import "./env";
import type express from "express";
import type Anthropic from "@anthropic-ai/sdk";
import { persistTokens, readTokens } from "./db";

/**
 * App-level spend backstop: refuse new LLM requests once cumulative token usage
 * crosses a DAILY ceiling (UTC days). The hard cap in the Anthropic Console is
 * the ultimate backstop; this just stops a stranger running up the bill before
 * that cap trips.
 *
 * The counter is Mongo-backed (usage_daily, atomic $inc per day) so it survives
 * container restarts — essential on scale-to-zero Cloud Run, where in-memory
 * state resets on every cold start. An in-memory cache mirrors the persisted
 * total so the per-request guard stays synchronous (no DB read on the hot
 * path); each write re-syncs the cache to the authoritative $inc result. When
 * Mongo is off/unreachable, the cache alone carries the guard (pre-Mongo
 * behavior).
 *
 * Explicit parse (not `|| default`) so DAILY_TOKEN_CEILING=0 works as an
 * emergency "halt all LLM requests" kill switch rather than coalescing to default.
 */
export const DAILY_TOKEN_CEILING =
  process.env.DAILY_TOKEN_CEILING !== undefined && process.env.DAILY_TOKEN_CEILING.trim() !== ""
    ? Number(process.env.DAILY_TOKEN_CEILING)
    : 25_000; // ~6 war-games or ~28 asks/day before the backstop trips; override via DAILY_TOKEN_CEILING.

function todayKey(): string {
  return new Date().toISOString().slice(0, 10); // "YYYY-MM-DD" (UTC)
}

// ── Daily counter: in-memory cache of the Mongo-persisted total ──
let usageDayKey = todayKey();
let tokensToday = 0;

/** Roll the cache over at the UTC day boundary. */
function rolloverIfNeeded(): void {
  const today = todayKey();
  if (today !== usageDayKey) {
    usageDayKey = today;
    tokensToday = 0;
  }
}

/**
 * Seed the cache from Mongo on startup, so a restarted container resumes from
 * the persisted total instead of zero. No-op when persistence is off.
 */
export async function seedSpendFromDb(): Promise<void> {
  const persisted = await readTokens(usageDayKey);
  if (persisted !== null && persisted > tokensToday) {
    tokensToday = persisted;
    console.log(`[spend] resumed today's token count from Mongo: ${tokensToday}`);
  }
}

/** Current UTC day's cumulative token count (for /health). */
export function tokensUsedToday(): number {
  rolloverIfNeeded();
  return tokensToday;
}

export function recordUsage(u: Anthropic.Usage): void {
  rolloverIfNeeded();
  const tokens =
    (u.input_tokens ?? 0) +
    (u.cache_creation_input_tokens ?? 0) +
    (u.cache_read_input_tokens ?? 0) +
    (u.output_tokens ?? 0);
  // Count locally first so the guard tightens immediately even if Mongo lags.
  tokensToday += tokens;
  // Persist async (atomic $inc) and re-sync the cache to the authoritative
  // total — this also folds in tokens recorded by other instances.
  const dayKey = usageDayKey;
  void persistTokens(dayKey, tokens).then((total) => {
    if (total !== null && dayKey === usageDayKey && total > tokensToday) {
      tokensToday = total;
    }
  });
}

export const SPEND_LIMIT_MESSAGE =
  "ClauseKit's demo has hit its daily usage limit. Please check back tomorrow.";

/** True once the daily token ceiling is hit (also rolls the day over). */
export function spendCeilingReached(): boolean {
  rolloverIfNeeded();
  return tokensToday >= DAILY_TOKEN_CEILING;
}

/**
 * Express middleware: refuse new LLM work once the daily token ceiling is hit.
 * Mounted on both the tRPC procedure paths and the deprecated REST routes; the
 * response body is shaped per caller — tRPC clients need the error envelope so
 * TRPCClientError surfaces the message, REST keeps the legacy { error } shape.
 */
export function spendGuard(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
): void {
  if (!spendCeilingReached()) return next();
  if (req.originalUrl.startsWith("/trpc")) {
    res.status(503).json({
      error: {
        message: SPEND_LIMIT_MESSAGE,
        code: -32603, // JSON-RPC INTERNAL_SERVER_ERROR — tRPC has no 503-specific code
        data: { code: "INTERNAL_SERVER_ERROR", httpStatus: 503 },
      },
    });
    return;
  }
  res.status(503).json({ error: SPEND_LIMIT_MESSAGE });
}
