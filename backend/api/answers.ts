import { z } from "zod";
import {
  addAnswer,
  deleteAnswer,
  editAnswer,
  getAnswersForUser,
} from "@db/queries/answers";
import { publicProcedure, t } from "./common";

export const answersRouter = t.router({
  getAnswersForUser: publicProcedure
    .input(z.string())
    .query(({ input }) => getAnswersForUser(input)),
  upsertAnswer: publicProcedure
    .input(
      z.object({
        content: z.string(),
        questionId: z.string(),
        userId: z.string(),
        answer: z.object({ _id: z.string() }).optional().nullable(),
      })
    )
    .mutation(async ({ input }) => {
      const { userId, content, questionId, answer } = input;
      if (answer)
        return await editAnswer(
          { user: userId, question: questionId, content },
          answer._id
        );
      return await addAnswer({ user: userId, question: questionId, content });
    }),
  deleteAnswer: publicProcedure
    .input(z.object({ answerId: z.string(), userId: z.string() }))
    .mutation(({ input }) => deleteAnswer(input.answerId, input.userId)),
});
