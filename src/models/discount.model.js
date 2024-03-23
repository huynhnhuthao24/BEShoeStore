"use strict";

const { Schema, model } = require("mongoose"); // Erase if already required

const DOCUMENT_NAME = "Discount";
const COLLECTIOM_NAME = "Discounts";
// Declare the Schema of the Mongo model
var discountModel = new Schema(
  {
    // tên loại hình giảm giá
    discount_name: {
      type: String,
      require: true,
    },
    // mô tả giảm giá
    discount_description: {
      type: String,
      require: true,
    },
    // loại giảm giá
    discount_type: {
      type: String,
      default: "fixed_amount",
    },
    // giá trị của discount là bao nhiêu
    discount_value: {
      type: Number,
      require: true,
    },
    // mã giảm giá
    discount_code: {
      type: String,
      require: true,
    },
    // ngày bắt đầu giảm giá
    discount_start_date: {
      type: Date,
      require: true,
    },
    // ngày kết thúc giảm giá
    discount_end_date: {
      type: Date,
      require: true,
    },
    // số lượng discount dc áp dụng
    discount_max_use: {
      type: Number,
      require: true,
    },
    // số lần discount đã dùng
    discount_uses_count: {
      type: Number,
      require: true,
    },
    // ai đã sử dụng
    discount_uses_used: {
      type: Array,
      default: [],
    },
    // số lượng cho phép tối đa mỗi user
    discount_max_uses_per_user: {
      type: Number,
      require: true,
    },
    //  giá trị tối thiểu discount
    discount_max_value: {
      type: Number,
      require: true,
    },
    //  giá trị tối thiểu discount
    discount_min_value: {
      type: Number,
      require: true,
    },
    discount_store_id: {
      type: Schema.Types.ObjectId,
      ref: "Store",
    },
    discount_is_active: {
      type: Boolean,
      default: false,
    },
    // mã discount đc áp dụng cho sản phẩm nào
    discount_applies_to_product: {
      type: String,
      require: true,
      enum: ["all", "specific"],
    },
    // mã sp dc áp dụng
    discount_product_ids: {
      type: Array,
      default: [],
    },
  },
  {
    timestamps: true,
    collection: COLLECTIOM_NAME,
  }
);

//Export the model
module.exports = model(DOCUMENT_NAME, discountModel);
