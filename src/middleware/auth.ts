import { NextFunction, Request, Response } from "express";
import { TokenUserInfo, ReqWithUserInfo } from "../appTypes";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../utils/config";
import { UnauthorizedError } from "../utils/errors/errorClasses";

export const auth = (reqOrig: Request, res: Response, next: NextFunction) => {
  const req = reqOrig as ReqWithUserInfo;
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith("Bearer ")) {
    console.log("Access attempt without token");
    next(new UnauthorizedError("Authorization required. No token"));
    return;
  }
  const token = authorization.replace("Bearer ", "");
  let payload;
  try {
    payload = jwt.verify(token, JWT_SECRET) as TokenUserInfo;
  } catch (err) {
    console.log("Token verification error");
    next(new UnauthorizedError("Authorization required. Token invalid"));
    return;
  }
  req.user = payload;
  next();
};
