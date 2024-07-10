import { Answer, AnswerModel } from "../../models/answers";
import mongoose from "mongoose";

const { ObjectId } = mongoose.Types;

export function getAnswersForUser(id: string) {
  return AnswerModel.aggregate([
    {
      $match: { user: new ObjectId(id) },
    },
    {
      $lookup: {
        from: "questions",
        localField: "question",
        foreignField: "_id",
        as: "questionDetails",
      },
    },
    {
      $match: { questionDetails: { $ne: [] } },
    },
    {
      $project: {
        questionDetails: 0,
      },
    },
  ]).exec();
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
