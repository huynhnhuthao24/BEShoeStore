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
class AuthFailureError extends ErrorReponse {
  constructor(
    message = reasonPhrase.UNAUTHORIZED,
    statusCode = statusCodes.UNAUTHORIZED
  ) {
    super(message, statusCode);
  }
}
class NotFoundError extends ErrorReponse {
  constructor(
    message = reasonPhrase.NOT_FOUND,
    statusCode = statusCodes.NOT_FOUND
  ) {
    super(message, statusCode);
  }
}
class ForbbidenError extends ErrorReponse {
  constructor(
    message = reasonPhrase.FORBIDDEN,
    statusCode = statusCodes.FORBIDDEN
  ) {
    super(message, statusCode);
  }
}

module.exports = {
  ConflictResquestError,
  BadRequestError,
  AuthFailureError,
  NotFoundError,
  ForbbidenError,
};
