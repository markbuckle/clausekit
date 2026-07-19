// Entrance-intro coordination. Computed once at module load so Nav, App and the overlay share one timeline.
const KEY = 'ck-intro-played';

function computePlay(): boolean {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false;
  // ?intro forces a replay (handy for previewing without clearing storage).
  if (new URLSearchParams(window.location.search).has('intro')) return true;
  try {
    if (sessionStorage.getItem(KEY)) return false;
    sessionStorage.setItem(KEY, '1');
  } catch {
    // Storage blocked, so just play every load.
  }
  return true;
}

// True exactly once per session, never under reduced motion.
export const PLAY_INTRO = computePlay();

// Timeline in ms: mark fades in at 0, sheen sweeps at 550, cover lifts at 2250, nav drops 2350, hero 2550, gone by 2800. Matches the .ck-intro* delays in landing.css.
export const INTRO_DONE_MS = 2800;
export const NAV_DROP_MS = PLAY_INTRO ? 2350 : 120;
export const HERO_REVEAL_MS = PLAY_INTRO ? 2550 : 260;