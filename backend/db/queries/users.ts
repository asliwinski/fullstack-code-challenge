import { UserModel } from "@models/users";

export function getUsers() {
  const cursor = UserModel.find({}).lean().cursor();
  return cursor;
}
