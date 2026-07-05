import { useCallback, useState } from "react";
import { useDocumentService } from "../../services";
import { trpc } from "../../services/trpc";

export type Side = "tenant" | "landlord";

/** One position on the user's fallback ladder (ideal → market → floor). */
export interface LadderRung {
  tier: string;
  proposedText: string;
  rationale: string;
}

/** The opposing-counsel simulation for a term. */
export interface Counterparty {
  predictedCounter: string;
  argument: string;
}

/** One off-market term analyzed for the negotiation brief. */
export interface AnalyzedTerm {
  clauseRef: string;
  currentText: string;
  favoredParty: string;
  yourLadder: LadderRung[];
  counterparty: Counterparty;
}

export interface UseNegotiate {
  side: Side;
  setSide: (s: Side) => void;
  terms: AnalyzedTerm[] | null;
  headings: Record<string, string>;
  loading: boolean;
  error: string | null;
  run: () => void;
  /** The side the current brief was actually run for (may differ from `side`). */
  ranSide: Side | null;
}

/**
 * Best-effort "§N → heading" map from the document text. The lease formats
 * clause headings as "§5. Rent Escalation"; documents that don't follow this
 * just yield no headings (cards fall back to the ref alone).
 */
function parseHeadings(documentText: string): Record<string, string> {
  const map: Record<string, string> = {};
  const re = /(§\d+)\.\s+([^\r\n]+)/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(documentText)) !== null) {
    if (!map[m[1]]) map[m[1]] = m[2].trim();
  }
  return map;
}

/**
 * Owns the Negotiation Simulator: the chosen side, the brief (terms + headings),
 * and the call to /api/negotiate, grounded in the document via the seam. Each
 * term's ladder rungs are applied through the same applyTrackedChange path as Ask.
 */
export function useNegotiate(): UseNegotiate {
  const service = useDocumentService();
  const [side, setSide] = useState<Side>("tenant");
  const [terms, setTerms] = useState<AnalyzedTerm[] | null>(null);
  const [headings, setHeadings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ranSide, setRanSide] = useState<Side | null>(null);

  const run = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const documentText = await service.getFullText();
      // Fully typed end to end: data.terms is inferred from the backend's
      // AppRouter (zod schemas) and must remain assignable to the local
      // AnalyzedTerm vocabulary — drift fails at compile time. Server errors
      // (rate limit, spend cap) surface as TRPCClientError with the server's
      // user-facing message.
      const data = await trpc.negotiate.mutate({ documentText, side });
      setTerms(data.terms);
      setHeadings(parseHeadings(documentText));
      setRanSide(side);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Couldn't reach the simulator.");
    } finally {
      setLoading(false);
    }
  }, [service, side]);

  return { side, setSide, terms, headings, loading, error, run, ranSide };
}
