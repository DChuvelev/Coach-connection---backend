const winston = require('winston');
const expressWinston = require('express-winston');

const messageFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.printf(({
    level,
    message,
    meta,
    timestamp
  }) => ` ${timestamp}, ${level}, ${meta.error?.stack} || ${message}`)
);

module.exports.requestLogger = expressWinston.logger({
  transports: [
    new winston.transports.Console({
      format: messageFormat
    }),
    new winston.transports.File({
      filename: 'requests.log',
      format: winston.format.json()
    })
  ]
})

module.exports.errorLogger = expressWinston.errorLogger({
  transports: [
    new winston.transports.Console({
      format: messageFormat
    }),
    new winston.transports.File({
      filename: 'errors.log',
      format: winston.format.json()
    })
  ]
})
