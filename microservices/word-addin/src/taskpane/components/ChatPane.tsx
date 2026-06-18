import { useEffect, useRef } from "react";
import type { ChatMessage } from "./useChat";

interface ChatPaneProps {
  messages: ChatMessage[];
  loading: boolean;
  error: string | null;
  onRetry: () => void;
}

/** Minimal inline rendering: **bold** spans, with line breaks preserved as
 *  separate paragraphs so lists in the model's answer stay readable. */
function renderContent(text: string) {
  return text.split("\n").map((line, lineIdx) => {
    if (line.trim() === "") return <div key={lineIdx} className="ck-gap" />;
    const parts = line.split(/(\*\*[^*]+\*\*)/g).filter(Boolean);
    return (
      <p key={lineIdx}>
        {parts.map((part, i) =>
          part.startsWith("**") && part.endsWith("**") ? (
            <strong key={i}>{part.slice(2, -2)}</strong>
          ) : (
            <span key={i}>{part}</span>
          )
        )}
      </p>
    );
  });
}

export default function ChatPane({ messages, loading, error, onRetry }: ChatPaneProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) ref.current.scrollTop = ref.current.scrollHeight;
  }, [messages, loading, error]);

  return (
    <div className="ck-chat" ref={ref}>
      <div className="ck-daydiv">Today</div>

      {messages.map((m, i) =>
        m.role === "user" ? (
          <div className="ck-row user" key={i}>
            <div>
              <div className="ck-bubble user">
                <p>{m.content}</p>
              </div>
              <div className="ck-time">Just now</div>
            </div>
          </div>
        ) : (
          <div className="ck-row" key={i}>
            <div className="ck-avatar">
              <span>CK</span>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div className="ck-bubble ai">{renderContent(m.content)}</div>
              <div className="ck-time">Just now</div>
            </div>
          </div>
        )
      )}

      {loading && (
        <div className="ck-row ck-thinking">
          <div className="ck-avatar">
            <span>CK</span>
          </div>
          <div className="t-bubble">
            <i />
            <i />
            <i />
          </div>
        </div>
      )}

      {error && (
        <div className="ck-row">
          <div className="ck-avatar">
            <span>CK</span>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="ck-error-bubble">
              <p>{error}</p>
              <button className="ck-retry" onClick={onRetry}>
                Retry
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
