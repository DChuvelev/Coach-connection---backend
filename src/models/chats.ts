import mongoose, { Schema, model, Types } from "mongoose";
import { IUser, Roles } from "./baseUser";

export interface IMessage {
  _id: Types.ObjectId;
  text: string;
  timestamp: string;
  authorId: Types.ObjectId;
  edited: boolean;
  fromChatId: Types.ObjectId;
}

export interface IChat {
  _id: Types.ObjectId;
  messages: IMessage[];
  members: (Types.ObjectId | IUser)[];
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
  authorId: {
    type: Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  edited: {
    type: Boolean,
    default: false,
  },
  fromChatId: {
    type: Schema.Types.ObjectId,
    ref: "chat",
  },
});

export const chatSchema = new Schema<IChat>({
  messages: [
    {
      type: Types.ObjectId,
      ref: "chatMessage",
    },
  ],
  members: [
    {
      type: Types.ObjectId,
      ref: "user",
    },
  ],
});

export const ChatModel = model<IChat>("chat", chatSchema);
export const MessageModel = model<IMessage>("chatMessage", messageSchema);
