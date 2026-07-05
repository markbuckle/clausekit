import dotenv from "dotenv";

/**
 * Loads backend/.env exactly once, before any module reads process.env.
 * Import this FIRST in every module that touches the environment — ESM
 * evaluates it ahead of the importer's body, so config is always in place.
 *
 * override: true so the backend's own .env is authoritative for
 * ANTHROPIC_API_KEY, even if an unrelated ANTHROPIC_API_KEY is already
 * exported in the shell (which dotenv would otherwise leave in place).
 * .env is gitignored and absent in prod, where real env vars are used instead.
 */
dotenv.config({ override: true });
