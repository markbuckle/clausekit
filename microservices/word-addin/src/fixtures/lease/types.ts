/**
 * Types for the seeded lease fixture.
 *
 * Pure data — no Office.js, React, or service imports — so the fixture can be
 * consumed by the in-browser mock, the playground, and (later) the backend.
 */

/**
 * One clause of the lease, authored as a locatable scope rather than a label.
 * `ref` is a stable locator (e.g. "§5"); the mock resolves a ref to this span
 * so `applyTrackedChange` can search WITHIN the clause's `text`.
 */
export interface LeaseClause {
  /** Stable locator, e.g. "§5" or "Recitals". Matches ContestedClause.clauseRef. */
  ref: string;
  /** Short heading, e.g. "Rent Escalation". */
  heading: string;
  /** The provision body — genuine lease language the LLM reasons over. */
  text: string;
}

/** Which side a provision is drafted to favor. */
export type FavoredParty = "landlord" | "tenant";

/**
 * One position on a negotiation ladder. Rungs are ordered landlord-favorable →
 * tenant-favorable; each carries the actual redline `language` for that position
 * plus a one-line `rationale`.
 */
export interface FallbackRung {
  /** Where this rung sits, e.g. "Landlord opening", "Market", "Tenant target". */
  label: string;
  /** The actual clause language at this rung — drop-in redline text. */
  language: string;
  /** One-line reason this position is where it is. */
  rationale: string;
}

/**
 * Curation sidecar for one contested clause. Kept SEPARATE from the prose: this
 * is our reference and the step 9 simulator's pre-wired ladder, never fed to the
 * LLM as an answer key. The first rung of `fallbackLadder` echoes the clause's
 * current (off-market) language; later rungs walk toward market and the
 * counterparty.
 */
export interface ContestedClause {
  /** The clause this is about; matches a LeaseClause.ref. */
  clauseRef: string;
  /** What makes the current language off-market. */
  issue: string;
  /** Which side the current language favors (all planted issues favor landlord). */
  favoredParty: FavoredParty;
  /** Ordered rungs, landlord-favorable → tenant-favorable. */
  fallbackLadder: FallbackRung[];
}
