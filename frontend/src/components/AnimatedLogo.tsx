import { useEffect, useRef, useState } from 'react';
// TEMP: mobile SVG swapped out for the mp4 to compare; restore this import and the mobile branch below to bring it back.
// import mobileMarkup from '../../assets/ck-custom-animated-mobile.svg?raw';
import desktopVideo from '../../assets/ck-custom.mp4';

// Matches the 560px phone breakpoint in landing.css.
const MOBILE_QUERY = '(max-width: 560px)';

interface AnimatedLogoProps {
  // Passed straight through to the wrapper (e.g. "pill-img"); size the inner svg/video via CSS.
  className?: string;
  // Pause all animation. Also auto-pauses while scrolled offscreen.
  paused?: boolean;
}

// Animated ClauseKit mark. The inline SVG has element ids, so mount at most one per page.
export default function AnimatedLogo({ className, paused = false }: AnimatedLogoProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useRef(true);
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(MOBILE_QUERY).matches,
  );

  // Swap SVG <-> video when the viewport crosses the phone breakpoint.
  useEffect(() => {
    const mq = window.matchMedia(MOBILE_QUERY);
    const onChange = () => setIsMobile(mq.matches);
    mq.addEventListener('change', onChange);
    setIsMobile(mq.matches);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  // Play/pause whatever is mounted based on the `paused` prop and visibility.
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

  // TEMP: mp4 everywhere for now; put back the `if (isMobile)` branch to restore the mobile SVG.
  void isMobile;

  return (
    <div ref={ref} className={className} role="img" aria-label="ClauseKit">
      <video src={desktopVideo} autoPlay loop muted playsInline aria-label="ClauseKit" />
    </div>
  );
}
