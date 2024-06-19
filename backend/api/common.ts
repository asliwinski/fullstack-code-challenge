import { initTRPC } from "@trpc/server";
import { dbConnection } from "@db";

export const t = initTRPC.create();

export const publicProcedure = t.procedure.use(async (opts) => {
  await dbConnection();
  return opts.next();
});
