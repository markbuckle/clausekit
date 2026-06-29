import { useState } from "react";
import CKHeader, { type Theme } from "./CKHeader";
import EmptyState from "./EmptyState";
import ChatPane from "./ChatPane";
import ChatInput from "./ChatInput";
import Simulator from "./Simulator";
import { useChat } from "./useChat";
import { useNegotiate } from "./useNegotiate";

interface AppProps {
  title: string;
  /**
   * Render the app's own branded header. Defaults to true (the browser
   * playground). Hidden inside the Office task pane, whose host chrome already
   * shows the add-in name — so Word doesn't stack two "ClauseKit" headers.
   */
  showHeader?: boolean;
}

type Mode = "ask" | "simulator";

export default function App({ showHeader = true }: AppProps) {
  const [mode, setMode] = useState<Mode>("ask");
  const [theme, setTheme] = useState<Theme>("light");
  const chat = useChat();
  const negotiate = useNegotiate();
  const chatOpen = chat.messages.length > 0;

  return (
    <div className="ck-pane" data-theme={theme}>
      {showHeader && (
        <CKHeader
          theme={theme}
          onToggleTheme={() => setTheme((t) => (t === "light" ? "dark" : "light"))}
        />
      )}
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
