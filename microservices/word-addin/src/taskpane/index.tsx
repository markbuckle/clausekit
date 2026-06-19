import { createRoot } from "react-dom/client";
import App from "./components/App";
import { DocumentServiceProvider } from "../services";
import { OfficeDocumentService } from "../services/office/OfficeDocumentService";
import "../styles/clausekit.css";

/* global document, Office, module, require, HTMLElement */

const title = "ClauseKit";

// Real Word integration: read/edit the live document via Word.run. The playground
// injects the mock instead; the StubDocumentService remains for pane-only testing.
const documentService = new OfficeDocumentService();

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
