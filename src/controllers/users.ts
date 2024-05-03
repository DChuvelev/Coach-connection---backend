import { Response, Request, NextFunction } from "express";
import { Model } from "mongoose";
import { IUser, UserModel, findUserByCredentials } from "../models/baseUser";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
// const faker = require("faker");
import { faker } from "@faker-js/faker";
import { ClientModel } from "../models/client";
import { CoachModel, ICoach } from "../models/coach";
import {
  BadRequestError,
  ConflictError,
  UnauthorizedError,
  NotFoundError,
} from "../utils/errors/errorClasses";
import { ReqWithUserAndFileInfo, ReqWithUserInfo } from "../appTypes";
import { AdminModel } from "../models/admin";
const { JWT_SECRET } = require("../utils/config");

const userPrivateInfoToSend = (user: any) => {
  const { __v, password, ...privateInfoToSend } = user._doc;
  return privateInfoToSend;
};

const userPublicInfoToSend = (user: any) => {
  const { __v, password, email, role, status, ...publicInfoToSend } = user._doc;
  return publicInfoToSend;
};

export const getCurrentUser = (
  reqOrig: Request,
  res: Response,
  next: NextFunction
) => {
  const req = reqOrig as ReqWithUserInfo;

  console.log("Get user by token", req.user._id, req.user.role);
  UserModel.findById(req.user._id)
    .populate({
      path: "chats",
      select: "_id",
      populate: {
        path: "members",
        select: "_id name role",
      },
    })
    .orFail()
    .then((user: any) => {
      res.send(userPrivateInfoToSend(user));
      console.log(`User ${user.name} found`);
    })
    .catch((err) => {
      console.error(err.name);
      if (err.name === "CastError") {
        next(new BadRequestError(`The id: '${req.user._id}' is invalid`));
        return;
      }
      if (err.name === "DocumentNotFoundError") {
        next(new NotFoundError(`There's no user with id: ${req.user._id}`));
        return;
      }
      next(err);
    });
};

export const createUser = (req: Request, res: Response, next: NextFunction) => {
  console.log("User creation request:");
  console.dir(req.body);

  // let currentModel: Model<any>;
  // switch (req.body.role) {
  //   case "client":
  //     currentModel = ClientModel;
  //     break;
  //   case "coach":
  //     currentModel = CoachModel;
  //     break;
  //   case "admin":
  //     currentModel = AdminModel;
  //     break;
  //   default:
  //     currentModel = ClientModel;
  // }

  bcrypt
    .hash(req.body.password, 10)
    .then((hash: string) => UserModel.create({ ...req.body, password: hash }))
    .then((user: any) => {
      res.send(userPrivateInfoToSend(user));
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

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log("Login");
  console.dir(req.body);
  try {
    let currentModel: Model<any>;
    switch (req.body.role) {
      case "client":
        currentModel = ClientModel;
        break;
      case "coach":
        currentModel = CoachModel;
        break;
      case "admin":
        currentModel = AdminModel;
        break;
      default:
        currentModel = ClientModel;
    }
    const user = currentModel
      .findById(
        (
          (await findUserByCredentials(
            req.body.email,
            req.body.password,
            currentModel
          )) as IUser
        )._id
      )
      .populate({
        path: "chats",
        select: "_id",
        populate: {
          path: "members",
          select: "_id name role",
        },
      })

      .then((user: any) => {
        console.log("Successful user login:", user.name);
        const token = jwt.sign({ _id: user._id, role: user.role }, JWT_SECRET, {
          expiresIn: "7d",
        });
        res.send({
          token,
          ...userPrivateInfoToSend(user),
        });
      });
  } catch (err: any) {
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
  }
};

export const setUserpic = (
  reqOrig: Request,
  res: Response,
  next: NextFunction
) => {
  const req = reqOrig as ReqWithUserAndFileInfo;

  const avatar = req.file.filename;
  UserModel.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true }
  )
    .then((user: any) => {
      res.send(userPrivateInfoToSend(user));
      console.log(`User ${user.name} modified`);
    })
    .catch((err) => {
      console.error(err.name);
      if (err.name === "DocumentNotFoundError") {
        next(new NotFoundError(`There's no user with id: ${req.user._id}`));
        return;
      }
      if (err.name === "ValidationError") {
        next(new BadRequestError("Invalid data"));
        return;
      }
      next(err);
    });
};

