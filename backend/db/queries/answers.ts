import { AnswerModel } from "@models/answers";

export function getAnswersForUser(id: string) {
  const cursor = AnswerModel.find({ user: id }).lean().cursor();
  return cursor;
}

export function addAnswer(answer) {
  const { userId, questionId, content } = answer;
  const newAnswer = {
    user: userId,
    question: questionId,
    content,
  };
  return AnswerModel.create(newAnswer);
}

export function editAnswer(answer, answerId) {
  return AnswerModel.findOneAndUpdate({ _id: answerId }, answer, {
    new: true,
  });
}

export function deleteAnswer(answerId: string, userId: string) {
  return AnswerModel.findOneAndDelete({ _id: answerId, user: userId });
}
