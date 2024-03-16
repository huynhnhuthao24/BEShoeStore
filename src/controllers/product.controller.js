"use strict";

const { CREATE, SuccessResponse } = require("../core/success.response");
const ProductService = require("../services/product.service");

class ProductController {
  // handle refreshToken
  createProduct = async (req, res, next) => {
    new SuccessResponse({
      message: "Tạo sản phẩm thành công",
      metadata: await ProductService.factoryCreate(req.body.product_type, {
        ...req.body,
        product_store: req.body.product_store,
      }),
    }).send(res);
  };
  /**
   * @description Lấy tất cả sp nháp
   * @param {Number} limit
   * @param {Number} skip
   * @returns {JSON}
   *
   */
  getAllDratf = async (req, res, next) => {
    new SuccessResponse({
      message: "Lấy sản phẩm thành công",
      metadata: await ProductService.findAllDraftStore({
        product_store: req.keyStore.user,
      }),
    }).send(res);
  };
  /**
   * @description Lấy tất cả sp đã publish
   * @param {Number} limit
   * @param {Number} skip
   * @returns {JSON}
   *
   */
  getAllPublishProduct = async (req, res, next) => {
    new SuccessResponse({
      message: "Lấy sản phẩm thành công",
      metadata: await ProductService.findAllPublishProduct({
        product_store: req.keyStore.user,
      }),
    }).send(res);
  };
  publishProduct = async (req, res, next) => {
    new SuccessResponse({
      message: "Lấy sản phẩm thành công",
      metadata: await ProductService.publishProduct({
        product_store: req.keyStore.user,
        product_id: req.body.product_id,
      }),
    }).send(res);
  };
}

module.exports = new ProductController();
