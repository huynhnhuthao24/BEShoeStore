"use strict";
const express = require("express");
const ProductController = require("../../controllers/product.controller");
const asyncHandle = require("../../helpers/asyncHandle");
const { authentication } = require("../../auth/authUtil");
const router = express.Router();

router.get("/search/:keyWord", asyncHandle(ProductController.searchProducts));
router.get("/allProducts", asyncHandle(ProductController.findAllProduct));
router.get(
  "/productDetail/:product_id",
  asyncHandle(ProductController.getProductDetail)
);
// authentication
router.use(authentication);
//
router.post("/createProduct", asyncHandle(ProductController.createProduct));
router.patch(
  "/updateProduct/:product_id",
  asyncHandle(ProductController.updateProduct)
);
router.post("/publish", asyncHandle(ProductController.publishProduct));
router.post("/unPublish", asyncHandle(ProductController.unPublishProduct));
// Query
router.get("/draft/allProducts", asyncHandle(ProductController.getAllDratf));
router.get(
  "/publish/allProducts",
  asyncHandle(ProductController.getAllPublishProduct)
);

module.exports = router;
