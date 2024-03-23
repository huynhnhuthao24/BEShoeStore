"use strict";

const { BadRequestError, NotFoundError } = require("../core/error.response");
const discountModel = require("../models/discount.model");
const { product } = require("../models/product.model");
const {
  findDiscount,
  findAllDiscountUnSelect,
} = require("../models/repository/discount.repo");
const { findAllProduct } = require("../models/repository/product.repo");
const { convertToObjectIdMongo } = require("../utils");

class DiscountService {
  static async createDiscount(payload) {
    const {
      code,
      start_date,
      end_date,
      is_active,
      storeId,
      min_order_value,
      product_ids,
      applies_to_product,
      discount_name,
      discount_description,
      discount_type,
      discount_value,
      max_value,
      max_user,
      uses_count,
      max_uses_per_user,
      uses_used,
      limit,
      page,
    } = payload;
    if (new Date() < new Date(start_date) || new Date() > new Date(end_date)) {
      throw new BadRequestError("Phiếu giảm giá đã quá hạn sử dụng");
    }
    if (new Date(start_date) >= new Date(end_date)) {
      throw new BadRequestError("Ngày bắt đầu đã quá hạn");
    }
    // create index for discount code
    const foundDiscount = await findDiscount({ code, storeId });
    if (foundDiscount && foundDiscount.discount_is_active) {
      throw new BadRequestError("Phiếu giảm giá đã tồn tại");
    }
    const discount = discountModel.create({
      discount_name,
      discount_description,
      discount_type,
      discount_code: code,
      discount_value,
      discount_min_value: min_order_value,
      discount_max_value: max_value,
      discount_start_date: new Date(start_date),
      discount_end_date: new Date(end_date),
      discount_max_use: max_user,
      discount_uses_count: uses_count,
      discount_uses_used: uses_used,
      discount_store_id: storeId,
      discount_max_uses_per_user: max_uses_per_user,
      discount_is_active: is_active,
      discount_product_ids: applies_to_product === "all" ? [] : product_ids,
      discount_applies_to_product: applies_to_product,
    });
    return discount;
  }
  static async updateDiscountCode() {}

  static async getAllDiscountCodeWithProduct({
    code,
    storeId,
    userId,
    limit,
    page,
  }) {
    const foundDiscount = await findDiscount({ code, storeId });
    if (!foundDiscount || !foundDiscount.discount_is_active) {
      throw new NotFoundError("Không tìm thấy thông tin mã giảm giá");
    }
    const { discount_applies_to_product, discount_product_ids } = foundDiscount;
    if (discount_applies_to_product === "all") {
      // get all product
      const products = await findAllProduct({
        filter: {
          product_store: convertToObjectIdMongo(storeId),
          isPublished: true,
        },
        limit,
        page,
        select: ["product_name"],
        sort: "ctime",
      });
      return products;
    }
    if (discount_applies_to_product === "specific") {
      const products = await findAllProduct({
        filter: { _id: { $in: discount_product_ids }, isPublished: true },
        limit,
        page,
        select: ["product_name"],
        sort: "ctime",
      });
      return products;
    }
  }
  static async getAllDiscountByStore(payload) {
    const { storeId, limit, page } = payload;
    const discounts = await findAllDiscountUnSelect({
      limit: +limit,
      page: +page,
      filter: {
        discount_store_id: convertToObjectIdMongo(storeId),
        discount_is_active: true,
      },
      model: discountModel,
      unSelect: ["__v", "discount_store_id"],
    });
    return discounts;
  }
}
