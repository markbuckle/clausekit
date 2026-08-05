import { useEffect, useRef, useState } from 'react';
// Raw imports so the markup renders inline: the animation is CSS inside the SVG,
// and an inline DOM stays scriptable so we can pause it offscreen.
import desktopMarkup from '../../assets/ck-custom-animated.svg?raw';
import mobileMarkup from '../../assets/ck-custom-animated-mobile.svg?raw';

// Matches the 560px phone breakpoint in landing.css. Both SVGs share the same
// internal element ids, so we swap the markup rather than render both and toggle
// with CSS — two copies in the DOM at once would collide those ids.
const MOBILE_QUERY = '(max-width: 560px)';

interface AnimatedLogoProps {
  // Passed straight through to the wrapper (e.g. "pill-img"); size the inner svg via CSS.
  className?: string;
  // Pause all animation. Also auto-pauses while scrolled offscreen.
  paused?: boolean;
}

// Animated ClauseKit mark, with a mobile-optimised variant below 560px.
// The SVGs have element ids, so mount at most one per page.
export default function AnimatedLogo({ className, paused = false }: AnimatedLogoProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useRef(true);
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(MOBILE_QUERY).matches,
  );

  // Swap desktop <-> mobile markup when the viewport crosses the phone breakpoint.
  useEffect(() => {
    const mq = window.matchMedia(MOBILE_QUERY);
    const onChange = () => setIsMobile(mq.matches);
    mq.addEventListener('change', onChange);
    setIsMobile(mq.matches);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  const markup = isMobile ? mobileMarkup : desktopMarkup;

  // Play/pause based on the `paused` prop and visibility. Re-runs on a markup
  // swap, since that replaces the SVG and with it the animation set.
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
