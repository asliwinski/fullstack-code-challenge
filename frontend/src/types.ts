import type { inferRouterOutputs } from "@trpc/server";
import { AppRouter } from "../../backend/api/trpc";

export type Answer = inferRouterOutputs<AppRouter>["getAnswersForUser"][0];
export type Question = inferRouterOutputs<AppRouter>["getQuestions"][0];
