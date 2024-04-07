const { CONFLICT } = require("../errorCodes");

class ConflictError extends Error {
  status: string;
  constructor(message: string) {
    super(message);
    this.status = CONFLICT;
  }
}

module.exports = ConflictError;
