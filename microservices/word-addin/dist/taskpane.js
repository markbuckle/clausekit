"use strict";
(globalThis["webpackChunkclausekit"] = globalThis["webpackChunkclausekit"] || []).push([["taskpane"],{

/***/ "./src/config.ts"
/*!***********************!*\
  !*** ./src/config.ts ***!
  \***********************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   API_BASE_URL: () => (/* binding */ API_BASE_URL)
/* harmony export */ });
/**
 * Runtime configuration for the task pane.
 *
 * Single source of truth for the backend base URL. Injected at build time by
 * webpack's DefinePlugin from the API_BASE_URL env var (default http://localhost:4000),
 * so localhost stays the default but a deployed URL can be baked in for production.
 */
const API_BASE_URL = "http://localhost:4000";

/***/ },

/***/ "./src/services/index.ts"
/*!*******************************!*\
  !*** ./src/services/index.ts ***!
  \*******************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   DocumentServiceProvider: () => (/* reexport safe */ _DocumentServiceContext__WEBPACK_IMPORTED_MODULE_0__.DocumentServiceProvider),
/* harmony export */   useDocumentService: () => (/* reexport safe */ _DocumentServiceContext__WEBPACK_IMPORTED_MODULE_0__.useDocumentService)
/* harmony export */ });
/* harmony import */ var _DocumentServiceContext__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./DocumentServiceContext */ "./src/services/DocumentServiceContext.tsx");


/***/ },

/***/ "./src/services/office/OfficeDocumentService.ts"
/*!******************************************************!*\
  !*** ./src/services/office/OfficeDocumentService.ts ***!
  \******************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   OfficeDocumentService: () => (/* binding */ OfficeDocumentService)
/* harmony export */ });
/* global Word */
/**
 * Real Word implementation of the DocumentService seam, via Word.run / Office.js.
 * Only the Office entry injects this; the playground keeps the mock. Edits land
 * as NATIVE Word tracked changes.
 */
// Word's body.search caps the query at ~255 chars and is finicky with some
// punctuation. Above this (or when search unexpectedly finds nothing) we fall
// back to locating the span in the document's actual text.
const SEARCH_MAX = 255;
const ANCHOR_MAX = 200;
const CONTEXT_CHARS = 40;
const SEARCH_OPTS = {
  matchCase: true,
  ignorePunct: false
};
class OfficeDocumentService {
  async getFullText() {
    return Word.run(async context => {
      const body = context.document.body;
      body.load("text");
      await context.sync();
      return body.text;
    });
  }
  async getSelection() {
    return Word.run(async context => {
      const selection = context.document.getSelection();
      selection.load("text");
      const paragraphs = selection.paragraphs;
      paragraphs.load("items/text");
      await context.sync();
      const text = selection.text ?? "";
      if (!text.trim()) return null;
      // Pull surrounding context from the paragraph(s) the selection sits in.
      let contextBefore = "";
      let contextAfter = "";
      const paraText = paragraphs.items.map(p => p.text).join(" ");
      const at = paraText.indexOf(text);
      if (at !== -1) {
        contextBefore = paraText.slice(Math.max(0, at - CONTEXT_CHARS), at);
        contextAfter = paraText.slice(at + text.length, at + text.length + CONTEXT_CHARS);
      }
      return {
        text,
        contextBefore,
        contextAfter
      };
    });
  }
  async applyTrackedChange(edit) {
    return Word.run(async context => {
      // Make the replacement a real, reviewable tracked change.
      context.document.changeTrackingMode = Word.ChangeTrackingMode.trackAll;
      const located = await locate(context, edit.originalText);
      if (located.status === "none") {
        return {
          status: "not-found",
          searchedText: edit.originalText
        };
      }
      if (located.status === "many") {
        return {
          status: "ambiguous",
          matchCount: located.count
        };
      }
      located.range.insertText(edit.proposedText, Word.InsertLocation.replace);
      await context.sync();
      return {
        status: "applied",
        clauseRef: edit.clauseRef
      };
    });
  }
  async scrollTo(target) {
    return Word.run(async context => {
      // For a clause ref, target the heading ("§5."); for text, the span itself.
      const query = "clauseRef" in target ? `${target.clauseRef}.` : target.text;
      const range = await findFirst(context, query);
      if (!range) return false;
      // Selecting a range brings it into view.
      range.select();
      await context.sync();
      return true;
    });
  }
}
/**
 * Locate `needle` and report whether it matches exactly once. Primary path is
 * body.search (gives a real range cheaply); falls back to the document's actual
 * text for spans over the search cap or that search can't match.
 */
async function locate(context, needle) {
  const body = context.document.body;
  if (needle.length <= SEARCH_MAX) {
    const results = body.search(needle, SEARCH_OPTS);
    results.load("items");
    await context.sync();
    if (results.items.length === 1) return {
      status: "one",
      range: results.items[0]
    };
    if (results.items.length > 1) return {
      status: "many",
      count: results.items.length
    };
    // 0 results — could be a punctuation quirk; fall through to text-based locate.
  }
  body.load("text");
  await context.sync();
  const text = body.text;
  const first = text.indexOf(needle);
  if (first === -1) return {
    status: "none"
  };
  // Count occurrences to detect ambiguity from the real text (no search quirks).
  let count = 0;
  for (let i = first; i !== -1; i = text.indexOf(needle, i + needle.length)) count++;
  if (count > 1) return {
    status: "many",
    count
  };
  // Exactly one occurrence: resolve it to a Range via prefix/suffix anchors that
  // are short enough for body.search, then expand between them.
  const range = await resolveByAnchors(context, needle);
  // If we can't safely resolve a range, treat as not-found rather than risk
  // editing the wrong span.
  return range ? {
    status: "one",
    range
  } : {
    status: "none"
  };
}
/** First match range for `needle` (uniqueness not required) — used for scrolling. */
async function findFirst(context, needle) {
  const body = context.document.body;
  const query = needle.length <= SEARCH_MAX ? needle : clampAnchor(needle, "start");
  const results = body.search(query, SEARCH_OPTS);
  results.load("items");
  await context.sync();
  return results.items.length > 0 ? results.items[0] : null;
}
/**
 * Build a Range spanning `needle` by searching for its start and end anchors
 * (each within the search cap) and expanding between them. Verifies the expanded
 * range's text matches before returning, so a mismatch resolves to null.
 */
async function resolveByAnchors(context, needle) {
  const body = context.document.body;
  const prefix = clampAnchor(needle, "start");
  const suffix = clampAnchor(needle, "end");
  const pre = body.search(prefix, SEARCH_OPTS);
  const suf = body.search(suffix, SEARCH_OPTS);
  pre.load("items");
  suf.load("items");
  await context.sync();
  if (pre.items.length !== 1 || suf.items.length !== 1) return null;
  const full = pre.items[0].expandTo(suf.items[0]);
  full.load("text");
  await context.sync();
  return full.text === needle ? full : null;
}
/** A start/end slice of `s` no longer than ANCHOR_MAX, cut at a word boundary. */
function clampAnchor(s, which) {
  if (s.length <= ANCHOR_MAX) return s;
  if (which === "start") {
    let cut = s.lastIndexOf(" ", ANCHOR_MAX);
    if (cut < ANCHOR_MAX / 2) cut = ANCHOR_MAX;
    return s.slice(0, cut);
  }
  let cut = s.indexOf(" ", s.length - ANCHOR_MAX);
  if (cut === -1 || cut > s.length - ANCHOR_MAX / 2) cut = s.length - ANCHOR_MAX;
  return s.slice(cut + 1);
}

/***/ },

/***/ "./src/taskpane/components/useChat.ts"
/*!********************************************!*\
  !*** ./src/taskpane/components/useChat.ts ***!
  \********************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   useChat: () => (/* binding */ useChat)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _services__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../services */ "./src/services/index.ts");
/* harmony import */ var _config__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../config */ "./src/config.ts");



/**
 * How many prior turns to send as conversation history. The document itself
 * never rides in history — it goes in `documentText`, which the backend caches
 * as a stable prefix. Keeping history short keeps the uncached part small.
 */
const HISTORY_TURNS = 6;
/**
 * Owns the live chat: the message list, loading/error state, and the call to
 * the backend's /api/ask, grounded in the document via the DocumentService seam.
 * Assistant turns carry the structured citations and optional redline edit.
 */
function useChat() {
  const service = (0,_services__WEBPACK_IMPORTED_MODULE_1__.useDocumentService)();
  const [messages, setMessages] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)([]);
  const [loading, setLoading] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
  const [error, setError] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(null);
  const ask = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(async (message, history) => {
    setLoading(true);
    setError(null);
    try {
      const documentText = await service.getFullText();
      const res = await fetch(`${_config__WEBPACK_IMPORTED_MODULE_2__.API_BASE_URL}/api/ask`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          documentText,
          message,
          history: history.slice(-HISTORY_TURNS)
        })
      });
      if (!res.ok) {
        // Prefer the server's user-facing message (rate limit, spend cap, …).
        let serverError = null;
        try {
          const body = await res.json();
          if (typeof body.error === "string") serverError = body.error;
        } catch {
          /* no JSON body */
        }
        throw new Error(serverError || `The assistant is unavailable (error ${res.status}).`);
      }
      const data = await res.json();
      const answer = (data.answer ?? "").trim();
      setMessages(prev => [...prev, {
        role: "assistant",
        content: answer || "(The assistant returned an empty answer.)",
        citations: data.citations,
        edit: data.edit
      }]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Couldn't reach the assistant.");
    } finally {
      setLoading(false);
    }
  }, [service]);
  const send = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(text => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;
    const history = messages;
    setMessages(prev => [...prev, {
      role: "user",
      content: trimmed
    }]);
    void ask(trimmed, history);
  }, [ask, loading, messages]);
  const retry = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(() => {
    if (loading) return;
    // On error the assistant reply was never appended, so the last message is
    // the user turn that failed — re-ask it with the history before it.
    let lastUserIdx = -1;
    for (let i = messages.length - 1; i >= 0; i--) {
      if (messages[i].role === "user") {
        lastUserIdx = i;
        break;
      }
    }
    if (lastUserIdx === -1) return;
    void ask(messages[lastUserIdx].content, messages.slice(0, lastUserIdx));
  }, [messages, ask, loading]);
  return {
    messages,
    loading,
    error,
    send,
    retry
  };
}

/***/ },

/***/ "./src/taskpane/components/useNegotiate.ts"
/*!*************************************************!*\
  !*** ./src/taskpane/components/useNegotiate.ts ***!
  \*************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   useNegotiate: () => (/* binding */ useNegotiate)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _services__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../services */ "./src/services/index.ts");
/* harmony import */ var _config__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../config */ "./src/config.ts");



/**
 * Best-effort "§N → heading" map from the document text. The lease formats
 * clause headings as "§5. Rent Escalation"; documents that don't follow this
 * just yield no headings (cards fall back to the ref alone).
 */
function parseHeadings(documentText) {
  const map = {};
  const re = /(§\d+)\.\s+([^\r\n]+)/g;
  let m;
  while ((m = re.exec(documentText)) !== null) {
    if (!map[m[1]]) map[m[1]] = m[2].trim();
  }
  return map;
}
/**
 * Owns the Negotiation Simulator: the chosen side, the brief (terms + headings),
 * and the call to /api/negotiate, grounded in the document via the seam. Each
 * term's ladder rungs are applied through the same applyTrackedChange path as Ask.
 */
