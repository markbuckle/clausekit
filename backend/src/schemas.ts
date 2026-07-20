import { z } from "zod";

// Single source of truth for the API's I/O shapes: these zod schemas are both the runtime validation and the compile-time
// contract the word-addin's tRPC client infers types from, so a renamed field fails the add-in's typecheck instead of breaking at runtime.

// Non-empty after trimming, but passed through untouched — documentText must stay byte-identical for verbatim substring checks.
const nonBlankString = (label: string) =>
  z.string().refine((s) => s.trim().length > 0, { message: `${label} is required` });

export const severitySchema = z.enum(["low", "medium", "high"]);
export type Severity = z.infer<typeof severitySchema>;

// An AI-proposed contract edit, matches the add-in's SuggestedEdit.
export const suggestedEditSchema = z.object({
  clauseRef: z.string(),
  originalText: z.string().min(1),
  proposedText: z.string(),
  rationale: z.string(),
  severity: severitySchema,
});
export type SuggestedEdit = z.infer<typeof suggestedEditSchema>;

export const historyTurnSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string(),
});
export type HistoryTurn = z.infer<typeof historyTurnSchema>;

export const askInputSchema = z.object({
  documentText: nonBlankString("documentText"),
  message: nonBlankString("message"),
  history: z.array(historyTurnSchema).optional(),
});
export type AskInput = z.infer<typeof askInputSchema>;

export const askOutputSchema = z.object({
  answer: z.string(),
  citations: z.array(z.string()),
  edit: suggestedEditSchema.optional(),
});
export type AskOutput = z.infer<typeof askOutputSchema>;

export const sideSchema = z.enum(["tenant", "landlord"]);
export type Side = z.infer<typeof sideSchema>;

// One position on the user's fallback ladder (ideal -> market -> floor).
export const ladderRungSchema = z.object({
  tier: z.string(),
  proposedText: z.string().min(1),
  rationale: z.string(),
});
export type LadderRung = z.infer<typeof ladderRungSchema>;

// The opposing-counsel simulation for a term.
export const counterpartySchema = z.object({
  predictedCounter: z.string(),
  argument: z.string(),
});
export type Counterparty = z.infer<typeof counterpartySchema>;

// One off-market term analyzed for the negotiation brief. favoredParty is always a string here since validateTerms coerces it.
export const analyzedTermSchema = z.object({
  clauseRef: z.string(),
  currentText: z.string().min(1),
  favoredParty: z.string(),
  severity: severitySchema,
  yourLadder: z.array(ladderRungSchema).min(1),
  counterparty: counterpartySchema,
});
export type AnalyzedTerm = z.infer<typeof analyzedTermSchema>;

export const negotiateInputSchema = z.object({
  documentText: nonBlankString("documentText"),
  side: sideSchema,
});
export type NegotiateInput = z.infer<typeof negotiateInputSchema>;

export const negotiateOutputSchema = z.object({
  side: sideSchema,
  terms: z.array(analyzedTermSchema),
});
export type NegotiateOutput = z.infer<typeof negotiateOutputSchema>;
