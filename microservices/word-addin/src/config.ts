/**
 * Runtime configuration for the task pane.
 *
 * Single source of truth for the backend base URL. Injected at build time by
 * webpack's DefinePlugin from the API_BASE_URL env var (default http://localhost:4000),
 * so localhost stays the default but a deployed URL can be baked in for production.
 */

declare const __CLAUSEKIT_API_BASE_URL__: string;

export const API_BASE_URL = __CLAUSEKIT_API_BASE_URL__;
