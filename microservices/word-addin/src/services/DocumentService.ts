import type { ApplyResult, ScrollTarget, Selection, SuggestedEdit } from "./types";

/**
 * The single seam between the UI and the document.
 *
 * Invariant #1: the UI never touches Office.js directly — every read or write
 * goes through this interface. Two implementations satisfy it: an in-browser
 * mock (for the playground and tests) and a real Word `Word.run` one (for the
 * live add-in). All methods are async so the real implementation can await
 * `context.sync()`; the mock simply resolves immediately.
 *
 * Implementations must be host-agnostic at the boundary: arguments and return
 * values use only the plain-data types in `./types`.
 */
export interface DocumentService {
  /**
   * Returns the full plain text of the document body.
   *
   * Used to give the model the whole contract for review/ask. Formatting is
   * not preserved — this is the text the AI reasons over.
   */
  getFullText(): Promise<string>;

  /**
   * Returns the user's current selection, or `null` if nothing is selected.
   *
   * Powers selection-scoped actions (e.g. "ask about this clause").
   */
  getSelection(): Promise<Selection | null>;

  /**
   * Locates `edit.originalText` in the document and replaces it with
   * `edit.proposedText` as a tracked change.
   *
   * Never guesses: if the text is missing it returns `not-found`, and if it
   * occurs more than once it returns `ambiguous` rather than editing an
   * arbitrary occurrence. On success the change is recorded as a tracked
   * (reviewable) edit, not a silent replacement.
   */
  applyTrackedChange(edit: SuggestedEdit): Promise<ApplyResult>;

  /**
   * Finds a clause or text fragment and scrolls it into view.
   *
   * Powers the "Jump to §X" citation chip. Resolves `true` if the target was
   * found and brought into view, `false` if it could not be located.
   */
  scrollTo(target: ScrollTarget): Promise<boolean>;
}
