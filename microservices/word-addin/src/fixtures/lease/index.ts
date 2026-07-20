// Seeded commercial-lease fixture: prose (document.ts) is the genuine LLM input; the sidecar (metadata.ts) is reference plus the simulator's pre-wired ladders.
export type { LeaseClause, FavoredParty, FallbackRung, ContestedClause } from "./types";
export { LEASE_TITLE, leaseRecitals, leaseClauses, getClauseByRef, getLeaseFullText } from "./document";
export { contestedClauses, contestedRefs, getContestedClause } from "./metadata";
