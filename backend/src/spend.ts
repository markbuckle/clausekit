import "./env";
import type express from "express";
import type Anthropic from "@anthropic-ai/sdk";

/**
 * App-level spend backstop: refuse new LLM requests once cumulative token usage
 * crosses a DAILY ceiling (resets each UTC day and on restart). The hard cap in
 * the Anthropic Console is the ultimate backstop; this just stops a stranger
 * running up the bill before that cap trips.
 *
 * Explicit parse (not `|| default`) so DAILY_TOKEN_CEILING=0 works as an
 * emergency "halt all LLM requests" kill switch rather than coalescing to default.
 */
export const DAILY_TOKEN_CEILING =
  process.env.DAILY_TOKEN_CEILING !== undefined && process.env.DAILY_TOKEN_CEILING.trim() !== ""
    ? Number(process.env.DAILY_TOKEN_CEILING)
    : 25_000; // ~6 war-games or ~28 asks/day before the backstop trips; override via DAILY_TOKEN_CEILING.

// ── In-memory daily counter (persisted store lands with MongoDB) ──
let usageDayKey = new Date().toISOString().slice(0, 10); // "YYYY-MM-DD" (UTC)
let tokensToday = 0;

/** Current UTC day's cumulative token count (for /health). */
export function tokensUsedToday(): number {
  return tokensToday;
}

export function recordUsage(u: Anthropic.Usage): void {
  tokensToday +=
    (u.input_tokens ?? 0) +
    (u.cache_creation_input_tokens ?? 0) +
    (u.cache_read_input_tokens ?? 0) +
    (u.output_tokens ?? 0);
}

export const SPEND_LIMIT_MESSAGE =
  "ClauseKit's demo has hit its daily usage limit. Please check back tomorrow.";

/** True once the daily token ceiling is hit (also rolls the day over). */
export function spendCeilingReached(): boolean {
  const today = new Date().toISOString().slice(0, 10);
  if (today !== usageDayKey) {
    usageDayKey = today;
    tokensToday = 0;
  }
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