function useNegotiate() {
  const service = (0,_services__WEBPACK_IMPORTED_MODULE_1__.useDocumentService)();
  const [side, setSide] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)("tenant");
  const [terms, setTerms] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(null);
  const [headings, setHeadings] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)({});
  const [loading, setLoading] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
  const [error, setError] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(null);
  const [ranSide, setRanSide] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(null);
  const run = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(async () => {
    setLoading(true);
    setError(null);
    try {
      const documentText = await service.getFullText();
      const res = await fetch(`${_config__WEBPACK_IMPORTED_MODULE_2__.API_BASE_URL}/api/negotiate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          documentText,
          side
        })
      });
      if (!res.ok) {
        // Prefer the server's user-facing message (rate limit, spend cap, …).
        let serverError = null;
        try {
          const body = await res.json();
          if (typeof body.error === "string") serverError = body.error;
        } catch {
          /* no JSON body */
        }
        throw new Error(serverError || `The simulator is unavailable (error ${res.status}).`);
      }
      const data = await res.json();
      setTerms(Array.isArray(data.terms) ? data.terms : []);
      setHeadings(parseHeadings(documentText));
      setRanSide(side);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Couldn't reach the simulator.");
    } finally {
      setLoading(false);
    }
  }, [service, side]);
  return {
    side,
    setSide,
    terms,
    headings,
    loading,
    error,
    run,
    ranSide
  };
}

/***/ },

/***/ "./node_modules/css-loader/dist/cjs.js!./src/styles/clausekit.css"
/*!************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./src/styles/clausekit.css ***!
  \************************************************************************/
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../node_modules/css-loader/dist/runtime/sourceMaps.js */ "./node_modules/css-loader/dist/runtime/sourceMaps.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../node_modules/css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, `/* ── ClauseKit Task Pane Design System ──
 *
 * Single source of truth for the task-pane UI. Loaded by both the Office
 * entry (src/taskpane/index.tsx) and the browser playground
 * (src/playground/playground.tsx) so the pane looks identical in either host.
 */
:root {
  --navy: #0E0E12;
  --navy-700: #2b2b34;
  --navy-300: #6c6c77;
  --amber: #F59E0B;
  --amber-600: #d4870a;
  --amber-soft: #FEF3C7;
  --amber-grad: linear-gradient(180deg, #FCC04A 0%, #F59E0B 52%, #E88B05 100%);
  --amber-glow: inset 0 1px 0 rgba(255,255,255,.35), 0 2px 10px rgba(245,158,11,.4), 0 1px 2px rgba(160,98,0,.45);
  --grey-grad: linear-gradient(180deg, #5b5b66 0%, #3d3d47 52%, #2b2b34 100%);
  --grey-grad-hover: linear-gradient(180deg, #66666f 0%, #46464f 52%, #33333b 100%);
  --grey-glow: inset 0 1px 0 rgba(255,255,255,.14), 0 2px 8px rgba(17,24,39,.20), 0 1px 2px rgba(17,24,39,.28);
  --bg: #F8F9FA;
  --surface: #FFFFFF;
  --user-bubble: #EEF2FF;
  --text-primary: #111827;
  --text-secondary: #6B7280;
  --border: #E5E7EB;
  --border-strong: #D1D5DB;
  --destructive: #EF4444;
  --destructive-soft: #FEF2F2;
  --fs-header: 16px;
  --fs-body: 13px;
  --fs-label: 11px;
  --pane-pad: 12px;
  --shadow-card: 0 1px 2px rgba(17,24,39,.06), 0 1px 3px rgba(17,24,39,.05);
  --font-display: 'Space Grotesk', 'Inter', system-ui, sans-serif;
  --font-body: 'Inter', system-ui, sans-serif;
  --font-mono: 'Roboto Mono', monospace;
}
* { box-sizing: border-box; }
html, body { margin: 0; padding: 0; height: 100%; -webkit-font-smoothing: antialiased; }
body { font-family: var(--font-body); background: var(--bg); color: var(--text-primary); }
#container { height: 100%; }

/* Pane shell */
.ck-pane { height: 100%; display: flex; flex-direction: column; }

/* ── Header ── */
.ck-header {
  background: linear-gradient(180deg, #08080b 0%, #131318 55%, #232329 100%);
  color: #fff; height: 36px; display: flex; align-items: center;
  padding: 0 var(--pane-pad); gap: 10px;
  border-bottom: 1px solid rgba(255,255,255,.06); flex-shrink: 0;
}
.h-mark { width: 30px; height: 30px; display: grid; place-items: center; flex: none; }
.h-mark img { width: 26px; height: 26px; object-fit: contain; display: block; }
.h-txt { display: flex; flex-direction: column; justify-content: center; line-height: 1.15; }
.h-name { font-family: var(--font-display); font-size: var(--fs-header); font-weight: 600; letter-spacing: -.01em; }
.h-actions { margin-left: auto; display: flex; gap: 2px; }
.ck-theme-btn { width: 22px; height: 22px; border-radius: 6px; display: grid; place-items: center; color: rgba(255,255,255,.78); cursor: pointer; background: rgba(255,255,255,.06); border: 1px solid rgba(255,255,255,.10); transition: background .14s, color .14s, border-color .14s; }
.ck-theme-btn:hover { background: rgba(255,255,255,.14); color: #fff; border-color: rgba(255,255,255,.18); }
.ck-theme-btn:active { transform: translateY(.5px); }
.ck-theme-btn svg { display: block; }

/* ── Chat scroll area ── */
.ck-chat { flex: 1; background: var(--bg); padding: var(--pane-pad); display: flex; flex-direction: column; gap: 14px; overflow-y: auto; }
.ck-daydiv { display: flex; align-items: center; gap: 10px; color: var(--text-secondary); font-size: var(--fs-label); }
.ck-daydiv::before, .ck-daydiv::after { content:""; height:1px; background: var(--border); flex:1; }

/* Message rows */
.ck-row { display: flex; gap: 8px; }
.ck-row.user { justify-content: flex-end; }
.ck-avatar { width: 24px; height: 24px; border-radius: 6px; display: grid; place-items: center; flex: none; margin-top: 2px; }
.ck-avatar span { font-size: 9px; font-weight: 700; color: #fff; letter-spacing: .02em; }
.ck-avatar img { width: 22px; height: 22px; object-fit: contain; display: block; }
.ck-bubble { font-size: var(--fs-body); line-height: 1.55; padding: 10px 12px; border-radius: 12px; max-width: 264px; }
.ck-bubble.user { background: var(--user-bubble); color: var(--navy); border-radius: 12px 12px 4px 12px; }
.ck-bubble.ai { background: var(--surface); border: 1px solid var(--border); border-radius: 4px 12px 12px 12px; box-shadow: var(--shadow-card); }
.ck-bubble p { margin: 0; }
.ck-bubble p + p { margin-top: 8px; }
.ck-bubble strong { font-weight: 600; }
.ck-time { font-size: 10px; color: var(--text-secondary); margin-top: 4px; }
.ck-row.user .ck-time { text-align: right; }

/* Quote block */
.ck-quote { background: #fafbfc; border: 1px solid var(--border); border-left: 3px solid var(--navy-300); border-radius: 6px; padding: 9px 11px; margin: 10px 0 4px; }
.q-meta { font-family: var(--font-mono); font-size: 10px; color: var(--text-secondary); letter-spacing: .02em; margin-bottom: 5px; display: flex; align-items: center; gap: 6px; }
.q-meta::before { content:"\\201C"; font-family: Georgia, serif; font-size: 16px; line-height: 0; color: var(--navy-300); position: relative; top: 3px; }
.q-text { font-size: 12px; line-height: 1.6; color: #374151; font-style: italic; }
.q-text mark { background: var(--amber-soft); font-style: normal; padding: 0 1px; }

/* Empty lines inside an AI answer (preserves list/paragraph spacing) */
.ck-bubble.ai .ck-gap { height: 8px; }

/* Error bubble + retry (chat thread) */
.ck-error-bubble { background: var(--destructive-soft); border: 1px solid #fecdca; border-radius: 4px 12px 12px 12px; box-shadow: var(--shadow-card); padding: 10px 12px; font-size: var(--fs-body); line-height: 1.55; color: #b42318; }
.ck-error-bubble p { margin: 0 0 8px; }
.ck-retry { font-size: 12px; font-weight: 500; color: var(--navy); background: #fff; border: 1px solid var(--border-strong); border-radius: 6px; padding: 5px 12px; cursor: pointer; font-family: var(--font-body); }
.ck-retry:hover { background: #f9fafb; }

/* Citation chips row */
.ck-cites { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 8px; }
.ck-cites .ck-cite { margin-top: 0; }

/* Citation chip */
.ck-cite { display: inline-flex; align-items: center; gap: 6px; margin-top: 8px; font-size: 11px; font-weight: 500; color: var(--navy); background: #eef2ff; border: 1px solid #dbe3fb; border-radius: 999px; padding: 4px 10px 4px 8px; cursor: pointer; }
.ck-cite:hover { background: #e4eafd; }
.pin { width: 11px; height: 11px; position: relative; flex: none; }
.pin::before { content:""; position:absolute; inset:0; border:1.5px solid var(--navy); border-radius:50% 50% 50% 0; transform: rotate(-45deg); }
.cite-arr { margin-left: 1px; color: var(--navy-300); font-size: 10px; }

/* ── Action card ── */
.ck-action-wrap { margin-top: 10px; }
.ck-action { background: var(--surface); border: 1px solid var(--border); border-left: 3px solid var(--navy-300); border-radius: 8px; box-shadow: var(--shadow-card); overflow: hidden; }
.ck-action.sev-high { border-left-color: var(--destructive); }
.ck-action.sev-medium { border-left-color: var(--navy-300); }
.ck-action.sev-low { border-left-color: var(--navy-300); }
.a-head { padding: 11px 12px 0; display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
.a-badge { font-family: var(--font-mono); font-size: 9.5px; font-weight: 500; letter-spacing: .06em; text-transform: uppercase; color: var(--amber-600); background: var(--amber-soft); border-radius: 4px; padding: 3px 6px; }
.a-clause { font-family: var(--font-mono); font-size: 11px; font-weight: 500; color: var(--navy); background: #eef2ff; border: 1px solid #dbe3fb; border-radius: 4px; padding: 2px 6px; }
.a-sev { margin-left: auto; font-size: 9px; font-weight: 600; letter-spacing: .05em; text-transform: uppercase; border-radius: 4px; padding: 2px 6px; }
.a-sev.sev-high { color: #b42318; background: var(--destructive-soft); }
.a-sev.sev-medium { color: var(--amber-600); background: var(--amber-soft); }
.a-sev.sev-low { color: var(--text-secondary); background: #f3f4f6; }
.a-title { font-size: 12.5px; font-weight: 600; line-height: 1.35; color: var(--text-primary); }
.a-body { padding: 9px 12px 0; }
.a-desc { font-size: 12px; color: var(--text-secondary); line-height: 1.55; margin: 0; }
.a-error { font-size: 12px; color: var(--destructive); background: var(--destructive-soft); border: 1px solid #fecdca; border-radius: 6px; padding: 7px 9px; margin: 10px 0 0; line-height: 1.45; }

/* Diff */
.ck-diff { margin: 10px 0 2px; border: 1px solid var(--border); border-radius: 6px; overflow: hidden; font-family: var(--font-mono); font-size: 11px; line-height: 1.55; }
.d-line { padding: 6px 10px 6px 24px; position: relative; }
.d-del { background: var(--destructive-soft); color: #b42318; }
.d-del .t { text-decoration: line-through; text-decoration-color: rgba(180,35,24,.5); }
.d-add { background: #ecfdf3; color: #067647; border-top: 1px solid #d1fadf; }
.d-line::before { position: absolute; left: 9px; top: 6px; font-weight: 700; }
.d-del::before { content: "−"; color: #d92d20; }
.d-add::before { content: "+"; color: #079455; }

/* Action footer */
.a-foot { display: flex; gap: 8px; padding: 12px; align-items: center; }
.a-foot .spacer { flex: 1; }
.ck-btn { font-size: 13px; font-weight: 500; border-radius: 6px; padding: 8px 14px; cursor: pointer; border: 1px solid transparent; line-height: 1; display: inline-flex; align-items: center; gap: 7px; white-space: nowrap; font-family: var(--font-body); transition: background .12s, border-color .12s; }
.ck-btn.primary { background: var(--grey-grad); color: #fff; font-weight: 600; border-color: rgba(17,24,39,.35); box-shadow: var(--grey-glow); }
.ck-btn.primary:hover { background: var(--grey-grad-hover); }
.ck-btn.danger-ghost { background: transparent; color: var(--text-secondary); border-color: transparent; }
.ck-btn.danger-ghost:hover { background: var(--destructive-soft); color: var(--destructive); }
.ck-btn.applied { background: #ecfdf3; color: #067647; border-color: #d1fadf; cursor: default; }
.ck-btn.applied:hover { filter: none; }
.chk { width: 6px; height: 11px; border-right: 2px solid currentColor; border-bottom: 2px solid currentColor; transform: rotate(40deg) translateY(-1px); display: inline-block; }

/* Thinking dots */
.ck-thinking { display: flex; gap: 8px; align-items: center; }
.t-bubble { background: var(--surface); border: 1px solid var(--border); border-radius: 4px 12px 12px 12px; box-shadow: var(--shadow-card); padding: 12px 14px; display: flex; gap: 5px; align-items: center; }
.t-bubble i { width: 6px; height: 6px; border-radius: 50%; background: var(--navy-300); animation: blink 1.2s infinite ease-in-out; font-style: normal; display: block; }
.t-bubble i:nth-child(2){ animation-delay: .18s; }
.t-bubble i:nth-child(3){ animation-delay: .36s; }
@keyframes blink { 0%,60%,100%{ opacity:.28; transform:translateY(0);} 30%{ opacity:1; transform:translateY(-2px);} }

/* ── Empty state ── */
.ck-empty { display: flex; flex-direction: column; align-items: center; text-align: center; padding: 36px 22px; gap: 0; flex: 1; }
.e-mark { width: 60px; height: 60px; border-radius: 16px; background: linear-gradient(180deg,#1d1d24 0%,#101015 100%); display: grid; place-items: center; position: relative; box-shadow: 0 10px 26px rgba(0,0,0,.28); border: 1px solid #2e2e36; margin-bottom: 18px; }
.e-mark img { width: 34px; height: 34px; object-fit: contain; display: block; }
.ck-empty h3 { font-family: var(--font-display); font-size: 15px; font-weight: 600; margin: 0 0 6px; color: var(--text-primary); }
.e-sub { font-family: var(--font-display); font-size: 14px; font-weight: 500; color: var(--text-primary); line-height: 1.6; letter-spacing: -.01em; margin: 0 0 22px; max-width: 28ch; }
.ck-suggest { display: flex; flex-direction: column; gap: 9px; width: 100%; }
.s-btn { position: relative; text-align: left; font-size: 12.5px; color: var(--navy); background: #fff; border: 1px solid var(--border); border-radius: 10px; padding: 12px 13px; cursor: pointer; box-shadow: var(--shadow-card); display: flex; align-items: center; gap: 9px; font-family: var(--font-body); overflow: hidden; transition: border-color .15s, box-shadow .15s, transform .15s, background .15s; }
.s-btn::before { content:""; position: absolute; left: 0; top: 0; bottom: 0; width: 3px; background: var(--grey-grad); opacity: 0; transition: opacity .15s; }
.s-btn:hover { border-color: var(--border-strong); background: #fafafb; box-shadow: 0 4px 12px rgba(17,24,39,.08); transform: translateY(-1px); }
.s-btn:hover::before { opacity: 1; }
.s-btn:active { transform: translateY(0); }
.s-txt { flex: 1; line-height: 1.4; }
.s-btn .s-ar { margin-left: auto; color: var(--navy-300); font-size: 15px; flex: none; transition: color .15s, transform .15s; }
.s-btn:hover .s-ar { color: var(--navy); transform: translateX(2px); }

/* ── Privacy note ── */
.ck-privacy { background: #fff; border-top: 1px solid var(--border); padding: 9px 12px; display: flex; align-items: center; gap: 9px; flex-shrink: 0; }
.p-shield { width: 22px; height: 24px; flex: none; position: relative; }
.p-shield::before { content:""; position:absolute; inset:0; background: #eef2ff; border:1.4px solid #dbe3fb; border-radius: 4px 4px 9px 9px / 4px 4px 14px 14px; }
.p-shield::after { content:""; position:absolute; left:7px; top:8px; width:5px; height:8px; border-right:1.8px solid var(--navy); border-bottom:1.8px solid var(--navy); transform: rotate(40deg); }
.p-txt { font-size: var(--fs-label); color: var(--text-secondary); line-height: 1.45; margin: 0; }
.p-txt b { color: var(--text-primary); font-weight: 600; }

/* ── Input area ── */
.ck-input-wrap { background: var(--surface); border-top: 1px solid var(--border); padding: 0 var(--pane-pad) 8px; flex-shrink: 0; }
.ck-input-resize { height: 14px; display: flex; align-items: center; justify-content: center; cursor: ns-resize; touch-action: none; }
.ck-input-grip { width: 28px; height: 4px; border-radius: 999px; background: var(--border-strong); transition: background .12s; }
.ck-input-resize:hover .ck-input-grip { background: var(--navy-300); }
.ck-input { background: #fff; border: 1px solid var(--border-strong); border-radius: 12px; padding: 7px 7px 7px 13px; display: flex; align-items: flex-end; gap: 8px; transition: border-color .12s, box-shadow .12s; }
.ck-input:focus-within { border-color: var(--navy); box-shadow: 0 0 0 3px rgba(14,14,18,.08); }
.ck-input textarea { flex: 1; font-size: var(--fs-body); color: var(--text-primary); line-height: 1.5; padding: 7px 0; border: none; outline: none; resize: none; background: transparent; font-family: var(--font-body); overflow-y: auto; }
.ck-input textarea::placeholder { color: var(--text-secondary); }
.ck-send { width: 34px; height: 34px; border-radius: 10px; background: var(--grey-grad); color: #fff; display: grid; place-items: center; flex: none; cursor: pointer; border: 1px solid rgba(17,24,39,.35); box-shadow: var(--grey-glow); transition: filter .12s, transform .12s, box-shadow .12s, background .12s; }
.ck-send:hover { background: var(--grey-grad-hover); }
.ck-send:active { transform: translateY(.5px); }
.ck-send svg { display: block; }
.ck-send.disabled { background: #eceef1; color: #aab1bb; border-color: var(--border); box-shadow: none; cursor: default; pointer-events: none; filter: none; }
.ck-hint { font-size: var(--fs-label); color: var(--text-secondary); margin-top: 7px; display: flex; align-items: center; gap: 5px; padding: 0 2px; }
.lock-icon { width: 9px; height: 9px; border: 1.4px solid var(--text-secondary); border-radius: 2px; position: relative; flex: none; }
.lock-icon::before { content:""; position:absolute; left:1.5px; top:-3.5px; width:5px; height:5px; border:1.4px solid var(--text-secondary); border-bottom:0; border-radius:3px 3px 0 0; }

/* ── Mode tabs ── */
.ck-tabs { display: flex; gap: 0; padding: 3px 0 0; background: var(--surface); border-bottom: 1px solid var(--border); flex-shrink: 0; }
.ck-tab { flex: 1; font-size: 12.5px; font-weight: 600; color: var(--text-secondary); background: none; border: none; padding: 6px 0 7px; cursor: pointer; border-bottom: 2px solid transparent; font-family: var(--font-body); }
.ck-tab:hover { color: var(--text-primary); }
.ck-tab.on { color: var(--navy); border-bottom-color: var(--navy); }

/* ── Negotiation Simulator ── */
.ck-sim { flex: 1; overflow-y: auto; background: var(--bg); display: flex; flex-direction: column; gap: 14px; padding: var(--pane-pad); }

.sim-setup { background: var(--surface); border: 1px solid var(--border); border-radius: 10px; box-shadow: var(--shadow-card); padding: 14px; display: flex; flex-direction: column; gap: 12px; }
.sim-title { font-family: var(--font-display); font-size: 14px; font-weight: 600; margin: 0; color: var(--text-primary); }
.sim-sub { font-size: 12px; color: var(--text-secondary); line-height: 1.5; margin: 5px 0 0; }
.sim-side { display: flex; align-items: center; gap: 10px; }
.sim-side-label { font-size: 12px; color: var(--text-secondary); }
.sim-toggle { display: inline-flex; background: #eef0f3; border-radius: 8px; padding: 3px; gap: 2px; }
.sim-seg { font-size: 12.5px; font-weight: 600; color: var(--text-secondary); background: none; border: none; border-radius: 6px; padding: 6px 16px; cursor: pointer; font-family: var(--font-body); }
.sim-seg.on { background: #fff; color: var(--navy); box-shadow: var(--shadow-card); }
.sim-run { justify-content: center; }

.sim-loading { display: flex; align-items: center; gap: 10px; color: var(--text-secondary); font-size: 12.5px; padding: 4px 2px; }
.sim-loading-text { display: flex; flex-direction: column; gap: 2px; }
.sim-loading-hint { font-size: 11px; color: var(--text-secondary); opacity: .8; }
.sim-error { border-radius: 8px; }
.sim-empty { text-align: center; color: var(--text-secondary); font-size: 12.5px; line-height: 1.55; padding: 20px 18px; }
.sim-placeholder { display: flex; flex-direction: column; align-items: center; text-align: center; gap: 12px; color: var(--text-secondary); font-size: 12.5px; line-height: 1.55; padding: 0px 22px; }
.sim-ph-mark { width: 46px; height: 46px; border-radius: 12px; background: linear-gradient(180deg,#1d1d24,#101015); display: grid; place-items: center; color: var(--amber); font-size: 22px; }
.sim-count { font-size: 11px; font-weight: 600; letter-spacing: .03em; text-transform: uppercase; color: var(--text-secondary); margin: 2px 2px 0; }

/* Term card */
.sim-card { background: var(--surface); border: 1px solid var(--border); border-radius: 10px; box-shadow: var(--shadow-card); overflow: hidden; }
.sim-card-head { display: flex; align-items: center; gap: 8px; padding: 12px; flex-wrap: wrap; border-bottom: 1px solid var(--border); }
.sim-ref { font-family: var(--font-mono); font-size: 12px; font-weight: 600; color: var(--navy); background: #eef2ff; border: 1px solid #dbe3fb; border-radius: 5px; padding: 2px 7px; }
.sim-heading { font-size: 13px; font-weight: 600; color: var(--text-primary); }
.sim-favors { margin-left: auto; font-size: 9.5px; font-weight: 600; letter-spacing: .04em; text-transform: uppercase; border-radius: 4px; padding: 3px 7px; background: var(--amber-soft); color: var(--amber-600); }
.sim-favors.tenant { background: #e0f2fe; color: #0369a1; }
.sim-favors.landlord { background: var(--amber-soft); color: var(--amber-600); }

.sim-current { padding: 10px 12px; border-bottom: 1px solid var(--border); }
.sim-current summary { font-size: 11.5px; font-weight: 500; color: var(--text-secondary); cursor: pointer; list-style: none; display: flex; align-items: center; gap: 6px; }
.sim-current summary::-webkit-details-marker { display: none; }
.sim-current summary::before { content: "›"; transition: transform .15s; display: inline-block; }
.sim-current[open] summary::before { transform: rotate(90deg); }
.sim-current-text { font-size: 12px; line-height: 1.6; color: #374151; font-style: italic; background: #fafbfc; border-left: 3px solid var(--navy-300); border-radius: 0 6px 6px 0; padding: 9px 11px; margin: 9px 0 2px; }

.sim-ladder { padding: 12px; display: flex; flex-direction: column; gap: 10px; }
.sim-ladder-label { font-size: 11px; font-weight: 600; letter-spacing: .03em; text-transform: uppercase; color: var(--text-secondary); }
.sim-rung { border: 1px solid var(--border); border-left: 3px solid var(--border-strong); border-radius: 8px; padding: 10px 11px; }
.sim-rung.tier-ideal { border-left-color: #16a34a; }
.sim-rung.tier-market { border-left-color: var(--amber); }
.sim-rung.tier-floor { border-left-color: var(--navy-300); }
.sim-rung.applied { background: #f0fdf4; border-color: #bbf7d0; }
.sim-tier { font-size: 10px; font-weight: 700; letter-spacing: .05em; text-transform: uppercase; color: var(--text-secondary); }
.sim-rung.tier-ideal .sim-tier { color: #16a34a; }
.sim-rung.tier-market .sim-tier { color: var(--amber-600); }
.sim-rung-text { font-size: 12.5px; line-height: 1.55; color: var(--text-primary); margin: 6px 0 0; }
.sim-rung-rat { font-size: 11.5px; line-height: 1.5; color: var(--text-secondary); margin: 6px 0 0; }
.sim-apply { margin-top: 10px; font-size: 12px; padding: 6px 12px; }

/* Counterparty callout — the differentiator */
.sim-counter { margin: 0 12px 12px; background: linear-gradient(180deg,#15151b,#1f1f27); border-radius: 9px; padding: 12px; }
.sim-counter-head { display: flex; align-items: center; gap: 7px; font-size: 11.5px; font-weight: 700; color: #fff; margin-bottom: 8px; }
.sim-counter-icon { width: 13px; height: 13px; flex: none; background: var(--amber); clip-path: polygon(50% 0, 100% 100%, 0 100%); }
.sim-counter-pred { font-size: 12.5px; line-height: 1.55; margin: 0; color: #eef0f5; }

/* ── Scrollbars ──
 * Modern, slim black/grey track + thumb. Applies to the pane scrollbar and
 * every inner scroll area (chat, simulator). WebKit/Chromium hosts use the
 * ::-webkit-scrollbar pseudo-elements; Firefox uses scrollbar-* properties.
 */
* {
  scrollbar-width: thin;
  scrollbar-color: #4b4b55 transparent;
}
*::-webkit-scrollbar { width: 10px; height: 10px; }
*::-webkit-scrollbar-track { background: transparent; }
*::-webkit-scrollbar-thumb {
  background: #3a3a44;
  border-radius: 999px;
  border: 2px solid transparent;
  background-clip: padding-box;
  transition: background .15s;
}
*::-webkit-scrollbar-thumb:hover { background: #56565f; background-clip: padding-box; }
*::-webkit-scrollbar-thumb:active { background: #6c6c77; background-clip: padding-box; }
*::-webkit-scrollbar-corner { background: transparent; }
.sim-counter-arg { font-size: 12px; line-height: 1.55; margin: 8px 0 0; color: #b9bdca; font-style: italic; border-left: 2px solid rgba(245,158,11,.5); padding-left: 9px; }
`, "",{"version":3,"sources":["webpack://./src/styles/clausekit.css"],"names":[],"mappings":"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","sourcesContent":["/* ── ClauseKit Task Pane Design System ──\n *\n * Single source of truth for the task-pane UI. Loaded by both the Office\n * entry (src/taskpane/index.tsx) and the browser playground\n * (src/playground/playground.tsx) so the pane looks identical in either host.\n */\n:root {\n  --navy: #0E0E12;\n  --navy-700: #2b2b34;\n  --navy-300: #6c6c77;\n  --amber: #F59E0B;\n  --amber-600: #d4870a;\n  --amber-soft: #FEF3C7;\n  --amber-grad: linear-gradient(180deg, #FCC04A 0%, #F59E0B 52%, #E88B05 100%);\n  --amber-glow: inset 0 1px 0 rgba(255,255,255,.35), 0 2px 10px rgba(245,158,11,.4), 0 1px 2px rgba(160,98,0,.45);\n  --grey-grad: linear-gradient(180deg, #5b5b66 0%, #3d3d47 52%, #2b2b34 100%);\n  --grey-grad-hover: linear-gradient(180deg, #66666f 0%, #46464f 52%, #33333b 100%);\n  --grey-glow: inset 0 1px 0 rgba(255,255,255,.14), 0 2px 8px rgba(17,24,39,.20), 0 1px 2px rgba(17,24,39,.28);\n  --bg: #F8F9FA;\n  --surface: #FFFFFF;\n  --user-bubble: #EEF2FF;\n  --text-primary: #111827;\n  --text-secondary: #6B7280;\n  --border: #E5E7EB;\n  --border-strong: #D1D5DB;\n  --destructive: #EF4444;\n  --destructive-soft: #FEF2F2;\n  --fs-header: 16px;\n  --fs-body: 13px;\n  --fs-label: 11px;\n  --pane-pad: 12px;\n  --shadow-card: 0 1px 2px rgba(17,24,39,.06), 0 1px 3px rgba(17,24,39,.05);\n  --font-display: 'Space Grotesk', 'Inter', system-ui, sans-serif;\n  --font-body: 'Inter', system-ui, sans-serif;\n  --font-mono: 'Roboto Mono', monospace;\n}\n* { box-sizing: border-box; }\nhtml, body { margin: 0; padding: 0; height: 100%; -webkit-font-smoothing: antialiased; }\nbody { font-family: var(--font-body); background: var(--bg); color: var(--text-primary); }\n#container { height: 100%; }\n\n/* Pane shell */\n.ck-pane { height: 100%; display: flex; flex-direction: column; }\n\n/* ── Header ── */\n.ck-header {\n  background: linear-gradient(180deg, #08080b 0%, #131318 55%, #232329 100%);\n  color: #fff; height: 36px; display: flex; align-items: center;\n  padding: 0 var(--pane-pad); gap: 10px;\n  border-bottom: 1px solid rgba(255,255,255,.06); flex-shrink: 0;\n}\n.h-mark { width: 30px; height: 30px; display: grid; place-items: center; flex: none; }\n.h-mark img { width: 26px; height: 26px; object-fit: contain; display: block; }\n.h-txt { display: flex; flex-direction: column; justify-content: center; line-height: 1.15; }\n.h-name { font-family: var(--font-display); font-size: var(--fs-header); font-weight: 600; letter-spacing: -.01em; }\n.h-actions { margin-left: auto; display: flex; gap: 2px; }\n.ck-theme-btn { width: 22px; height: 22px; border-radius: 6px; display: grid; place-items: center; color: rgba(255,255,255,.78); cursor: pointer; background: rgba(255,255,255,.06); border: 1px solid rgba(255,255,255,.10); transition: background .14s, color .14s, border-color .14s; }\n.ck-theme-btn:hover { background: rgba(255,255,255,.14); color: #fff; border-color: rgba(255,255,255,.18); }\n.ck-theme-btn:active { transform: translateY(.5px); }\n.ck-theme-btn svg { display: block; }\n\n/* ── Chat scroll area ── */\n.ck-chat { flex: 1; background: var(--bg); padding: var(--pane-pad); display: flex; flex-direction: column; gap: 14px; overflow-y: auto; }\n.ck-daydiv { display: flex; align-items: center; gap: 10px; color: var(--text-secondary); font-size: var(--fs-label); }\n.ck-daydiv::before, .ck-daydiv::after { content:\"\"; height:1px; background: var(--border); flex:1; }\n\n/* Message rows */\n.ck-row { display: flex; gap: 8px; }\n.ck-row.user { justify-content: flex-end; }\n.ck-avatar { width: 24px; height: 24px; border-radius: 6px; display: grid; place-items: center; flex: none; margin-top: 2px; }\n.ck-avatar span { font-size: 9px; font-weight: 700; color: #fff; letter-spacing: .02em; }\n.ck-avatar img { width: 22px; height: 22px; object-fit: contain; display: block; }\n.ck-bubble { font-size: var(--fs-body); line-height: 1.55; padding: 10px 12px; border-radius: 12px; max-width: 264px; }\n.ck-bubble.user { background: var(--user-bubble); color: var(--navy); border-radius: 12px 12px 4px 12px; }\n.ck-bubble.ai { background: var(--surface); border: 1px solid var(--border); border-radius: 4px 12px 12px 12px; box-shadow: var(--shadow-card); }\n.ck-bubble p { margin: 0; }\n.ck-bubble p + p { margin-top: 8px; }\n.ck-bubble strong { font-weight: 600; }\n.ck-time { font-size: 10px; color: var(--text-secondary); margin-top: 4px; }\n.ck-row.user .ck-time { text-align: right; }\n\n/* Quote block */\n.ck-quote { background: #fafbfc; border: 1px solid var(--border); border-left: 3px solid var(--navy-300); border-radius: 6px; padding: 9px 11px; margin: 10px 0 4px; }\n.q-meta { font-family: var(--font-mono); font-size: 10px; color: var(--text-secondary); letter-spacing: .02em; margin-bottom: 5px; display: flex; align-items: center; gap: 6px; }\n.q-meta::before { content:\"\\201C\"; font-family: Georgia, serif; font-size: 16px; line-height: 0; color: var(--navy-300); position: relative; top: 3px; }\n.q-text { font-size: 12px; line-height: 1.6; color: #374151; font-style: italic; }\n.q-text mark { background: var(--amber-soft); font-style: normal; padding: 0 1px; }\n\n/* Empty lines inside an AI answer (preserves list/paragraph spacing) */\n.ck-bubble.ai .ck-gap { height: 8px; }\n\n/* Error bubble + retry (chat thread) */\n.ck-error-bubble { background: var(--destructive-soft); border: 1px solid #fecdca; border-radius: 4px 12px 12px 12px; box-shadow: var(--shadow-card); padding: 10px 12px; font-size: var(--fs-body); line-height: 1.55; color: #b42318; }\n.ck-error-bubble p { margin: 0 0 8px; }\n.ck-retry { font-size: 12px; font-weight: 500; color: var(--navy); background: #fff; border: 1px solid var(--border-strong); border-radius: 6px; padding: 5px 12px; cursor: pointer; font-family: var(--font-body); }\n.ck-retry:hover { background: #f9fafb; }\n\n/* Citation chips row */\n.ck-cites { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 8px; }\n.ck-cites .ck-cite { margin-top: 0; }\n\n/* Citation chip */\n.ck-cite { display: inline-flex; align-items: center; gap: 6px; margin-top: 8px; font-size: 11px; font-weight: 500; color: var(--navy); background: #eef2ff; border: 1px solid #dbe3fb; border-radius: 999px; padding: 4px 10px 4px 8px; cursor: pointer; }\n.ck-cite:hover { background: #e4eafd; }\n.pin { width: 11px; height: 11px; position: relative; flex: none; }\n.pin::before { content:\"\"; position:absolute; inset:0; border:1.5px solid var(--navy); border-radius:50% 50% 50% 0; transform: rotate(-45deg); }\n.cite-arr { margin-left: 1px; color: var(--navy-300); font-size: 10px; }\n\n/* ── Action card ── */\n.ck-action-wrap { margin-top: 10px; }\n.ck-action { background: var(--surface); border: 1px solid var(--border); border-left: 3px solid var(--navy-300); border-radius: 8px; box-shadow: var(--shadow-card); overflow: hidden; }\n.ck-action.sev-high { border-left-color: var(--destructive); }\n.ck-action.sev-medium { border-left-color: var(--navy-300); }\n.ck-action.sev-low { border-left-color: var(--navy-300); }\n.a-head { padding: 11px 12px 0; display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }\n.a-badge { font-family: var(--font-mono); font-size: 9.5px; font-weight: 500; letter-spacing: .06em; text-transform: uppercase; color: var(--amber-600); background: var(--amber-soft); border-radius: 4px; padding: 3px 6px; }\n.a-clause { font-family: var(--font-mono); font-size: 11px; font-weight: 500; color: var(--navy); background: #eef2ff; border: 1px solid #dbe3fb; border-radius: 4px; padding: 2px 6px; }\n.a-sev { margin-left: auto; font-size: 9px; font-weight: 600; letter-spacing: .05em; text-transform: uppercase; border-radius: 4px; padding: 2px 6px; }\n.a-sev.sev-high { color: #b42318; background: var(--destructive-soft); }\n.a-sev.sev-medium { color: var(--amber-600); background: var(--amber-soft); }\n.a-sev.sev-low { color: var(--text-secondary); background: #f3f4f6; }\n.a-title { font-size: 12.5px; font-weight: 600; line-height: 1.35; color: var(--text-primary); }\n.a-body { padding: 9px 12px 0; }\n.a-desc { font-size: 12px; color: var(--text-secondary); line-height: 1.55; margin: 0; }\n.a-error { font-size: 12px; color: var(--destructive); background: var(--destructive-soft); border: 1px solid #fecdca; border-radius: 6px; padding: 7px 9px; margin: 10px 0 0; line-height: 1.45; }\n\n/* Diff */\n.ck-diff { margin: 10px 0 2px; border: 1px solid var(--border); border-radius: 6px; overflow: hidden; font-family: var(--font-mono); font-size: 11px; line-height: 1.55; }\n.d-line { padding: 6px 10px 6px 24px; position: relative; }\n.d-del { background: var(--destructive-soft); color: #b42318; }\n.d-del .t { text-decoration: line-through; text-decoration-color: rgba(180,35,24,.5); }\n.d-add { background: #ecfdf3; color: #067647; border-top: 1px solid #d1fadf; }\n.d-line::before { position: absolute; left: 9px; top: 6px; font-weight: 700; }\n.d-del::before { content: \"−\"; color: #d92d20; }\n.d-add::before { content: \"+\"; color: #079455; }\n\n/* Action footer */\n.a-foot { display: flex; gap: 8px; padding: 12px; align-items: center; }\n.a-foot .spacer { flex: 1; }\n.ck-btn { font-size: 13px; font-weight: 500; border-radius: 6px; padding: 8px 14px; cursor: pointer; border: 1px solid transparent; line-height: 1; display: inline-flex; align-items: center; gap: 7px; white-space: nowrap; font-family: var(--font-body); transition: background .12s, border-color .12s; }\n.ck-btn.primary { background: var(--grey-grad); color: #fff; font-weight: 600; border-color: rgba(17,24,39,.35); box-shadow: var(--grey-glow); }\n.ck-btn.primary:hover { background: var(--grey-grad-hover); }\n.ck-btn.danger-ghost { background: transparent; color: var(--text-secondary); border-color: transparent; }\n.ck-btn.danger-ghost:hover { background: var(--destructive-soft); color: var(--destructive); }\n.ck-btn.applied { background: #ecfdf3; color: #067647; border-color: #d1fadf; cursor: default; }\n.ck-btn.applied:hover { filter: none; }\n.chk { width: 6px; height: 11px; border-right: 2px solid currentColor; border-bottom: 2px solid currentColor; transform: rotate(40deg) translateY(-1px); display: inline-block; }\n\n/* Thinking dots */\n.ck-thinking { display: flex; gap: 8px; align-items: center; }\n.t-bubble { background: var(--surface); border: 1px solid var(--border); border-radius: 4px 12px 12px 12px; box-shadow: var(--shadow-card); padding: 12px 14px; display: flex; gap: 5px; align-items: center; }\n.t-bubble i { width: 6px; height: 6px; border-radius: 50%; background: var(--navy-300); animation: blink 1.2s infinite ease-in-out; font-style: normal; display: block; }\n.t-bubble i:nth-child(2){ animation-delay: .18s; }\n.t-bubble i:nth-child(3){ animation-delay: .36s; }\n@keyframes blink { 0%,60%,100%{ opacity:.28; transform:translateY(0);} 30%{ opacity:1; transform:translateY(-2px);} }\n\n/* ── Empty state ── */\n.ck-empty { display: flex; flex-direction: column; align-items: center; text-align: center; padding: 36px 22px; gap: 0; flex: 1; }\n.e-mark { width: 60px; height: 60px; border-radius: 16px; background: linear-gradient(180deg,#1d1d24 0%,#101015 100%); display: grid; place-items: center; position: relative; box-shadow: 0 10px 26px rgba(0,0,0,.28); border: 1px solid #2e2e36; margin-bottom: 18px; }\n.e-mark img { width: 34px; height: 34px; object-fit: contain; display: block; }\n.ck-empty h3 { font-family: var(--font-display); font-size: 15px; font-weight: 600; margin: 0 0 6px; color: var(--text-primary); }\n.e-sub { font-family: var(--font-display); font-size: 14px; font-weight: 500; color: var(--text-primary); line-height: 1.6; letter-spacing: -.01em; margin: 0 0 22px; max-width: 28ch; }\n.ck-suggest { display: flex; flex-direction: column; gap: 9px; width: 100%; }\n.s-btn { position: relative; text-align: left; font-size: 12.5px; color: var(--navy); background: #fff; border: 1px solid var(--border); border-radius: 10px; padding: 12px 13px; cursor: pointer; box-shadow: var(--shadow-card); display: flex; align-items: center; gap: 9px; font-family: var(--font-body); overflow: hidden; transition: border-color .15s, box-shadow .15s, transform .15s, background .15s; }\n.s-btn::before { content:\"\"; position: absolute; left: 0; top: 0; bottom: 0; width: 3px; background: var(--grey-grad); opacity: 0; transition: opacity .15s; }\n.s-btn:hover { border-color: var(--border-strong); background: #fafafb; box-shadow: 0 4px 12px rgba(17,24,39,.08); transform: translateY(-1px); }\n.s-btn:hover::before { opacity: 1; }\n.s-btn:active { transform: translateY(0); }\n.s-txt { flex: 1; line-height: 1.4; }\n.s-btn .s-ar { margin-left: auto; color: var(--navy-300); font-size: 15px; flex: none; transition: color .15s, transform .15s; }\n.s-btn:hover .s-ar { color: var(--navy); transform: translateX(2px); }\n\n/* ── Privacy note ── */\n.ck-privacy { background: #fff; border-top: 1px solid var(--border); padding: 9px 12px; display: flex; align-items: center; gap: 9px; flex-shrink: 0; }\n.p-shield { width: 22px; height: 24px; flex: none; position: relative; }\n.p-shield::before { content:\"\"; position:absolute; inset:0; background: #eef2ff; border:1.4px solid #dbe3fb; border-radius: 4px 4px 9px 9px / 4px 4px 14px 14px; }\n.p-shield::after { content:\"\"; position:absolute; left:7px; top:8px; width:5px; height:8px; border-right:1.8px solid var(--navy); border-bottom:1.8px solid var(--navy); transform: rotate(40deg); }\n.p-txt { font-size: var(--fs-label); color: var(--text-secondary); line-height: 1.45; margin: 0; }\n.p-txt b { color: var(--text-primary); font-weight: 600; }\n\n/* ── Input area ── */\n.ck-input-wrap { background: var(--surface); border-top: 1px solid var(--border); padding: 0 var(--pane-pad) 8px; flex-shrink: 0; }\n.ck-input-resize { height: 14px; display: flex; align-items: center; justify-content: center; cursor: ns-resize; touch-action: none; }\n.ck-input-grip { width: 28px; height: 4px; border-radius: 999px; background: var(--border-strong); transition: background .12s; }\n.ck-input-resize:hover .ck-input-grip { background: var(--navy-300); }\n.ck-input { background: #fff; border: 1px solid var(--border-strong); border-radius: 12px; padding: 7px 7px 7px 13px; display: flex; align-items: flex-end; gap: 8px; transition: border-color .12s, box-shadow .12s; }\n.ck-input:focus-within { border-color: var(--navy); box-shadow: 0 0 0 3px rgba(14,14,18,.08); }\n.ck-input textarea { flex: 1; font-size: var(--fs-body); color: var(--text-primary); line-height: 1.5; padding: 7px 0; border: none; outline: none; resize: none; background: transparent; font-family: var(--font-body); overflow-y: auto; }\n.ck-input textarea::placeholder { color: var(--text-secondary); }\n.ck-send { width: 34px; height: 34px; border-radius: 10px; background: var(--grey-grad); color: #fff; display: grid; place-items: center; flex: none; cursor: pointer; border: 1px solid rgba(17,24,39,.35); box-shadow: var(--grey-glow); transition: filter .12s, transform .12s, box-shadow .12s, background .12s; }\n.ck-send:hover { background: var(--grey-grad-hover); }\n.ck-send:active { transform: translateY(.5px); }\n.ck-send svg { display: block; }\n.ck-send.disabled { background: #eceef1; color: #aab1bb; border-color: var(--border); box-shadow: none; cursor: default; pointer-events: none; filter: none; }\n.ck-hint { font-size: var(--fs-label); color: var(--text-secondary); margin-top: 7px; display: flex; align-items: center; gap: 5px; padding: 0 2px; }\n.lock-icon { width: 9px; height: 9px; border: 1.4px solid var(--text-secondary); border-radius: 2px; position: relative; flex: none; }\n.lock-icon::before { content:\"\"; position:absolute; left:1.5px; top:-3.5px; width:5px; height:5px; border:1.4px solid var(--text-secondary); border-bottom:0; border-radius:3px 3px 0 0; }\n\n/* ── Mode tabs ── */\n.ck-tabs { display: flex; gap: 0; padding: 3px 0 0; background: var(--surface); border-bottom: 1px solid var(--border); flex-shrink: 0; }\n.ck-tab { flex: 1; font-size: 12.5px; font-weight: 600; color: var(--text-secondary); background: none; border: none; padding: 6px 0 7px; cursor: pointer; border-bottom: 2px solid transparent; font-family: var(--font-body); }\n.ck-tab:hover { color: var(--text-primary); }\n.ck-tab.on { color: var(--navy); border-bottom-color: var(--navy); }\n\n/* ── Negotiation Simulator ── */\n.ck-sim { flex: 1; overflow-y: auto; background: var(--bg); display: flex; flex-direction: column; gap: 14px; padding: var(--pane-pad); }\n\n.sim-setup { background: var(--surface); border: 1px solid var(--border); border-radius: 10px; box-shadow: var(--shadow-card); padding: 14px; display: flex; flex-direction: column; gap: 12px; }\n.sim-title { font-family: var(--font-display); font-size: 14px; font-weight: 600; margin: 0; color: var(--text-primary); }\n.sim-sub { font-size: 12px; color: var(--text-secondary); line-height: 1.5; margin: 5px 0 0; }\n.sim-side { display: flex; align-items: center; gap: 10px; }\n.sim-side-label { font-size: 12px; color: var(--text-secondary); }\n.sim-toggle { display: inline-flex; background: #eef0f3; border-radius: 8px; padding: 3px; gap: 2px; }\n.sim-seg { font-size: 12.5px; font-weight: 600; color: var(--text-secondary); background: none; border: none; border-radius: 6px; padding: 6px 16px; cursor: pointer; font-family: var(--font-body); }\n.sim-seg.on { background: #fff; color: var(--navy); box-shadow: var(--shadow-card); }\n.sim-run { justify-content: center; }\n\n.sim-loading { display: flex; align-items: center; gap: 10px; color: var(--text-secondary); font-size: 12.5px; padding: 4px 2px; }\n.sim-loading-text { display: flex; flex-direction: column; gap: 2px; }\n.sim-loading-hint { font-size: 11px; color: var(--text-secondary); opacity: .8; }\n.sim-error { border-radius: 8px; }\n.sim-empty { text-align: center; color: var(--text-secondary); font-size: 12.5px; line-height: 1.55; padding: 20px 18px; }\n.sim-placeholder { display: flex; flex-direction: column; align-items: center; text-align: center; gap: 12px; color: var(--text-secondary); font-size: 12.5px; line-height: 1.55; padding: 0px 22px; }\n.sim-ph-mark { width: 46px; height: 46px; border-radius: 12px; background: linear-gradient(180deg,#1d1d24,#101015); display: grid; place-items: center; color: var(--amber); font-size: 22px; }\n.sim-count { font-size: 11px; font-weight: 600; letter-spacing: .03em; text-transform: uppercase; color: var(--text-secondary); margin: 2px 2px 0; }\n\n/* Term card */\n.sim-card { background: var(--surface); border: 1px solid var(--border); border-radius: 10px; box-shadow: var(--shadow-card); overflow: hidden; }\n.sim-card-head { display: flex; align-items: center; gap: 8px; padding: 12px; flex-wrap: wrap; border-bottom: 1px solid var(--border); }\n.sim-ref { font-family: var(--font-mono); font-size: 12px; font-weight: 600; color: var(--navy); background: #eef2ff; border: 1px solid #dbe3fb; border-radius: 5px; padding: 2px 7px; }\n.sim-heading { font-size: 13px; font-weight: 600; color: var(--text-primary); }\n.sim-favors { margin-left: auto; font-size: 9.5px; font-weight: 600; letter-spacing: .04em; text-transform: uppercase; border-radius: 4px; padding: 3px 7px; background: var(--amber-soft); color: var(--amber-600); }\n.sim-favors.tenant { background: #e0f2fe; color: #0369a1; }\n.sim-favors.landlord { background: var(--amber-soft); color: var(--amber-600); }\n\n.sim-current { padding: 10px 12px; border-bottom: 1px solid var(--border); }\n.sim-current summary { font-size: 11.5px; font-weight: 500; color: var(--text-secondary); cursor: pointer; list-style: none; display: flex; align-items: center; gap: 6px; }\n.sim-current summary::-webkit-details-marker { display: none; }\n.sim-current summary::before { content: \"›\"; transition: transform .15s; display: inline-block; }\n.sim-current[open] summary::before { transform: rotate(90deg); }\n.sim-current-text { font-size: 12px; line-height: 1.6; color: #374151; font-style: italic; background: #fafbfc; border-left: 3px solid var(--navy-300); border-radius: 0 6px 6px 0; padding: 9px 11px; margin: 9px 0 2px; }\n\n.sim-ladder { padding: 12px; display: flex; flex-direction: column; gap: 10px; }\n.sim-ladder-label { font-size: 11px; font-weight: 600; letter-spacing: .03em; text-transform: uppercase; color: var(--text-secondary); }\n.sim-rung { border: 1px solid var(--border); border-left: 3px solid var(--border-strong); border-radius: 8px; padding: 10px 11px; }\n.sim-rung.tier-ideal { border-left-color: #16a34a; }\n.sim-rung.tier-market { border-left-color: var(--amber); }\n.sim-rung.tier-floor { border-left-color: var(--navy-300); }\n.sim-rung.applied { background: #f0fdf4; border-color: #bbf7d0; }\n.sim-tier { font-size: 10px; font-weight: 700; letter-spacing: .05em; text-transform: uppercase; color: var(--text-secondary); }\n.sim-rung.tier-ideal .sim-tier { color: #16a34a; }\n.sim-rung.tier-market .sim-tier { color: var(--amber-600); }\n.sim-rung-text { font-size: 12.5px; line-height: 1.55; color: var(--text-primary); margin: 6px 0 0; }\n.sim-rung-rat { font-size: 11.5px; line-height: 1.5; color: var(--text-secondary); margin: 6px 0 0; }\n.sim-apply { margin-top: 10px; font-size: 12px; padding: 6px 12px; }\n\n/* Counterparty callout — the differentiator */\n.sim-counter { margin: 0 12px 12px; background: linear-gradient(180deg,#15151b,#1f1f27); border-radius: 9px; padding: 12px; }\n.sim-counter-head { display: flex; align-items: center; gap: 7px; font-size: 11.5px; font-weight: 700; color: #fff; margin-bottom: 8px; }\n.sim-counter-icon { width: 13px; height: 13px; flex: none; background: var(--amber); clip-path: polygon(50% 0, 100% 100%, 0 100%); }\n.sim-counter-pred { font-size: 12.5px; line-height: 1.55; margin: 0; color: #eef0f5; }\n\n/* ── Scrollbars ──\n * Modern, slim black/grey track + thumb. Applies to the pane scrollbar and\n * every inner scroll area (chat, simulator). WebKit/Chromium hosts use the\n * ::-webkit-scrollbar pseudo-elements; Firefox uses scrollbar-* properties.\n */\n* {\n  scrollbar-width: thin;\n  scrollbar-color: #4b4b55 transparent;\n}\n*::-webkit-scrollbar { width: 10px; height: 10px; }\n*::-webkit-scrollbar-track { background: transparent; }\n*::-webkit-scrollbar-thumb {\n  background: #3a3a44;\n  border-radius: 999px;\n  border: 2px solid transparent;\n  background-clip: padding-box;\n  transition: background .15s;\n}\n*::-webkit-scrollbar-thumb:hover { background: #56565f; background-clip: padding-box; }\n*::-webkit-scrollbar-thumb:active { background: #6c6c77; background-clip: padding-box; }\n*::-webkit-scrollbar-corner { background: transparent; }\n.sim-counter-arg { font-size: 12px; line-height: 1.55; margin: 8px 0 0; color: #b9bdca; font-style: italic; border-left: 2px solid rgba(245,158,11,.5); padding-left: 9px; }\n"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ },

/***/ "./node_modules/css-loader/dist/runtime/api.js"
/*!*****************************************************!*\
  !*** ./node_modules/css-loader/dist/runtime/api.js ***!
  \*****************************************************/
(module) {



/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
*/
module.exports = function (cssWithMappingToString) {
  var list = [];

  // return the list of modules as css string
  list.toString = function toString() {
    return this.map(function (item) {
      var content = "";
      var needLayer = typeof item[5] !== "undefined";
      if (item[4]) {
        content += "@supports (".concat(item[4], ") {");
      }
      if (item[2]) {
        content += "@media ".concat(item[2], " {");
      }
      if (needLayer) {
        content += "@layer".concat(item[5].length > 0 ? " ".concat(item[5]) : "", " {");
      }
      content += cssWithMappingToString(item);
      if (needLayer) {
        content += "}";
      }
      if (item[2]) {
        content += "}";
      }
      if (item[4]) {
        content += "}";
      }
      return content;
    }).join("");
  };

  // import a list of modules into the list
  list.i = function i(modules, media, dedupe, supports, layer) {
    if (typeof modules === "string") {
      modules = [[null, modules, undefined]];
    }
    var alreadyImportedModules = {};
    if (dedupe) {
      for (var k = 0; k < this.length; k++) {
        var id = this[k][0];
        if (id != null) {
          alreadyImportedModules[id] = true;
        }
      }
    }
    for (var _k = 0; _k < modules.length; _k++) {
      var item = [].concat(modules[_k]);
      if (dedupe && alreadyImportedModules[item[0]]) {
        continue;
      }
      if (typeof layer !== "undefined") {
        if (typeof item[5] === "undefined") {
          item[5] = layer;
        } else {
          item[1] = "@layer".concat(item[5].length > 0 ? " ".concat(item[5]) : "", " {").concat(item[1], "}");
          item[5] = layer;
        }
      }
      if (media) {
        if (!item[2]) {
          item[2] = media;
        } else {
          item[1] = "@media ".concat(item[2], " {").concat(item[1], "}");
          item[2] = media;
        }
      }
      if (supports) {
        if (!item[4]) {
          item[4] = "".concat(supports);
        } else {
          item[1] = "@supports (".concat(item[4], ") {").concat(item[1], "}");
          item[4] = supports;
        }
      }
      list.push(item);
    }
  };
  return list;
};

/***/ },

/***/ "./node_modules/css-loader/dist/runtime/sourceMaps.js"
/*!************************************************************!*\
  !*** ./node_modules/css-loader/dist/runtime/sourceMaps.js ***!
  \************************************************************/
(module) {



module.exports = function (item) {
  var content = item[1];
  var cssMapping = item[3];
  if (!cssMapping) {
    return content;
  }
  if (typeof btoa === "function") {
    var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(cssMapping))));
    var data = "sourceMappingURL=data:application/json;charset=utf-8;base64,".concat(base64);
    var sourceMapping = "/*# ".concat(data, " */");
    return [content].concat([sourceMapping]).join("\n");
  }
  return [content].join("\n");
};

/***/ },

/***/ "./src/taskpane/taskpane.html"
/*!************************************!*\
  !*** ./src/taskpane/taskpane.html ***!
  \************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
// Module
var code = `<!-- Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license. -->
<!-- See LICENSE in the project root for license information -->

<!doctype html>
<html lang="en" data-framework="typescript">

<head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=Edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>ClauseKit</title>

    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Roboto+Mono:wght@400;500&display=swap" rel="stylesheet">

    <!-- Office JavaScript API -->
    ${"<" + "script"} type="text/javascript" src="https://appsforoffice.microsoft.com/lib/1/hosted/office.js">${"<" + "/script"}>

    <!-- Design-system styles are imported by src/taskpane/index.tsx from
         src/styles/clausekit.css (the single source of truth shared with the
         browser playground). -->

    <!-- Boot splash, shown until React mounts. Office's built-in task-pane
         spinner runs on the WebView main thread, so it freezes while the JS
         bundle parses/executes. This one animates only \`transform\`, which the
         browser runs on the compositor thread — it keeps spinning during that
         load. React clears #container's contents on mount, removing it. -->
    <style>
        #ck-boot {
            position: fixed;
            inset: 0;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 14px;
            background: #fff;
            font-family: 'Space Grotesk', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }
        #ck-boot .ck-boot-spinner {
            width: 30px;
            height: 30px;
            border-radius: 50%;
            border: 3px solid rgba(19, 19, 24, 0.12);
            border-top-color: #131318;
            animation: ck-boot-spin 0.7s linear infinite;
            will-change: transform;
        }
        #ck-boot .ck-boot-text {
            margin: 0;
            font-size: 13px;
            font-weight: 500;
            letter-spacing: 0.01em;
            color: #6b7280;
        }
        @keyframes ck-boot-spin {
            to { transform: rotate(360deg); }
        }
        @media (prefers-reduced-motion: reduce) {
            #ck-boot .ck-boot-spinner { animation-duration: 1.6s; }
        }
    </style>
</head>

<body style="width: 100%; height: 100%; margin: 0; padding: 0;">
    <div id="container">
        <div id="ck-boot" role="status" aria-label="Loading ClauseKit">
            <div class="ck-boot-spinner"></div>
            <p class="ck-boot-text">Loading ClauseKit&hellip;</p>
        </div>
    </div>

    <!--
        Fluent UI React v. 9 uses modern JavaScript syntax that is not supported in
        Trident (Internet Explorer) or EdgeHTML (Edge Legacy), so this add-in won't
        work in Office versions that use these webviews. The script below makes the
        following div display when an unsupported webview is in use, and hides the
        React container div.
    -->
    <div id="tridentmessage" style="display: none; padding: 10;">
        This add-in will not run in your version of Office. Please upgrade either to perpetual Office 2021 (or later)
        or to a Microsoft 365 account.
    </div>
    ${"<" + "script"}>
        if ((navigator.userAgent.indexOf("Trident") !== -1) || (navigator.userAgent.indexOf("Edge") !== -1)) {
            var tridentMessage = document.getElementById("tridentmessage");
            var normalContainer = document.getElementById("container");
            tridentMessage.style.display = "block";
            normalContainer.style.display = "none";
        }
    ${"<" + "/script"}>
</body>

</html>
`;
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (code);

/***/ },

/***/ "./node_modules/react-dom/client.js"
/*!******************************************!*\
  !*** ./node_modules/react-dom/client.js ***!
  \******************************************/
(__unused_webpack_module, exports, __webpack_require__) {



var m = __webpack_require__(/*! react-dom */ "./node_modules/react-dom/index.js");
if (false) // removed by dead control flow
{} else {
  var i = m.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;
  exports.createRoot = function(c, o) {
    i.usingClientEntryPoint = true;
    try {
      return m.createRoot(c, o);
    } finally {
      i.usingClientEntryPoint = false;
    }
  };
  exports.hydrateRoot = function(c, h, o) {
    i.usingClientEntryPoint = true;
    try {
      return m.hydrateRoot(c, h, o);
    } finally {
      i.usingClientEntryPoint = false;
    }
  };
}


/***/ },

/***/ "./node_modules/react/cjs/react-jsx-runtime.development.js"
/*!*****************************************************************!*\
  !*** ./node_modules/react/cjs/react-jsx-runtime.development.js ***!
  \*****************************************************************/
(__unused_webpack_module, exports, __webpack_require__) {

/**
 * @license React
 * react-jsx-runtime.development.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */



if (true) {
  (function() {
'use strict';

var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");

// ATTENTION
// When adding new symbols to this file,
// Please consider also adding to 'react-devtools-shared/src/backend/ReactSymbols'
// The Symbol used to tag the ReactElement-like types.
var REACT_ELEMENT_TYPE = Symbol.for('react.element');
var REACT_PORTAL_TYPE = Symbol.for('react.portal');
var REACT_FRAGMENT_TYPE = Symbol.for('react.fragment');
var REACT_STRICT_MODE_TYPE = Symbol.for('react.strict_mode');
var REACT_PROFILER_TYPE = Symbol.for('react.profiler');
var REACT_PROVIDER_TYPE = Symbol.for('react.provider');
var REACT_CONTEXT_TYPE = Symbol.for('react.context');
var REACT_FORWARD_REF_TYPE = Symbol.for('react.forward_ref');
var REACT_SUSPENSE_TYPE = Symbol.for('react.suspense');
var REACT_SUSPENSE_LIST_TYPE = Symbol.for('react.suspense_list');
var REACT_MEMO_TYPE = Symbol.for('react.memo');
var REACT_LAZY_TYPE = Symbol.for('react.lazy');
var REACT_OFFSCREEN_TYPE = Symbol.for('react.offscreen');
var MAYBE_ITERATOR_SYMBOL = Symbol.iterator;
var FAUX_ITERATOR_SYMBOL = '@@iterator';
function getIteratorFn(maybeIterable) {
  if (maybeIterable === null || typeof maybeIterable !== 'object') {
    return null;
  }

  var maybeIterator = MAYBE_ITERATOR_SYMBOL && maybeIterable[MAYBE_ITERATOR_SYMBOL] || maybeIterable[FAUX_ITERATOR_SYMBOL];

  if (typeof maybeIterator === 'function') {
    return maybeIterator;
  }

  return null;
}

var ReactSharedInternals = React.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;

function error(format) {
  {
    {
      for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
        args[_key2 - 1] = arguments[_key2];
      }

      printWarning('error', format, args);
    }
  }
}

function printWarning(level, format, args) {
  // When changing this logic, you might want to also
  // update consoleWithStackDev.www.js as well.
  {
    var ReactDebugCurrentFrame = ReactSharedInternals.ReactDebugCurrentFrame;
    var stack = ReactDebugCurrentFrame.getStackAddendum();

    if (stack !== '') {
      format += '%s';
      args = args.concat([stack]);
    } // eslint-disable-next-line react-internal/safe-string-coercion


    var argsWithFormat = args.map(function (item) {
      return String(item);
    }); // Careful: RN currently depends on this prefix

    argsWithFormat.unshift('Warning: ' + format); // We intentionally don't use spread (or .apply) directly because it
    // breaks IE9: https://github.com/facebook/react/issues/13610
    // eslint-disable-next-line react-internal/no-production-logging

    Function.prototype.apply.call(console[level], console, argsWithFormat);
  }
}

// -----------------------------------------------------------------------------

var enableScopeAPI = false; // Experimental Create Event Handle API.
var enableCacheElement = false;
var enableTransitionTracing = false; // No known bugs, but needs performance testing

var enableLegacyHidden = false; // Enables unstable_avoidThisFallback feature in Fiber
// stuff. Intended to enable React core members to more easily debug scheduling
// issues in DEV builds.

var enableDebugTracing = false; // Track which Fiber(s) schedule render work.

var REACT_MODULE_REFERENCE;

{
  REACT_MODULE_REFERENCE = Symbol.for('react.module.reference');
}

function isValidElementType(type) {
  if (typeof type === 'string' || typeof type === 'function') {
    return true;
  } // Note: typeof might be other than 'symbol' or 'number' (e.g. if it's a polyfill).


  if (type === REACT_FRAGMENT_TYPE || type === REACT_PROFILER_TYPE || enableDebugTracing  || type === REACT_STRICT_MODE_TYPE || type === REACT_SUSPENSE_TYPE || type === REACT_SUSPENSE_LIST_TYPE || enableLegacyHidden  || type === REACT_OFFSCREEN_TYPE || enableScopeAPI  || enableCacheElement  || enableTransitionTracing ) {
    return true;
  }

  if (typeof type === 'object' && type !== null) {
    if (type.$$typeof === REACT_LAZY_TYPE || type.$$typeof === REACT_MEMO_TYPE || type.$$typeof === REACT_PROVIDER_TYPE || type.$$typeof === REACT_CONTEXT_TYPE || type.$$typeof === REACT_FORWARD_REF_TYPE || // This needs to include all possible module reference object
    // types supported by any Flight configuration anywhere since
    // we don't know which Flight build this will end up being used
    // with.
    type.$$typeof === REACT_MODULE_REFERENCE || type.getModuleId !== undefined) {
      return true;
    }
  }

  return false;
}

function getWrappedName(outerType, innerType, wrapperName) {
  var displayName = outerType.displayName;

  if (displayName) {
    return displayName;
  }

  var functionName = innerType.displayName || innerType.name || '';
  return functionName !== '' ? wrapperName + "(" + functionName + ")" : wrapperName;
} // Keep in sync with react-reconciler/getComponentNameFromFiber


function getContextName(type) {
  return type.displayName || 'Context';
} // Note that the reconciler package should generally prefer to use getComponentNameFromFiber() instead.


function getComponentNameFromType(type) {
  if (type == null) {
    // Host root, text node or just invalid type.
    return null;
  }

  {
    if (typeof type.tag === 'number') {
      error('Received an unexpected object in getComponentNameFromType(). ' + 'This is likely a bug in React. Please file an issue.');
    }
  }

  if (typeof type === 'function') {
    return type.displayName || type.name || null;
  }

  if (typeof type === 'string') {
    return type;
  }

  switch (type) {
    case REACT_FRAGMENT_TYPE:
      return 'Fragment';

    case REACT_PORTAL_TYPE:
      return 'Portal';

    case REACT_PROFILER_TYPE:
      return 'Profiler';

    case REACT_STRICT_MODE_TYPE:
      return 'StrictMode';

    case REACT_SUSPENSE_TYPE:
      return 'Suspense';

    case REACT_SUSPENSE_LIST_TYPE:
      return 'SuspenseList';

  }

  if (typeof type === 'object') {
    switch (type.$$typeof) {
      case REACT_CONTEXT_TYPE:
        var context = type;
        return getContextName(context) + '.Consumer';

      case REACT_PROVIDER_TYPE:
        var provider = type;
        return getContextName(provider._context) + '.Provider';

      case REACT_FORWARD_REF_TYPE:
        return getWrappedName(type, type.render, 'ForwardRef');

      case REACT_MEMO_TYPE:
        var outerName = type.displayName || null;

        if (outerName !== null) {
          return outerName;
        }

        return getComponentNameFromType(type.type) || 'Memo';

      case REACT_LAZY_TYPE:
        {
          var lazyComponent = type;
          var payload = lazyComponent._payload;
          var init = lazyComponent._init;

          try {
            return getComponentNameFromType(init(payload));
          } catch (x) {
            return null;
          }
        }

      // eslint-disable-next-line no-fallthrough
    }
  }

  return null;
}

var assign = Object.assign;

// Helpers to patch console.logs to avoid logging during side-effect free
// replaying on render function. This currently only patches the object
// lazily which won't cover if the log function was extracted eagerly.
// We could also eagerly patch the method.
var disabledDepth = 0;
var prevLog;
var prevInfo;
var prevWarn;
var prevError;
var prevGroup;
var prevGroupCollapsed;
var prevGroupEnd;

function disabledLog() {}

disabledLog.__reactDisabledLog = true;
function disableLogs() {
  {
    if (disabledDepth === 0) {
      /* eslint-disable react-internal/no-production-logging */
      prevLog = console.log;
      prevInfo = console.info;
      prevWarn = console.warn;
      prevError = console.error;
      prevGroup = console.group;
      prevGroupCollapsed = console.groupCollapsed;
      prevGroupEnd = console.groupEnd; // https://github.com/facebook/react/issues/19099

      var props = {
        configurable: true,
        enumerable: true,
        value: disabledLog,
        writable: true
      }; // $FlowFixMe Flow thinks console is immutable.

      Object.defineProperties(console, {
        info: props,
        log: props,
        warn: props,
        error: props,
        group: props,
        groupCollapsed: props,
        groupEnd: props
      });
      /* eslint-enable react-internal/no-production-logging */
    }

    disabledDepth++;
  }
}
function reenableLogs() {
  {
    disabledDepth--;

    if (disabledDepth === 0) {
      /* eslint-disable react-internal/no-production-logging */
      var props = {
        configurable: true,
        enumerable: true,
        writable: true
      }; // $FlowFixMe Flow thinks console is immutable.

      Object.defineProperties(console, {
        log: assign({}, props, {
          value: prevLog
        }),
        info: assign({}, props, {
          value: prevInfo
        }),
        warn: assign({}, props, {
          value: prevWarn
        }),
        error: assign({}, props, {
          value: prevError
        }),
        group: assign({}, props, {
          value: prevGroup
        }),
        groupCollapsed: assign({}, props, {
          value: prevGroupCollapsed
        }),
        groupEnd: assign({}, props, {
          value: prevGroupEnd
        })
      });
      /* eslint-enable react-internal/no-production-logging */
    }

    if (disabledDepth < 0) {
      error('disabledDepth fell below zero. ' + 'This is a bug in React. Please file an issue.');
    }
  }
}

var ReactCurrentDispatcher = ReactSharedInternals.ReactCurrentDispatcher;
var prefix;
function describeBuiltInComponentFrame(name, source, ownerFn) {
  {
    if (prefix === undefined) {
      // Extract the VM specific prefix used by each line.
      try {
        throw Error();
      } catch (x) {
        var match = x.stack.trim().match(/\n( *(at )?)/);
        prefix = match && match[1] || '';
      }
    } // We use the prefix to ensure our stacks line up with native stack frames.


    return '\n' + prefix + name;
  }
}
var reentry = false;
var componentFrameCache;

{
  var PossiblyWeakMap = typeof WeakMap === 'function' ? WeakMap : Map;
  componentFrameCache = new PossiblyWeakMap();
}

function describeNativeComponentFrame(fn, construct) {
  // If something asked for a stack inside a fake render, it should get ignored.
  if ( !fn || reentry) {
    return '';
  }

  {
    var frame = componentFrameCache.get(fn);

    if (frame !== undefined) {
      return frame;
    }
  }

  var control;
  reentry = true;
  var previousPrepareStackTrace = Error.prepareStackTrace; // $FlowFixMe It does accept undefined.

  Error.prepareStackTrace = undefined;
  var previousDispatcher;

  {
    previousDispatcher = ReactCurrentDispatcher.current; // Set the dispatcher in DEV because this might be call in the render function
    // for warnings.

    ReactCurrentDispatcher.current = null;
    disableLogs();
  }

  try {
    // This should throw.
    if (construct) {
      // Something should be setting the props in the constructor.
      var Fake = function () {
        throw Error();
      }; // $FlowFixMe


      Object.defineProperty(Fake.prototype, 'props', {
        set: function () {
          // We use a throwing setter instead of frozen or non-writable props
          // because that won't throw in a non-strict mode function.
          throw Error();
        }
      });

      if (typeof Reflect === 'object' && Reflect.construct) {
        // We construct a different control for this case to include any extra
        // frames added by the construct call.
        try {
          Reflect.construct(Fake, []);
        } catch (x) {
          control = x;
        }

        Reflect.construct(fn, [], Fake);
      } else {
        try {
          Fake.call();
        } catch (x) {
          control = x;
        }

        fn.call(Fake.prototype);
      }
    } else {
      try {
        throw Error();
      } catch (x) {
        control = x;
      }

      fn();
    }
  } catch (sample) {
    // This is inlined manually because closure doesn't do it for us.
    if (sample && control && typeof sample.stack === 'string') {
      // This extracts the first frame from the sample that isn't also in the control.
      // Skipping one frame that we assume is the frame that calls the two.
      var sampleLines = sample.stack.split('\n');
      var controlLines = control.stack.split('\n');
      var s = sampleLines.length - 1;
      var c = controlLines.length - 1;

      while (s >= 1 && c >= 0 && sampleLines[s] !== controlLines[c]) {
        // We expect at least one stack frame to be shared.
        // Typically this will be the root most one. However, stack frames may be
        // cut off due to maximum stack limits. In this case, one maybe cut off
        // earlier than the other. We assume that the sample is longer or the same
        // and there for cut off earlier. So we should find the root most frame in
        // the sample somewhere in the control.
        c--;
      }

      for (; s >= 1 && c >= 0; s--, c--) {
        // Next we find the first one that isn't the same which should be the
        // frame that called our sample function and the control.
        if (sampleLines[s] !== controlLines[c]) {
          // In V8, the first line is describing the message but other VMs don't.
          // If we're about to return the first line, and the control is also on the same
          // line, that's a pretty good indicator that our sample threw at same line as
          // the control. I.e. before we entered the sample frame. So we ignore this result.
          // This can happen if you passed a class to function component, or non-function.
          if (s !== 1 || c !== 1) {
            do {
              s--;
              c--; // We may still have similar intermediate frames from the construct call.
              // The next one that isn't the same should be our match though.

              if (c < 0 || sampleLines[s] !== controlLines[c]) {
                // V8 adds a "new" prefix for native classes. Let's remove it to make it prettier.
                var _frame = '\n' + sampleLines[s].replace(' at new ', ' at '); // If our component frame is labeled "<anonymous>"
                // but we have a user-provided "displayName"
                // splice it in to make the stack more readable.


                if (fn.displayName && _frame.includes('<anonymous>')) {
                  _frame = _frame.replace('<anonymous>', fn.displayName);
                }

                {
                  if (typeof fn === 'function') {
                    componentFrameCache.set(fn, _frame);
                  }
                } // Return the line we found.


                return _frame;
              }
            } while (s >= 1 && c >= 0);
          }

          break;
        }
      }
    }
  } finally {
    reentry = false;

    {
      ReactCurrentDispatcher.current = previousDispatcher;
      reenableLogs();
    }

    Error.prepareStackTrace = previousPrepareStackTrace;
  } // Fallback to just using the name if we couldn't make it throw.


  var name = fn ? fn.displayName || fn.name : '';
  var syntheticFrame = name ? describeBuiltInComponentFrame(name) : '';

  {
    if (typeof fn === 'function') {
      componentFrameCache.set(fn, syntheticFrame);
    }
  }

  return syntheticFrame;
}
function describeFunctionComponentFrame(fn, source, ownerFn) {
  {
    return describeNativeComponentFrame(fn, false);
  }
}

function shouldConstruct(Component) {
  var prototype = Component.prototype;
  return !!(prototype && prototype.isReactComponent);
}

function describeUnknownElementTypeFrameInDEV(type, source, ownerFn) {

  if (type == null) {
    return '';
  }

  if (typeof type === 'function') {
    {
      return describeNativeComponentFrame(type, shouldConstruct(type));
    }
  }

  if (typeof type === 'string') {
    return describeBuiltInComponentFrame(type);
  }

  switch (type) {
    case REACT_SUSPENSE_TYPE:
      return describeBuiltInComponentFrame('Suspense');

    case REACT_SUSPENSE_LIST_TYPE:
      return describeBuiltInComponentFrame('SuspenseList');
  }

  if (typeof type === 'object') {
    switch (type.$$typeof) {
      case REACT_FORWARD_REF_TYPE:
        return describeFunctionComponentFrame(type.render);

      case REACT_MEMO_TYPE:
        // Memo may contain any component type so we recursively resolve it.
        return describeUnknownElementTypeFrameInDEV(type.type, source, ownerFn);

      case REACT_LAZY_TYPE:
        {
          var lazyComponent = type;
          var payload = lazyComponent._payload;
          var init = lazyComponent._init;

          try {
            // Lazy may contain any component type so we recursively resolve it.
            return describeUnknownElementTypeFrameInDEV(init(payload), source, ownerFn);
          } catch (x) {}
        }
    }
  }

  return '';
}

var hasOwnProperty = Object.prototype.hasOwnProperty;

var loggedTypeFailures = {};
var ReactDebugCurrentFrame = ReactSharedInternals.ReactDebugCurrentFrame;

function setCurrentlyValidatingElement(element) {
  {
    if (element) {
      var owner = element._owner;
      var stack = describeUnknownElementTypeFrameInDEV(element.type, element._source, owner ? owner.type : null);
      ReactDebugCurrentFrame.setExtraStackFrame(stack);
    } else {
      ReactDebugCurrentFrame.setExtraStackFrame(null);
    }
  }
}

function checkPropTypes(typeSpecs, values, location, componentName, element) {
  {
    // $FlowFixMe This is okay but Flow doesn't know it.
    var has = Function.call.bind(hasOwnProperty);

    for (var typeSpecName in typeSpecs) {
      if (has(typeSpecs, typeSpecName)) {
        var error$1 = void 0; // Prop type validation may throw. In case they do, we don't want to
        // fail the render phase where it didn't fail before. So we log it.
        // After these have been cleaned up, we'll let them throw.

        try {
          // This is intentionally an invariant that gets caught. It's the same
          // behavior as without this statement except with a better message.
          if (typeof typeSpecs[typeSpecName] !== 'function') {
            // eslint-disable-next-line react-internal/prod-error-codes
            var err = Error((componentName || 'React class') + ': ' + location + ' type `' + typeSpecName + '` is invalid; ' + 'it must be a function, usually from the `prop-types` package, but received `' + typeof typeSpecs[typeSpecName] + '`.' + 'This often happens because of typos such as `PropTypes.function` instead of `PropTypes.func`.');
            err.name = 'Invariant Violation';
            throw err;
          }

          error$1 = typeSpecs[typeSpecName](values, typeSpecName, componentName, location, null, 'SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED');
        } catch (ex) {
          error$1 = ex;
        }

        if (error$1 && !(error$1 instanceof Error)) {
          setCurrentlyValidatingElement(element);

          error('%s: type specification of %s' + ' `%s` is invalid; the type checker ' + 'function must return `null` or an `Error` but returned a %s. ' + 'You may have forgotten to pass an argument to the type checker ' + 'creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and ' + 'shape all require an argument).', componentName || 'React class', location, typeSpecName, typeof error$1);

          setCurrentlyValidatingElement(null);
        }

        if (error$1 instanceof Error && !(error$1.message in loggedTypeFailures)) {
          // Only monitor this failure once because there tends to be a lot of the
          // same error.
          loggedTypeFailures[error$1.message] = true;
          setCurrentlyValidatingElement(element);

          error('Failed %s type: %s', location, error$1.message);

          setCurrentlyValidatingElement(null);
        }
      }
    }
  }
}

var isArrayImpl = Array.isArray; // eslint-disable-next-line no-redeclare

function isArray(a) {
  return isArrayImpl(a);
}

/*
 * The `'' + value` pattern (used in in perf-sensitive code) throws for Symbol
 * and Temporal.* types. See https://github.com/facebook/react/pull/22064.
 *
 * The functions in this module will throw an easier-to-understand,
 * easier-to-debug exception with a clear errors message message explaining the
 * problem. (Instead of a confusing exception thrown inside the implementation
 * of the `value` object).
 */
// $FlowFixMe only called in DEV, so void return is not possible.
function typeName(value) {
  {
    // toStringTag is needed for namespaced types like Temporal.Instant
    var hasToStringTag = typeof Symbol === 'function' && Symbol.toStringTag;
    var type = hasToStringTag && value[Symbol.toStringTag] || value.constructor.name || 'Object';
    return type;
  }
} // $FlowFixMe only called in DEV, so void return is not possible.


function willCoercionThrow(value) {
  {
    try {
      testStringCoercion(value);
      return false;
    } catch (e) {
      return true;
    }
  }
}

function testStringCoercion(value) {
  // If you ended up here by following an exception call stack, here's what's
  // happened: you supplied an object or symbol value to React (as a prop, key,
  // DOM attribute, CSS property, string ref, etc.) and when React tried to
  // coerce it to a string using `'' + value`, an exception was thrown.
  //
  // The most common types that will cause this exception are `Symbol` instances
  // and Temporal objects like `Temporal.Instant`. But any object that has a
  // `valueOf` or `[Symbol.toPrimitive]` method that throws will also cause this
  // exception. (Library authors do this to prevent users from using built-in
  // numeric operators like `+` or comparison operators like `>=` because custom
  // methods are needed to perform accurate arithmetic or comparison.)
  //
  // To fix the problem, coerce this object or symbol value to a string before
  // passing it to React. The most reliable way is usually `String(value)`.
  //
  // To find which value is throwing, check the browser or debugger console.
  // Before this exception was thrown, there should be `console.error` output
  // that shows the type (Symbol, Temporal.PlainDate, etc.) that caused the
  // problem and how that type was used: key, atrribute, input value prop, etc.
  // In most cases, this console output also shows the component and its
  // ancestor components where the exception happened.
  //
  // eslint-disable-next-line react-internal/safe-string-coercion
  return '' + value;
}
function checkKeyStringCoercion(value) {
  {
    if (willCoercionThrow(value)) {
      error('The provided key is an unsupported type %s.' + ' This value must be coerced to a string before before using it here.', typeName(value));

      return testStringCoercion(value); // throw (to help callers find troubleshooting comments)
    }
  }
}

var ReactCurrentOwner = ReactSharedInternals.ReactCurrentOwner;
var RESERVED_PROPS = {
  key: true,
  ref: true,
  __self: true,
  __source: true
};
var specialPropKeyWarningShown;
var specialPropRefWarningShown;
var didWarnAboutStringRefs;

{
  didWarnAboutStringRefs = {};
}

function hasValidRef(config) {
  {
    if (hasOwnProperty.call(config, 'ref')) {
      var getter = Object.getOwnPropertyDescriptor(config, 'ref').get;

      if (getter && getter.isReactWarning) {
        return false;
      }
    }
  }

  return config.ref !== undefined;
}

function hasValidKey(config) {
  {
    if (hasOwnProperty.call(config, 'key')) {
      var getter = Object.getOwnPropertyDescriptor(config, 'key').get;

      if (getter && getter.isReactWarning) {
        return false;
      }
    }
  }

  return config.key !== undefined;
}

function warnIfStringRefCannotBeAutoConverted(config, self) {
  {
    if (typeof config.ref === 'string' && ReactCurrentOwner.current && self && ReactCurrentOwner.current.stateNode !== self) {
      var componentName = getComponentNameFromType(ReactCurrentOwner.current.type);

      if (!didWarnAboutStringRefs[componentName]) {
        error('Component "%s" contains the string ref "%s". ' + 'Support for string refs will be removed in a future major release. ' + 'This case cannot be automatically converted to an arrow function. ' + 'We ask you to manually fix this case by using useRef() or createRef() instead. ' + 'Learn more about using refs safely here: ' + 'https://reactjs.org/link/strict-mode-string-ref', getComponentNameFromType(ReactCurrentOwner.current.type), config.ref);

        didWarnAboutStringRefs[componentName] = true;
      }
    }
  }
}

function defineKeyPropWarningGetter(props, displayName) {
  {
    var warnAboutAccessingKey = function () {
      if (!specialPropKeyWarningShown) {
        specialPropKeyWarningShown = true;

        error('%s: `key` is not a prop. Trying to access it will result ' + 'in `undefined` being returned. If you need to access the same ' + 'value within the child component, you should pass it as a different ' + 'prop. (https://reactjs.org/link/special-props)', displayName);
      }
    };

    warnAboutAccessingKey.isReactWarning = true;
    Object.defineProperty(props, 'key', {
      get: warnAboutAccessingKey,
      configurable: true
    });
  }
}

function defineRefPropWarningGetter(props, displayName) {
  {
    var warnAboutAccessingRef = function () {
      if (!specialPropRefWarningShown) {
        specialPropRefWarningShown = true;

        error('%s: `ref` is not a prop. Trying to access it will result ' + 'in `undefined` being returned. If you need to access the same ' + 'value within the child component, you should pass it as a different ' + 'prop. (https://reactjs.org/link/special-props)', displayName);
      }
    };

    warnAboutAccessingRef.isReactWarning = true;
    Object.defineProperty(props, 'ref', {
      get: warnAboutAccessingRef,
      configurable: true
    });
  }
}
/**
 * Factory method to create a new React element. This no longer adheres to
 * the class pattern, so do not use new to call it. Also, instanceof check
 * will not work. Instead test $$typeof field against Symbol.for('react.element') to check
 * if something is a React Element.
 *
 * @param {*} type
 * @param {*} props
 * @param {*} key
 * @param {string|object} ref
 * @param {*} owner
 * @param {*} self A *temporary* helper to detect places where `this` is
 * different from the `owner` when React.createElement is called, so that we
 * can warn. We want to get rid of owner and replace string `ref`s with arrow
 * functions, and as long as `this` and owner are the same, there will be no
 * change in behavior.
 * @param {*} source An annotation object (added by a transpiler or otherwise)
 * indicating filename, line number, and/or other information.
 * @internal
 */


var ReactElement = function (type, key, ref, self, source, owner, props) {
  var element = {
    // This tag allows us to uniquely identify this as a React Element
    $$typeof: REACT_ELEMENT_TYPE,
    // Built-in properties that belong on the element
    type: type,
    key: key,
    ref: ref,
    props: props,
    // Record the component responsible for creating this element.
    _owner: owner
  };

  {
    // The validation flag is currently mutative. We put it on
    // an external backing store so that we can freeze the whole object.
    // This can be replaced with a WeakMap once they are implemented in
    // commonly used development environments.
    element._store = {}; // To make comparing ReactElements easier for testing purposes, we make
    // the validation flag non-enumerable (where possible, which should
    // include every environment we run tests in), so the test framework
    // ignores it.

    Object.defineProperty(element._store, 'validated', {
      configurable: false,
      enumerable: false,
      writable: true,
      value: false
    }); // self and source are DEV only properties.

    Object.defineProperty(element, '_self', {
      configurable: false,
      enumerable: false,
      writable: false,
      value: self
    }); // Two elements created in two different places should be considered
    // equal for testing purposes and therefore we hide it from enumeration.

    Object.defineProperty(element, '_source', {
      configurable: false,
      enumerable: false,
      writable: false,
      value: source
    });

    if (Object.freeze) {
      Object.freeze(element.props);
      Object.freeze(element);
    }
  }

  return element;
};
/**
 * https://github.com/reactjs/rfcs/pull/107
 * @param {*} type
 * @param {object} props
 * @param {string} key
 */

function jsxDEV(type, config, maybeKey, source, self) {
  {
    var propName; // Reserved names are extracted

    var props = {};
    var key = null;
    var ref = null; // Currently, key can be spread in as a prop. This causes a potential
    // issue if key is also explicitly declared (ie. <div {...props} key="Hi" />
    // or <div key="Hi" {...props} /> ). We want to deprecate key spread,
    // but as an intermediary step, we will use jsxDEV for everything except
    // <div {...props} key="Hi" />, because we aren't currently able to tell if
    // key is explicitly declared to be undefined or not.

    if (maybeKey !== undefined) {
      {
        checkKeyStringCoercion(maybeKey);
      }

      key = '' + maybeKey;
    }

    if (hasValidKey(config)) {
      {
        checkKeyStringCoercion(config.key);
      }

      key = '' + config.key;
    }

    if (hasValidRef(config)) {
      ref = config.ref;
      warnIfStringRefCannotBeAutoConverted(config, self);
    } // Remaining properties are added to a new props object


    for (propName in config) {
      if (hasOwnProperty.call(config, propName) && !RESERVED_PROPS.hasOwnProperty(propName)) {
        props[propName] = config[propName];
      }
    } // Resolve default props


    if (type && type.defaultProps) {
      var defaultProps = type.defaultProps;

      for (propName in defaultProps) {
        if (props[propName] === undefined) {
          props[propName] = defaultProps[propName];
        }
      }
    }

    if (key || ref) {
      var displayName = typeof type === 'function' ? type.displayName || type.name || 'Unknown' : type;

      if (key) {
        defineKeyPropWarningGetter(props, displayName);
      }

      if (ref) {
        defineRefPropWarningGetter(props, displayName);
      }
    }

    return ReactElement(type, key, ref, self, source, ReactCurrentOwner.current, props);
  }
}

var ReactCurrentOwner$1 = ReactSharedInternals.ReactCurrentOwner;
var ReactDebugCurrentFrame$1 = ReactSharedInternals.ReactDebugCurrentFrame;

function setCurrentlyValidatingElement$1(element) {
  {
    if (element) {
      var owner = element._owner;
      var stack = describeUnknownElementTypeFrameInDEV(element.type, element._source, owner ? owner.type : null);
      ReactDebugCurrentFrame$1.setExtraStackFrame(stack);
    } else {
      ReactDebugCurrentFrame$1.setExtraStackFrame(null);
    }
  }
}

var propTypesMisspellWarningShown;

{
  propTypesMisspellWarningShown = false;
}
/**
 * Verifies the object is a ReactElement.
 * See https://reactjs.org/docs/react-api.html#isvalidelement
 * @param {?object} object
 * @return {boolean} True if `object` is a ReactElement.
 * @final
 */


function isValidElement(object) {
  {
    return typeof object === 'object' && object !== null && object.$$typeof === REACT_ELEMENT_TYPE;
  }
}

function getDeclarationErrorAddendum() {
  {
    if (ReactCurrentOwner$1.current) {
      var name = getComponentNameFromType(ReactCurrentOwner$1.current.type);

      if (name) {
        return '\n\nCheck the render method of `' + name + '`.';
      }
    }

    return '';
  }
}

function getSourceInfoErrorAddendum(source) {
  {
    if (source !== undefined) {
      var fileName = source.fileName.replace(/^.*[\\\/]/, '');
      var lineNumber = source.lineNumber;
      return '\n\nCheck your code at ' + fileName + ':' + lineNumber + '.';
    }

    return '';
  }
}
/**
 * Warn if there's no key explicitly set on dynamic arrays of children or
 * object keys are not valid. This allows us to keep track of children between
 * updates.
 */


var ownerHasKeyUseWarning = {};

function getCurrentComponentErrorInfo(parentType) {
  {
    var info = getDeclarationErrorAddendum();

    if (!info) {
      var parentName = typeof parentType === 'string' ? parentType : parentType.displayName || parentType.name;

      if (parentName) {
        info = "\n\nCheck the top-level render call using <" + parentName + ">.";
      }
    }

    return info;
  }
}
/**
 * Warn if the element doesn't have an explicit key assigned to it.
 * This element is in an array. The array could grow and shrink or be
 * reordered. All children that haven't already been validated are required to
 * have a "key" property assigned to it. Error statuses are cached so a warning
 * will only be shown once.
 *
 * @internal
 * @param {ReactElement} element Element that requires a key.
 * @param {*} parentType element's parent's type.
 */


function validateExplicitKey(element, parentType) {
  {
    if (!element._store || element._store.validated || element.key != null) {
      return;
    }

    element._store.validated = true;
    var currentComponentErrorInfo = getCurrentComponentErrorInfo(parentType);

    if (ownerHasKeyUseWarning[currentComponentErrorInfo]) {
      return;
    }

    ownerHasKeyUseWarning[currentComponentErrorInfo] = true; // Usually the current owner is the offender, but if it accepts children as a
    // property, it may be the creator of the child that's responsible for
    // assigning it a key.

    var childOwner = '';

    if (element && element._owner && element._owner !== ReactCurrentOwner$1.current) {
      // Give the component that originally created this child.
      childOwner = " It was passed a child from " + getComponentNameFromType(element._owner.type) + ".";
    }

    setCurrentlyValidatingElement$1(element);

    error('Each child in a list should have a unique "key" prop.' + '%s%s See https://reactjs.org/link/warning-keys for more information.', currentComponentErrorInfo, childOwner);

    setCurrentlyValidatingElement$1(null);
  }
}
/**
 * Ensure that every element either is passed in a static location, in an
 * array with an explicit keys property defined, or in an object literal
 * with valid key property.
 *
 * @internal
 * @param {ReactNode} node Statically passed child of any type.
 * @param {*} parentType node's parent's type.
 */


function validateChildKeys(node, parentType) {
  {
    if (typeof node !== 'object') {
      return;
    }

    if (isArray(node)) {
      for (var i = 0; i < node.length; i++) {
        var child = node[i];

        if (isValidElement(child)) {
          validateExplicitKey(child, parentType);
        }
      }
    } else if (isValidElement(node)) {
      // This element was passed in a valid location.
      if (node._store) {
        node._store.validated = true;
      }
    } else if (node) {
      var iteratorFn = getIteratorFn(node);

      if (typeof iteratorFn === 'function') {
        // Entry iterators used to provide implicit keys,
        // but now we print a separate warning for them later.
        if (iteratorFn !== node.entries) {
          var iterator = iteratorFn.call(node);
          var step;

          while (!(step = iterator.next()).done) {
            if (isValidElement(step.value)) {
              validateExplicitKey(step.value, parentType);
            }
          }
        }
      }
    }
  }
}
/**
 * Given an element, validate that its props follow the propTypes definition,
 * provided by the type.
 *
 * @param {ReactElement} element
 */


function validatePropTypes(element) {
  {
    var type = element.type;

    if (type === null || type === undefined || typeof type === 'string') {
      return;
    }

    var propTypes;

    if (typeof type === 'function') {
      propTypes = type.propTypes;
    } else if (typeof type === 'object' && (type.$$typeof === REACT_FORWARD_REF_TYPE || // Note: Memo only checks outer props here.
    // Inner props are checked in the reconciler.
    type.$$typeof === REACT_MEMO_TYPE)) {
      propTypes = type.propTypes;
    } else {
      return;
    }

    if (propTypes) {
      // Intentionally inside to avoid triggering lazy initializers:
      var name = getComponentNameFromType(type);
      checkPropTypes(propTypes, element.props, 'prop', name, element);
    } else if (type.PropTypes !== undefined && !propTypesMisspellWarningShown) {
      propTypesMisspellWarningShown = true; // Intentionally inside to avoid triggering lazy initializers:

      var _name = getComponentNameFromType(type);

      error('Component %s declared `PropTypes` instead of `propTypes`. Did you misspell the property assignment?', _name || 'Unknown');
    }

    if (typeof type.getDefaultProps === 'function' && !type.getDefaultProps.isReactClassApproved) {
      error('getDefaultProps is only used on classic React.createClass ' + 'definitions. Use a static property named `defaultProps` instead.');
    }
  }
}
/**
 * Given a fragment, validate that it can only be provided with fragment props
 * @param {ReactElement} fragment
 */


function validateFragmentProps(fragment) {
  {
    var keys = Object.keys(fragment.props);

    for (var i = 0; i < keys.length; i++) {
      var key = keys[i];

      if (key !== 'children' && key !== 'key') {
        setCurrentlyValidatingElement$1(fragment);

        error('Invalid prop `%s` supplied to `React.Fragment`. ' + 'React.Fragment can only have `key` and `children` props.', key);

        setCurrentlyValidatingElement$1(null);
        break;
      }
    }

    if (fragment.ref !== null) {
      setCurrentlyValidatingElement$1(fragment);

      error('Invalid attribute `ref` supplied to `React.Fragment`.');

      setCurrentlyValidatingElement$1(null);
    }
  }
}

var didWarnAboutKeySpread = {};
function jsxWithValidation(type, props, key, isStaticChildren, source, self) {
  {
    var validType = isValidElementType(type); // We warn in this case but don't throw. We expect the element creation to
    // succeed and there will likely be errors in render.

    if (!validType) {
      var info = '';

      if (type === undefined || typeof type === 'object' && type !== null && Object.keys(type).length === 0) {
        info += ' You likely forgot to export your component from the file ' + "it's defined in, or you might have mixed up default and named imports.";
      }

      var sourceInfo = getSourceInfoErrorAddendum(source);

      if (sourceInfo) {
        info += sourceInfo;
      } else {
        info += getDeclarationErrorAddendum();
      }

      var typeString;

      if (type === null) {
        typeString = 'null';
      } else if (isArray(type)) {
        typeString = 'array';
      } else if (type !== undefined && type.$$typeof === REACT_ELEMENT_TYPE) {
        typeString = "<" + (getComponentNameFromType(type.type) || 'Unknown') + " />";
        info = ' Did you accidentally export a JSX literal instead of a component?';
      } else {
        typeString = typeof type;
      }

      error('React.jsx: type is invalid -- expected a string (for ' + 'built-in components) or a class/function (for composite ' + 'components) but got: %s.%s', typeString, info);
    }

    var element = jsxDEV(type, props, key, source, self); // The result can be nullish if a mock or a custom function is used.
    // TODO: Drop this when these are no longer allowed as the type argument.

    if (element == null) {
      return element;
    } // Skip key warning if the type isn't valid since our key validation logic
    // doesn't expect a non-string/function type and can throw confusing errors.
    // We don't want exception behavior to differ between dev and prod.
    // (Rendering will throw with a helpful message and as soon as the type is
    // fixed, the key warnings will appear.)


    if (validType) {
      var children = props.children;

      if (children !== undefined) {
        if (isStaticChildren) {
          if (isArray(children)) {
            for (var i = 0; i < children.length; i++) {
              validateChildKeys(children[i], type);
            }

            if (Object.freeze) {
              Object.freeze(children);
            }
          } else {
            error('React.jsx: Static children should always be an array. ' + 'You are likely explicitly calling React.jsxs or React.jsxDEV. ' + 'Use the Babel transform instead.');
          }
        } else {
          validateChildKeys(children, type);
        }
      }
    }

    {
      if (hasOwnProperty.call(props, 'key')) {
        var componentName = getComponentNameFromType(type);
        var keys = Object.keys(props).filter(function (k) {
          return k !== 'key';
        });
        var beforeExample = keys.length > 0 ? '{key: someKey, ' + keys.join(': ..., ') + ': ...}' : '{key: someKey}';

        if (!didWarnAboutKeySpread[componentName + beforeExample]) {
          var afterExample = keys.length > 0 ? '{' + keys.join(': ..., ') + ': ...}' : '{}';

          error('A props object containing a "key" prop is being spread into JSX:\n' + '  let props = %s;\n' + '  <%s {...props} />\n' + 'React keys must be passed directly to JSX without using spread:\n' + '  let props = %s;\n' + '  <%s key={someKey} {...props} />', beforeExample, componentName, afterExample, componentName);

          didWarnAboutKeySpread[componentName + beforeExample] = true;
        }
      }
    }

    if (type === REACT_FRAGMENT_TYPE) {
      validateFragmentProps(element);
    } else {
      validatePropTypes(element);
    }

    return element;
  }
} // These two functions exist to still get child warnings in dev
// even with the prod transform. This means that jsxDEV is purely
// opt-in behavior for better messages but that we won't stop
// giving you warnings if you use production apis.

function jsxWithValidationStatic(type, props, key) {
  {
    return jsxWithValidation(type, props, key, true);
  }
}
function jsxWithValidationDynamic(type, props, key) {
  {
    return jsxWithValidation(type, props, key, false);
  }
}

var jsx =  jsxWithValidationDynamic ; // we may want to special case jsxs internally to take advantage of static children.
// for now we can ship identical prod functions

var jsxs =  jsxWithValidationStatic ;

exports.Fragment = REACT_FRAGMENT_TYPE;
exports.jsx = jsx;
exports.jsxs = jsxs;
  })();
}


/***/ },

/***/ "./node_modules/react/jsx-runtime.js"
/*!*******************************************!*\
  !*** ./node_modules/react/jsx-runtime.js ***!
  \*******************************************/
(module, __unused_webpack_exports, __webpack_require__) {



if (false) // removed by dead control flow
{} else {
  module.exports = __webpack_require__(/*! ./cjs/react-jsx-runtime.development.js */ "./node_modules/react/cjs/react-jsx-runtime.development.js");
}


/***/ },

/***/ "./src/styles/clausekit.css"
/*!**********************************!*\
  !*** ./src/styles/clausekit.css ***!
  \**********************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/styleDomAPI.js */ "./node_modules/style-loader/dist/runtime/styleDomAPI.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/insertBySelector.js */ "./node_modules/style-loader/dist/runtime/insertBySelector.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js */ "./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/insertStyleElement.js */ "./node_modules/style-loader/dist/runtime/insertStyleElement.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/styleTagTransform.js */ "./node_modules/style-loader/dist/runtime/styleTagTransform.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_clausekit_css__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! !!../../node_modules/css-loader/dist/cjs.js!./clausekit.css */ "./node_modules/css-loader/dist/cjs.js!./src/styles/clausekit.css");

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default());
options.setAttributes = (_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default());
options.insert = _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default().bind(null, "head");
options.domAPI = (_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default());
options.insertStyleElement = (_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default());

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_clausekit_css__WEBPACK_IMPORTED_MODULE_6__["default"], options);




       /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_clausekit_css__WEBPACK_IMPORTED_MODULE_6__["default"] && _node_modules_css_loader_dist_cjs_js_clausekit_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals ? _node_modules_css_loader_dist_cjs_js_clausekit_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals : undefined);


/***/ },

/***/ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js"
/*!****************************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js ***!
  \****************************************************************************/
(module) {



var stylesInDOM = [];
function getIndexByIdentifier(identifier) {
  var result = -1;
  for (var i = 0; i < stylesInDOM.length; i++) {
    if (stylesInDOM[i].identifier === identifier) {
      result = i;
      break;
    }
  }
  return result;
}
function modulesToDom(list, options) {
  var idCountMap = {};
  var identifiers = [];
  for (var i = 0; i < list.length; i++) {
    var item = list[i];
    var id = options.base ? item[0] + options.base : item[0];
    var count = idCountMap[id] || 0;
    var identifier = "".concat(id, " ").concat(count);
    idCountMap[id] = count + 1;
    var indexByIdentifier = getIndexByIdentifier(identifier);
    var obj = {
      css: item[1],
      media: item[2],
      sourceMap: item[3],
      supports: item[4],
      layer: item[5]
    };
    if (indexByIdentifier !== -1) {
      stylesInDOM[indexByIdentifier].references++;
      stylesInDOM[indexByIdentifier].updater(obj);
    } else {
      var updater = addElementStyle(obj, options);
      options.byIndex = i;
      stylesInDOM.splice(i, 0, {
        identifier: identifier,
        updater: updater,
        references: 1
      });
    }
    identifiers.push(identifier);
  }
  return identifiers;
}
function addElementStyle(obj, options) {
  var api = options.domAPI(options);
  api.update(obj);
  var updater = function updater(newObj) {
    if (newObj) {
      if (newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap && newObj.supports === obj.supports && newObj.layer === obj.layer) {
        return;
      }
      api.update(obj = newObj);
    } else {
      api.remove();
    }
  };
  return updater;
}
module.exports = function (list, options) {
  options = options || {};
  list = list || [];
  var lastIdentifiers = modulesToDom(list, options);
  return function update(newList) {
    newList = newList || [];
    for (var i = 0; i < lastIdentifiers.length; i++) {
      var identifier = lastIdentifiers[i];
      var index = getIndexByIdentifier(identifier);
      stylesInDOM[index].references--;
    }
    var newLastIdentifiers = modulesToDom(newList, options);
    for (var _i = 0; _i < lastIdentifiers.length; _i++) {
      var _identifier = lastIdentifiers[_i];
      var _index = getIndexByIdentifier(_identifier);
      if (stylesInDOM[_index].references === 0) {
        stylesInDOM[_index].updater();
        stylesInDOM.splice(_index, 1);
      }
    }
    lastIdentifiers = newLastIdentifiers;
  };
};

/***/ },

/***/ "./node_modules/style-loader/dist/runtime/insertBySelector.js"
/*!********************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/insertBySelector.js ***!
  \********************************************************************/
(module) {



var memo = {};

/* istanbul ignore next  */
function getTarget(target) {
  if (typeof memo[target] === "undefined") {
    var styleTarget = document.querySelector(target);

    // Special case to return head of iframe instead of iframe itself
    if (window.HTMLIFrameElement && styleTarget instanceof window.HTMLIFrameElement) {
      try {
        // This will throw an exception if access to iframe is blocked
        // due to cross-origin restrictions
        styleTarget = styleTarget.contentDocument.head;
      } catch (e) {
        // istanbul ignore next
        styleTarget = null;
      }
    }
    memo[target] = styleTarget;
  }
  return memo[target];
}

/* istanbul ignore next  */
function insertBySelector(insert, style) {
  var target = getTarget(insert);
  if (!target) {
    throw new Error("Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.");
  }
  target.appendChild(style);
}
module.exports = insertBySelector;

/***/ },

/***/ "./node_modules/style-loader/dist/runtime/insertStyleElement.js"
/*!**********************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/insertStyleElement.js ***!
  \**********************************************************************/
(module) {



/* istanbul ignore next  */
function insertStyleElement(options) {
  var element = document.createElement("style");
  options.setAttributes(element, options.attributes);
  options.insert(element, options.options);
  return element;
}
module.exports = insertStyleElement;

/***/ },

/***/ "./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js"
/*!**********************************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js ***!
  \**********************************************************************************/
(module, __unused_webpack_exports, __webpack_require__) {



/* istanbul ignore next  */
function setAttributesWithoutAttributes(styleElement) {
  var nonce =  true ? __webpack_require__.nc : 0;
  if (nonce) {
    styleElement.setAttribute("nonce", nonce);
  }
}
module.exports = setAttributesWithoutAttributes;

/***/ },

/***/ "./node_modules/style-loader/dist/runtime/styleDomAPI.js"
/*!***************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/styleDomAPI.js ***!
  \***************************************************************/
(module) {



/* istanbul ignore next  */
function apply(styleElement, options, obj) {
  var css = "";
  if (obj.supports) {
    css += "@supports (".concat(obj.supports, ") {");
  }
  if (obj.media) {
    css += "@media ".concat(obj.media, " {");
  }
  var needLayer = typeof obj.layer !== "undefined";
  if (needLayer) {
    css += "@layer".concat(obj.layer.length > 0 ? " ".concat(obj.layer) : "", " {");
  }
  css += obj.css;
  if (needLayer) {
    css += "}";
  }
  if (obj.media) {
    css += "}";
  }
  if (obj.supports) {
    css += "}";
  }
  var sourceMap = obj.sourceMap;
  if (sourceMap && typeof btoa !== "undefined") {
    css += "\n/*# sourceMappingURL=data:application/json;base64,".concat(btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))), " */");
  }

  // For old IE
  /* istanbul ignore if  */
  options.styleTagTransform(css, styleElement, options.options);
}
function removeStyleElement(styleElement) {
  // istanbul ignore if
  if (styleElement.parentNode === null) {
    return false;
  }
  styleElement.parentNode.removeChild(styleElement);
}

/* istanbul ignore next  */
function domAPI(options) {
  if (typeof document === "undefined") {
    return {
      update: function update() {},
      remove: function remove() {}
    };
  }
  var styleElement = options.insertStyleElement(options);
  return {
    update: function update(obj) {
      apply(styleElement, options, obj);
    },
    remove: function remove() {
      removeStyleElement(styleElement);
    }
  };
}
module.exports = domAPI;

/***/ },

/***/ "./node_modules/style-loader/dist/runtime/styleTagTransform.js"
/*!*********************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/styleTagTransform.js ***!
  \*********************************************************************/
(module) {



/* istanbul ignore next  */
function styleTagTransform(css, styleElement) {
  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText = css;
  } else {
    while (styleElement.firstChild) {
      styleElement.removeChild(styleElement.firstChild);
    }
    styleElement.appendChild(document.createTextNode(css));
  }
}
module.exports = styleTagTransform;

/***/ },

/***/ "./src/services/DocumentServiceContext.tsx"
/*!*************************************************!*\
  !*** ./src/services/DocumentServiceContext.tsx ***!
  \*************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   DocumentServiceProvider: () => (/* binding */ DocumentServiceProvider),
/* harmony export */   useDocumentService: () => (/* binding */ useDocumentService)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-runtime */ "./node_modules/react/jsx-runtime.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);


/**
 * React context carrying the active {@link DocumentService}. Defaults to `null`
 * so {@link useDocumentService} can detect use outside a provider. The concrete
 * implementation (mock or real Word) is injected by whoever mounts the tree —
 * the playground supplies the mock, the add-in supplies the Word one.
 */
const DocumentServiceContext = (0,react__WEBPACK_IMPORTED_MODULE_1__.createContext)(null);
/** Provides a {@link DocumentService} to everything beneath it. */
function DocumentServiceProvider({ service, children }) {
    return (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(DocumentServiceContext.Provider, { value: service, children: children });
}
/**
 * Consumes the injected {@link DocumentService}.
 *
 * @throws if called outside a {@link DocumentServiceProvider}, so a missing
 * implementation fails loudly at the point of use rather than silently no-op'ing.
 */
function useDocumentService() {
    const service = (0,react__WEBPACK_IMPORTED_MODULE_1__.useContext)(DocumentServiceContext);
    if (!service) {
        throw new Error("useDocumentService must be used within a <DocumentServiceProvider>. " +
            "Wrap the app in a provider with a mock or Word DocumentService.");
    }
    return service;
}


/***/ },

/***/ "./src/taskpane/components/ActionCard.tsx"
/*!************************************************!*\
  !*** ./src/taskpane/components/ActionCard.tsx ***!
  \************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ ActionCard)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-runtime */ "./node_modules/react/jsx-runtime.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _services__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../services */ "./src/services/index.ts");



/**
 * Renders a single model-proposed redline and applies it as a tracked change
 * through the DocumentService seam. Driven entirely by the `edit` prop — no
 * hardcoded content.
 */
function ActionCard({ edit }) {
    const service = (0,_services__WEBPACK_IMPORTED_MODULE_2__.useDocumentService)();
    const [state, setState] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)("idle");
    const [errorMsg, setErrorMsg] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)("");
    const [dismissed, setDismissed] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(false);
    if (dismissed)
        return null;
    const handleApply = async () => {
        setState("applying");
        setErrorMsg("");
        try {
            const result = await service.applyTrackedChange(edit);
            switch (result.status) {
                case "applied":
                    setState("applied");
                    await service.scrollTo({ clauseRef: result.clauseRef ?? edit.clauseRef });
                    break;
                case "not-found":
                    setState("error");
                    setErrorMsg(`Couldn't find the original text in ${edit.clauseRef} to redline.`);
                    break;
                case "ambiguous":
                    setState("error");
                    setErrorMsg(`Found ${result.matchCount} matches in ${edit.clauseRef}; can't redline unambiguously.`);
                    break;
            }
        }
        catch (err) {
            setState("error");
            setErrorMsg(err instanceof Error ? err.message : "Failed to apply the change.");
        }
    };
    const applyLabel = state === "applying" ? "Applying…" : state === "error" ? "Retry" : "Apply Change";
    return ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: `ck-action sev-${edit.severity}`, children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "a-head", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "a-badge", children: "Suggested edit" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "a-clause", children: edit.clauseRef }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: `a-sev sev-${edit.severity}`, children: edit.severity })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "a-body", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { className: "a-desc", children: edit.rationale }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "ck-diff", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "d-line d-del", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "t", children: edit.originalText }) }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "d-line d-add", children: edit.proposedText })] }), state === "error" && (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { className: "a-error", children: errorMsg })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "a-foot", children: [state === "applied" ? ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("button", { className: "ck-btn applied", disabled: true, children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "chk" }), " Applied to document"] })) : ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("button", { className: "ck-btn primary", onClick: handleApply, disabled: state === "applying", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "chk" }), " ", applyLabel] })), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "spacer" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button", { className: "ck-btn danger-ghost", onClick: () => setDismissed(true), children: "Dismiss" })] })] }));
}


/***/ },

/***/ "./src/taskpane/components/App.tsx"
/*!*****************************************!*\
  !*** ./src/taskpane/components/App.tsx ***!
  \*****************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ App)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-runtime */ "./node_modules/react/jsx-runtime.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _CKHeader__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./CKHeader */ "./src/taskpane/components/CKHeader.tsx");
/* harmony import */ var _EmptyState__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./EmptyState */ "./src/taskpane/components/EmptyState.tsx");
/* harmony import */ var _ChatPane__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./ChatPane */ "./src/taskpane/components/ChatPane.tsx");
/* harmony import */ var _ChatInput__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./ChatInput */ "./src/taskpane/components/ChatInput.tsx");
/* harmony import */ var _Simulator__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./Simulator */ "./src/taskpane/components/Simulator.tsx");
/* harmony import */ var _useChat__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./useChat */ "./src/taskpane/components/useChat.ts");
/* harmony import */ var _useNegotiate__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./useNegotiate */ "./src/taskpane/components/useNegotiate.ts");









function App({ showHeader = true }) {
    const [mode, setMode] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)("ask");
    const [theme, setTheme] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)("light");
    const chat = (0,_useChat__WEBPACK_IMPORTED_MODULE_7__.useChat)();
    const negotiate = (0,_useNegotiate__WEBPACK_IMPORTED_MODULE_8__.useNegotiate)();
    const chatOpen = chat.messages.length > 0;
    return ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "ck-pane", "data-theme": theme, children: [showHeader && ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_CKHeader__WEBPACK_IMPORTED_MODULE_2__["default"], { theme: theme, onToggleTheme: () => setTheme((t) => (t === "light" ? "dark" : "light")) })), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "ck-tabs", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button", { className: `ck-tab${mode === "ask" ? " on" : ""}`, onClick: () => setMode("ask"), children: "Ask" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button", { className: `ck-tab${mode === "simulator" ? " on" : ""}`, onClick: () => setMode("simulator"), children: "Simulator" })] }), mode === "ask" ? ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.Fragment, { children: [chatOpen ? ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_ChatPane__WEBPACK_IMPORTED_MODULE_4__["default"], { messages: chat.messages, loading: chat.loading, error: chat.error, onRetry: chat.retry })) : ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_EmptyState__WEBPACK_IMPORTED_MODULE_3__["default"], { onPrompt: chat.send })), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_ChatInput__WEBPACK_IMPORTED_MODULE_5__["default"], { onSend: chat.send, chatOpen: chatOpen, disabled: chat.loading })] })) : ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_Simulator__WEBPACK_IMPORTED_MODULE_6__["default"], { ...negotiate }))] }));
}


