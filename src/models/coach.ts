import { Schema } from "mongoose";
import { IUser, UserModel, findUserByCredentials } from "./baseUser";

export interface ICoach extends IUser {
  status: string;
  skills: string[];
  paymentOptions: string[];
  paymentScheme: string;
  sertification: string;
  sertificationLevel: string[];
}

const coachSchema = new Schema<ICoach>({
  skills: [
    {
      type: String,
    },
  ],
  paymentOptions: [
    {
      type: String,
    },
  ],
  paymentScheme: {
    type: String,
  },
  sertification: {
    type: String,
    default: "inTraining",
  },
  sertificationLevel: [
    {
      type: String,
    },
  ],
  status: {
    type: String,
    default: "active",
  },
});

export const CoachModel = UserModel.discriminator<ICoach>("coach", coachSchema);

coachSchema.statics.findCoachByCredentials = function (email, password) {
  return findUserByCredentials(email, password, this);
};
