import { Router } from "express";
export const chatsRouter = Router();

import {
  addMessage,
  checkChat,
  createChat,
  getChatByID,
  refreshChat,
  deleteChat,
} from "../controllers/chats";

chatsRouter.get("/:chatId", getChatByID);
chatsRouter.patch("/check/:chatId", checkChat);
chatsRouter.delete("/:chatId", deleteChat);
chatsRouter.get("/create/:userId", createChat);
chatsRouter.get("/refresh/:chatId/:lastMessageId", refreshChat);
chatsRouter.post("/addMessage", addMessage);
