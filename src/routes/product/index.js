"use strict";
const express = require("express");
const ProductController = require("../../controllers/product.controller");
const asyncHandle = require("../../helpers/asyncHandle");
const { authentication } = require("../../auth/authUtil");
const router = express.Router();

// authentication
router.use(authentication);
//
router.post("", asyncHandle(ProductController.createProduct));
// Query
router.post("/draft/allProducts", asyncHandle(ProductController.getAllDratf));

module.exports = router;