/***/ },

/***/ "./src/taskpane/components/CKHeader.tsx"
/*!**********************************************!*\
  !*** ./src/taskpane/components/CKHeader.tsx ***!
  \**********************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ CKHeader)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-runtime */ "./node_modules/react/jsx-runtime.js");

function CKHeader({ theme, onToggleTheme }) {
    const nextTheme = theme === "light" ? "dark" : "light";
    return ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "ck-header", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "h-txt", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "h-name", children: "ClauseKit" }) }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "h-actions", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button", { className: "ck-theme-btn", onClick: onToggleTheme, "aria-label": `Switch to ${nextTheme} mode`, title: `Switch to ${nextTheme} mode`, style: { display: "none" }, children: theme === "light" ? (
                    // Moon — click to go dark
                    (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("svg", { viewBox: "0 0 24 24", width: "12", height: "12", "aria-hidden": "true", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("path", { d: "M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z", fill: "none", stroke: "currentColor", strokeWidth: "1.8", strokeLinecap: "round", strokeLinejoin: "round" }) })) : (
                    // Sun — click to go light
                    (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("svg", { viewBox: "0 0 24 24", width: "12", height: "12", "aria-hidden": "true", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("circle", { cx: "12", cy: "12", r: "4", fill: "none", stroke: "currentColor", strokeWidth: "1.8" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("path", { d: "M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M19.1 4.9l-1.4 1.4M6.3 17.7l-1.4 1.4", fill: "none", stroke: "currentColor", strokeWidth: "1.8", strokeLinecap: "round" })] })) }) })] }));
}


