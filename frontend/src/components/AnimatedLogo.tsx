import { useEffect, useRef, useState } from 'react';
// Vite raw imports — ship the SVG markup as strings so they render inline
// (CSS animations + prefers-reduced-motion run; the DOM stays scriptable so we
// can pause it). Requires "vite/client" types (already in vite-env.d.ts).
import desktopMarkup from '../../assets/ck-custom-animated.svg?raw';
import mobileMarkup from '../../assets/ck-custom-animated-mobile.svg?raw';

// Phones get the mobile-optimised mark; iPad/laptop/desktop get the full one.
// Matches the app's own 560px phone breakpoint in landing.css. IMPORTANT: both
// SVGs share the same internal element ids (gradients, clip paths, filters), so
// only ONE may ever be in the DOM at a time — we swap the markup rather than
// render both and toggle with CSS (which would collide those ids).
const MOBILE_QUERY = '(max-width: 560px)';

interface AnimatedLogoProps {
  /** Passed straight through to the wrapper (e.g. "pill-img"). Size the inner
   *  <svg> via CSS (`.pill-img svg { ... }`), not here. */
  className?: string;
  /**
   * Pause all animation. The component also auto-pauses while scrolled
   * offscreen so the compositor does no work when the logo isn't visible.
   */
  paused?: boolean;
}

/**
 * Inline animated ClauseKit mark (ambient sweep, gold streak, particle
 * shimmer), with a mobile-optimised variant swapped in below 560px. All
 * animation is CSS inside the SVG itself and honours prefers-reduced-motion.
 * NOTE: the SVGs contain element ids — mount at most one inline instance per
 * page; use the static mark for repeats.
 */
export default function AnimatedLogo({ className, paused = false }: AnimatedLogoProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useRef(true);
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(MOBILE_QUERY).matches,
  );

  // Track viewport crossing the phone breakpoint so we swap the markup.
  useEffect(() => {
    const mq = window.matchMedia(MOBILE_QUERY);
    const onChange = () => setIsMobile(mq.matches);
    mq.addEventListener('change', onChange);
    setIsMobile(mq.matches);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  const markup = isMobile ? mobileMarkup : desktopMarkup;

  // Re-runs when the markup swaps (the inline SVG, and thus its animations, is
  // replaced) or when `paused` changes: reattach the observer and set play state
  // on the current set of animations.
  useEffect(() => {
    const root = ref.current;
    if (!root) return;

    const setPlayState = () => {
      const run = !paused && inView.current;
      root.getAnimations({ subtree: true }).forEach((a) => (run ? a.play() : a.pause()));
    };

    const io = new IntersectionObserver(([entry]) => {
      inView.current = entry.isIntersecting;
      setPlayState();
    });
    io.observe(root);
    setPlayState();
    return () => io.disconnect();
  }, [paused, markup]);

  return (
    <div
      ref={ref}
      className={className}
      role="img"
      aria-label="ClauseKit"
      dangerouslySetInnerHTML={{ __html: markup }}
    />
  );
}
