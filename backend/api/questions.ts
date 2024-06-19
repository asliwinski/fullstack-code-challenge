import {
  addQuestion,
  deleteQuestion,
  editQuestion,
  getQuestions,
} from "@db/queries/questions";
import { z } from "zod";
import { publicProcedure, t } from "./common";

export const questionsRouter = t.router({
  getQuestions: publicProcedure.query(getQuestions),
  upsertQuestion: publicProcedure
    .input(
      z.object({
        content: z.string(),
        question: z.object({ _id: z.string() }).optional().nullable(),
      })
    )
    .mutation(async ({ input }) => {
      const { content, question } = input;
      if (question) return await editQuestion({ content }, question._id);
      await addQuestion({ content });
    }),
  deleteQuestion: publicProcedure
    .input(z.string())
    .mutation(({ input }) => deleteQuestion(input)),
});