/***/ },

/***/ "./src/taskpane/components/ChatInput.tsx"
/*!***********************************************!*\
  !*** ./src/taskpane/components/ChatInput.tsx ***!
  \***********************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ ChatInput)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-runtime */ "./node_modules/react/jsx-runtime.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);


const MIN_HEIGHT = 40;
const MAX_HEIGHT = 240;
const DEFAULT_HEIGHT = 40;
function ChatInput({ onSend, chatOpen, disabled = false }) {
    const [value, setValue] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)("");
    const [height, setHeight] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(DEFAULT_HEIGHT);
    const textareaRef = (0,react__WEBPACK_IMPORTED_MODULE_1__.useRef)(null);
    const handleSend = () => {
        const trimmed = value.trim();
        if (!trimmed || disabled)
            return;
        onSend(trimmed);
        setValue("");
    };
    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };
    const handleResizeStart = (e) => {
        e.preventDefault();
        const startY = e.clientY;
        const startHeight = height;
        const handle = e.currentTarget;
        handle.setPointerCapture(e.pointerId);
        const onMove = (ev) => {
            // Drag up grows the box, drag down shrinks it.
            const next = startHeight + (startY - ev.clientY);
            setHeight(Math.min(MAX_HEIGHT, Math.max(MIN_HEIGHT, next)));
        };
        const onUp = (ev) => {
            handle.releasePointerCapture(ev.pointerId);
            handle.removeEventListener("pointermove", onMove);
            handle.removeEventListener("pointerup", onUp);
        };
        handle.addEventListener("pointermove", onMove);
        handle.addEventListener("pointerup", onUp);
    };
    const canSend = value.trim().length > 0 && !disabled;
    return ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.Fragment, { children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "ck-input-wrap", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "ck-input-resize", onPointerDown: handleResizeStart, role: "separator", "aria-orientation": "horizontal", "aria-label": "Resize input", title: "Drag to resize", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "ck-input-grip" }) }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "ck-input", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("textarea", { ref: textareaRef, placeholder: chatOpen ? "Ask a follow-up…" : "Ask about this contract…", value: value, onChange: (e) => setValue(e.target.value), onKeyDown: handleKeyDown, style: { height } }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button", { className: `ck-send${canSend ? "" : " disabled"}`, onClick: handleSend, disabled: !canSend, "aria-label": "Send", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("svg", { viewBox: "0 0 24 24", width: "17", height: "17", "aria-hidden": "true", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("path", { d: "M12 19V6M12 6l-6 6M12 6l6 6", fill: "none", stroke: "currentColor", strokeWidth: "2.2", strokeLinecap: "round", strokeLinejoin: "round" }) }) })] })] }) }));
}


