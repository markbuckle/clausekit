import { useEffect, useRef } from "react";
import { useDocumentService } from "../../services";
import type { ChatMessage } from "./useChat";
import ActionCard from "./ActionCard";

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
  const service = useDocumentService();

  useEffect(() => {
    if (ref.current) ref.current.scrollTop = ref.current.scrollHeight;
  }, [messages, loading, error]);

  // Jump to a cited clause; no-op gracefully if it can't be located.
  const handleJump = (clauseRef: string) => {
    void service.scrollTo({ clauseRef });
  };

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
              {m.citations && m.citations.length > 0 && (
                <div className="ck-cites">
                  {m.citations.map((ref) => (
                    <button key={ref} className="ck-cite" onClick={() => handleJump(ref)}>
                      <span className="pin" />
                      Jump to {ref}
                      <span className="cite-arr">›</span>
                    </button>
                  ))}
                </div>
              )}
              {m.edit && (
                <div className="ck-action-wrap">
                  <ActionCard edit={m.edit} />
                </div>
              )}
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
