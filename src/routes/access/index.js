"use strict";
const express = require("express");
const AccessController = require("../../controllers/access.controller");
const router = express.Router();

router.post("/store/signup",AccessController.signUp);

module.exports = router;
