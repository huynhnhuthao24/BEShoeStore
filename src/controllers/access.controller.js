"use strict";

const { CREATE, SuccessResponse } = require("../core/success.response");
const AccessService = require("../services/access.service");

class AccessController {
  // đăng xuất
  logOut = async (req, res, next) => {
    new SuccessResponse({
      message: "Logout Success",
      metadata: await AccessService.logOutService({ keyStore: req.keyStore }),
    }).send(res);
  };
  // đăng nhập
  signIn = async (req, res, next) => {
    new SuccessResponse({
      metadata: await AccessService.signInService(req.body),
    }).send(res);
  };
  // đăng kí
  signUp = async (req, res, next) => {
    new CREATE({
      message: "Registered OK!",
      metadata: await AccessService.signUpService(req.body),
    }).send(res);
  };
}

module.exports = new AccessController();
