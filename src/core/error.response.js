"use strict";

const reasonPhrase = require("../constant/reasonPhrase");
const statusCodes = require("../constant/statusCode");

class ErrorReponse extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

class ConflictResquestError extends ErrorReponse {
  constructor(
    message = reasonPhrase.CONFLICT,
    statusCode = statusCodes.FORBIDDEN
  ) {
    super(message, statusCode);
  }
}
class BadRequestError extends ErrorReponse {
  constructor(
    message = reasonPhrase.BAD_REQUEST,
    statusCode = statusCodes.BAD_REQUEST
  ) {
    super(message, statusCode);
  }
}

module.exports = {
  ConflictResquestError,
  BadRequestError,
};
