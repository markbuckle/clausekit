import { useState } from "react";
import CKHeader from "./CKHeader";
import EmptyState from "./EmptyState";
import ChatPane from "./ChatPane";
import ChatInput from "./ChatInput";

interface AppProps {
  title: string;
}

type View = "empty" | "chat";

export default function App(_props: AppProps) {
  const [view, setView] = useState<View>("empty");
  const [firstQuery, setFirstQuery] = useState("");

  const handleSend = (query: string) => {
    if (!query.trim()) return;
    if (view === "empty") {
      setFirstQuery(query);
      setView("chat");
    }
  };

  return (
    <div className="ck-pane">
      <CKHeader status={view === "chat" ? "Reviewing MSA · §9" : "Ready to review"} />
      {view === "empty" ? (
        <EmptyState onPrompt={handleSend} />
      ) : (
        <ChatPane query={firstQuery} />
      )}
      <ChatInput onSend={handleSend} chatOpen={view === "chat"} />
    </div>
  );
}
