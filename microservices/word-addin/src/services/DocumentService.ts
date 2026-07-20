import type { ApplyResult, ScrollTarget, Selection, SuggestedEdit } from "./types";

// The single seam between the UI and the document: the UI never touches Office.js directly, every read or write goes through this interface. Two implementations satisfy it, an in-browser mock (playground and tests) and a real Word `Word.run` one (the live add-in); arguments and return values use only the plain-data types in `./types`.
export interface DocumentService {
  // Full plain text of the document body — what the model reasons over for review/ask. Formatting is not preserved.
  getFullText(): Promise<string>;

  // The user's current selection, or `null` if nothing is selected. Powers selection-scoped actions (e.g. "ask about this clause").
  getSelection(): Promise<Selection | null>;

  // Locates `edit.originalText` and replaces it with `edit.proposedText` as a tracked change. Never guesses: returns `not-found` if missing, `ambiguous` if it occurs more than once.
  applyTrackedChange(edit: SuggestedEdit): Promise<ApplyResult>;

  // Finds a clause or text fragment and scrolls it into view. Powers the "Jump to §X" citation chip.
  scrollTo(target: ScrollTarget): Promise<boolean>;
}
