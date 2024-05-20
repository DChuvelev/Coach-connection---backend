import path from "path";
import { connect } from "mongoose";
import { type Response, type Request, type NextFunction } from "express";
require("dotenv").config({
  path: path.join(__dirname, "..", ".env"),
});
import cors from "cors";
import bodyParser from "body-parser";
import helmet from "helmet";
import { errors } from "celebrate";
import routes from "./routes/index";
import type session from "express-session";
import initializeWebsocketServer from "./utils/websocket/websocket";
import express from "express";
import {
  validateCreateUserData,
  validateLoginData,
} from "./middleware/validation";
import { login, createUser } from "./controllers/users";

import { requestLogger, errorLogger } from "./middleware/logger";
import type { InternalServerError } from "./utils/errors/errorClasses";

const { PORT = 3001 } = process.env;
declare module "express" {
  interface Request {
    session: session.Session & Partial<session.SessionData>;
  }
}

export const userpicsPath = path.join(
  __dirname,
  "..",
  "..",
  "data",
  "userpics"
);
console.log(userpicsPath);

const app = express();

app.use(helmet());

export const corsOptions: cors.CorsOptions = {
  origin: [
    "http://localhost:5173",
    "https://coachfind.me",
    "https://www.coachfind.me",
  ],
};

app.use(cors(corsOptions));

console.log(`The app is runnung in ${process.env.NODE_ENV} mode.`);

const connectToDatabase = async (): Promise<void> => {
  try {
    await connect("mongodb://127.0.0.1:27017/coach-connection");
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
};

void connectToDatabase();

app.use("/avatars", (req: Request, res: Response, next: NextFunction) => {
  res.set("Cross-Origin-Resource-Policy", "cross-origin");
  next();
});
app.use("/avatars", express.static(userpicsPath));

app.use(bodyParser.json());
app.use("/", routes);

app.use(requestLogger);

app.post("/signin", validateLoginData, login);
// app.get("/signup", createUser);
app.post("/signup", validateCreateUserData, createUser);
app.use("/", routes);

app.use(errorLogger);

app.use(errors());

app.use(
  (
    err: InternalServerError,
    req: Request,
    res: Response,
    next: NextFunction
  ): void => {
    console.log(`${err.message}. Error status: ${err.status}`);
    const { status = 500, message } = err;
    res.status(status).send({
      message: status === 500 ? "Internal server error" : message,
    });
  }
);

const httpServer = app.listen(PORT, () => {
  console.log(`App listening to port ${PORT}`);
});

initializeWebsocketServer(httpServer);
