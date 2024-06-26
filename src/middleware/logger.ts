import winston from "winston";
import expressWinston from "express-winston";

const messageFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.printf(
    ({ level, message, meta, timestamp }) =>
      ` ${timestamp}, ${level}, ${meta.error?.stack} || ${message}`
  )
);

export const requestLogger = expressWinston.logger({
  transports: [
    new winston.transports.Console({
      format: messageFormat,
    }),
    new winston.transports.File({
      filename: "requests.log",
      format: winston.format.json(),
    }),
  ],
});
export const errorLogger = expressWinston.errorLogger({
  transports: [
    new winston.transports.Console({
      format: messageFormat,
    }),
    new winston.transports.File({
      filename: "errors.log",
      format: winston.format.json(),
    }),
  ],
});
