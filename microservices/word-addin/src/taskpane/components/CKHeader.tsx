export type Theme = "light" | "dark";

interface CKHeaderProps {
  theme: Theme;
  onToggleTheme: () => void;
}

export default function CKHeader({ theme, onToggleTheme }: CKHeaderProps) {
  const nextTheme = theme === "light" ? "dark" : "light";
  return (
    <div className="ck-header">
      <div className="h-mark">
        <img src="assets/ck-mark.svg" alt="ClauseKit" />
      </div>
      <div className="h-txt">
        <span className="h-name">ClauseKit</span>
      </div>
      <div className="h-actions">
        <button
          className="ck-theme-btn"
          onClick={onToggleTheme}
          aria-label={`Switch to ${nextTheme} mode`}
          title={`Switch to ${nextTheme} mode`}
        >
          {theme === "light" ? (
            // Moon — click to go dark
            <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
              <path
                d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          ) : (
            // Sun — click to go light
            <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
              <circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="1.8" />
              <path
                d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M19.1 4.9l-1.4 1.4M6.3 17.7l-1.4 1.4"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}