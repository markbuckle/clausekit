# ClauseKit

AI legal assistant for Microsoft Word.

## Repository structure

| Folder | What it is |
|--------|-----------|
| `microservices/word-addin/` | Word Office Add-in - React + TypeScript task pane. Runs inside Microsoft Word via Office.js. Entry point: `microservices/word-addin/src/taskpane/index.tsx`. Build with `npm start` (run from that folder). Houses its own `package.json`, `webpack.config.js`, `tsconfig.json`, `manifest.xml`, and `assets/`. |
| `microservices/` | Container for ClauseKit's microservices - currently just the Word add-in, with more to be added over time. Each microservice owns its own dependencies and build config. |
| `frontend/` | Marketing website - React + TypeScript, built with Vite (plain CSS, no framework). `npm run dev` to serve locally, `npm run build` to bundle. |
| `backend/` | Backend API - Node.js + Express + TypeScript, calling Claude via the Anthropic SDK. Serves `/api/ask` (document-grounded Q&A) and `/api/negotiate` (negotiation brief). Entry point: `backend/src/index.ts`. |

## Tech stack

Mostly TypeScript. Each area owns its own dependencies and build config - there is no shared root `package.json`.

### Frontend (`frontend/`)
- **React** + **TypeScript**, bundled with **Vite** (`@vitejs/plugin-react`).
- **Plain CSS** (hand-authored design system in `src/landing.css`)
- Assets (SVG/MP4/images) imported through Vite

### Word add-in (`microservices/word-addin/`)
- **React** + **TypeScript** task pane running inside Word via **Office.js**.
- **Fluent UI** (`@fluentui/react-components`) for UI, **Less** for styling.
- Bundled with **Webpack** + **Babel**; tooling via the **Office Add-in CLI** (`office-addin-*`). Loaded into Word through `manifest.xml`.
- `docx` is used to generate the sample lease document.

### Backend (`backend/`)
- **Node.js** + **Express** + **TypeScript**, run directly with **tsx** (ESM).
- **Anthropic SDK** (`@anthropic-ai/sdk`) for all LLM calls - **Claude Haiku 4.5** by default, model swappable via env (Sonnet/Opus for heavier reasoning).
- Structured outputs via **tool use**, with server-side verbatim validation so a suggested edit's original text is always an exact substring of the contract.
- **Prompt caching** on the stable system prompt + contract prefix to cut cost/latency.
- Hardening: **CORS** allowlist, **express-rate-limit** (per-minute + daily caps), and an in-memory daily token spend backstop.
- **Docker** (`backend/Dockerfile`) for deployment (e.g. Cloud Run).

### AI / model layer
- **Claude** (Anthropic) is the single model provider, called only from the backend so the API key never reaches the client.
- Two endpoints: contract-review Q&A (`/api/ask`) and the negotiation simulator (`/api/negotiate`).

## Deployment

- **Vercel** hosts the two static frontends — `frontend/` (marketing site) and `microservices/word-addin/` (playground + task pane) — each built and served from its own `vercel.json`.
- **Google Cloud Run** hosts the `backend/` API as a Docker container (`backend/Dockerfile`).
