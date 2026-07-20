// Backend base URL, injected at build time by webpack's DefinePlugin from the API_BASE_URL env var (default http://localhost:4000).

declare const __CLAUSEKIT_API_BASE_URL__: string;

export const API_BASE_URL = __CLAUSEKIT_API_BASE_URL__;
