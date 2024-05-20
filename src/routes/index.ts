import { Router } from "express";
import { gptRouter } from "./gpt";
import { auth } from "../middleware/auth";
import { userpicsRouter } from "./userpics";
import { usersRouter } from "./users";
import { chatsRouter } from "./chats";

const routes = Router();

routes.use("/askGpt", auth, gptRouter);
routes.use("/users", usersRouter);
routes.use("/userpics", auth, userpicsRouter);
routes.use("/chats", auth, chatsRouter);

export default routes;
