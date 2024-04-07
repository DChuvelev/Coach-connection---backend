import { Model } from "mongoose";
import validator = require("validator");
const bcrypt = require("bcryptjs");

const roles = ["coach", "client", "admin"];

export interface User {
  name: string;
  email: string;
  password: string;
  avatar?: string;
  role: string;
}

export interface Coach extends User {}

export interface Client extends User {}

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
    validate: {
      validator: (v: string) => validator.isURL(v),
      message: "It's not a URL",
    },
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
    .then((user) => {
      console.log(user);
      if (!user) {
        return Promise.reject(new Error("Incorrect username or password"));
      }
      const user1 = user as unknown;
      const user2 = user1 as User;
      return bcrypt
        .compare(password, user2.password)
        .then((matched: boolean) => {
          if (!matched) {
            return Promise.reject(new Error("Incorrect username or password"));
          }
          return user;
        });
    });
};
