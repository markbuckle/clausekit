/**
 * Public surface of the document layer — the seam both the add-in and the
 * future browser playground import from. Implementations are added later
 * (MockDocumentService in step 4, OfficeDocumentService in step 7).
 */
export type { Severity, SuggestedEdit, Selection, ApplyResult, ScrollTarget } from "./types";
export type { DocumentService } from "./DocumentService";
export { DocumentServiceProvider, useDocumentService } from "./DocumentServiceContext";
