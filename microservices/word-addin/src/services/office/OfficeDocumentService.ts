import type { DocumentService } from "../DocumentService";
import type { ApplyResult, ScrollTarget, Selection, SuggestedEdit } from "../types";

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

const SEARCH_OPTS: Word.SearchOptions | { matchCase: boolean; ignorePunct: boolean } = {
  matchCase: true,
  ignorePunct: false,
};

type Located =
  | { status: "one"; range: Word.Range }
  | { status: "none" }
  | { status: "many"; count: number };

export class OfficeDocumentService implements DocumentService {
  async getFullText(): Promise<string> {
    return Word.run(async (context) => {
      const body = context.document.body;
      body.load("text");
      await context.sync();
      return body.text;
    });
  }

  async getSelection(): Promise<Selection | null> {
    return Word.run(async (context) => {
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
      const paraText = paragraphs.items.map((p) => p.text).join(" ");
      const at = paraText.indexOf(text);
      if (at !== -1) {
        contextBefore = paraText.slice(Math.max(0, at - CONTEXT_CHARS), at);
        contextAfter = paraText.slice(at + text.length, at + text.length + CONTEXT_CHARS);
      }
      return { text, contextBefore, contextAfter };
    });
  }

  async applyTrackedChange(edit: SuggestedEdit): Promise<ApplyResult> {
    return Word.run(async (context) => {
      // Make the replacement a real, reviewable tracked change.
      context.document.changeTrackingMode = Word.ChangeTrackingMode.trackAll;

      const located = await locate(context, edit.originalText);
      if (located.status === "none") {
        return { status: "not-found", searchedText: edit.originalText };
      }
      if (located.status === "many") {
        return { status: "ambiguous", matchCount: located.count };
      }

      located.range.insertText(edit.proposedText, Word.InsertLocation.replace);
      await context.sync();
      return { status: "applied", clauseRef: edit.clauseRef };
    });
  }

  async scrollTo(target: ScrollTarget): Promise<boolean> {
    return Word.run(async (context) => {
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
async function locate(context: Word.RequestContext, needle: string): Promise<Located> {
  const body = context.document.body;

  if (needle.length <= SEARCH_MAX) {
    const results = body.search(needle, SEARCH_OPTS as Word.SearchOptions);
    results.load("items");
    await context.sync();
    if (results.items.length === 1) return { status: "one", range: results.items[0] };
    if (results.items.length > 1) return { status: "many", count: results.items.length };
    // 0 results — could be a punctuation quirk; fall through to text-based locate.
  }

  body.load("text");
  await context.sync();
  const text = body.text;

  const first = text.indexOf(needle);
  if (first === -1) return { status: "none" };
  // Count occurrences to detect ambiguity from the real text (no search quirks).
  let count = 0;
  for (let i = first; i !== -1; i = text.indexOf(needle, i + needle.length)) count++;
  if (count > 1) return { status: "many", count };

  // Exactly one occurrence: resolve it to a Range via prefix/suffix anchors that
  // are short enough for body.search, then expand between them.
  const range = await resolveByAnchors(context, needle);
  // If we can't safely resolve a range, treat as not-found rather than risk
  // editing the wrong span.
  return range ? { status: "one", range } : { status: "none" };
}

/** First match range for `needle` (uniqueness not required) — used for scrolling. */
async function findFirst(context: Word.RequestContext, needle: string): Promise<Word.Range | null> {
  const body = context.document.body;
  const query = needle.length <= SEARCH_MAX ? needle : clampAnchor(needle, "start");
  const results = body.search(query, SEARCH_OPTS as Word.SearchOptions);
  results.load("items");
  await context.sync();
  return results.items.length > 0 ? results.items[0] : null;
}

/**
 * Build a Range spanning `needle` by searching for its start and end anchors
 * (each within the search cap) and expanding between them. Verifies the expanded
 * range's text matches before returning, so a mismatch resolves to null.
 */
async function resolveByAnchors(
  context: Word.RequestContext,
  needle: string
): Promise<Word.Range | null> {
  const body = context.document.body;
  const prefix = clampAnchor(needle, "start");
  const suffix = clampAnchor(needle, "end");

  const pre = body.search(prefix, SEARCH_OPTS as Word.SearchOptions);
  const suf = body.search(suffix, SEARCH_OPTS as Word.SearchOptions);
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
function clampAnchor(s: string, which: "start" | "end"): string {
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
