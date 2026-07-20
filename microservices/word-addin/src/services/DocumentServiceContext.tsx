import { createContext, useContext } from "react";
import type { ReactNode } from "react";
import type { DocumentService } from "./DocumentService";

// React context carrying the active DocumentService. Defaults to `null` so useDocumentService can detect use outside a provider; the concrete implementation is injected by whoever mounts the tree (mock for the playground, Word for the add-in).
const DocumentServiceContext = createContext<DocumentService | null>(null);

interface DocumentServiceProviderProps {
  // The implementation to inject — mock in the playground, Word in the add-in.
  service: DocumentService;
  children: ReactNode;
}

// Provides a DocumentService to everything beneath it.
export function DocumentServiceProvider({ service, children }: DocumentServiceProviderProps) {
  return <DocumentServiceContext.Provider value={service}>{children}</DocumentServiceContext.Provider>;
}

// Consumes the injected DocumentService; throws if called outside a DocumentServiceProvider so a missing implementation fails loudly rather than silently no-op'ing.
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