/***/ },

/***/ "./src/taskpane/components/ChatPane.tsx"
/*!**********************************************!*\
  !*** ./src/taskpane/components/ChatPane.tsx ***!
  \**********************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ ChatPane)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-runtime */ "./node_modules/react/jsx-runtime.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _services__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../services */ "./src/services/index.ts");
/* harmony import */ var _ActionCard__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./ActionCard */ "./src/taskpane/components/ActionCard.tsx");




/** Minimal inline rendering: **bold** spans, with line breaks preserved as
 *  separate paragraphs so lists in the model's answer stay readable. */
function renderContent(text) {
    return text.split("\n").map((line, lineIdx) => {
        if (line.trim() === "")
            return (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "ck-gap" }, lineIdx);
        const parts = line.split(/(\*\*[^*]+\*\*)/g).filter(Boolean);
        return ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { children: parts.map((part, i) => part.startsWith("**") && part.endsWith("**") ? ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("strong", { children: part.slice(2, -2) }, i)) : ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { children: part }, i))) }, lineIdx));
    });
}
function ChatPane({ messages, loading, error, onRetry }) {
    const ref = (0,react__WEBPACK_IMPORTED_MODULE_1__.useRef)(null);
    const service = (0,_services__WEBPACK_IMPORTED_MODULE_2__.useDocumentService)();
    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(() => {
        if (ref.current)
            ref.current.scrollTop = ref.current.scrollHeight;
    }, [messages, loading, error]);
    // Jump to a cited clause; no-op gracefully if it can't be located.
    const handleJump = (clauseRef) => {
        void service.scrollTo({ clauseRef });
    };
    return ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "ck-chat", ref: ref, children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "ck-daydiv", children: "Today" }), messages.map((m, i) => m.role === "user" ? ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "ck-row user", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "ck-bubble user", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { children: m.content }) }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "ck-time", children: "Just now" })] }) }, i)) : ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "ck-row", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "ck-avatar", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("img", { src: "assets/ck-mark.svg", alt: "ClauseKit" }) }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { style: { flex: 1, minWidth: 0 }, children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "ck-bubble ai", children: renderContent(m.content) }), m.citations && m.citations.length > 0 && ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "ck-cites", children: m.citations.map((ref) => ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("button", { className: "ck-cite", onClick: () => handleJump(ref), children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "pin" }), "Jump to ", ref, (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "cite-arr", children: "\u203A" })] }, ref))) })), m.edit && ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "ck-action-wrap", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_ActionCard__WEBPACK_IMPORTED_MODULE_3__["default"], { edit: m.edit }) })), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "ck-time", children: "Just now" })] })] }, i))), loading && ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "ck-row ck-thinking", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "ck-avatar", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("img", { src: "assets/ck-mark.svg", alt: "ClauseKit" }) }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "t-bubble", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("i", {}), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("i", {}), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("i", {})] })] })), error && ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "ck-row", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "ck-avatar", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("img", { src: "assets/ck-mark.svg", alt: "ClauseKit" }) }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { style: { flex: 1, minWidth: 0 }, children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "ck-error-bubble", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { children: error }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button", { className: "ck-retry", onClick: onRetry, children: "Retry" })] }) })] }))] }));
}


