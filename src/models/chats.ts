import mongoose, { Schema, model, Types } from "mongoose";
import { IUser, Roles, UserModel } from "./baseUser";

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
  lastMessage?: Types.ObjectId;
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
  lastMessage: {
    type: Schema.Types.ObjectId,
    ref: "chatMessage",
  },
});

//Here we define a pre-middleware for deleteOne method.
//When we delete a chat we have to delete all messages from it in MessageModel
//and also remove links to it from it's members from UserModel
chatSchema.pre(
  "deleteOne",
  { document: false, query: true },
  async function (next) {
    const doc: IChat | null = await this.model
      .findOne(this.getQuery())
      .lean<IChat>()
      .exec();
    if (doc) {
      console.log(
        `Result of deleteing messages from deleted chat: ${await MessageModel.deleteMany({ fromChatId: doc._id })}`
      );
      console.log(
        `Result of deleteing chat links from users: ${await UserModel.updateMany(
          {
            _id: { $in: doc.members.map((member) => member as Types.ObjectId) },
          },
          { $pull: { chats: doc._id, gotNewMessagesInChatIDs: doc._id } }
        )}`
      );
    }
    next();
  }
);

export const ChatModel = model<IChat>("chat", chatSchema);
export const MessageModel = model<IMessage>("chatMessage", messageSchema);
