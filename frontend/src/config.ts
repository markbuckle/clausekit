/**
 * Demo wiring for the landing page. Mirrors the task pane's API_BASE_URL pattern:
 * a single constant, defaulting to local, swappable for deployment (step 8b).
 */

/** Where "Try the demo" sends visitors — the ClauseKit playground. */
export const PLAYGROUND_URL = "http://localhost:3001/playground.html";

/** The sample lease offered on the "run in real Word" path (served from public/). */
export const LEASE_DOCX_URL = "/lease.docx";
