import { useState } from "react";

export default function ActionCard() {
  const [applied, setApplied] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="ck-action">
      <div className="a-head">
        <span className="a-badge">Suggested edit</span>
        <span className="a-title">Raise the liability cap to a market-standard floor</span>
      </div>
      <div className="a-body">
        <p className="a-desc">
          Adds a 2× fee floor so a low-revenue year doesn&apos;t artificially compress your exposure ceiling.
        </p>
        <div className="ck-diff">
          <div className="d-line d-del">
            <span className="t">
              …shall not exceed the total fees paid in the twelve (12) months preceding the claim.
            </span>
          </div>
          <div className="d-line d-add">
            …shall not exceed the greater of (a) fees paid in the twelve (12) months, or (b) two times (2×) such fees…
          </div>
        </div>
      </div>
      <div className="a-foot">
        {applied ? (
          <button className="ck-btn applied" disabled>
            <span className="chk" /> Applied to document
          </button>
        ) : (
          <button className="ck-btn primary" onClick={() => setApplied(true)}>
            <span className="chk" /> Apply Change
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
