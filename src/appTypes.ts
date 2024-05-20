import type { Request } from "express";
import { type Types } from "mongoose";
import { type Roles } from "./models/baseUser";
export interface TokenUserInfo {
  _id: Types.ObjectId;
  role: Roles;
}
export interface ReqWithUserInfo extends Request {
  user: TokenUserInfo;
}

export interface ReqWithUserAndFileInfo extends Request {
  file: Express.Multer.File;
  user: TokenUserInfo;
}
