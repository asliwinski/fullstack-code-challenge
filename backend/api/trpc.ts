import { answersRouter } from "./answers";
import { usersRouter } from "./users";
import { questionsRouter } from "./questions";
import { t } from "./common";

export const appRouter = t.mergeRouters(
  questionsRouter,
  usersRouter,
  answersRouter
);

export type AppRouter = typeof appRouter;
