import "./env";
import { MongoClient, type Db, type Collection } from "mongodb";

/**
 * MongoDB persistence layer. Two jobs:
 *
 *   1. `usage_daily` — the spend guard's token counter, one document per UTC
 *      day (atomic $inc), so the daily ceiling survives container restarts.
 *      Without this the counter resets on every cold start, which on
 *      scale-to-zero Cloud Run made the ceiling nearly meaningless.
 *   2. `sessions`   — one metadata record per ask/negotiate call (timestamps,
 *      route, model, token usage — NEVER the document text), the foundation
 *      for usage history and analytics.
 *
 * This is a demo, so persistence is best-effort by design: if MONGODB_URI is
 * unset or Mongo is unreachable, we log it and keep serving with in-memory
 * state only — the API never goes down because the database did.
 */

const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB = process.env.MONGODB_DB || "clausekit";

/** One document per UTC day; _id is the "YYYY-MM-DD" day key. */
interface UsageDailyDoc {
  _id: string;
  tokens: number;
  updatedAt: Date;
}

/** One metadata record per LLM call. No contract text, ever. */
export interface SessionDoc {
  ts: Date;
  route: "ask" | "negotiate";
  model: string;
  usage: {
    input: number;
    cacheCreation: number;
    cacheRead: number;
    output: number;
  };
  /** negotiate only */
  side?: "tenant" | "landlord";
  /** negotiate only: how many terms the brief returned */
  terms?: number;
  /** ask only: whether a validated redline was returned */
  editReturned?: boolean;
  /** ask only: how many citations the answer carried */
  citations?: number;
}

let db: Db | null = null;

function usageColl(): Collection<UsageDailyDoc> | null {
  return db ? db.collection<UsageDailyDoc>("usage_daily") : null;
}

function sessionsColl(): Collection<SessionDoc> | null {
  return db ? db.collection<SessionDoc>("sessions") : null;
}

/** True when a Mongo connection is live (for /health). */
export function dbConnected(): boolean {
  return db !== null;
}

/**
 * Connect on startup. Failure is non-fatal: log and continue without
 * persistence rather than crash the API.
 */
export async function initDb(): Promise<void> {
  if (!MONGODB_URI) {
    console.log("[db] MONGODB_URI not set — running without persistence (in-memory only).");
    return;
  }
  try {
    const client = new MongoClient(MONGODB_URI, { serverSelectionTimeoutMS: 5000 });
    await client.connect();
    const candidate = client.db(MONGODB_DB);
    await candidate.command({ ping: 1 });
    db = candidate;
    console.log(`[db] connected (db: ${MONGODB_DB})`);
  } catch (err) {
    console.error(
      "[db] unreachable — continuing without persistence:",
      err instanceof Error ? err.message : err
    );
  }
}

/**
 * Atomically add tokens to today's counter and return the authoritative
 * day total, or null when persistence is off/unreachable. Upsert + $inc is a
 * single atomic op, so concurrent instances can't lose updates.
 */
export async function persistTokens(dayKey: string, tokens: number): Promise<number | null> {
  const coll = usageColl();
  if (!coll) return null;
  try {
    const doc = await coll.findOneAndUpdate(
      { _id: dayKey },
      { $inc: { tokens }, $set: { updatedAt: new Date() } },
      { upsert: true, returnDocument: "after" }
    );
    return doc?.tokens ?? null;
  } catch (err) {
    console.error("[db] failed to persist token usage:", err instanceof Error ? err.message : err);
    return null;
  }
}

/** Read a day's persisted token total (0 when absent), or null when off. */
export async function readTokens(dayKey: string): Promise<number | null> {
  const coll = usageColl();
  if (!coll) return null;
  try {
    const doc = await coll.findOne({ _id: dayKey });
    return doc?.tokens ?? 0;
  } catch (err) {
    console.error("[db] failed to read token usage:", err instanceof Error ? err.message : err);
    return null;
  }
}

/** Fire-and-forget insert of a session record; never blocks or fails a request. */
export function logSession(doc: SessionDoc): void {
  const coll = sessionsColl();
  if (!coll) return;
  void coll.insertOne(doc).catch((err: unknown) => {
    console.error("[db] failed to log session:", err instanceof Error ? err.message : err);
  });
}
