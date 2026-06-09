const PROMPTS = [
  "Is this liability cap standard for an MSA?",
  "Flag any uncapped indemnity obligations",
  "Does confidentiality survive termination?",
];

interface EmptyStateProps {
  onPrompt: (prompt: string) => void;
}

export default function EmptyState({ onPrompt }: EmptyStateProps) {
  return (
    <div className="ck-empty">
      <div className="e-mark">
        <span>CK</span>
      </div>
      <h3>Review with confidence</h3>
      <p className="e-sub">
        Ask anything about the contract you&apos;re in — or pick a starting point below.
      </p>
      <div className="ck-suggest">
        {PROMPTS.map((p) => (
          <button key={p} className="s-btn" onClick={() => onPrompt(p)}>
            <span className="s-dot" />
            {p}
            <span className="s-ar">›</span>
          </button>
        ))}
      </div>
    </div>
  );
}
