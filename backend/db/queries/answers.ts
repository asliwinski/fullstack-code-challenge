import { Answer, AnswerModel } from "../../models/answers";

export async function getAnswersForUser(id: string) {
  return AnswerModel.find({ user: id }).lean();
}

export async function addAnswer(
  answer: Omit<Answer, "user" | "question"> & { user: string; question: string }
) {
  return AnswerModel.create(answer);
}

export async function editAnswer(
  answer: Omit<Answer, "user" | "question"> & {
    user: string;
    question: string;
  },
  answerId: string
) {
  return AnswerModel.findOneAndUpdate({ _id: answerId }, answer, {
    new: true,
  });
}

export async function deleteAnswer(answerId: string, userId: string) {
  return AnswerModel.findOneAndDelete({ _id: answerId, user: userId });
}
