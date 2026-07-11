import { useState, useSyncExternalStore } from "react";
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
  // On phones the pane becomes a bottom sheet; this tracks whether it's
  // expanded (collapsed on load so the contract gets the first impression).
  // Desktop ignores it entirely (the toggle bar is display: none).
  const [sheetOpen, setSheetOpen] = useState(false);

  return (
    <div className={`pg-root ${sheetOpen ? "pg-sheet-open" : "pg-sheet-closed"}`}>
      <div className="pg-doc-pane">
        <LeaseDocument />
      </div>
      <div className="pg-pane-host">
        <button
          type="button"
          className="pg-sheet-toggle"
          aria-expanded={sheetOpen}
          onClick={() => setSheetOpen((open) => !open)}
        >
          <span className="pg-sheet-grip" aria-hidden="true" />
          <span className="pg-sheet-name">ClauseKit</span>
          <svg className="pg-sheet-chev" viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
            <path d="M3.5 6l4.5 4.5L12.5 6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <div className="pg-pane-body">
          <DocumentServiceProvider service={documentService}>
            <App title="ClauseKit" />
          </DocumentServiceProvider>
        </div>
      </div>
      <button
        type="button"
        className="pg-sheet-fab"
        aria-label="Open ClauseKit"
        onClick={() => setSheetOpen(true)}
      >
        <img src="assets/ck-mark-amber.svg" alt="" />
      </button>
    </div>
  );
}

const rootElement = document.getElementById("root");
if (rootElement) {
  createRoot(rootElement).render(<Playground />);
}
