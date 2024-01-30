"use strict";

const AccessService = require("../services/access.service");

class AccessController {
  signUp = async (req, res, next) => {
    return res.status(201).json(
      await AccessService.signUpService({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
      })
    );
  };
}

module.exports = new AccessController();
