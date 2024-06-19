import { InferSchemaType, model, Schema } from "mongoose";

const AnswerSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  question: {
    type: Schema.Types.ObjectId,
    ref: "Question",
    required: true,
  },
  content: {
    type: String,
    required: true,
    unique: true,
  },
});

export const AnswerModel = model("Answer", AnswerSchema);

export type Answer = InferSchemaType<typeof AnswerSchema>;
