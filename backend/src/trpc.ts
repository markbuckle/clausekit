import { initTRPC } from "@trpc/server";
import type * as express from "express";

/**
 * tRPC initialization. The context carries the Express request/response so
 * procedures could read headers etc.; CORS, rate limiting, and the spend guard
 * stay as Express middleware mounted ahead of the adapter (see index.ts).
 */
export interface TrpcContext {
  req: express.Request;
  res: express.Response;
}

const t = initTRPC.context<TrpcContext>().create();

export const router = t.router;
export const publicProcedure = t.procedure;
