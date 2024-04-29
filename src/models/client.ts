import { Schema } from "mongoose";
import { IUser, UserModel, findUserByCredentials } from "./baseUser";

export interface IClient extends IUser {
  coachRequests: string[];
}

const clientSchema = new Schema<IClient>({
  coachRequests: [
    {
      type: String,
    },
  ],
});

export const ClientModel = UserModel.discriminator<IClient>(
  "client",
  clientSchema
);

clientSchema.statics.findClientByCredentials = function (email, password) {
  return findUserByCredentials(email, password, this);
};
