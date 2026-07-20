import { useState } from "react";
import { useDocumentService } from "../../services";
import type { SuggestedEdit } from "../../services";

interface ActionCardProps {
  // The model-proposed redline this card applies.
  edit: SuggestedEdit;
}

type ApplyState = "idle" | "applying" | "applied" | "error";

// Renders a single model-proposed redline and applies it as a tracked change through the DocumentService seam. Proposed wording can be tweaked inline before applying; originalText stays untouched since it anchors the redline.
export default function ActionCard({ edit }: ActionCardProps) {
  const service = useDocumentService();
  const [state, setState] = useState<ApplyState>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [dismissed, setDismissed] = useState(false);
  const [editing, setEditing] = useState(false);
  const [proposedText, setProposedText] = useState(edit.proposedText);

  if (dismissed) return null;

  const handleApply = async () => {
    setState("applying");
    setErrorMsg("");
    try {
      const result = await service.applyTrackedChange({ ...edit, proposedText });
      switch (result.status) {
        case "applied":
          setState("applied");
          setEditing(false);
          await service.scrollTo({ clauseRef: result.clauseRef ?? edit.clauseRef });
          break;
        case "not-found":
          setState("error");
          setErrorMsg(`Couldn't find the original text in ${edit.clauseRef} to redline.`);
          break;
        case "ambiguous":
          setState("error");
          setErrorMsg(
            `Found ${result.matchCount} matches in ${edit.clauseRef}; can't redline unambiguously.`
          );
          break;
      }
    } catch (err) {
      setState("error");
      setErrorMsg(err instanceof Error ? err.message : "Failed to apply the change.");
    }
  };

  const cancelEdit = () => {
    setProposedText(edit.proposedText);
    setEditing(false);
  };

  const applyLabel =
    state === "applying" ? "Applying…" : state === "error" ? "Retry" : "Apply Change";

  return (
    <div className={`ck-action sev-${edit.severity}`}>
      <div className="a-head">
        <span className="a-badge">Suggested edit</span>
        <span className="a-clause">{edit.clauseRef}</span>
        <span className={`a-sev sev-${edit.severity}`}>{edit.severity}</span>
      </div>
      <div className="a-body">
        <p className="a-desc">{edit.rationale}</p>
        <div className="ck-diff">
          <div className="d-line d-del">
            <span className="t">{edit.originalText}</span>
          </div>
          <div className="d-line d-add">
            {editing ? (
              <textarea
                className="d-add-input"
                value={proposedText}
                onChange={(e) => setProposedText(e.target.value)}
                aria-label="Edit the proposed text"
                autoFocus
              />
            ) : (
              proposedText
            )}
          </div>
        </div>
        {state === "error" && <p className="a-error">{errorMsg}</p>}
      </div>
      <div className="a-foot">
        {state === "applied" ? (
          <button className="ck-btn applied" disabled>
            <span className="chk" /> Applied to document
          </button>
        ) : (
          <>
            <button className="ck-btn primary" onClick={handleApply} disabled={state === "applying"}>
              <span className="chk" /> {applyLabel}
            </button>
            <button
              className="ck-btn ghost"
              onClick={editing ? cancelEdit : () => setEditing(true)}
              disabled={state === "applying"}
            >
              {editing ? "Cancel" : "Edit"}
            </button>
          </>
        )}
        <span className="spacer" />
        <button className="ck-btn danger-ghost" onClick={() => setDismissed(true)}>
          Dismiss
        </button>
      </div>
    </div>
  );
}
