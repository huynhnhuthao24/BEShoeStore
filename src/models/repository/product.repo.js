"use strict";

const { product, clothing, electronic, funiture } = require("../product.model");
const { Types } = require("mongoose");

const findAllDraftStore = async ({ query, limit = 50, skip = 0 }) => {
  return await queryProduct({ query, limit, skip });
};
const findAllPublishProduct = async ({ query, limit = 50, skip = 0 }) => {
  return await queryProduct({ query, limit, skip });
};
const publishOrUnPublishProduct = async ({
  product_store,
  product_id,
  unPublish = false,
}) => {
  const findStore = await product.findOne({
    product_store: new Types.ObjectId(product_store),
    _id: new Types.ObjectId(product_id),
  });
  if (!findStore) return null;
  if (unPublish) {
    findStore.isDraft = true;
    findStore.isPublished = false;
  } else {
    findStore.isDraft = false;
    findStore.isPublished = true;
  }
  const { modifiedCount } = await findStore.updateOne(findStore);
  return modifiedCount;
};

const queryProduct = async ({ query, limit, skip }) => {
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
const searchProduct = async ({ keyWord }) => {
  const regexSearch = new RegExp(keyWord);
  const result = await product
    .find(
      { isDraft: false, $text: { $search: regexSearch } },
      { score: { $meta: "textScore" } }
    )
    .sort({ score: { $meta: "textScore" } })
    .lean();
  return result;
};

module.exports = {
  findAllDraftStore,
  publishOrUnPublishProduct,
  findAllPublishProduct,
  searchProduct,
};
