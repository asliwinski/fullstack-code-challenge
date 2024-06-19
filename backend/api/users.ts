import { getUsers } from "@db/queries/users";
import { publicProcedure, t } from "./common";

export const usersRouter = t.router({
  getUsers: publicProcedure.query(getUsers),
});
