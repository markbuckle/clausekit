/**
 * Demo wiring for the landing page. Env-driven for deployment (step 8b) with
 * localhost defaults for dev: inject VITE_PLAYGROUND_URL / VITE_LEASE_DOCX_URL at
 * build time (e.g. on Vercel) to point at the deployed playground / docx.
 */

/**
 * Where "Try the demo" sends visitors — the ClauseKit playground.
 * Note: the local dev server runs over HTTPS (Office dev certs), so the
 * default must be https, not http (http → ERR_EMPTY_RESPONSE against TLS).
 * Default targets the add-in dev server (`npm run dev-server` / `npm start`,
 * port 3000); the standalone `npm run playground` serves the same page on 3001.
 */
export const PLAYGROUND_URL =
  import.meta.env.VITE_PLAYGROUND_URL ?? "https://localhost:3000/playground.html";

/** The sample lease offered on the "run in real Word" path (served from public/). */
export const LEASE_DOCX_URL = import.meta.env.VITE_LEASE_DOCX_URL ?? "/lease.docx";

/**
 * The add-in manifest for "Upload My Add-in" (served from public/). Its
 * SourceLocation points at the hosted task pane, which calls the deployed backend.
 */
export const MANIFEST_URL = "/manifest.xml";
