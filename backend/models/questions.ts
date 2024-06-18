import { model, Schema, Document } from "mongoose";
import { Question } from "@_types/question";

const QuestionSchema: Schema = new Schema({
  content: {
    type: String,
    required: true,
  },
});

export const QuestionModel = model<Question & Document>(
  "Question",
  QuestionSchema
);
