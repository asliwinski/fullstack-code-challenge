import { Question, QuestionModel } from "../../models/questions";

export async function getQuestions() {
  return QuestionModel.find({}).lean();
}

export async function addQuestion(question: Question) {
  return QuestionModel.create(question);
}

export async function editQuestion(question: Question, id: string) {
  return QuestionModel.findOneAndUpdate({ _id: id }, question, {
    new: true,
  });
}

export async function deleteQuestion(id: string) {
  return QuestionModel.findOneAndDelete({ _id: id });
}
