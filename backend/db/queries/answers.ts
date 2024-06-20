import { Answer, AnswerModel } from "../../models/answers";

export function getAnswersForUser(id: string) {
  return AnswerModel.find({ user: id }).lean();
}

export function addAnswer(
  answer: Omit<Answer, "user" | "question"> & { user: string; question: string }
) {
  return AnswerModel.create(answer);
}

export function editAnswer(
  answer: Omit<Answer, "user" | "question"> & {
    user: string;
    question: string;
  },
  answerId: string
) {
  return AnswerModel.findOneAndUpdate({ _id: answerId }, answer, {
    new: true,
  }).exec();
}

export function deleteAnswer(answerId: string, userId: string) {
  return AnswerModel.findOneAndDelete({ _id: answerId, user: userId });
}
