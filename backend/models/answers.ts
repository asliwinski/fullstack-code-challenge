import { model, Schema, Document } from "mongoose";
import { Answer } from "@_types/answer";

const AnswerSchema: Schema = new Schema({
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

export const AnswerModel = model<Answer & Document>("Answer", AnswerSchema);
