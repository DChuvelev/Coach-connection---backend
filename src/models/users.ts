import mongoose, { Model, Mongoose, Schema, Validator, model } from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";

const roles = ["coach", "client", "admin"];

export interface User {
  _id: string;
  name: string;
  email: string;
  password: string;
  avatar: string;
  role: string;
}

export interface Coach extends User {
  status: string;
}

export interface Client extends User {
  someSpecialClientInfo: string;
}

export interface Admin extends User {}

export const userFields = {
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  avatar: {
    type: String,
    required: false,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (v: string) => validator.isEmail(v),
      message: "It's not a valid e-mail address",
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  role: {
    type: String,
    required: true,
    validate: {
      validator: (v: string) => roles.includes(v),
      message: "Error in role",
    },
  },
  gender: {
    type: String,
  },
  languages: [
    {
      type: String,
    },
  ],
  birthDate: {
    type: String,
  },
  about: {
    type: String,
  },
};

export const findUserByCredentials = function <T>(
  email: string,
  password: string,
  db: Model<T>
) {
  if (!email || !password) {
    return Promise.reject(new Error("Invalid data"));
  }
  return db
    .findOne({ email })
    .select("+password")
    .then((user: any) => {
      console.log(user);
      if (!user) {
        return Promise.reject(new Error("Incorrect username or password"));
      }
      return bcrypt
        .compare(password, user.password)
        .then((matched: boolean) => {
          if (!matched) {
            return Promise.reject(new Error("Incorrect username or password"));
          }
          return user;
        });
    });
};

const clientFields = { ...userFields };

const clientSchema = new Schema<Client>(clientFields);

clientSchema.statics.findClientByCredentials = function (email, password) {
  return findUserByCredentials(email, password, this);
};

export const clientModel = mongoose.model("client", clientSchema);

const coachFields = {
  ...userFields,
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
};

const coachSchema = new Schema<Coach>(coachFields);

coachSchema.statics.findCoachByCredentials = function (email, password) {
  return findUserByCredentials(email, password, this);
};

export const coachModel = mongoose.model("coach", coachSchema);
