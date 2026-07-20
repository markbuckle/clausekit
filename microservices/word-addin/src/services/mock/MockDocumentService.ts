import type { DocumentService } from "../DocumentService";
import type { ApplyResult, ScrollTarget, Selection, SuggestedEdit } from "../types";
import { DocumentModel, clauseDomId } from "./documentModel";

const FLASH_CLASS = "pg-flash";
const FLASH_MS = 1200;
const CONTEXT_CHARS = 40;

// In-browser DocumentService backed by a DocumentModel. Text operations delegate to the model; selection and scrolling read/drive the live canvas DOM, which is fine here since this is the mock used by the playground and tests, not the real Word host.
export class MockDocumentService implements DocumentService {
  constructor(private readonly model: DocumentModel) {}

  async getFullText(): Promise<string> {
    return this.model.getFullText();
  }

  async getSelection(): Promise<Selection | null> {
    if (typeof window === "undefined") return null;
    const sel = window.getSelection();
    if (!sel || sel.isCollapsed || sel.rangeCount === 0) return null;
    const text = sel.toString();
    if (!text.trim()) return null;

    let contextBefore = "";
    let contextAfter = "";
    const container = sel.anchorNode?.parentElement?.closest(
      ".pg-clause-text, .pg-recitals, .pg-doc"
    );
    const full = container?.textContent ?? "";
    const at = full.indexOf(text);
    if (at !== -1) {
      contextBefore = full.slice(Math.max(0, at - CONTEXT_CHARS), at);
      contextAfter = full.slice(at + text.length, at + text.length + CONTEXT_CHARS);
    }
    return { text, contextBefore, contextAfter };
  }

  async applyTrackedChange(edit: SuggestedEdit): Promise<ApplyResult> {
    return this.model.applyChange(edit);
  }

  async scrollTo(target: ScrollTarget): Promise<boolean> {
    if (typeof document === "undefined") return false;
    const el = "clauseRef" in target ? this.byRef(target.clauseRef) : this.byText(target.text);
    if (!el) return false;
    el.scrollIntoView({ behavior: "smooth", block: "center" });
    el.classList.add(FLASH_CLASS);
    window.setTimeout(() => el.classList.remove(FLASH_CLASS), FLASH_MS);
    return true;
  }

  private byRef(ref: string): HTMLElement | null {
    return document.getElementById(clauseDomId(ref));
  }

  private byText(text: string): HTMLElement | null {
    const clauses = Array.from(document.querySelectorAll<HTMLElement>(".pg-clause"));
    return clauses.find((c) => (c.textContent ?? "").includes(text)) ?? null;
  }
}
