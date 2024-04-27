import { Request } from "express";
export interface TokenUserInfo {
  _id: string;
  role: string;
}
export interface ReqWithUserInfo extends Request {
  user: TokenUserInfo;
}

export interface ReqWithUserAndFileInfo extends Request {
  file: Express.Multer.File;
  user: TokenUserInfo;
}
