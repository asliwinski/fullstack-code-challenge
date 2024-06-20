import { addUser, getUsers } from "@db/queries/users";
import { publicProcedure, t } from "./common";
import { z } from "zod";

export const usersRouter = t.router({
  getUsers: publicProcedure.query(getUsers),
  addUser: publicProcedure
    .input(z.object({ name: z.string(), email: z.string() }))
    .mutation(({ input }) => addUser(input)),
});
