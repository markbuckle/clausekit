import { useState } from "react";
import { useDocumentService } from "../../services";
import type { SuggestedEdit } from "../../services";
import type { AnalyzedTerm, LadderRung, Side } from "./useNegotiate";

const TIER_LABELS: Record<string, string> = { ideal: "Ideal", market: "Market", floor: "Floor" };

interface TermCardProps {
  term: AnalyzedTerm;
  heading?: string;
  /** The side the brief was run for — determines who the counterparty is. */
  side: Side;
}

export default function TermCard({ term, heading, side }: TermCardProps) {
  const service = useDocumentService();
  const [appliedTier, setAppliedTier] = useState<string | null>(null);
  const [pendingTier, setPendingTier] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  // Inline wording tweaks, keyed by tier. A rung with no draft applies the
  // model's proposal; cancelling an edit deletes the draft to revert.
  const [editingTier, setEditingTier] = useState<string | null>(null);
  const [drafts, setDrafts] = useState<Record<string, string>>({});

  const counterpartyName = side === "tenant" ? "landlord" : "tenant";

  const proposedFor = (rung: LadderRung) => drafts[rung.tier] ?? rung.proposedText;

  const toggleEdit = (rung: LadderRung) => {
    if (editingTier === rung.tier) {
      setDrafts((d) => {
        const next = { ...d };
        delete next[rung.tier];
        return next;
      });
      setEditingTier(null);
    } else {
      setEditingTier(rung.tier);
    }
  };

  const applyRung = async (rung: LadderRung) => {
    setPendingTier(rung.tier);
    setError(null);
    try {
      const edit: SuggestedEdit = {
        clauseRef: term.clauseRef,
        originalText: term.currentText,
        proposedText: proposedFor(rung),
        rationale: rung.rationale,
        severity: term.severity,
      };
      const result = await service.applyTrackedChange(edit);
      switch (result.status) {
        case "applied":
          setAppliedTier(rung.tier);
          setEditingTier(null);
          await service.scrollTo({ clauseRef: result.clauseRef ?? term.clauseRef });
          break;
        case "not-found":
          setError(
            `Couldn't find the ${term.clauseRef} language to redline` +
              (appliedTier ? " — a position was already applied here." : ".")
          );
          break;
        case "ambiguous":
          setError(`Found ${result.matchCount} matches in ${term.clauseRef}; can't redline unambiguously.`);
          break;
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to apply the change.");
    } finally {
      setPendingTier(null);
    }
  };

  return (
    <div className="sim-card">
      <div className="sim-card-head">
        <span className="sim-ref">{term.clauseRef}</span>
        {heading && <span className="sim-heading">{heading}</span>}
        <span className={`sim-favors ${term.favoredParty}`}>favors {term.favoredParty}</span>
        <span className={`a-sev sev-${term.severity}`}>{term.severity}</span>
      </div>

      <details className="sim-current">
        <summary>Current language</summary>
        <p className="sim-current-text">{term.currentText}</p>
      </details>

      <div className="sim-ladder">
        <div className="sim-ladder-label">Your fallback ladder</div>
        {term.yourLadder.map((rung) => {
          const isApplied = appliedTier === rung.tier;
          const isPending = pendingTier === rung.tier;
          const otherApplied = appliedTier !== null && !isApplied;
          const isEditing = editingTier === rung.tier;
          return (
            <div className={`sim-rung tier-${rung.tier}${isApplied ? " applied" : ""}`} key={rung.tier}>
              <span className="sim-tier">{TIER_LABELS[rung.tier] ?? rung.tier}</span>
              {isEditing && !isApplied ? (
                <textarea
                  className="sim-rung-edit"
                  value={proposedFor(rung)}
                  onChange={(e) => setDrafts((d) => ({ ...d, [rung.tier]: e.target.value }))}
                  aria-label={`Edit the ${TIER_LABELS[rung.tier] ?? rung.tier} proposal`}
                  autoFocus
                />
              ) : (
                <p className="sim-rung-text">{proposedFor(rung)}</p>
              )}
              <p className="sim-rung-rat">{rung.rationale}</p>
              <div className="sim-rung-actions">
                {isApplied ? (
                  <button className="ck-btn applied sim-apply" disabled>
                    <span className="chk" /> Applied
                  </button>
                ) : (
                  <>
                    <button
                      className="ck-btn primary sim-apply"
                      onClick={() => applyRung(rung)}
                      disabled={isPending || otherApplied}
                    >
                      {isPending ? "Applying…" : "Apply this position"}
                    </button>
                    <button
                      className="ck-btn ghost sim-edit"
                      onClick={() => toggleEdit(rung)}
                      disabled={isPending || otherApplied}
                    >
                      {isEditing ? "Cancel" : "Edit"}
                    </button>
                  </>
                )}
              </div>
            </div>
          );
        })}
        {error && <p className="a-error">{error}</p>}
      </div>

      <div className="sim-counter">
        <div className="sim-counter-head">
          <span className="sim-counter-icon" />
          How the {counterpartyName} fights back
        </div>
        <p className="sim-counter-pred">{term.counterparty.predictedCounter}</p>
        <p className="sim-counter-arg">{term.counterparty.argument}</p>
      </div>
    </div>
  );
}
