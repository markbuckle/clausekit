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
 * the provided contract text via Claude, and returns structured output. The API
 * key lives only here (loaded from a gitignored .env), never in the client.
 *
 * Contract:
 *   POST /api/ask
 *   body:    { documentText: string, message: string, history?: {role,content}[] }
 *   returns: { answer: string, citations: string[], edit?: SuggestedEdit }
 *
 *   - answer:    prose review.
 *   - citations: § refs the answer relies on (validated against the document).
 *   - edit:      a single concrete redline, present ONLY when an off-market /
 *                one-sided term has a clear fix. edit.originalText is guaranteed
 *                to be an exact verbatim substring of documentText (else dropped).
 */

const PORT = Number(process.env.PORT) || 4000;
// Structured-output path. Default Haiku 4.5 for cost. originalText is validated
// verbatim server-side and any non-exact edit is dropped, so a cheaper model can
// only reduce how often an edit is offered, never ship a broken one. Swappable
const MODEL = process.env.ANTHROPIC_MODEL || "claude-haiku-4-5";
const MAX_TOKENS = 1024;

if (!process.env.ANTHROPIC_API_KEY) {
  console.error("Missing ANTHROPIC_API_KEY. Set it in backend/.env (see .env.example).");
  process.exit(1);
}

// Reads ANTHROPIC_API_KEY from the environment.
const anthropic = new Anthropic();

type Severity = "low" | "medium" | "high";
interface SuggestedEdit {
  clauseRef: string;
  originalText: string;
  proposedText: string;
  rationale: string;
  severity: Severity;
}

// Stable system prompt — no dynamic content, so it stays part of the cached prefix.
const SYSTEM_PROMPT = `You are ClauseKit, an AI contract-review assistant working for a party reviewing a contract. Your job is two-fold: explain what the contract says, AND assess how its terms compare to market norms and standard practice.

Keep these two kinds of statements distinct:

1. What THIS contract says must be grounded only in the provided contract text, and cited by section reference (for example, "§5"). Never invent, assume, or guess contract terms that are not in the text. If the contract is genuinely silent on a factual point, say so.

2. Assessing those terms — whether a provision is standard, off-market, aggressive, or one-sided, and which party it favors — SHOULD draw on your general knowledge of commercial and legal norms. This is the core value of the review. Do NOT refuse to assess a term just because the contract contains no market data or benchmarks; that judgment is expected to come from your expertise, not from the document.

So when asked whether something is off-market, standard, or favorable: state the relevant contract term (cited by §), then give your market/practice assessment, clearly framed as an assessment (e.g. "this is above the typical range", "this is more landlord-favorable than standard").

Guardrail: keep market comparisons qualitative and general (e.g. "escalations are typically 2–3%", "most leases cap this"). Do NOT fabricate precise statistics, datasets, figures presented as hard data, or named sources. When unsure of a specific number, hedge ("usually", "generally", "in most leases") rather than inventing one.

Be concise and direct. Lead with the answer — no preamble, no restating the question, no filler like "Based on the contract". Keep responses to a few short sentences or a short paragraph unless the question genuinely requires more.

Respond by calling the provide_review tool. Put your prose review in "answer" (following all the guidance above). List the section references your answer relies on in "citations" (e.g. ["§5"]) — real section numbers only.

Include "edit" ONLY when your assessment identifies an off-market or one-sided term that has a clear, concrete fix; omit it entirely for purely informational answers. When you include it:
- originalText MUST be copied verbatim from the contract, character-for-character including punctuation — the minimal contiguous span that needs to change, not the whole clause unless necessary.
- proposedText replaces exactly that span.
- clauseRef is the section it belongs to; rationale is one sentence; severity is low, medium, or high.`;

const REVIEW_TOOL: Anthropic.Tool = {
  name: "provide_review",
  description:
    "Return the contract-review answer with structured citations and, only when warranted, a single concrete redline edit.",
  input_schema: {
    type: "object",
    properties: {
      answer: {
        type: "string",
        description: "The prose review answer for the user, following the system guidance.",
      },
      citations: {
        type: "array",
        items: { type: "string" },
        description: 'Section references the answer relies on, e.g. ["§5"]. Real section numbers only.',
      },
      edit: {
        type: "object",
        description:
          "A single concrete redline. Include ONLY when the assessment identifies an off-market or one-sided term with a clear fix. Omit entirely for purely informational answers.",
        properties: {
          clauseRef: { type: "string", description: 'Section the edit belongs to, e.g. "§5".' },
          originalText: {
            type: "string",
            description:
              "EXACT verbatim substring copied from the contract, character-for-character including punctuation — the minimal contiguous span that must change.",
          },
          proposedText: { type: "string", description: "Replacement for exactly that span." },
          rationale: { type: "string", description: "One sentence on why the change is warranted." },
          severity: { type: "string", enum: ["low", "medium", "high"] },
        },
        required: ["clauseRef", "originalText", "proposedText", "rationale", "severity"],
      },
    },
    required: ["answer", "citations"],
  },
};

