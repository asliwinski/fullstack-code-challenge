import { InferSchemaType, model, Schema } from "mongoose";

const QuestionSchema = new Schema({
  content: {
    type: String,
    required: true,
  },
});

export const QuestionModel = model("Question", QuestionSchema);

export type Question = InferSchemaType<typeof QuestionSchema>;
