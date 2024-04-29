import { Router } from "express";
export const routes = Router();
import { gptRouter } from "./gpt";
import { auth } from "../middleware/auth";
import { userpicsRouter } from "./userpics";
import { usersRouter } from "./users";
import { chatsRouter } from "./chats";

routes.use("/askGpt", auth, gptRouter);
routes.use("/users", usersRouter);
routes.use("/userpics", auth, userpicsRouter);
routes.use("/chats", auth, chatsRouter);
