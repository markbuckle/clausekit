import type { ApplyResult, SuggestedEdit } from "../types";
import type { LeaseClause } from "../../fixtures/lease";
import { LEASE_TITLE, leaseRecitals, leaseClauses } from "../../fixtures/lease";

// A run within a clause: either unchanged `text`, or a tracked `change` holding the struck `original` and the inserted `proposed`.
export type Segment =
  | { kind: "text"; text: string }
  | { kind: "change"; original: string; proposed: string };

// A clause in the mutable working copy.
export interface WorkingClause {
  ref: string;
  heading: string;
  segments: Segment[];
}

// Stable DOM id for a clause in the canvas, shared by the canvas renderer and the mock service's scrollTo so they agree on element ids.
export function clauseDomId(ref: string): string {
  return `clause-${ref}`;
}

type Listener = () => void;

// Observable working copy of the lease. Initialized from the immutable fixture, which is never mutated; records applied tracked-changes and notifies subscribers so the canvas can re-render. Pure data plus subscriptions, no DOM.
export class DocumentModel {
  private clauses: WorkingClause[];
  private listeners = new Set<Listener>();

  constructor(source: LeaseClause[] = leaseClauses) {
    this.clauses = source.map((c) => ({
      ref: c.ref,
      heading: c.heading,
      segments: [{ kind: "text", text: c.text }],
    }));
  }

  // Subscribe to change notifications; returns an unsubscribe fn.
  subscribe = (listener: Listener): (() => void) => {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  };

  // Current working clauses. Reference changes only when the model mutates.
  getSnapshot = (): WorkingClause[] => this.clauses;

  private notify(): void {
    this.listeners.forEach((l) => l());
  }

  private clauseText(c: WorkingClause): string {
    return c.segments.map((s) => (s.kind === "text" ? s.text : s.proposed)).join("");
  }

  // Full document text, reflecting applied changes (proposed text wins).
  getFullText(): string {
    const body = this.clauses
      .map((c) => `${c.ref}. ${c.heading}\n\n${this.clauseText(c)}`)
      .join("\n\n");
    return `${LEASE_TITLE}\n\n${leaseRecitals}\n\n${body}\n`;
  }

  // Applies a tracked change: searches for `edit.originalText` scoped to the clause named by `edit.clauseRef`, and only within still-unchanged text runs. Exactly one match records the change; zero is not-found; more than one is ambiguous.
  applyChange(edit: SuggestedEdit): ApplyResult {
    const idx = this.clauses.findIndex((c) => c.ref === edit.clauseRef);
    if (idx === -1) return { status: "not-found", searchedText: edit.originalText };

    const clause = this.clauses[idx];
    const hits: Array<{ segIndex: number; offset: number }> = [];
    clause.segments.forEach((seg, si) => {
      if (seg.kind !== "text" || edit.originalText.length === 0) return;
      let pos = seg.text.indexOf(edit.originalText);
      while (pos !== -1) {
        hits.push({ segIndex: si, offset: pos });
        pos = seg.text.indexOf(edit.originalText, pos + edit.originalText.length);
      }
    });

    if (hits.length === 0) return { status: "not-found", searchedText: edit.originalText };
    if (hits.length > 1) return { status: "ambiguous", matchCount: hits.length };

    const { segIndex, offset } = hits[0];
    const target = clause.segments[segIndex] as { kind: "text"; text: string };
    const before = target.text.slice(0, offset);
    const after = target.text.slice(offset + edit.originalText.length);

    const segments: Segment[] = [];
    clause.segments.forEach((s, si) => {
      if (si !== segIndex) {
        segments.push(s);
        return;
      }
      if (before) segments.push({ kind: "text", text: before });
      segments.push({ kind: "change", original: edit.originalText, proposed: edit.proposedText });
      if (after) segments.push({ kind: "text", text: after });
    });

    const updated: WorkingClause = { ...clause, segments };
    this.clauses = this.clauses.map((c, i) => (i === idx ? updated : c));
    this.notify();
    return { status: "applied", clauseRef: edit.clauseRef };
  }
}
