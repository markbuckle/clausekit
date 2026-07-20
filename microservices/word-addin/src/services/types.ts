// Shared, host-agnostic vocabulary for the document layer. Nothing here may import or reference Office.js or `Word.*` types, so an in-browser mock can satisfy the contract just as well as real Word.

// Coarse risk level attached to a suggested edit or a flagged issue.
export type Severity = "low" | "medium" | "high";

// An AI-proposed contract edit, always returned as structured data, never prose. The UI renders from this, and "apply" turns it into a tracked change via DocumentService.applyTrackedChange.
export interface SuggestedEdit {
  // Human-readable clause locator, e.g. "§9.1" or "Section 12(b)".
  clauseRef: string;
  // Exact text currently in the document that the edit targets.
  originalText: string;
  // Text that should replace originalText.
  proposedText: string;
  // Why the change is recommended — shown to the user, not acted on.
  rationale: string;
  // How serious the underlying issue is.
  severity: Severity;
}

// The user's current selection, described host-agnostically. The optional surrounding context lets a locator disambiguate `text` when the same phrase appears more than once.
export interface Selection {
  // The selected text. Empty string is possible for a collapsed cursor.
  text: string;
  // A short slice of text immediately before the selection, if known.
  contextBefore?: string;
  // A short slice of text immediately after the selection, if known.
  contextAfter?: string;
}

// Outcome of attempting to apply a tracked change. A discriminated union on `status`: because contract phrases can repeat, an ambiguous match is reported rather than applied to an arbitrary occurrence.
export type ApplyResult =
  | { status: "applied"; clauseRef?: string } // applied as a tracked change
  | { status: "not-found"; searchedText: string } // originalText was not found in the document
  | { status: "ambiguous"; matchCount: number }; // originalText matched more than once; the caller must disambiguate

// Where DocumentService.scrollTo should bring into view — either a clause reference (e.g. "§9.1") or a literal text fragment.
export type ScrollTarget = { clauseRef: string } | { text: string };
