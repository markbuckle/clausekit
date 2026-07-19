/// <reference types="vite/client" />

interface ImportMetaEnv {
  // Playground URL for "Try the demo", injected at build for deployment.
  readonly VITE_PLAYGROUND_URL?: string;
  // Sample lease download URL for the "run in real Word" path.
  readonly VITE_LEASE_DOCX_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
