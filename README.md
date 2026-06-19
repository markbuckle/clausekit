# ClauseKit

AI legal assistant for Microsoft Word.

## Repository structure

| Folder | What it is |
|--------|-----------|
| `microservices/word-addin/` | Word Office Add-in - React + TypeScript task pane. Runs inside Microsoft Word via Office.js. Entry point: `microservices/word-addin/src/taskpane/index.tsx`. Build with `npm start` (run from that folder). Houses its own `package.json`, `webpack.config.js`, `tsconfig.json`, `manifest.xml`, and `assets/`. |
| `microservices/` | Container for ClauseKit's microservices - currently just the Word add-in, with more to be added over time. Each microservice owns its own dependencies and build config. |
| `frontend/` | Marketing website - React/CSS. Open `frontend/index.html` directly in a browser. No build step. |
| `backend/` | Backend API - Node.js + Express + tRPC. Handles all LLM calls and RAG. Not yet implemented. |
