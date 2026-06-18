import { useState } from "react";
import { useDocumentService } from "../../services";
import type { SuggestedEdit } from "../../services";
import { getContestedClause } from "../../fixtures/lease";

/**
 * Demo edit built from the §5 contested-clause sidecar: lower the 5% compounding
 * escalator (the landlord-opening rung) to the market 3% rung. Replaces the old
 * hardcoded MSA liability content so the card matches the seeded lease.
 */
const escalation = getContestedClause("§5");
const demoEdit: SuggestedEdit = {
  clauseRef: "§5",
  originalText: escalation?.fallbackLadder[0].language ?? "",
  proposedText: escalation?.fallbackLadder[1].language ?? "",
  rationale: escalation?.fallbackLadder[1].rationale ?? "",
  severity: "high",
};

type ApplyState = "idle" | "applying" | "applied" | "error";

export default function ActionCard() {
  const service = useDocumentService();
  const [state, setState] = useState<ApplyState>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  const handleApply = async () => {
    setState("applying");
    setErrorMsg("");
    try {
      const result = await service.applyTrackedChange(demoEdit);
      switch (result.status) {
        case "applied":
          setState("applied");
          await service.scrollTo({ clauseRef: result.clauseRef ?? demoEdit.clauseRef });
          break;
        case "not-found":
          setState("error");
          setErrorMsg(`Couldn't find the original text in ${demoEdit.clauseRef} to redline.`);
          break;
        case "ambiguous":
          setState("error");
          setErrorMsg(
            `Found ${result.matchCount} matches in ${demoEdit.clauseRef}; can't redline unambiguously.`
          );
          break;
      }
    } catch (err) {
      setState("error");
      setErrorMsg(err instanceof Error ? err.message : "Failed to apply the change.");
    }
  };

  const applyLabel =
    state === "applying" ? "Applying…" : state === "error" ? "Retry" : "Apply Change";

  return (
    <div className="ck-action">
      <div className="a-head">
        <span className="a-badge">Suggested edit</span>
        <span className="a-title">Lower the rent escalation to a market 3%</span>
      </div>
      <div className="a-body">
        <p className="a-desc">{demoEdit.rationale}</p>
        <div className="ck-diff">
          <div className="d-line d-del">
            <span className="t">{demoEdit.originalText}</span>
          </div>
          <div className="d-line d-add">{demoEdit.proposedText}</div>
        </div>
        {state === "error" && <p className="a-error">{errorMsg}</p>}
      </div>
      <div className="a-foot">
        {state === "applied" ? (
          <button className="ck-btn applied" disabled>
            <span className="chk" /> Applied to document
          </button>
        ) : (
          <button className="ck-btn primary" onClick={handleApply} disabled={state === "applying"}>
            <span className="chk" /> {applyLabel}
          </button>
        )}
        <span className="spacer" />
        <button className="ck-btn danger-ghost" onClick={() => setDismissed(true)}>
          Dismiss
        </button>
      </div>
    </div>
  );
}
