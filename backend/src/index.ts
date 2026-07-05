import "./env";
import express from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { appRouter } from "./router";
import { askInputSchema, negotiateInputSchema } from "./schemas";
import { runAsk, runNegotiate, ModelCallError, MODEL } from "./handlers";
import { spendGuard, tokensUsedToday, seedSpendFromDb } from "./spend";
import { initDb, dbConnected } from "./db";

/**
 * ClauseKit backend. The API is served twice from the same handlers:
 *
 *   - tRPC (canonical): POST /trpc/ask and /trpc/negotiate via the Express
 *     adapter. The word-addin client infers full request/response types from
 *     AppRouter (see router.ts) — no hand-written response types client-side.
 *   - REST (DEPRECATED): POST /api/ask and /api/negotiate kept temporarily as
 *     thin wrappers for curl-ability and smoke tests. New clients use tRPC.
 *
 * Express owns the cross-cutting middleware — CORS, per-route rate limits, and
 * the daily spend guard — mounted ahead of BOTH surfaces, so tRPC calls get the
 * exact same protections as the legacy routes.
 */

const PORT = Number(process.env.PORT) || 4000;

// ── Production hardening config (env-driven; localhost defaults for dev) ──

// CORS allowlist. In prod set ALLOWED_ORIGINS to the deployed frontend/playground
// origin(s), comma-separated. Defaults cover local dev: vite (5173/5174) and the
// HTTPS add-in + playground dev servers (3000/3001).
const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS ?? "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);
const DEV_ORIGINS = [
  "http://localhost:5173",
  "http://localhost:5174",
  "https://localhost:3000",
  "https://localhost:3001",
];
const ORIGIN_ALLOWLIST = ALLOWED_ORIGINS.length > 0 ? ALLOWED_ORIGINS : DEV_ORIGINS;

// Per-IP rate limits: /api/ask generous, /api/negotiate tight (each negotiate is
// ~4k+ tokens) with a low daily cap too.
const ASK_PER_MIN = Number(process.env.ASK_RATE_PER_MIN) || 30;
const NEGOTIATE_PER_MIN = Number(process.env.NEGOTIATE_RATE_PER_MIN) || 5;
const NEGOTIATE_PER_DAY = Number(process.env.NEGOTIATE_RATE_PER_DAY) || 25;

/**
 * Rate-limit responder that speaks both wire formats: the tRPC error envelope
 * on /trpc/* (so TRPCClientError surfaces the human message) and the legacy
 * { error } JSON on the deprecated REST routes. One limiter instance is mounted
 * on both surfaces, so the counters are shared across them.
 */
function limitHandler(message: string): express.RequestHandler {
  return (req, res) => {
    if (req.originalUrl.startsWith("/trpc")) {
      res.status(429).json({
        error: {
          message,
          code: -32029, // JSON-RPC code for TOO_MANY_REQUESTS
          data: { code: "TOO_MANY_REQUESTS", httpStatus: 429 },
        },
      });
      return;
    }
    res.status(429).json({ error: message });
  };
}

const rateLimitOptions = { standardHeaders: true as const, legacyHeaders: false as const };
const askLimiter = rateLimit({
  ...rateLimitOptions,
  windowMs: 60_000,
  max: ASK_PER_MIN,
  handler: limitHandler("Too many requests — please slow down and try again shortly."),
});
const negotiateMinuteLimiter = rateLimit({
  ...rateLimitOptions,
  windowMs: 60_000,
  max: NEGOTIATE_PER_MIN,
  handler: limitHandler("Too many simulator runs — please wait a minute and try again."),
});
const negotiateDayLimiter = rateLimit({
  ...rateLimitOptions,
  windowMs: 24 * 60 * 60 * 1000,
  max: NEGOTIATE_PER_DAY,
  handler: limitHandler("Daily limit for the negotiation simulator reached. Please try again tomorrow."),
});

const app = express();
// Behind a single proxy in prod (Cloud Run etc.) so req.ip reflects the real
// client for rate limiting (not the proxy).
app.set("trust proxy", 1);
app.use(
  cors({
    origin(origin, callback) {
      // Allow non-browser clients (curl, health checks) that send no Origin.
      if (!origin || ORIGIN_ALLOWLIST.includes(origin)) return callback(null, true);
      return callback(null, false);
    },
  })
);
app.use(express.json({ limit: "1mb" }));

app.get("/health", (_req, res) => {
  res.json({ ok: true, model: MODEL, tokensToday: tokensUsedToday(), db: dbConnected() });
});

// ── tRPC (canonical surface) ────────────────────────────────────────────────

// The per-procedure middleware below matches on the /trpc/<procedure> path, so
// batched calls (/trpc/ask,negotiate) would slip past the limiters. Our client
// uses httpLink (no batching); reject batch URLs outright as defense in depth.
app.use("/trpc", (req, res, next) => {
  if (req.path.includes(",")) {
    res.status(404).json({ error: "Batched tRPC calls are not supported." });
    return;
  }
  next();
});
app.use("/trpc/ask", askLimiter, spendGuard);
app.use("/trpc/negotiate", negotiateDayLimiter, negotiateMinuteLimiter, spendGuard);
app.use(
  "/trpc",
  createExpressMiddleware({
    router: appRouter,
    createContext: ({ req, res }) => ({ req, res }),
  })
);

// ── REST (DEPRECATED — thin wrappers over the same handlers) ───────────────
// Kept temporarily for curl-based smoke tests. The word-addin uses tRPC only;
// remove these once nothing external depends on them.

function restError(res: express.Response, err: unknown, fallback: string): express.Response {
  if (err instanceof ModelCallError) {
    return res.status(err.status).json({ error: err.message });
  }
  return res.status(500).json({ error: fallback });
}

/** @deprecated Use tRPC /trpc/ask. */
app.post("/api/ask", askLimiter, spendGuard, async (req, res) => {
  const parsed = askInputSchema.safeParse(req.body ?? {});
  if (!parsed.success) {
    const msg = parsed.error.issues[0]?.message ?? "Invalid request body.";
    return res.status(400).json({ error: msg });
  }
  try {
    return res.json(await runAsk(parsed.data));
  } catch (err) {
    return restError(res, err, "Failed to get an answer from the model.");
  }
});

/** @deprecated Use tRPC /trpc/negotiate. */
app.post("/api/negotiate", negotiateDayLimiter, negotiateMinuteLimiter, spendGuard, async (req, res) => {
  const parsed = negotiateInputSchema.safeParse(req.body ?? {});
  if (!parsed.success) {
    const msg = parsed.error.issues[0]?.message ?? "Invalid request body.";
    return res.status(400).json({ error: msg });
  }
  try {
    return res.json(await runNegotiate(parsed.data));
  } catch (err) {
    return restError(res, err, "Failed to build the negotiation brief.");
  }
});

// Connect to Mongo (best-effort — the API serves regardless), seed the spend
// counter from the persisted total, then start listening.
void initDb()
  .then(() => seedSpendFromDb())
  .finally(() => {
    app.listen(PORT, () => {
      console.log(`ClauseKit backend listening on http://localhost:${PORT} (model: ${MODEL})`);
    });
  });
