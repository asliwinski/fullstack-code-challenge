import { model, Schema, Document } from "mongoose";
import { User } from "@_types/user";

const UserSchema: Schema = new Schema({
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

export const UserModel = model<User & Document>("User", UserSchema);
