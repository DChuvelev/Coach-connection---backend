const { FORBIDDEN } = require("../errorCodes");

class ForbiddenError extends Error {
  status: string;
  constructor(message: string) {
    super(message);
    this.status = FORBIDDEN;
  }
}

module.exports = ForbiddenError;
