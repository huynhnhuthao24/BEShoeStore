"use strict";

const { product, clothing, electronic, funiture } = require("../product.model");
const { Types } = require("mongoose");

const findAllDraftStore = async ({ query, limit = 50, skip = 0 }) => {
  return await product
    .find(query)
    .populate("product_store", "name email -_id")
    .sort({
      updateAt: -1,
    })
    .skip(skip)
    .limit(limit)
    .lean()
    .exec();
};
const publishProduct = async ({ product_store, product_id }) => {
  const findStore = await product
    .findOne({
      product_store: new Types.ObjectId(product_store),
      _id: new Types.ObjectId(product_id),
    })
    .lean();
  if (!findStore) return null;
  findStore.isDraft = false;
  findStore.isPublished = true;
};

module.exports = {
  findAllDraftStore,
  publishProduct,
};
