import { useState } from 'react';
import type { MouseEvent } from 'react';
import { PLAYGROUND_URL } from '../config';
import DesktopOnlyModal from './DesktopOnlyModal';

// Below this width the live demo doesn't have room to breathe, so we intercept
// the CTA taps and point visitors to their desktop instead (matches the 768px
// phone/small-tablet range where the demo UI degrades).
const MOBILE_QUERY = '(max-width: 768px)';

export default function FinalCta() {
  const [modalOpen, setModalOpen] = useState(false);

  // On mobile, stop the navigation and show the "use your desktop" modal.
  // On desktop, let the link behave normally.
  const guardMobile = (e: MouseEvent<HTMLAnchorElement>) => {
    if (window.matchMedia(MOBILE_QUERY).matches) {
      e.preventDefault();
      setModalOpen(true);
    }
  };

  return (
    <section className="section" id="demo">
      <div className="wrap">
        <div className="cta reveal">
          <h2 className="serif-grad">See <span className="text-gold-grad">ClauseKit</span> on your next contract</h2>
          <p>
            Install the add-in, open a draft, and watch it do its magic
          </p>
          <div className="cta-btns">
            <a className="btn demo lg" href={PLAYGROUND_URL} target="_blank" rel="noopener noreferrer" onClick={guardMobile}>
              Run in browser
            </a>
            <a className="btn demo lg blue" href="/run-in-word">
              Run in Word
            </a>
          </div>
        </div>
      </div>
      <DesktopOnlyModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </section>
  );
}
