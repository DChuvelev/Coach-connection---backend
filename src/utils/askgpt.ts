import { NextFunction, Request, Response } from "express";

import { communicateWithAssistant } from "./GptApi";
import { InternalServerError } from "./errors/errorClasses";

export const chooseMeACoach = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log("Ask GPT start. Request message:");
  console.log(req.body.message);

  let respFromAssistant;
  try {
    respFromAssistant = await communicateWithAssistant(req.body.message);
    console.log(respFromAssistant);
    res.send(respFromAssistant);
  } catch (err) {
    if (err instanceof Error) {
      next(new InternalServerError(err.message));
    } else {
      next(new InternalServerError("Unknown error"));
    }
  }
};
