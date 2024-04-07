import { Response, Request, NextFunction, Express } from "express";
import { Document, Model } from "mongoose";
import { findUserByCredentials } from "../models/userTypes";
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
import { Client, Coach } from "../models/userTypes";
const clientModel = require("../models/clients");
const coachModel = require("../models/coaches");
const { JWT_SECRET } = require("../utils/config");
const UnauthorizedError = require("../utils/errors/UnauthorizedError");
const BadRequestError = require("../utils/errors/BadRequestError");
const NotFoundError = require("../utils/errors/NotFoundError");
const ConflictError = require("../utils/errors/ConflictError");

module.exports.createUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log("User creation request:");
  console.dir(req.body);

  let currentModel: Model<Client | Coach>;
  switch (req.body.role) {
    case "client":
      currentModel = clientModel;
      break;
    case "coach":
      currentModel = coachModel;
      break;
  }

  bcrypt
    .hash(req.body.password, 10)
    .then((hash: string) =>
      currentModel.create({ ...req.body, password: hash })
    )
    .then((user: any) => {
      const userWithoutPass = (({ password, ...restProps }) => restProps)(
        user._doc
      );
      res.send(userWithoutPass);
      console.log(`User created: ${user}`);
    })
    .catch((err: any) => {
      console.error(err.name, "|", err.message);
      if (err.name === "ValidationError") {
        next(new BadRequestError("Invalid data"));
        return;
      }
      if (err.name === "MongoServerError" || err.code === 11000) {
        next(new ConflictError("User already exists"));
        return;
      }
      next(err);
    });
};

module.exports.login = (req: Request, res: Response, next: NextFunction) => {
  console.log("Login");
  console.dir(req.body);

  let currentModel: Model<Client | Coach>;
  switch (req.body.role) {
    case "client":
      currentModel = clientModel;
      break;
    case "coach":
      currentModel = coachModel;
      break;
    default:
      currentModel = clientModel;
  }

  findUserByCredentials(req.body.email, req.body.password, currentModel)
    .then((user: any) => {
      console.log("Successful user login:", user.name);
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      res.send({
        token,
        name: user.name,
        avatar: user.avatar,
        email: user.email,
        role: user.role,
        _id: user._id,
      });
    })
    .catch((err: any) => {
      console.error("Error:", err.message);
      if (err.message === "Incorrect username or password") {
        next(new UnauthorizedError(err.message));
        return;
      }
      if (err.message === "Invalid data") {
        next(new BadRequestError(err.message));
        return;
      }
      next(err);
    });
};
