import { useEffect, useState } from 'react';
import ckMark from '../../assets/ck-mark.svg';
import { PLAY_INTRO, INTRO_DONE_MS } from '../intro';

// Branded entrance cover, plays once per session (see intro.ts). Pointer-events:none with a hard unmount timer, so it can never trap input.
// The url() must be quoted: Vite inlines the SVG as a data: URL with raw spaces, and an unquoted url() gets silently dropped.
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