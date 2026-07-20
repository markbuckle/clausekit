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

// The API is served twice from the same handlers: tRPC (canonical, /trpc/*) and REST (deprecated, /api/*, kept for curl smoke tests).
// Express owns CORS, rate limits, and the spend guard, mounted ahead of both surfaces so they share the same protections.

const PORT = Number(process.env.PORT) || 4000;

// ── Production hardening config (env-driven; localhost defaults for dev) ──

// CORS allowlist; set ALLOWED_ORIGINS (comma-separated) in prod. Defaults cover local vite + the HTTPS add-in/playground dev servers.
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

// Per-IP rate limits: /api/ask generous, /api/negotiate tight since each run is ~4k+ tokens.
const ASK_PER_MIN = Number(process.env.ASK_RATE_PER_MIN) || 30;
const NEGOTIATE_PER_MIN = Number(process.env.NEGOTIATE_RATE_PER_MIN) || 5;
const NEGOTIATE_PER_DAY = Number(process.env.NEGOTIATE_RATE_PER_DAY) || 25;

// Rate-limit responder that speaks both wire formats: the tRPC error envelope on /trpc/*, legacy { error } JSON elsewhere.
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
// Behind a single proxy in prod (Cloud Run etc.), so req.ip reflects the real client, not the proxy.
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

// Batched calls (/trpc/ask,negotiate) would slip past the per-procedure limiters below; reject them outright as defense in depth.
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
// Kept for curl smoke tests; the word-addin uses tRPC only. Remove once nothing external depends on these.

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

// Connect to Mongo (best-effort), seed the spend counter, then start listening.
void initDb()
  .then(() => seedSpendFromDb())
  .finally(() => {
    app.listen(PORT, () => {
      console.log(`ClauseKit backend listening on http://localhost:${PORT} (model: ${MODEL})`);
    });
  });
