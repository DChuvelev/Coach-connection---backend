import { Router } from "express";
import {
  createUser,
  getAllCoaches,
  getCurrentUser,
  login,
  modifyCurrentUserData,
} from "../controllers/users";
import {
  validateCreateUserData,
  validateLoginData,
  validateModifyUserData,
} from "../middleware/validation";
import { auth } from "../middleware/auth";

export const usersRouter = Router();
usersRouter.get("/me", auth, getCurrentUser);
usersRouter.patch("/me", auth, validateModifyUserData, modifyCurrentUserData);
usersRouter.get("/coaches", getAllCoaches);
usersRouter.post("/signin", validateLoginData, login);
usersRouter.post("/signup", validateCreateUserData, createUser);
