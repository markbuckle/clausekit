import { initTRPC } from "@trpc/server";
import type * as express from "express";

// tRPC context carries the Express req/res; CORS, rate limiting, and the spend guard stay as Express middleware (see index.ts).
export interface TrpcContext {
  req: express.Request;
  res: express.Response;
}

const t = initTRPC.context<TrpcContext>().create();

export const router = t.router;
export const publicProcedure = t.procedure;
