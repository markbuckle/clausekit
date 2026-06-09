interface CKHeaderProps {
  status: string;
}

export default function CKHeader({ status }: CKHeaderProps) {
  return (
    <div className="ck-header">
      <div className="h-mark">
        <span>CK</span>
      </div>
      <div className="h-txt">
        <span className="h-name">ClauseKit</span>
        <span className="h-status">
          <span className="live" />
          {status}
        </span>
      </div>
      <div className="h-actions">
        <button className="ck-icon-btn" aria-label="More options">
          <span className="kebab">
            <b /><b /><b />
          </span>
        </button>
      </div>
    </div>
  );
}