/***/ },

/***/ "./src/taskpane/components/EmptyState.tsx"
/*!************************************************!*\
  !*** ./src/taskpane/components/EmptyState.tsx ***!
  \************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ EmptyState)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-runtime */ "./node_modules/react/jsx-runtime.js");

const PROMPTS = [
    "Is the 5% rent escalation off-market?",
    "Are the tenant's repair obligations standard?",
    "Is the personal guaranty unusual?",
];
function EmptyState({ onPrompt }) {
    return ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "ck-empty", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { className: "e-sub", children: "Ask anything about this contract or pick a starting point below." }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "ck-suggest", children: PROMPTS.map((p) => ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("button", { className: "s-btn", onClick: () => onPrompt(p), children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "s-txt", children: p }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "s-ar", children: "\u203A" })] }, p))) })] }));
}


/***/ },

/***/ "./src/taskpane/components/Simulator.tsx"
/*!***********************************************!*\
  !*** ./src/taskpane/components/Simulator.tsx ***!
  \***********************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Simulator)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-runtime */ "./node_modules/react/jsx-runtime.js");
/* harmony import */ var _TermCard__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./TermCard */ "./src/taskpane/components/TermCard.tsx");


function Simulator({ side, setSide, terms, headings, loading, error, run, ranSide, }) {
    return ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "ck-sim", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "sim-setup", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { className: "sim-title", children: "Negotiation Simulator" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { className: "sim-sub", children: "Pick your side:" })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "sim-side", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "sim-side-label", children: "I represent the" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "sim-toggle", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button", { className: `sim-seg${side === "tenant" ? " on" : ""}`, onClick: () => setSide("tenant"), disabled: loading, children: "Tenant" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button", { className: `sim-seg${side === "landlord" ? " on" : ""}`, onClick: () => setSide("landlord"), disabled: loading, children: "Landlord" })] })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button", { className: "ck-btn primary sim-run", onClick: run, disabled: loading, children: loading ? "War-gaming the lease…" : terms ? "Re-run war-game" : "War-game the lease" })] }), loading && ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "sim-loading", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "t-bubble", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("i", {}), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("i", {}), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("i", {})] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "sim-loading-text", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("span", { children: ["War-gaming the lease as the ", side, "\u2026"] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "sim-loading-hint", children: "This takes ~30 seconds \u2014 analyzing every term from both sides." })] })] })), error && !loading && ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "ck-error-bubble sim-error", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { children: error }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button", { className: "ck-retry", onClick: run, children: "Retry" })] })), !loading && !error && terms && terms.length === 0 && ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("p", { className: "sim-empty", children: ["No off-market terms surfaced for the ", ranSide, ". Try the other side."] })), !loading && terms && terms.length > 0 && ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "sim-brief", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("p", { className: "sim-count", children: [terms.length, " term", terms.length > 1 ? "s" : "", " to negotiate as the ", ranSide] }), terms.map((term, i) => ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_TermCard__WEBPACK_IMPORTED_MODULE_1__["default"], { term: term, heading: headings[term.clauseRef], side: ranSide ?? side }, i)))] })), !loading && !error && !terms && ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "sim-placeholder", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { children: "Run the war-game to see your fallback ladders and the counterparty's likely pushback." }) }))] }));
}


