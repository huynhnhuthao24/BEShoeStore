"use strict";

const { CREATE, SuccessResponse } = require("../core/success.response");
const ProductService = require("../services/product.service");

class ProductController {
  // handle refreshToken
  createProduct = async (req, res, next) => {
    new SuccessResponse({
      message: "Tạo sản phẩm thành công",
      metadata: await ProductService.createProduct(req.body.product_type, {
        ...req.body,
        product_store,
      }),
    }).send(res);
  };
}

module.exports = new ProductController();
