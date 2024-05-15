require("dotenv").config();
import { connect } from "mongoose";
import { Response, Request, NextFunction, Express } from "express";
import path from "path";

const { PORT = 3001 } = process.env;
const express = require("express");

import cors from "cors";
import bodyParser from "body-parser";
import helmet from "helmet";
import { errors } from "celebrate";
import { routes } from "./routes/index";
import { createServer, Server } from "http";
import session from "express-session";
import initializeWebsocketServer from "./utils/websocket/websocket";
declare module "express" {
  interface Request {
    session: session.Session & Partial<session.SessionData>;
  }
}

const { login, createUser } = require("./controllers/users");
const {
  validateCreateUserData,
  validateLoginData,
} = require("./middleware/validation");
const { requestLogger, errorLogger } = require("./middleware/logger");

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
  origin: "http://localhost:5173",
};

app.use(cors(corsOptions));

console.log(`The app is runnung in ${process.env.NODE_ENV} mode.`);
connect("mongodb://127.0.0.1:27017/coach-connection");

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

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.log(`${err.message}. Error status: ${err.status}`);
  const { status = 500, message } = err;
  res.status(status).send({
    message: status === 500 ? "Internal server error" : message,
  });
});

const httpServer = app.listen(PORT, () => {
  console.log(`App listening to port ${PORT}`);
});

initializeWebsocketServer(httpServer);