export const modifyCurrentUserData = async (
  reqOrig: Request,
  res: Response,
  next: NextFunction
) => {
  const req = reqOrig as ReqWithUserAndFileInfo;

  const { _id, __v, email, role, avatar, ...updatedInfo } = req.body;
  console.dir(updatedInfo);
  try {
    const user = await UserModel.findByIdAndUpdate(req.user._id, updatedInfo, {
      new: true,
      runValidators: true,
    })
      .populate({
        path: "chats",
        select: "_id",
        populate: {
          path: "members",
          select: "_id name role",
        },
      })
      .orFail();

    res.send(userPrivateInfoToSend(user));
    console.log(`User ${user.name} modified`);
  } catch (err: any) {
    console.error(err.name);
    if (err.name === "DocumentNotFoundError") {
      next(new NotFoundError(`There's no user with id: ${req.user._id}`));
      return;
    }
    if (err.name === "ValidationError") {
      next(new BadRequestError("Invalid data"));
      return;
    }
    next(err);
  }
};

export const getAllCoaches = (
  reqOrigin: Request,
  res: Response,
  next: NextFunction
) => {
  const req = reqOrigin as ReqWithUserInfo;

  CoachModel.find({})
    .then((foundDoc: unknown) => {
      const coachesFullInfo = foundDoc as Array<{ _doc: ICoach }>;
      console.log("Get all items");
      const coachesToSend = coachesFullInfo
        .filter((coach) => coach._doc.status === "active")
        .map((coach) => userPublicInfoToSend(coach));
      res.send({ data: coachesToSend });
    })
    .catch((err: Error) => {
      console.error(err);
      next(err);
    });
};

// ------------------ temporary ----------------------------

export const generateRandomCoach = (
  reqOrigin: Request,
  res: Response,
  next: NextFunction
) => {
  const req = reqOrigin as ReqWithUserInfo;

  interface CoachInfo {
    role: string;
    name: string;
    avatar: string;
    email: string;
    gender: string;
    birthDate: string;
    languages: Array<string>;
    about: string;
    skills: Array<string>;
    sertification: string;
    sertificationLevel: Array<string>;
    status: string;
  }

  const roles = ["client", "coach", "admin"];
  const genders = ["male", "female", "undefined"];
  const langs = ["en", "ru", "germ", "fr"];
  const skills = [
    "goalSetting",
    "personalEffectiveness",
    "motivation",
    "timeManagement",
    "selfConfidence",
    "productiveCommunication",
    "stressManagement",
    "decisionMaking",
    "relationships",
    "personalDevelopment",
  ];
  const sert = ["inTraining", "lev1", "lev2", "levFollowing"];
  const sertLev = [
    "ACC",
    "PCC",
    "MCC",
    "PractRFPC",
    "ExpertRFPC",
    "MasterRFPC",
  ];
  const status = ["active", "busy"];
  // Set a minimum age (let's say 18 years old)
  const minAge = 18;
  const maxAge = 65; // You can adjust this

  function generateBirthDate() {
    const yearsAgo = faker.number.int({ min: minAge, max: maxAge });

    // Subtract years from the current date
    const birthDate = new Date();
    birthDate.setFullYear(birthDate.getFullYear() - yearsAgo);

    // Format as YYYY-MM-DD (no changes needed here)
    return birthDate.toISOString().slice(0, 10);
  }

  function generateCoachAbout() {
    const coachingFocus = [
      "life transformation",
      "career development",
      "mindfulness",
      "relationship building",
      "goal achievement",
    ];
    const adjectives = [
      "experienced",
      "dedicated",
      "compassionate",
      "results-oriented",
      "insightful",
    ];

    const focus = faker.helpers.arrayElement(coachingFocus);
    const adjective = faker.helpers.arrayElement(adjectives);

    const aboutMe = `I'm an ${adjective} coach specializing in ${focus}. I'm committed to helping you unlock your potential and achieve your goals. ${faker.company.buzzPhrase()}`; // Adds a coaching buzzword

    return aboutMe;
  }

  const generateCoach: () => CoachInfo = () => {
    const addedCoach: CoachInfo = {
      role: "coach",
      name: faker.person.fullName(),
      avatar: "avatar_661cf19ca06caf5fb48b7e34",
      email: faker.internet.email(),
      gender: faker.helpers.arrayElement(genders),
      birthDate: generateBirthDate(),
      languages: faker.helpers.arrayElements(langs),
      about: generateCoachAbout(),
      skills: faker.helpers.arrayElements(skills),
      sertification: faker.helpers.arrayElement(sert),
      sertificationLevel: faker.helpers.arrayElements(sertLev),
      status: faker.helpers.arrayElement(status),
    };
    return addedCoach;
  };

  const addCoachToDB = async () => {
    const hash = await bcrypt.hash("easyone", 10);
    const createdUser = await CoachModel.create({
      ...generateCoach(),
      password: hash,
    });
    res.send(createdUser);
  };
  console.log("Generating random coach");
  addCoachToDB();
};
