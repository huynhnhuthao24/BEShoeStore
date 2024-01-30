"use strict";
const express = require("express");
const AccessController = require("../../controllers/access.controller");
const { asyncHandle } = require("../../auth/checkAuth");
const router = express.Router();

router.post("/store/signup", asyncHandle(AccessController.signUp));

module.exports = router;
