const { UNAUTHORIZED } = require("../errorCodes");

class UnauthorizedError extends Error {
  status: string;
  constructor(message: string) {
    super(message);
    this.status = UNAUTHORIZED;
  }
}

module.exports = UnauthorizedError;
