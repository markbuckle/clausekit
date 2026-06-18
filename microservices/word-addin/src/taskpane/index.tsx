import { createRoot } from "react-dom/client";
import App from "./components/App";
import { DocumentServiceProvider } from "../services";
import { StubDocumentService } from "../services/office/StubDocumentService";
import "../styles/clausekit.css";

/* global document, Office, module, require, HTMLElement */

const title = "ClauseKit";

// The Word-backed DocumentService arrives in step 7; until then a stub keeps the
// pane mountable (useDocumentService throws without a provider).
const documentService = new StubDocumentService();

const rootElement: HTMLElement | null = document.getElementById("container");
const root = rootElement ? createRoot(rootElement) : undefined;

Office.onReady(() => {
  root?.render(
    <DocumentServiceProvider service={documentService}>
      <App title={title} />
    </DocumentServiceProvider>
  );
});

if ((module as any).hot) {
  (module as any).hot.accept("./components/App", () => {
    const NextApp = require("./components/App").default;
    root?.render(
      <DocumentServiceProvider service={documentService}>
        <NextApp title={title} />
      </DocumentServiceProvider>
    );
  });
}
