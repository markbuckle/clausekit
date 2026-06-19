import { useCallback, useState } from "react";
import { useDocumentService } from "../../services";
import type { SuggestedEdit } from "../../services";
import { API_BASE_URL } from "../../config";

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  /** § refs the answer relies on (assistant turns only). */
  citations?: string[];
  /** A concrete redline, present only when the model proposed one. */
  edit?: SuggestedEdit;
}

/**
 * How many prior turns to send as conversation history. The document itself
 * never rides in history — it goes in `documentText`, which the backend caches
 * as a stable prefix. Keeping history short keeps the uncached part small.
 */
const HISTORY_TURNS = 6;

export interface UseChat {
  messages: ChatMessage[];
  loading: boolean;
  error: string | null;
  send: (text: string) => void;
  retry: () => void;
}

/**
 * Owns the live chat: the message list, loading/error state, and the call to
 * the backend's /api/ask, grounded in the document via the DocumentService seam.
 * Assistant turns carry the structured citations and optional redline edit.
 */
export function useChat(): UseChat {
  const service = useDocumentService();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const ask = useCallback(
    async (message: string, history: ChatMessage[]) => {
      setLoading(true);
      setError(null);
      try {
        const documentText = await service.getFullText();
        const res = await fetch(`${API_BASE_URL}/api/ask`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            documentText,
            message,
            history: history.slice(-HISTORY_TURNS),
          }),
        });
        if (!res.ok) {
          throw new Error(`The assistant is unavailable (error ${res.status}).`);
        }
        const data = (await res.json()) as {
          answer?: string;
          citations?: string[];
          edit?: SuggestedEdit;
        };
        const answer = (data.answer ?? "").trim();
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: answer || "(The assistant returned an empty answer.)",
            citations: data.citations,
            edit: data.edit,
          },
        ]);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Couldn't reach the assistant.");
      } finally {
        setLoading(false);
      }
    },
    [service]
  );

  const send = useCallback(
    (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || loading) return;
      const history = messages;
      setMessages((prev) => [...prev, { role: "user", content: trimmed }]);
      void ask(trimmed, history);
    },
    [ask, loading, messages]
  );

  const retry = useCallback(() => {
    if (loading) return;
    // On error the assistant reply was never appended, so the last message is
    // the user turn that failed — re-ask it with the history before it.
    let lastUserIdx = -1;
    for (let i = messages.length - 1; i >= 0; i--) {
      if (messages[i].role === "user") {
        lastUserIdx = i;
        break;
      }
    }
    if (lastUserIdx === -1) return;
    void ask(messages[lastUserIdx].content, messages.slice(0, lastUserIdx));
  }, [messages, ask, loading]);

  return { messages, loading, error, send, retry };
}
