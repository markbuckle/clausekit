<div align="center">

<img src="frontend/assets/ck-mark.svg" width="90" alt="ClauseKit logo" />

# ClauseKit

**AI legal assistant for Microsoft Word**

Review and redline contracts, then simulate the negotiation - without leaving the document

<br/>

![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React_18-087EA4?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?logo=express&logoColor=white)
![tRPC](https://img.shields.io/badge/tRPC-2596BE?logo=trpc&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?logo=mongodb&logoColor=white)
![Claude](https://img.shields.io/badge/Claude-D97706?logo=anthropic&logoColor=white)
![Office.js](https://img.shields.io/badge/Office.js-D83B01?logo=microsoftword&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?logo=vercel&logoColor=white)
![Cloud Run](https://img.shields.io/badge/Cloud_Run-4285F4?logo=googlecloud&logoColor=white)

</div>

---

## What it does

- **Grounded contract Q&A** - answers come from the document in front of you, cited by the clause (`§`) number
- **One-click redlines** - proposes exact replacement language and applies it as a native tracked change in Word
- **Negotiation simulator** - builds a fallback ladder per off-market term and role-plays opposing counsel

## Architecture

<!-- Static render (no GitHub mermaid pan/zoom controls). Source: docs/architecture.mmd
     Regenerate after editing: npx -y @mermaid-js/mermaid-cli -i docs/architecture.mmd -o docs/architecture.svg -b transparent -->
![ClauseKit architecture](docs/architecture.svg)

## Design

- **Inspiration** - benchmarked against the products ClauseKit lives beside: [Spellbook](https://www.spellbook.legal/) for AI contract-review UX patterns, [Resend](https://resend.com/home/) for the dark, typography-led aesthetic of the landing page.
- **Design system** - built with **Claude**: near-black ink surfaces with a single amber accent, Newsreader serif display over Inter body text, Roboto Mono for section references and labels (source of truth in `frontend/src/landing.css`).
- **Prototypes** - svg's finalized in **Figma** before implementation.
- **Inside Word** - the task pane uses **Fluent UI** so ClauseKit reads as native Microsoft Word UI rather than a bolted-on web view.

## Repository structure

| Folder | What it is |
|:-------|:-----------|
| `microservices/`<br>`word-addin/` | **Word Office Add-in** - React + TypeScript task pane running inside Microsoft Word via Office.js<br><sub>Entry `src/taskpane/index.tsx` · build with `npm start` from that folder · owns its own `package.json`, `webpack.config.js`, `tsconfig.json`, `manifest.xml`, and `assets/`</sub> |
| `frontend/` | **Landing page** - React + TypeScript, built with Vite, hand-authored CSS<br><sub>`npm run dev` to serve locally · `npm run build` to bundle</sub> |
| `backend/` | **Backend API** - Node.js + Express + tRPC, calling Claude via the Anthropic SDK<br><sub>typed procedures `ask` (document-grounded Q&A) and `negotiate` (negotiation brief) at `/trpc` · deprecated REST mirrors at `/api/*` · entry `src/index.ts`</sub> |

## Tech stack

Mostly TypeScript. Each area owns its own dependencies and build config - there is no shared root `package.json`.

<details open>
<summary><b>Frontend</b> - <code>frontend/</code></summary>
<br/>

- **React** + **TypeScript**, bundled with **Vite** (`@vitejs/plugin-react`).
- **Plain CSS** (hand-authored design system in `src/landing.css`).
- Assets (SVG / MP4 / images) imported through Vite.

</details>

<details open>
<summary><b>Word add-in</b> - <code>microservices/word-addin/</code></summary>
<br/>

- **React** + **TypeScript** task pane running inside Word via **Office.js**.
- **Fluent UI** (`@fluentui/react-components`) for UI, **Less** for styling.
- Bundled with **Webpack** + **Babel**; tooling via the **Office Add-in CLI** (`office-addin-*`). Loaded into Word through `manifest.xml`.
- `docx` generates the sample lease document.

</details>

<details open>
<summary><b>Backend</b> - <code>backend/</code></summary>
<br/>

- **Node.js** + **Express** + **TypeScript**, run directly with **tsx** (ESM).
- **tRPC** (Express adapter at `/trpc`) with **zod** schemas as the single source of truth for the wire contract - the Word add-in's client infers full request/response types from `AppRouter`, so contract drift fails at compile time. Deprecated REST mirrors kept at `/api/*` for curl-based smoke tests.
- **Anthropic SDK** (`@anthropic-ai/sdk`) for all LLM calls - **Claude Haiku 4.5** by default, model swappable via env (Sonnet/Opus for heavier reasoning).
- Structured outputs via **tool use**, with server-side verbatim validation so a suggested edit's original text is always an exact substring of the contract.
- **Prompt caching** on the stable system prompt + contract prefix to cut cost/latency.
- Hardening: **CORS** allowlist, **express-rate-limit** (per-minute + daily caps), and a daily token spend backstop.
- **MongoDB** (optional, e.g. Atlas M0): persists the spend counter across container restarts (atomic `$inc` per UTC day - essential on scale-to-zero Cloud Run) and records per-call usage metadata (`sessions`; never contract text). Degrades gracefully to in-memory state when unset/unreachable.
- **Docker** (`backend/Dockerfile`) for deployment.

</details>

<details open>
<summary><b>AI / model layer</b></summary>
<br/>

- **Claude** (Anthropic) is the single model provider, called only from the backend so the API key never reaches the client.
- Two endpoints: contract-review Q&A (`/api/ask`) and the negotiation simulator (`/api/negotiate`).

</details>

## Deployment

| Piece | Platform | How |
|:------|:---------|:----|
| `frontend/` · `microservices/`<br>`word-addin/` | **Vercel** | Two static deployments<br><sub>each built and served from its own `vercel.json`</sub> |
| `backend/` | **Google Cloud Run** | Docker container from `backend/Dockerfile`<br><sub>platform injects `PORT` + secrets (`ANTHROPIC_API_KEY`, `MONGODB_URI`, `ALLOWED_ORIGINS`) · see `.env.example`</sub> |

---

<div align="center">
<sub>Built by <a href="https://github.com/markbuckle">Mark Buckle</a></sub>
</div>
