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

Office.onReady((info) => {
  root?.render(
    <DocumentServiceProvider service={documentService}>
      <App title={title} />
    </DocumentServiceProvider>
  );

  // After the user opens ClauseKit once, keep it open on this document — it
  // re-opens automatically on subsequent opens. Requires the shared runtime
  // (declared in the manifest); guarded to Word and to API availability so it's
  // a safe no-op elsewhere (e.g. if the shared runtime isn't present).
  if (info.host === Office.HostType.Word && Office.addin?.setStartupBehavior) {
    Office.addin.setStartupBehavior(Office.StartupBehavior.load).catch(() => {
      /* shared runtime unavailable — ignore */
    });
  }
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
