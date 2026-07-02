import { useEffect, useRef } from 'react';
// Vite raw import — ships the SVG markup as a string so it renders inline
// (CSS animations + prefers-reduced-motion run; the DOM stays scriptable so we
// can pause it). Requires "vite/client" types (already in vite-env.d.ts).
import logoMarkup from '../../assets/ck-custom-animated.svg?raw';

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
 * shimmer). All animation is CSS inside the SVG itself and honours
 * prefers-reduced-motion. NOTE: the SVG contains element ids (gradients,
 * clip paths) — mount at most one inline instance per page; use the static
 * mark for repeats.
 */
export default function AnimatedLogo({ className, paused = false }: AnimatedLogoProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useRef(true);

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
  }, [paused]);

  return (
    <div
      ref={ref}
      className={className}
      role="img"
      aria-label="ClauseKit"
      dangerouslySetInnerHTML={{ __html: logoMarkup }}
    />
  );
}
