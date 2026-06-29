const PROMPTS = [
  "Is the 5% rent escalation off-market?",
  "Are the tenant's repair obligations standard?",
  "Is the personal guaranty unusual?",
];

interface EmptyStateProps {
  onPrompt: (prompt: string) => void;
}

export default function EmptyState({ onPrompt }: EmptyStateProps) {
  return (
    <div className="ck-empty">
      <p className="e-sub">
        Ask anything about this contract or pick a starting point below.
      </p>
      <div className="ck-suggest">
        {PROMPTS.map((p) => (
          <button key={p} className="s-btn" onClick={() => onPrompt(p)}>
            <span className="s-txt">{p}</span>
            <span className="s-ar">›</span>
          </button>
        ))}
      </div>
    </div>
  );
}