/***/ },

/***/ "./src/taskpane/components/TermCard.tsx"
/*!**********************************************!*\
  !*** ./src/taskpane/components/TermCard.tsx ***!
  \**********************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ TermCard)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-runtime */ "./node_modules/react/jsx-runtime.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _services__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../services */ "./src/services/index.ts");



const TIER_LABELS = { ideal: "Ideal", market: "Market", floor: "Floor" };
function TermCard({ term, heading, side }) {
    const service = (0,_services__WEBPACK_IMPORTED_MODULE_2__.useDocumentService)();
    const [appliedTier, setAppliedTier] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(null);
    const [pendingTier, setPendingTier] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(null);
    const [error, setError] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(null);
    const counterpartyName = side === "tenant" ? "landlord" : "tenant";
    const applyRung = async (rung) => {
        setPendingTier(rung.tier);
        setError(null);
        try {
            const edit = {
                clauseRef: term.clauseRef,
                originalText: term.currentText,
                proposedText: rung.proposedText,
                rationale: rung.rationale,
                severity: "high",
            };
            const result = await service.applyTrackedChange(edit);
            switch (result.status) {
                case "applied":
                    setAppliedTier(rung.tier);
                    await service.scrollTo({ clauseRef: result.clauseRef ?? term.clauseRef });
                    break;
                case "not-found":
                    setError(`Couldn't find the ${term.clauseRef} language to redline` +
                        (appliedTier ? " — a position was already applied here." : "."));
                    break;
                case "ambiguous":
                    setError(`Found ${result.matchCount} matches in ${term.clauseRef}; can't redline unambiguously.`);
                    break;
            }
        }
        catch (e) {
            setError(e instanceof Error ? e.message : "Failed to apply the change.");
        }
        finally {
            setPendingTier(null);
        }
    };
    return ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "sim-card", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "sim-card-head", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "sim-ref", children: term.clauseRef }), heading && (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "sim-heading", children: heading }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("span", { className: `sim-favors ${term.favoredParty}`, children: ["favors ", term.favoredParty] })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("details", { className: "sim-current", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("summary", { children: "Current language" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { className: "sim-current-text", children: term.currentText })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "sim-ladder", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "sim-ladder-label", children: "Your fallback ladder" }), term.yourLadder.map((rung) => {
                        const isApplied = appliedTier === rung.tier;
                        const isPending = pendingTier === rung.tier;
                        const otherApplied = appliedTier !== null && !isApplied;
                        return ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: `sim-rung tier-${rung.tier}${isApplied ? " applied" : ""}`, children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "sim-tier", children: TIER_LABELS[rung.tier] ?? rung.tier }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { className: "sim-rung-text", children: rung.proposedText }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { className: "sim-rung-rat", children: rung.rationale }), isApplied ? ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("button", { className: "ck-btn applied sim-apply", disabled: true, children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "chk" }), " Applied"] })) : ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button", { className: "ck-btn primary sim-apply", onClick: () => applyRung(rung), disabled: isPending || otherApplied, children: isPending ? "Applying…" : "Apply this position" }))] }, rung.tier));
                    }), error && (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { className: "a-error", children: error })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "sim-counter", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "sim-counter-head", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "sim-counter-icon" }), "How the ", counterpartyName, " fights back"] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { className: "sim-counter-pred", children: term.counterparty.predictedCounter }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { className: "sim-counter-arg", children: term.counterparty.argument })] })] }));
}


