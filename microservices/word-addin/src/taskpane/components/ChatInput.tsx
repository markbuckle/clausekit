import { useRef, useState } from "react";

interface ChatInputProps {
  onSend: (query: string) => void;
  chatOpen: boolean;
  disabled?: boolean;
}

export default function ChatInput({ onSend, chatOpen, disabled = false }: ChatInputProps) {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setValue("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const canSend = value.trim().length > 0 && !disabled;

  return (
    <>
      <div className="ck-privacy">
        <div className="p-shield" />
        <p className="p-txt">
          <b>Your document stays private.</b> Text is only sent when you ask a question.
        </p>
      </div>
      <div className="ck-input-wrap">
        <div className="ck-input">
          <textarea
            ref={textareaRef}
            rows={1}
            placeholder={chatOpen ? "Ask a follow-up…" : "Ask about this contract…"}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button
            className={`ck-send${canSend ? "" : " disabled"}`}
            onClick={handleSend}
            aria-label="Send"
          >
            <span className="send-arrow" />
          </button>
        </div>
        <div className="ck-hint">
          <span className="lock-icon" />
          Encrypted in transit · Your firm&apos;s data is never used to train models
        </div>
      </div>
    </>
  );
}
