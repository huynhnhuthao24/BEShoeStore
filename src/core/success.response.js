"use strict";

const reasonPhrase = require("../constant/reasonPhrase");
const statusCodes = require("../constant/statusCode");

class SuccessResponse {
  constructor({
    message,
    statusCode = statusCodes.OK,
    reasonStatusCode = reasonPhrase.OK,
    metadata = {},
  }) {
    this.message = !message ? reasonStatusCode : message;
    this.statusCode = statusCode;
    this.metadata = metadata;
  }

  send(res, headers = {}) {
    return res.status(this.statusCode).json(this);
  }
}

class OK extends SuccessResponse {
  constructor({ message, metadata }) {
    super({ message, metadata });
  }
}

class CREATE extends SuccessResponse {
  constructor({
    message,
    statusCode = statusCodes.CREATED,
    reasonStatusCode = reasonPhrase.CREATED,
    metadata,
    option = {},
  }) {
    super({ option, message, statusCode, reasonStatusCode, metadata });
    this.option = option;
  }
}
module.exports = {
  OK,
  CREATE,
  SuccessResponse
};
