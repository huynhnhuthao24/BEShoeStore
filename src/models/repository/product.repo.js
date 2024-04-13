"use strict";

const { getSelectData, unSelectData } = require("../../utils");
const { product } = require("../product.model");
const { Types } = require("mongoose");

const findAllDraftStore = async ({ query, limit = 50, skip = 0 }) => {
  const test = await queryProduct({ query, limit, skip });
  console.log("test", test);
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
  const data = await product
    .find(query)
    .populate("product_store", "name email -_id")
    .sort({
      updateAt: -1,
    })
    .skip(skip)
    .limit(limit)
    .lean()
    .exec();
  const totalCount = await product.countDocuments(query);
  return {
    product: data,
    totalCount,
  };
};
const findAllProduct = async ({ limit, sort, page, filter, select }) => {
  const skip = (page - 1) * limit;
  const sortBy = sort === "ctime" ? { _id: -1 } : { _id: 1 };
  const products = await product
    .find(filter)
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .select(getSelectData(select))
    .lean();
  return products;
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
const findProduct = async ({ product_id, unSelect }) => {
  return await product.findById(product_id).select(unSelectData(unSelect));
};

const updateProductById = async ({
  productId,
  objectPayload,
  model,
  isNew = true,
}) => {
  return await model.findByIdAndUpdate(productId, objectPayload, {
    new: isNew,
  });
};

module.exports = {
  findAllDraftStore,
  publishOrUnPublishProduct,
  findAllPublishProduct,
  searchProduct,
  findAllProduct,
  findProduct,
  updateProductById,
};
