/**
 * Entrance-intro coordination. The branded cover (EntranceReveal.tsx) plays
 * once per browser session; every load after that — and reduced-motion users
 * always — skips straight to a fast reveal. Computed once at module load so
 * Nav, App and the overlay all agree on one timeline.
 */
const KEY = 'ck-intro-played';

function computePlay(): boolean {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false;
  // ?intro forces a replay (handy for previewing without clearing storage).
  if (new URLSearchParams(window.location.search).has('intro')) return true;
  try {
    if (sessionStorage.getItem(KEY)) return false;
    sessionStorage.setItem(KEY, '1');
  } catch {
    // Storage blocked (hardened privacy mode): play per-load — the honest
    // fallback for "once per session".
  }
  return true;
}

/** True exactly once per session (and never under reduced motion). */
export const PLAY_INTRO = computePlay();

/* Timeline (ms from mount) when the intro plays:
     0    the dark mark fades in over the page-colour cover
     550  the amber sheen starts its diagonal sweep through the mark
     2250 the amber exits (top-right); the cover starts lifting — the page
          has been rendering beneath it all along
     2350 nav drops in behind the lifting cover
     2550 hero begins its slow fade
     2800 cover fully gone (unmounted just after)
   The cover never gates the page longer than INTRO_DONE_MS. When the intro is
   skipped, the nav and hero reveal almost immediately instead.
   (These match the .ck-intro* animation delays/durations in landing.css.) */
export const INTRO_DONE_MS = 2800;
export const NAV_DROP_MS = PLAY_INTRO ? 2350 : 120;
export const HERO_REVEAL_MS = PLAY_INTRO ? 2550 : 260;