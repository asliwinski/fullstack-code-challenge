import { QuestionModel } from "@models/questions";

export function getQuestions() {
  const cursor = QuestionModel.find({}).lean().cursor();
  return cursor;
}

export function addQuestion(question) {
  return QuestionModel.create(question);
}

export function editQuestion(question, id) {
  return QuestionModel.findOneAndUpdate({ _id: id }, question, {
    new: true,
  });
}

export function deleteQuestion(id: string) {
  return QuestionModel.findOneAndDelete({ _id: id });
}
