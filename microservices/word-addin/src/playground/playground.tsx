import { useSyncExternalStore } from "react";
import { createRoot } from "react-dom/client";
import App from "../taskpane/components/App";
import { DocumentServiceProvider } from "../services";
import { DocumentModel, clauseDomId } from "../services/mock/documentModel";
import type { WorkingClause } from "../services/mock/documentModel";
import { MockDocumentService } from "../services/mock/MockDocumentService";
import { LEASE_TITLE, leaseRecitals } from "../fixtures/lease";
import "../styles/clausekit.css";
import "./playground.css";

/* global document */

/**
 * Browser playground: the real task pane (reused, not reimplemented) running
 * next to the seeded lease, now wired to a live MockDocumentService. Applying a
 * redline from the pane mutates the shared model; the canvas subscribes and
 * re-renders the tracked change. No Office host — React mounts directly.
 */

const model = new DocumentModel();
const documentService = new MockDocumentService(model);

function useWorkingClauses(): WorkingClause[] {
  return useSyncExternalStore(model.subscribe, model.getSnapshot, model.getSnapshot);
}

function LeaseDocument() {
  const clauses = useWorkingClauses();
  return (
    <article className="pg-doc">
      <h1 className="pg-doc-title">{LEASE_TITLE}</h1>
      <p className="pg-recitals">{leaseRecitals}</p>
      {clauses.map((clause) => (
        <section className="pg-clause" key={clause.ref} id={clauseDomId(clause.ref)}>
          <h2 className="pg-clause-head">
            <span className="pg-ref">{clause.ref}</span>
            <span>{clause.heading}</span>
          </h2>
          <p className="pg-clause-text">
            {clause.segments.map((seg, i) =>
              seg.kind === "text" ? (
                <span key={i}>{seg.text}</span>
              ) : (
                <span key={i}>
                  <del className="pg-del">{seg.original}</del>
                  <ins className="pg-ins">{seg.proposed}</ins>
                </span>
              )
            )}
          </p>
        </section>
      ))}
    </article>
  );
}

function Playground() {
  return (
    <div className="pg-root">
      <div className="pg-doc-pane">
        <LeaseDocument />
      </div>
      <div className="pg-pane-host">
        <DocumentServiceProvider service={documentService}>
          <App title="ClauseKit" />
        </DocumentServiceProvider>
      </div>
    </div>
  );
}

const rootElement = document.getElementById("root");
if (rootElement) {
  createRoot(rootElement).render(<Playground />);
}
