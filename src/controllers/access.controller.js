"use strict";

const { CREATE, SuccessResponse } = require("../core/success.response");
const AccessService = require("../services/access.service");

class AccessController {
  signIn = async (req, res, next) => {
    new SuccessResponse({
      metadata: await AccessService.signInService(req.body),
    }).send(res);
  };
  signUp = async (req, res, next) => {
    new CREATE({
      message: "Registered OK!",
      metadata: await AccessService.signUpService(req.body),
    }).send(res);
  };
}

module.exports = new AccessController();