/***/ },

/***/ "./src/taskpane/index.tsx"
/*!********************************!*\
  !*** ./src/taskpane/index.tsx ***!
  \********************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-runtime */ "./node_modules/react/jsx-runtime.js");
/* harmony import */ var react_dom_client__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-dom/client */ "./node_modules/react-dom/client.js");
/* harmony import */ var _components_App__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./components/App */ "./src/taskpane/components/App.tsx");
/* harmony import */ var _services__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../services */ "./src/services/index.ts");
/* harmony import */ var _services_office_OfficeDocumentService__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../services/office/OfficeDocumentService */ "./src/services/office/OfficeDocumentService.ts");
/* harmony import */ var _styles_clausekit_css__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../styles/clausekit.css */ "./src/styles/clausekit.css");






/* global document, Office, module, require, HTMLElement */
const title = "ClauseKit";
// Real Word integration: read/edit the live document via Word.run. The playground
// injects the mock instead; the StubDocumentService remains for pane-only testing.
const documentService = new _services_office_OfficeDocumentService__WEBPACK_IMPORTED_MODULE_4__.OfficeDocumentService();
const rootElement = document.getElementById("container");
const root = rootElement ? (0,react_dom_client__WEBPACK_IMPORTED_MODULE_1__.createRoot)(rootElement) : undefined;
Office.onReady((info) => {
    root?.render((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_services__WEBPACK_IMPORTED_MODULE_3__.DocumentServiceProvider, { service: documentService, children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components_App__WEBPACK_IMPORTED_MODULE_2__["default"], { title: title, showHeader: false }) }));
    // After the user opens ClauseKit once, keep it open on this document — it
    // re-opens automatically on subsequent opens. Requires the shared runtime
    // (declared in the manifest); guarded to Word and to API availability so it's
    // a safe no-op elsewhere (e.g. if the shared runtime isn't present).
    if (info.host === Office.HostType.Word && Office.addin?.setStartupBehavior) {
        Office.addin.setStartupBehavior(Office.StartupBehavior.load).catch(() => {
            /* shared runtime unavailable — ignore */
        });
    }
});
if (false) // removed by dead control flow
{}


/***/ }

},
/******/ __webpack_require__ => { // webpackRuntimeModules
/******/ var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
/******/ var __webpack_exports__ = (__webpack_exec__("./src/taskpane/index.tsx"), __webpack_exec__("./src/taskpane/taskpane.html"));
/******/ }
]);
//# sourceMappingURL=taskpane.js.map