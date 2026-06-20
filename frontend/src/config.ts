/**
 * Demo wiring for the landing page. Mirrors the task pane's API_BASE_URL pattern:
 * a single constant, defaulting to local, swappable for deployment (step 8b).
 */

/**
 * Where "Try the demo" sends visitors — the ClauseKit playground.
 * Note: the local playground dev server runs over HTTPS (Office dev certs), so
 * this must be https, not http (http → ERR_EMPTY_RESPONSE against the TLS server).
 */
export const PLAYGROUND_URL = "https://localhost:3001/playground.html";

/** The sample lease offered on the "run in real Word" path (served from public/). */
export const LEASE_DOCX_URL = "/lease.docx";
