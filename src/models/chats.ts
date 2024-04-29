import mongoose, { Schema, model } from "mongoose";
import { Roles } from "./baseUser";

export interface IMessage {
  _id: Schema.Types.ObjectId;
  text: string;
  timestamp: string;
  author: Schema.Types.ObjectId;
}

export interface IChatMember {
  memberId: Schema.Types.ObjectId;
  role: Roles;
}

export interface IChat {
  _id: Schema.Types.ObjectId;
  messages: IMessage[];
  members: IChatMember[];
}

const messageSchema = new Schema<IMessage>({
  _id: {
    type: Schema.Types.ObjectId,
  },
  text: {
    type: String,
  },
  timestamp: {
    type: String,
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
});

export const chatMemberSchema = new Schema<IChatMember>(
  {
    memberId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "user",
    },
    role: {
      type: String,
      enum: Roles,
      required: true,
    },
  },
  { _id: false }
);

export const chatSchema = new Schema<IChat>({
  messages: [messageSchema],
  members: [chatMemberSchema],
});

export const ChatModel = model<IChat>("chat", chatSchema);
