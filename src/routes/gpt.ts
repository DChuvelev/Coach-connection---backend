import { Router } from "express";
export const gptRouter = Router();
import { chooseMeACoach } from "../utils/askgpt";
gptRouter.post("/chooseMeACoach", chooseMeACoach);
