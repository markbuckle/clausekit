import { useEffect, useState } from 'react';
import ckMark from '../../assets/ck-mark.svg';
import { PLAY_INTRO, INTRO_DONE_MS } from '../intro';

/**
 * Branded entrance cover: the CK mark fades in dark, an amber glow sweeps
 * through it diagonally (echoing the hero mp4's drifting orb), and as the
 * amber exits the cover lifts to reveal the page — which has been rendering
 * normally beneath it the entire time (reveal, not load). Plays once per
 * session (see intro.ts); reduced-motion users never see it. The cover is
 * pointer-events:none and unmounts on a hard timer, so it can never trap
 * input or gate the page beyond the intro timeline.
 *
 * The mark is drawn as a CSS mask over gradient layers (rather than an <img>)
 * so the sweeping amber sheen stays clipped to the CK shape.
 */
/* The url() MUST be quoted: in production Vite inlines this small SVG as a
   data: URL containing raw spaces and single quotes, and an unquoted url()
   with those characters is invalid CSS — the browser silently drops the
   declaration and the mark renders as unmasked rectangles. */
const markMask = {
  WebkitMaskImage: `url("${ckMark}")`,
  maskImage: `url("${ckMark}")`,
} as const;

export default function EntranceReveal() {
  const [gone, setGone] = useState(!PLAY_INTRO);

  useEffect(() => {
    if (gone) return;
    const t = window.setTimeout(() => setGone(true), INTRO_DONE_MS + 50);
    return () => window.clearTimeout(t);
  }, [gone]);

  if (gone) return null;
  return (
    <div className="ck-intro" aria-hidden="true">
      <div className="ck-intro-mark" style={markMask}>
        <span className="ck-intro-sheen" />
      </div>
    </div>
  );
}