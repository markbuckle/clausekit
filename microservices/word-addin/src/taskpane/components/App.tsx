import { useState } from "react";
import CKHeader from "./CKHeader";
import EmptyState from "./EmptyState";
import ChatPane from "./ChatPane";
import ChatInput from "./ChatInput";
import Simulator from "./Simulator";
import { useChat } from "./useChat";
import { useNegotiate } from "./useNegotiate";

interface AppProps {
  title: string;
}

type Mode = "ask" | "simulator";

export default function App(_props: AppProps) {
  const [mode, setMode] = useState<Mode>("ask");
  const chat = useChat();
  const negotiate = useNegotiate();
  const chatOpen = chat.messages.length > 0;

  const status =
    mode === "simulator"
      ? negotiate.terms
        ? `Simulating · ${negotiate.ranSide}`
        : "Negotiation Simulator"
      : chatOpen
        ? "Reviewing commercial lease"
        : "Ready to review";

  return (
    <div className="ck-pane">
      <CKHeader status={status} />
      <div className="ck-tabs">
        <button className={`ck-tab${mode === "ask" ? " on" : ""}`} onClick={() => setMode("ask")}>
          Ask
        </button>
        <button
          className={`ck-tab${mode === "simulator" ? " on" : ""}`}
          onClick={() => setMode("simulator")}
        >
          Simulator
        </button>
      </div>

      {mode === "ask" ? (
        <>
          {chatOpen ? (
            <ChatPane
              messages={chat.messages}
              loading={chat.loading}
              error={chat.error}
              onRetry={chat.retry}
            />
          ) : (
            <EmptyState onPrompt={chat.send} />
          )}
          <ChatInput onSend={chat.send} chatOpen={chatOpen} disabled={chat.loading} />
        </>
      ) : (
        <Simulator {...negotiate} />
      )}
    </div>
  );
}
