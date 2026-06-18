import CKHeader from "./CKHeader";
import EmptyState from "./EmptyState";
import ChatPane from "./ChatPane";
import ChatInput from "./ChatInput";
import { useChat } from "./useChat";

interface AppProps {
  title: string;
}

export default function App(_props: AppProps) {
  const { messages, loading, error, send, retry } = useChat();
  const chatOpen = messages.length > 0;

  return (
    <div className="ck-pane">
      <CKHeader status={chatOpen ? "Reviewing commercial lease" : "Ready to review"} />
      {chatOpen ? (
        <ChatPane messages={messages} loading={loading} error={error} onRetry={retry} />
      ) : (
        <EmptyState onPrompt={send} />
      )}
      <ChatInput onSend={send} chatOpen={chatOpen} disabled={loading} />
    </div>
  );
}
