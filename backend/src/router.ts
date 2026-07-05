import { TRPCError } from "@trpc/server";
import { router, publicProcedure } from "./trpc";
import {
  askInputSchema,
  askOutputSchema,
  negotiateInputSchema,
  negotiateOutputSchema,
} from "./schemas";
import { runAsk, runNegotiate, ModelCallError } from "./handlers";

/** Map a handler failure to a TRPCError whose message is safe to show users. */
function toTrpcError(err: unknown, fallback: string): TRPCError {
  if (err instanceof ModelCallError) {
    return new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: err.message });
  }
  return new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: fallback });
}

/**
 * The ClauseKit API as typed procedures. Input AND output are zod-validated,
 * and the word-addin's tRPC client infers its call signatures from AppRouter —
 * one source of truth for the wire contract. Both procedures are mutations
 * (each call spends LLM tokens; neither is idempotent or cacheable).
 */
export const appRouter = router({
  /** Contract-review Q&A grounded in the document. */
  ask: publicProcedure
    .input(askInputSchema)
    .output(askOutputSchema)
    .mutation(async ({ input }) => {
      try {
        return await runAsk(input);
      } catch (err) {
        throw toTrpcError(err, "Failed to get an answer from the model.");
      }
    }),

  /** Negotiation Simulator: off-market terms + fallback ladders for one side. */
  negotiate: publicProcedure
    .input(negotiateInputSchema)
    .output(negotiateOutputSchema)
    .mutation(async ({ input }) => {
      try {
        return await runNegotiate(input);
      } catch (err) {
        throw toTrpcError(err, "Failed to build the negotiation brief.");
      }
    }),
});

export type AppRouter = typeof appRouter;
