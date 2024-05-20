import { Router } from "express";
import {
  getAllCoaches,
  getCurrentUser,
  modifyCurrentUserData,
} from "../controllers/users";
import { validateModifyUserData } from "../middleware/validation";
import { auth } from "../middleware/auth";

export const usersRouter = Router();
usersRouter.get("/me", auth, getCurrentUser);
usersRouter.patch("/me", auth, validateModifyUserData, modifyCurrentUserData);
usersRouter.get("/coaches", getAllCoaches);
