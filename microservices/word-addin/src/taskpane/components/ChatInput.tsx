import { useRef, useState } from "react";

interface ChatInputProps {
  onSend: (query: string) => void;
  chatOpen: boolean;
  disabled?: boolean;
}

const MIN_HEIGHT = 40;
const MAX_HEIGHT = 240;
const DEFAULT_HEIGHT = 40;

export default function ChatInput({ onSend, chatOpen, disabled = false }: ChatInputProps) {
  const [value, setValue] = useState("");
  const [height, setHeight] = useState(DEFAULT_HEIGHT);
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

  const handleResizeStart = (e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    const startY = e.clientY;
    const startHeight = height;
    const handle = e.currentTarget;
    handle.setPointerCapture(e.pointerId);

    const onMove = (ev: PointerEvent) => {
      // Drag up grows the box, drag down shrinks it.
      const next = startHeight + (startY - ev.clientY);
      setHeight(Math.min(MAX_HEIGHT, Math.max(MIN_HEIGHT, next)));
    };
    const onUp = (ev: PointerEvent) => {
      handle.releasePointerCapture(ev.pointerId);
      handle.removeEventListener("pointermove", onMove);
      handle.removeEventListener("pointerup", onUp);
    };
    handle.addEventListener("pointermove", onMove);
    handle.addEventListener("pointerup", onUp);
  };

  const canSend = value.trim().length > 0 && !disabled;

  return (
    <>
      <div className="ck-input-wrap">
        <div
          className="ck-input-resize"
          onPointerDown={handleResizeStart}
          role="separator"
          aria-orientation="horizontal"
          aria-label="Resize input"
          title="Drag to resize"
        >
          <span className="ck-input-grip" />
        </div>
        <div className="ck-input">
          <textarea
            ref={textareaRef}
            placeholder={chatOpen ? "Ask a follow-up…" : "Ask about this contract…"}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            style={{ height }}
          />
          <button
            className={`ck-send${canSend ? "" : " disabled"}`}
            onClick={handleSend}
            disabled={!canSend}
            aria-label="Send"
          >
            <svg viewBox="0 0 24 24" width="17" height="17" aria-hidden="true">
              <path
                d="M12 19V6M12 6l-6 6M12 6l6 6"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>
    </>
  );
}
