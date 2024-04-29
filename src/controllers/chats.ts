import { Response, Request, NextFunction } from "express";
import { ChatModel, IChat, IMessage } from "../models/chats";
import { ReqWithUserInfo } from "../appTypes";
import { Roles, UserModel } from "../models/baseUser";
import mongoose, { Schema } from "mongoose";

export const getChatByID = (
  reqOrig: Request,
  res: Response,
  next: NextFunction
) => {
  const req = reqOrig as ReqWithUserInfo;
  console.log(req.params.chatId);
  // ChatModel
  //   .findById(req.user._id)
  //   .orFail()
  //   .then((user: any) => {
  //     res.send(userPrivateInfoToSend(user));
  //     console.log(`User ${user.name} found`);
  //   })
  //   .catch((err) => {
  //     console.error(err.name);
  //     if (err.name === "CastError") {
  //       next(new BadRequestError(`The id: '${req.user._id}' is invalid`));
  //       return;
  //     }
  //     if (err.name === "DocumentNotFoundError") {
  //       next(new NotFoundError(`There's no user with id: ${req.user._id}`));
  //       return;
  //     }
  //     next(err);
};

export const createChat = async (
  reqOrig: Request,
  res: Response,
  next: NextFunction
) => {
  const req = reqOrig as ReqWithUserInfo;
  console.log(req.params.chatId);
  try {
    const firstMember = await UserModel.findById(req.user._id).orFail();
    const secondMember = await UserModel.findById(req.params.userId).orFail();
    const newChat: IChat = {
      _id: new mongoose.Types.ObjectId() as unknown as Schema.Types.ObjectId,
      messages: [],
      members: [
        {
          memberId: req.user._id,
          role: req.user.role,
        },
        {
          memberId: secondMember?._id as unknown as Schema.Types.ObjectId,
          role: secondMember?.role as Roles,
        },
      ],
    };
    const newCreatedChat: IChat = await ChatModel.create(newChat);
    firstMember.chats.push({
      chatId: newCreatedChat._id,
      members: [
        {
          memberId: secondMember?._id as unknown as Schema.Types.ObjectId,
          role: secondMember?.role as Roles,
        },
      ],
    });

    await firstMember.save();
    secondMember.chats.push({
      chatId: newCreatedChat._id,
      members: [
        {
          memberId: req.user._id,
          role: req.user.role,
        },
      ],
    });
    secondMember.gotNewMessagesInChatIDs.push(newCreatedChat._id);
    await secondMember.save();
    console.log(`Chat with id:${newCreatedChat._id} created`);
    res.send(newCreatedChat._id);
  } catch (err) {
    console.log(err);
    next(err);
  }
};

export const refreshChat = async (
  reqOrig: Request,
  res: Response,
  next: NextFunction
) => {
  const req = reqOrig as ReqWithUserInfo;

  let chatId;
  try {
    chatId = new mongoose.Types.ObjectId(req.params.chatId);
  } catch {
    chatId = undefined;
  }

  let lastMessageId;
  try {
    lastMessageId = new mongoose.Types.ObjectId(req.params.lastMessageId);
  } catch {
    lastMessageId = undefined;
  }
  console.log(chatId, lastMessageId);

  try {
    const chat = await ChatModel.findById(chatId);
    console.log("Before sorting", chat?.messages);

    if (lastMessageId && chat) {
      let startIndex = chat.messages.findIndex((message: IMessage) =>
        lastMessageId.equals(message._id as unknown as string)
      );
      if (startIndex !== -1) {
        chat.messages = chat.messages.slice(startIndex + 1);
      }
    }
    console.log("After sorting", chat?.messages);
    res.send(chat ? chat : {});
  } catch (error) {
    console.error("Error refreshing chat:", error);
    next(error);
  }
};

export const addMessage = async (
  reqOrig: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const req = reqOrig as ReqWithUserInfo;
    const {
      chatId,
      author,
      text,
    }: {
      chatId: Schema.Types.ObjectId;
      author: Schema.Types.ObjectId;
      text: string;
    } = req.body;

    const newMessage: IMessage = {
      _id: new mongoose.Types.ObjectId() as unknown as Schema.Types.ObjectId,
      text: text,
      timestamp: new Date().toISOString(),
      author: author,
    };

    const updatedChat = await ChatModel.findOneAndUpdate(
      { _id: chatId },
      { $push: { messages: newMessage } },
      { new: true }
    );

    if (!updatedChat) {
      throw new Error("Chat not found");
    }

    res.send(newMessage._id);
  } catch (error) {
    console.error("Error adding message:", error);
    next(error);
  }
};
