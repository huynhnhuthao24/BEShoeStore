"use strict";
const express = require("express");
const { apiKey, validPermission } = require("../auth/checkAuth");
const router = express.Router();

// check apiKey
router.use(apiKey);
// check permission
router.use(validPermission('0000'));
router.use("/v1/api", require("./access"));
// router.get("", (req, res, next) => {
//     return res.status(200).json({
//       message: "test",
//     });
//   });

module.exports = router;
