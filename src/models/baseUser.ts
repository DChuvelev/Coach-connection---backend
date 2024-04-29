import mongoose, { Model, Schema, model } from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";
import { IChat, IChatMember, chatMemberSchema, chatSchema } from "./chats";

export enum Roles {
  Coach = "coach",
  Client = "client",
  Admin = "admin",
}

export interface IUser {
  _id: Schema.Types.ObjectId;
  name: string;
  email: string;
  password: string;
  avatar: string;
  role: Roles;
  gender: string;
  languages: string[];
  birthDate: string;
  about: string;
  chats: {
    chatId: Schema.Types.ObjectId;
    members: IChatMember[];
  }[];
  gotNewMessagesInChatIDs: Schema.Types.ObjectId[];
}

const baseUserSchema = new Schema<IUser>(
  {
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
      // unique: true,
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
        validator: (v: string) => Object.values(Roles).includes(v as Roles),
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
    chats: [
      {
        chatId: {
          type: Schema.Types.ObjectId,
          required: true,
          _id: false,
        },
        members: [chatMemberSchema],
        _id: false,
      },
    ],
    gotNewMessagesInChatIDs: [
      {
        type: Schema.Types.ObjectId,
      },
    ],
  },
  { discriminatorKey: "role", collection: "users" }
);

baseUserSchema.index({ email: 1, role: 1 }, { unique: true });

export const UserModel = model<IUser>("user", baseUserSchema);

export const findUserByCredentials = function <T>(
  email: string,
  password: string,
  currentModel: Model<T>
) {
  if (!email || !password) {
    return Promise.reject(new Error("Invalid data"));
  }
  return currentModel
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
