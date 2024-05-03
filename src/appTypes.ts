import { Request } from "express";
import { Schema, Types } from "mongoose";
import { Roles } from "./models/baseUser";
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
