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
      message: "Publish sản phẩm thành công",
      metadata: await ProductService.publishProduct({
        product_store: req.user.userId,
        product_id: req.body.product_id,
      }),
    }).send(res);
  };

  unPublishProduct = async (req, res, next) => {
    new SuccessResponse({
      message: "UnPublish sản phẩm thành công",
      metadata: await ProductService.unPublishProduct({
        product_store: req.user.userId,
        product_id: req.body.product_id,
      }),
    }).send(res);
  };

  searchProducts = async (req, res, next) => {
    new SuccessResponse({
      // message: "Publish sản phẩm thành công",
      metadata: await ProductService.searchProducts(req.params),
    }).send(res);
  };

  findAllProduct = async (req, res, next) => {
    new SuccessResponse({
      message: "Lấy dữ liệu thành công",
      metadata: await ProductService.findAllProducts(req.query),
    }).send(res);
  };

  getProductDetail = async (req, res, next) => {
    new SuccessResponse({
      message: "Lấy dữ liệu thành công",
      metadata: await ProductService.productDetail({
        product_id: req.params.product_id,
      }),
    }).send(res);
  };

  updateProduct = async (req, res, next) => {
    new SuccessResponse({
      message: "Cập nhật sản phẩm thành công",
      metadata: await ProductService.updateProduct(
        req.body.product_type,
        req.params.product_id,
        {
          ...req.body,
          product_store: req.user.userId,
        }
      ),
    }).send(res);
  };
}

module.exports = new ProductController();
