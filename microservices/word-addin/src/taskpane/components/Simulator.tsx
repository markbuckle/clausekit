import type { UseNegotiate } from "./useNegotiate";
import TermCard from "./TermCard";

export default function Simulator({
  side,
  setSide,
  terms,
  headings,
  loading,
  error,
  run,
  ranSide,
}: UseNegotiate) {
  return (
    <div className="ck-sim">
      <div className="sim-setup">
        <div>
          <p className="sim-title">Negotiation Simulator</p>
          <p className="sim-sub">
            Pick your side and war-game the lease — fallback positions for every off-market term, plus
            how the other side fights back.
          </p>
        </div>
        <div className="sim-side">
          <span className="sim-side-label">I represent the</span>
          <div className="sim-toggle">
            <button
              className={`sim-seg${side === "tenant" ? " on" : ""}`}
              onClick={() => setSide("tenant")}
              disabled={loading}
            >
              Tenant
            </button>
            <button
              className={`sim-seg${side === "landlord" ? " on" : ""}`}
              onClick={() => setSide("landlord")}
              disabled={loading}
            >
              Landlord
            </button>
          </div>
        </div>
        <button className="ck-btn primary sim-run" onClick={run} disabled={loading}>
          {loading ? "War-gaming the lease…" : terms ? "Re-run war-game" : "War-game the lease"}
        </button>
      </div>

      {loading && (
        <div className="sim-loading">
          <div className="t-bubble">
            <i />
            <i />
            <i />
          </div>
          <span>War-gaming the lease as the {side}…</span>
        </div>
      )}

      {error && !loading && (
        <div className="ck-error-bubble sim-error">
          <p>{error}</p>
          <button className="ck-retry" onClick={run}>
            Retry
          </button>
        </div>
      )}

      {!loading && !error && terms && terms.length === 0 && (
        <p className="sim-empty">No off-market terms surfaced for the {ranSide}. Try the other side.</p>
      )}

      {!loading && terms && terms.length > 0 && (
        <div className="sim-brief">
          <p className="sim-count">
            {terms.length} term{terms.length > 1 ? "s" : ""} to negotiate as the {ranSide}
          </p>
          {terms.map((term, i) => (
            <TermCard key={i} term={term} heading={headings[term.clauseRef]} side={ranSide ?? side} />
          ))}
        </div>
      )}

      {!loading && !error && !terms && (
        <div className="sim-placeholder">
          <div className="sim-ph-mark">
            <span>⚔</span>
          </div>
          <p>Run the war-game to see your fallback ladders and the counterparty&apos;s likely pushback.</p>
        </div>
      )}
    </div>
  );
}
