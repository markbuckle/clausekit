import "./env";
import type express from "express";
import type Anthropic from "@anthropic-ai/sdk";
import { persistTokens, readTokens } from "./db";

// Refuse new LLM requests once today's (UTC) token usage crosses a daily ceiling, as a backstop under the Anthropic Console's hard cap.
// The counter is Mongo-backed so it survives container restarts, with an in-memory cache so the per-request check stays synchronous.
// Explicit parse (not `|| default`) so DAILY_TOKEN_CEILING=0 works as an emergency kill switch instead of falling back to the default.
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

// Roll the cache over at the UTC day boundary.
function rolloverIfNeeded(): void {
  const today = todayKey();
  if (today !== usageDayKey) {
    usageDayKey = today;
    tokensToday = 0;
  }
}

// Seed the cache from Mongo on startup, so a restarted container resumes from the persisted total instead of zero.
export async function seedSpendFromDb(): Promise<void> {
  const persisted = await readTokens(usageDayKey);
  if (persisted !== null && persisted > tokensToday) {
    tokensToday = persisted;
    console.log(`[spend] resumed today's token count from Mongo: ${tokensToday}`);
  }
}

// Current UTC day's cumulative token count (for /health).
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
  // Persist async and re-sync the cache to the authoritative total (also folds in other instances' writes).
  const dayKey = usageDayKey;
  void persistTokens(dayKey, tokens).then((total) => {
    if (total !== null && dayKey === usageDayKey && total > tokensToday) {
      tokensToday = total;
    }
  });
}

export const SPEND_LIMIT_MESSAGE =
  "ClauseKit's demo has hit its daily usage limit. Please check back tomorrow.";

// True once the daily token ceiling is hit (also rolls the day over).
export function spendCeilingReached(): boolean {
  rolloverIfNeeded();
  return tokensToday >= DAILY_TOKEN_CEILING;
}

// Express middleware: refuse new LLM work once the daily ceiling is hit. Response shape differs per caller: tRPC gets the error envelope, REST keeps { error }.
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
