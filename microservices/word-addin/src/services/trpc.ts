import { createTRPCClient, httpLink } from "@trpc/client";
// Type-only import: no backend code ships in the bundle, only the AppRouter type crosses the boundary. Rename a field in backend/src/schemas.ts and the client below fails to compile instead of breaking at runtime.
import type { AppRouter } from "../../../../backend/src/router";
import { API_BASE_URL } from "../config";

// httpLink (not httpBatchLink) on purpose: each procedure gets its own /trpc/<name> URL, which is what the backend's per-procedure Express rate limiters and spend guard match on.
export const trpc = createTRPCClient<AppRouter>({
  links: [httpLink({ url: `${API_BASE_URL}/trpc` })],
});
