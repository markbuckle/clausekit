import { createRoot } from "react-dom/client";
import App from "../taskpane/components/App";
import { LEASE_TITLE, leaseRecitals, leaseClauses } from "../fixtures/lease";
import "../styles/clausekit.css";
import "./playground.css";

/* global document */

/**
 * Browser playground: the real task pane (reused, not reimplemented) running
 * next to the seeded lease rendered as a document. No Office host — this entry
 * mounts React directly rather than waiting on Office.onReady. Wiring the pane
 * to a DocumentService is step 4b; here it stays in its current mocked state.
 */

function LeaseDocument() {
  return (
    <article className="pg-doc">
      <h1 className="pg-doc-title">{LEASE_TITLE}</h1>
      <p className="pg-recitals">{leaseRecitals}</p>
      {leaseClauses.map((clause) => (
        <section className="pg-clause" key={clause.ref} id={`clause-${clause.ref}`}>
          <h2 className="pg-clause-head">
            <span className="pg-ref">{clause.ref}</span>
            <span>{clause.heading}</span>
          </h2>
          <p className="pg-clause-text">{clause.text}</p>
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
        <App title="ClauseKit" />
      </div>
    </div>
  );
}

const rootElement = document.getElementById("root");
if (rootElement) {
  createRoot(rootElement).render(<Playground />);
}
