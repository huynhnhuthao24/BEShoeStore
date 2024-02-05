"use strict";
const express = require("express");
const AccessController = require("../../controllers/access.controller");
const asyncHandle = require("../../helpers/asyncHandle");
const { authentication } = require("../../auth/authUtil");
const router = express.Router();

router.post("/store/signup", asyncHandle(AccessController.signUp));
router.post("/store/signIn", asyncHandle(AccessController.signIn));

// authentication
router.use(authentication);
//
router.post("/store/logout", asyncHandle(AccessController.logOut));

module.exports = router;
