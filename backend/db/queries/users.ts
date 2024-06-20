import { User, UserModel } from "../../models/users";

export function getUsers() {
  return UserModel.find({}).lean();
}

export function addUser(user: User) {
  return UserModel.create(user);
}
