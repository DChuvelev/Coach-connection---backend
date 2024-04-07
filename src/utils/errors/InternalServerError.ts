const { INTERNAL_SERVER_ERROR } = require("../errorCodes");

class InternalServerError extends Error {
  status: string;
  constructor(message: string) {
    super(message);
    this.status = INTERNAL_SERVER_ERROR;
  }
}

module.exports = InternalServerError;
