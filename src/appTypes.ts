import { Request } from "express";
import { Schema } from "mongoose";
import { Roles } from "./models/baseUser";
export interface TokenUserInfo {
  _id: Schema.Types.ObjectId;
  role: Roles;
}
export interface ReqWithUserInfo extends Request {
  user: TokenUserInfo;
}

export interface ReqWithUserAndFileInfo extends Request {
  file: Express.Multer.File;
  user: TokenUserInfo;
}
