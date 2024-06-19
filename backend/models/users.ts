import { InferSchemaType, model, Schema } from "mongoose";

const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
});

export const UserModel = model("User", UserSchema);

export type User = InferSchemaType<typeof UserSchema>;