/** The real section refs present in the document, e.g. {"§1",…,"§20"}. */
function documentRefs(documentText: string): Set<string> {
  const refs = new Set<string>();
  for (const m of documentText.matchAll(/§\d+/g)) refs.add(m[0]);
  return refs;
}

/**
 * Validate a candidate edit. Returns it only if every field is well-formed AND
 * originalText is an EXACT substring of the document — otherwise null, so the
 * client never receives an edit it can't locate.
 */
function validateEdit(raw: unknown, documentText: string): SuggestedEdit | null {
  if (!raw || typeof raw !== "object") return null;
  const e = raw as Record<string, unknown>;
  const { clauseRef, originalText, proposedText, rationale, severity } = e;
  if (
    typeof clauseRef !== "string" ||
    typeof originalText !== "string" ||
    typeof proposedText !== "string" ||
    typeof rationale !== "string" ||
    (severity !== "low" && severity !== "medium" && severity !== "high")
  ) {
    return null;
  }
  if (originalText.length === 0) return null;
  if (!documentText.includes(originalText)) {
    console.log(`[ask] dropped edit: originalText is not a verbatim substring (clauseRef=${clauseRef})`);
    return null;
  }
  return { clauseRef, originalText, proposedText, rationale, severity };
}

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
  const documentText = body.documentText;

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
      // The tool definition + system prompt + contract are identical across
      // requests, so they form a cacheable stable prefix (tools and system both
      // sit before the breakpoint). cache_control on the LAST system block sets
      // the breakpoint; the per-turn message + history below it stay uncached.
      tools: [REVIEW_TOOL],
      tool_choice: { type: "tool", name: REVIEW_TOOL.name },
      system: [
        { type: "text", text: SYSTEM_PROMPT },
        {
          type: "text",
          text: `Contract under review:\n\n${documentText}`,
          cache_control: { type: "ephemeral" },
        },
      ],
      messages,
    });

    // Extract the structured tool output. On any shortfall we degrade to an
    // answer-only response rather than failing.
    const toolUse = response.content.find(
      (b): b is Anthropic.ToolUseBlock => b.type === "tool_use" && b.name === REVIEW_TOOL.name
    );

    let answer = "";
    let citations: string[] = [];
    let edit: SuggestedEdit | undefined;

    if (toolUse && toolUse.input && typeof toolUse.input === "object") {
      const input = toolUse.input as Record<string, unknown>;
      answer = typeof input.answer === "string" ? input.answer.trim() : "";
      const validRefs = documentRefs(documentText);
      if (Array.isArray(input.citations)) {
        citations = [
          ...new Set(
            input.citations.filter((c): c is string => typeof c === "string" && validRefs.has(c))
          ),
        ];
      }
      edit = validateEdit(input.edit, documentText) ?? undefined;
    }

    if (!answer) {
      // Degrade gracefully: fall back to any prose text, drop unreliable structure.
      const text = response.content
        .filter((b): b is Anthropic.TextBlock => b.type === "text")
        .map((b) => b.text)
        .join("")
        .trim();
      answer = text || "I couldn't produce an answer. Please try rephrasing your question.";
      citations = [];
      edit = undefined;
    }

    const u = response.usage;
    console.log(
      `[ask] model=${MODEL} input=${u.input_tokens} ` +
        `cache_creation=${u.cache_creation_input_tokens ?? 0} ` +
        `cache_read=${u.cache_read_input_tokens ?? 0} output=${u.output_tokens} ` +
        `citations=${citations.length} edit=${edit ? edit.clauseRef : "none"}`
    );

    const payload: { answer: string; citations: string[]; edit?: SuggestedEdit } = {
      answer,
      citations,
    };
    if (edit) payload.edit = edit;
    return res.json(payload);
  } catch (err) {
    const status = err instanceof Anthropic.APIError ? err.status ?? 502 : 500;
    console.error("[ask] error:", err instanceof Error ? err.message : err);
    return res.status(status).json({ error: "Failed to get an answer from the model." });
  }
});

app.listen(PORT, () => {
  console.log(`ClauseKit backend listening on http://localhost:${PORT} (model: ${MODEL})`);
});
