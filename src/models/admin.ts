import { Schema } from "mongoose";
import { IUser, UserModel, findUserByCredentials } from "./baseUser";

export interface IAdmin extends IUser {}

const adminSchema = new Schema<IAdmin>({});

export const AdminModel = UserModel.discriminator<IAdmin>("admin", adminSchema);

adminSchema.statics.findAdminByCredentials = function (email, password) {
  return findUserByCredentials(email, password, this);
};
