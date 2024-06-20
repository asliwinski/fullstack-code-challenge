import { Question, QuestionModel } from "../../models/questions";

export function getQuestions() {
  return QuestionModel.find({}).lean();
}

export function addQuestion(question: Question) {
  return QuestionModel.create(question);
}

export function editQuestion(question: Question, id: string) {
  return QuestionModel.findOneAndUpdate({ _id: id }, question, {
    new: true,
  }).exec();
}

export function deleteQuestion(id: string) {
  return QuestionModel.findOneAndDelete({ _id: id });
}
