import { useEffect } from 'react';

interface DesktopOnlyModalProps {
  open: boolean;
  onClose: () => void;
}

// Shown when a Word-tutorial CTA is tapped on a small screen; installing the add-in needs a desktop, so we point people there.
export default function DesktopOnlyModal({ open, onClose }: DesktopOnlyModalProps) {
  // Close on Escape and lock scroll (including mobile touch) while up.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    // overflow: hidden alone doesn't stop touch scrolling on iOS Safari.
    const onTouchMove = (e: TouchEvent) => e.preventDefault();

    document.addEventListener('keydown', onKey);
    document.addEventListener('touchmove', onTouchMove, { passive: false });

    const html = document.documentElement;
    const prevBodyOverflow = document.body.style.overflow;
    const prevHtmlOverflow = html.style.overflow;
    document.body.style.overflow = 'hidden';
    html.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('touchmove', onTouchMove);
      document.body.style.overflow = prevBodyOverflow;
      html.style.overflow = prevHtmlOverflow;
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="ck-modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="ck-modal-title"
      onClick={onClose}
    >
      <div className="ck-modal-card" onClick={(e) => e.stopPropagation()}>
        <button className="ck-modal-close" aria-label="Close" onClick={onClose}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
        </button>

        <span className="kicker">Best on desktop</span>
        <h2 id="ck-modal-title" className="serif-grad">
          ClauseKit for Word is built for your laptop only
        </h2>
        <p>
          The live demo runs contracts side-by-side with the assistant - a
          desktop-class experience that needs the room only a laptop or larger
          screen can give. Head over to your computer and open this page there to
          run ClauseKit in the browser or in Word.
        </p>

        <button className="btn demo lg ck-modal-cta" onClick={onClose}>
          Got it
        </button>
      </div>
    </div>
  );
}
