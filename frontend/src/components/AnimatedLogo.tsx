import { useEffect, useRef, useState } from 'react';
// Vite imports: the mobile mark ships inline as a string (?raw) so its CSS
// animations run and the DOM stays scriptable; the desktop mark is an <mp4>
// URL (Vite copies + hashes it as a separately-cached asset).
// TEMP: mobile SVG swapped out for the mp4 to compare — restore this import and
// the mobile branch below to bring back ck-custom-animated-mobile.svg.
// import mobileMarkup from '../../assets/ck-custom-animated-mobile.svg?raw';
import desktopVideo from '../../assets/ck-custom.mp4';

// Phones get the mobile-optimised inline SVG; iPad/laptop/desktop get the mp4.
// Matches the app's own 560px phone breakpoint in landing.css.
const MOBILE_QUERY = '(max-width: 560px)';

interface AnimatedLogoProps {
  /** Passed straight through to the wrapper (e.g. "pill-img"). Size the inner
   *  <svg>/<video> via CSS (`.pill-img svg, .pill-img video { ... }`). */
  className?: string;
  /**
   * Pause all animation. The component also auto-pauses while scrolled
   * offscreen so nothing decodes/composites when the logo isn't visible.
   */
  paused?: boolean;
}

/**
 * Animated ClauseKit mark. Desktop plays the mp4 (video quality/size test);
 * below 560px it swaps to the inline mobile SVG. NOTE: the SVG contains element
 * ids — mount at most one inline instance per page; use the static mark for
 * repeats.
 */
export default function AnimatedLogo({ className, paused = false }: AnimatedLogoProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useRef(true);
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(MOBILE_QUERY).matches,
  );

  // Track viewport crossing the phone breakpoint so we swap SVG <-> video.
  useEffect(() => {
    const mq = window.matchMedia(MOBILE_QUERY);
    const onChange = () => setIsMobile(mq.matches);
    mq.addEventListener('change', onChange);
    setIsMobile(mq.matches);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  // Play/pause whatever is mounted (SVG CSS animations or the <video>) based on
  // the `paused` prop and on-screen visibility. Re-runs on the SVG<->video swap.
  useEffect(() => {
    const root = ref.current;
    if (!root) return;

    const setPlayState = () => {
      const run = !paused && inView.current;
      root.getAnimations({ subtree: true }).forEach((a) => (run ? a.play() : a.pause()));
      const vid = root.querySelector('video');
      if (vid) run ? void vid.play().catch(() => {}) : vid.pause();
    };

    const io = new IntersectionObserver(([entry]) => {
      inView.current = entry.isIntersecting;
      setPlayState();
    });
    io.observe(root);
    setPlayState();
    return () => io.disconnect();
  }, [paused, isMobile]);

  // TEMP: both mobile and desktop play the mp4 for comparison. To restore the
  // mobile SVG, re-add the import above and put back the `if (isMobile)` branch
  // that rendered `mobileMarkup` via dangerouslySetInnerHTML.
  void isMobile;

  return (
    <div ref={ref} className={className} role="img" aria-label="ClauseKit">
      <video src={desktopVideo} autoPlay loop muted playsInline aria-label="ClauseKit" />
    </div>
  );
}
