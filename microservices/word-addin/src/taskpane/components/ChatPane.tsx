import { useEffect, useRef } from "react";
import ActionCard from "./ActionCard";

interface ChatPaneProps {
  query: string;
}

export default function ChatPane({ query }: ChatPaneProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) ref.current.scrollTop = ref.current.scrollHeight;
  }, []);

  return (
    <div className="ck-chat" ref={ref}>
      <div className="ck-daydiv">Today</div>

      {/* User question */}
      <div className="ck-row user">
        <div>
          <div className="ck-bubble user">
            <p>{query}</p>
          </div>
          <div className="ck-time">Just now</div>
        </div>
      </div>

      {/* AI first response */}
      <div className="ck-row">
        <div className="ck-avatar"><span>CK</span></div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="ck-bubble ai">
            <p>
              The cap ties total liability to <strong>12 months of fees</strong> — below market for a deal of this value.
            </p>
            <div className="ck-quote">
              <div className="q-meta">§ 9.1 · Limitation of Liability</div>
              <div className="q-text">
                …shall not exceed the total fees paid by Customer in the{" "}
                <mark>twelve (12) months</mark> preceding the claim.
              </div>
            </div>
            <p>
              Most MSAs at this contract value cap at{" "}
              <strong>the greater of 12 months&apos; fees or 2×</strong>. I can propose a revision.
            </p>
          </div>
          <button className="ck-cite">
            <span className="pin" />
            Jump to § 9.1
            <span className="cite-arr">›</span>
          </button>
          <div className="ck-time">Just now</div>
        </div>
      </div>

      {/* Action card */}
      <div className="ck-row">
        <div className="ck-avatar"><span>CK</span></div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <ActionCard />
        </div>
      </div>

      {/* Second user turn */}
      <div className="ck-row user">
        <div>
          <div className="ck-bubble user">
            <p>Can you also carve indemnity and confidentiality out of the cap?</p>
          </div>
          <div className="ck-time">Just now</div>
        </div>
      </div>

      {/* Thinking indicator */}
      <div className="ck-row ck-thinking">
        <div className="ck-avatar"><span>CK</span></div>
        <div className="t-bubble">
          <i /><i /><i />
        </div>
      </div>
    </div>
  );
}
