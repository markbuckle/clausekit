import { createContext, useContext } from "react";
import type { ReactNode } from "react";
import type { DocumentService } from "./DocumentService";

/**
 * React context carrying the active {@link DocumentService}. Defaults to `null`
 * so {@link useDocumentService} can detect use outside a provider. The concrete
 * implementation (mock or real Word) is injected by whoever mounts the tree —
 * the playground supplies the mock, the add-in supplies the Word one.
 */
const DocumentServiceContext = createContext<DocumentService | null>(null);

interface DocumentServiceProviderProps {
  /** The implementation to inject — mock in the playground, Word in the add-in. */
  service: DocumentService;
  children: ReactNode;
}

/** Provides a {@link DocumentService} to everything beneath it. */
export function DocumentServiceProvider({ service, children }: DocumentServiceProviderProps) {
  return <DocumentServiceContext.Provider value={service}>{children}</DocumentServiceContext.Provider>;
}

/**
 * Consumes the injected {@link DocumentService}.
 *
 * @throws if called outside a {@link DocumentServiceProvider}, so a missing
 * implementation fails loudly at the point of use rather than silently no-op'ing.
 */
export function useDocumentService(): DocumentService {
  const service = useContext(DocumentServiceContext);
  if (!service) {
    throw new Error(
      "useDocumentService must be used within a <DocumentServiceProvider>. " +
        "Wrap the app in a provider with a mock or Word DocumentService."
    );
  }
  return service;
}
