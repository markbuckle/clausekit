import dotenv from "dotenv";
import express from "express";

// override: true so the backend's own .env is authoritative for ANTHROPIC_API_KEY,
// even if an unrelated ANTHROPIC_API_KEY is already exported in the shell (which
// dotenv would otherwise leave in place). .env is gitignored and absent in prod,
// where the real env var is used instead.
dotenv.config({ override: true });
import cors from "cors";
import Anthropic from "@anthropic-ai/sdk";

/**
 * ClauseKit backend — one route, /api/ask, that answers a question grounded in
 * the provided contract text via Claude. The API key lives only here (loaded
 * from a gitignored .env), never in the client.
 *
 * Contract:
 *   POST /api/ask
 *   body:    { documentText: string, message: string, history?: {role,content}[] }
 *   returns: { answer: string }   (prose; structured edits are step 6)
 */

const PORT = Number(process.env.PORT) || 4000;
const MODEL = process.env.ANTHROPIC_MODEL || "claude-haiku-4-5";
const MAX_TOKENS = 600;

if (!process.env.ANTHROPIC_API_KEY) {
  console.error("Missing ANTHROPIC_API_KEY. Set it in backend/.env (see .env.example).");
  process.exit(1);
}

// Reads ANTHROPIC_API_KEY from the environment.
const anthropic = new Anthropic();

// Stable system prompt — no dynamic content, so it stays part of the cached prefix.
const SYSTEM_PROMPT = `You are ClauseKit, an AI contract-review assistant.

Answer the user's question using ONLY the contract text provided in this prompt. When you rely on a clause, cite it by its section reference (for example, "§5"). If the contract does not address the question, say so plainly. Never use outside knowledge or invent terms that are not in the contract.

Be concise and direct. Lead with the answer — no preamble, no restating the question, and no filler like "Based on the contract". Keep responses to a few short sentences or a short paragraph unless the question genuinely requires more.`;

type HistoryTurn = { role: "user" | "assistant"; content: string };

const app = express();
app.use(cors());
app.use(express.json({ limit: "1mb" }));

app.get("/health", (_req, res) => {
  res.json({ ok: true, model: MODEL });
});

app.post("/api/ask", async (req, res) => {
  const body = (req.body ?? {}) as {
    documentText?: unknown;
    message?: unknown;
    history?: unknown;
  };

  if (typeof body.documentText !== "string" || !body.documentText.trim()) {
    return res.status(400).json({ error: "documentText is required" });
  }
  if (typeof body.message !== "string" || !body.message.trim()) {
    return res.status(400).json({ error: "message is required" });
  }

  const history: HistoryTurn[] = Array.isArray(body.history)
    ? (body.history as unknown[]).filter(
        (t): t is HistoryTurn =>
          !!t &&
          typeof (t as HistoryTurn).content === "string" &&
          ((t as HistoryTurn).role === "user" || (t as HistoryTurn).role === "assistant")
      )
    : [];

  const messages: Anthropic.MessageParam[] = [
    ...history.map((t) => ({ role: t.role, content: t.content })),
    { role: "user" as const, content: body.message },
  ];

  try {
    const response = await anthropic.messages.create({
      model: MODEL,
      max_tokens: MAX_TOKENS,
      // The system prompt + the contract are identical across requests, so they
      // form a cacheable stable prefix. cache_control on the LAST system block
      // sets the cache breakpoint at the end of that prefix; the per-turn
      // message + history below it stay uncached.
      system: [
        { type: "text", text: SYSTEM_PROMPT },
        {
          type: "text",
          text: `Contract under review:\n\n${body.documentText}`,
          cache_control: { type: "ephemeral" },
        },
      ],
      messages,
    });

    const u = response.usage;
    console.log(
      `[ask] model=${MODEL} input=${u.input_tokens} ` +
        `cache_creation=${u.cache_creation_input_tokens ?? 0} ` +
        `cache_read=${u.cache_read_input_tokens ?? 0} output=${u.output_tokens}`
    );

    const answer = response.content
      .filter((b): b is Anthropic.TextBlock => b.type === "text")
      .map((b) => b.text)
      .join("")
      .trim();

    return res.json({ answer });
  } catch (err) {
    const status = err instanceof Anthropic.APIError ? err.status ?? 502 : 500;
    console.error("[ask] error:", err instanceof Error ? err.message : err);
    return res.status(status).json({ error: "Failed to get an answer from the model." });
  }
});

app.listen(PORT, () => {
  console.log(`ClauseKit backend listening on http://localhost:${PORT} (model: ${MODEL})`);
});
