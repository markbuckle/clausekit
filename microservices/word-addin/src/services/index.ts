// Public surface of the document layer — the seam both the add-in and the browser playground import from.
export type { Severity, SuggestedEdit, Selection, ApplyResult, ScrollTarget } from "./types";
export type { DocumentService } from "./DocumentService";
export { DocumentServiceProvider, useDocumentService } from "./DocumentServiceContext";
