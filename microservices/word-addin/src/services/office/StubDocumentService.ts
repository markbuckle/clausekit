import type { DocumentService } from "../DocumentService";
import type { ApplyResult, ScrollTarget, Selection, SuggestedEdit } from "../types";

const NOT_IMPLEMENTED =
  "ClauseKit can't read or edit the Word document yet - the live Word integration arrives in step 7.";

// Placeholder DocumentService for when the task pane mounts without a Word-backed implementation. Read-of-nothing methods are safe no-ops; mutating/locating methods fail loudly so the UI's error path gets exercised rather than silently doing nothing.
export class StubDocumentService implements DocumentService {
  async getFullText(): Promise<string> {
    throw new Error(NOT_IMPLEMENTED);
  }

  async getSelection(): Promise<Selection | null> {
    return null;
  }

  async applyTrackedChange(_edit: SuggestedEdit): Promise<ApplyResult> {
    throw new Error(NOT_IMPLEMENTED);
  }

  async scrollTo(_target: ScrollTarget): Promise<boolean> {
    return false;
  }
}
