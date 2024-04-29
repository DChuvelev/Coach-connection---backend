import { Router } from "express";
export const chatsRouter = Router();

import {
  addMessage,
  createChat,
  getChatByID,
  refreshChat,
} from "../controllers/chats";

chatsRouter.get("/:chatId", getChatByID);
chatsRouter.get("/create/:userId", createChat);
chatsRouter.get("/refresh/:chatId/:lastMessageId", refreshChat);
chatsRouter.post("/addMessage", addMessage);
