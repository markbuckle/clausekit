import { useCallback, useState } from "react";
import { useDocumentService } from "../../services";
import { API_BASE_URL } from "../../config";

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
      const res = await fetch(`${API_BASE_URL}/api/negotiate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ documentText, side }),
      });
      if (!res.ok) {
        // Prefer the server's user-facing message (rate limit, spend cap, …).
        let serverError: string | null = null;
        try {
          const body = (await res.json()) as { error?: unknown };
          if (typeof body.error === "string") serverError = body.error;
        } catch {
          /* no JSON body */
        }
        throw new Error(serverError || `The simulator is unavailable (error ${res.status}).`);
      }
      const data = (await res.json()) as { terms?: AnalyzedTerm[] };
      setTerms(Array.isArray(data.terms) ? data.terms : []);
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
