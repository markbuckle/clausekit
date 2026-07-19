// Demo wiring for the landing page. Set VITE_PLAYGROUND_URL / VITE_LEASE_DOCX_URL at build time to override the localhost dev defaults.

// "Try the demo" target. Must be https even locally, since the dev server runs on Office dev certs.
export const PLAYGROUND_URL =
  import.meta.env.VITE_PLAYGROUND_URL ?? "https://localhost:3000/playground.html";

// Sample lease for the "run in real Word" path (served from public/).
export const LEASE_DOCX_URL = import.meta.env.VITE_LEASE_DOCX_URL ?? "/lease.docx";

// Add-in manifest for "Upload My Add-in"; its SourceLocation points at the hosted task pane.
export const MANIFEST_URL = "/manifest.xml";
