import { Router } from "express";
export const usersRouter = Router();

import {
  generateRandomCoach,
  getAllCoaches,
  getCurrentUser,
  modifyCurrentUserData,
} from "../controllers/users";
import { validateModifyUserData } from "../middleware/validation";
import { auth } from "../middleware/auth";

usersRouter.get("/me", auth, getCurrentUser);
usersRouter.patch("/me", auth, validateModifyUserData, modifyCurrentUserData);
usersRouter.get("/coaches", getAllCoaches);
usersRouter.get("/coaches/create/random", generateRandomCoach);
