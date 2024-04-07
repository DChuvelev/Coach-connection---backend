const { NOT_FOUND } = require("../errorCodes");

class NotFoundError extends Error {
  status: string;
  constructor(message: string) {
    super(message);
    this.status = NOT_FOUND;
  }
}

module.exports = NotFoundError;
