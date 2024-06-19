import { UserModel } from "../../models/users";

export async function getUsers() {
  return UserModel.find({}).lean();
}
