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

ClauseKit sits in a panel next to the contract and answers questions about it. Answers are grounded in the document itself and cited by clause number, so you can click through and check rather than take the model's word for it. When a term is off-market, ClauseKit drafts replacement language and applies it as a tracked change - nothing touches the document without review.

There's also a negotiation simulator: pick your side and it finds the terms stacked against you, builds a fallback ladder for each one (opening ask, market middle, walk-away floor), and plays opposing counsel so you can hear the pushback before the real call.

## Architecture

<!-- Static render (no GitHub mermaid pan/zoom controls). Source: docs/architecture.mmd
     Regenerate after editing: npx -y @mermaid-js/mermaid-cli -i docs/architecture.mmd -o docs/architecture.svg -b transparent -->
![ClauseKit architecture](docs/architecture.svg)

## Repository layout

```text
clausekit/
├── frontend/              landing page - React + Vite, one hand-written CSS file
├── backend/               API - Express + tRPC, calls Claude, optional MongoDB
├── microservices/
│   └── word-addin/        Word task pane - Office.js + Fluent UI, webpack build
└── docs/                  architecture diagram (mermaid source + rendered SVG)
```

There's no root `package.json` - each app owns its own dependencies and build. The task pane boots from `src/taskpane/index.tsx` (run `npm start` from that folder to sideload it into Word); the API's entry point is `backend/src/index.ts`.

## How it's built

**Frontend.** React 18 bundled with Vite. Styling is one hand-written CSS file (`frontend/src/landing.css`) - no framework.

**Word add-in.** A React task pane running on Office.js, styled with Fluent UI so it doesn't look out of place inside Word. Webpack and Babel do the bundling, the Office Add-in CLI handles sideloading and the manifest, and the sample lease is generated with `docx`.

**Backend.** Express + tRPC on Node, run straight from TypeScript with tsx. Two procedures, `ask` and `negotiate`, both call Claude through the Anthropic SDK (Haiku 4.5 by default, swappable via env) with prompt caching on the contract prefix, so repeat questions against the same document stay cheap. The zod schemas that validate requests also drive the client's types - the add-in imports the router type directly, which turns a renamed field into a compile error instead of a production surprise. Suggested edits are checked server-side: if the model's `originalText` isn't a verbatim substring of the contract, the edit is dropped rather than sent to a client that can't apply it. The old REST routes still answer at `/api/*` for curl, but they're deprecated.

Since the demo is public, there's a CORS allowlist, per-route rate limits, and a daily token ceiling. The ceiling's counter lives in MongoDB (a free Atlas cluster) so it survives Cloud Run restarts, and each call writes a small usage record - route, model, token counts, the question asked - but never the contract text. If Mongo is unreachable, the API logs it and keeps serving from memory.

## Design

The landing page's dark, typography-first look borrows from [Resend](https://resend.com/); the product patterns come from studying [Spellbook](https://www.spellbook.legal/), which ClauseKit sits alongside. The design system - ink-black surfaces, one amber accent, Newsreader for headlines, Inter for body text, Roboto Mono for § references - was built with Claude and lives in `frontend/src/landing.css`. Screens were prototyped in Figma before implementation, and inside Word the pane leans on Fluent UI so it feels like part of the host app.

## Deployment

The two frontends deploy to Vercel as static builds, each from its own `vercel.json`. The backend ships as a Docker container to Google Cloud Run, which injects `PORT` and the secrets (`ANTHROPIC_API_KEY`, `MONGODB_URI`, `ALLOWED_ORIGINS`). The full list of environment variables is in `backend/.env.example`.

---

<div align="center">
<sub>Built by <a href="https://github.com/markbuckle">Mark Buckle</a> · MIT License</sub>
</div>
