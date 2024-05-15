import { Router } from "express";
export const gptRouter = Router();
import { chooseMeACoach, generateFeedback } from "../utils/askgpt";
gptRouter.post("/chooseMeACoach", chooseMeACoach);
gptRouter.post("/generateFeedback", generateFeedback);
