const { BAD_REQUEST } = require("../errorCodes");

class BadRequestError extends Error {
  status: string;
  constructor(message: string) {
    super(message);
    this.status = BAD_REQUEST;
  }
}

module.exports = BadRequestError;
