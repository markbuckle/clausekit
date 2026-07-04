<div align="center">

<img src="frontend/assets/ck-mark.svg" width="90" alt="ClauseKit logo" />

# ClauseKit

**AI legal assistant for Microsoft Word.**

Review and redline contracts, then simulate the negotiation - without leaving the document.

<br/>

![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React_18-087EA4?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?logo=express&logoColor=white)
![Claude](https://img.shields.io/badge/Claude-D97706?logo=anthropic&logoColor=white)
![Office.js](https://img.shields.io/badge/Office.js-D83B01?logo=microsoftword&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?logo=vercel&logoColor=white)
![Cloud Run](https://img.shields.io/badge/Cloud_Run-4285F4?logo=googlecloud&logoColor=white)
![License: MIT](https://img.shields.io/badge/License-MIT-22c55e)

</div>

---

## What it does

- **Grounded contract Q&A** - answers come from the document in front of you, cited by clause (`§`), never invented.
- **One-click redlines** - proposes exact replacement language and applies it as a native tracked change in Word.
- **Negotiation simulator** - builds a fallback ladder (ideal → market → floor) per off-market term and role-plays opposing counsel.

## Architecture

```mermaid
flowchart LR
    subgraph vercel["Vercel"]
        direction TB
        A["<b>Landing page</b><br/><i>frontend/</i>"]
        B["<b>Playground + task pane</b><br/><i>microservices/word-addin/</i>"]
    end

    subgraph gcr["Google Cloud Run"]
        C["<b>Backend API</b><br/><i>backend/</i>"]
    end

    subgraph anthropic["Anthropic"]
        D["<b>Claude</b>"]
    end

    W["<b>Microsoft Word</b><br/><i>Office.js host</i>"]

    A -- "Try the demo" --> B
    W -.->|loads task pane| B
    B -- "POST /api/ask<br/>POST /api/negotiate" --> C
    C -- "Anthropic SDK" --> D

    classDef node fill:#0e0e12,stroke:#3a3a44,color:#f5f5f6
    classDef box fill:transparent,stroke:#6b7280,color:#9a9aa4
    class A,B,C,D,W node
    class vercel,gcr,anthropic box
```

## Repository structure

| Folder | What it is |
|--------|-----------|
| `microservices/word-addin/` | Word Office Add-in - React + TypeScript task pane running inside Microsoft Word via Office.js. Entry point: `src/taskpane/index.tsx`. Build with `npm start` (from that folder). Owns its `package.json`, `webpack.config.js`, `tsconfig.json`, `manifest.xml`, and `assets/`. |
| `microservices/` | Container for ClauseKit's microservices - currently just the Word add-in, with more to come. Each microservice owns its own dependencies and build config. |
| `frontend/` | Landing page - React + TypeScript, built with Vite (plain CSS, no framework). `npm run dev` to serve locally, `npm run build` to bundle. |
| `backend/` | Backend API - Node.js + Express + TypeScript, calling Claude via the Anthropic SDK. Serves `/api/ask` (document-grounded Q&A) and `/api/negotiate` (negotiation brief). Entry point: `backend/src/index.ts`. |

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
- **Anthropic SDK** (`@anthropic-ai/sdk`) for all LLM calls - **Claude Haiku 4.5** by default, model swappable via env (Sonnet/Opus for heavier reasoning).
- Structured outputs via **tool use**, with server-side verbatim validation so a suggested edit's original text is always an exact substring of the contract.
- **Prompt caching** on the stable system prompt + contract prefix to cut cost/latency.
- Hardening: **CORS** allowlist, **express-rate-limit** (per-minute + daily caps), and an in-memory daily token spend backstop.
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
|-------|----------|-----|
| `frontend/` + `microservices/word-addin/` | **Vercel** | Two static deployments, each built and served from its own `vercel.json`. |
| `backend/` | **Google Cloud Run** | Docker container (`backend/Dockerfile`); the platform injects `PORT` and secrets (`ANTHROPIC_API_KEY`, `ALLOWED_ORIGINS`, ...). See `backend/.env.example`. |

---

<div align="center">
<sub>Built by <a href="https://github.com/markbuckle">Mark Buckle</a> · MIT License</sub>
</div>
