"use strict";

const { unSelectData, getSelectData } = require("../../utils");
const discountModel = require("../discount.model");

const findDiscount = async ({ code, storeId }) => {
  return await discountModel
    .findOne({
      discount_code: code,
      discount_store_id: convertToObjectIdMongo(storeId),
    })
    .lean();
};
const findAllDiscountUnSelect = async ({
  filter,
  unSelect,
  model,
  limit = 50,
  sort = "ctime",
  page = 1,
}) => {
  const skip = (page - 1) * limit;
  const sortBy = sort === "ctime" ? { _id: -1 } : { _id: 1 };
  const document = await model
    .find(filter)
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .select(unSelectData(unSelect))
    .lean();
  return document;
};
const findAllDiscountSelect = async ({
  filter,
  select,
  model,
  limit = 50,
  sort = "ctime",
  page = 1,
}) => {
  const skip = (page - 1) * limit;
  const sortBy = sort === "ctime" ? { _id: -1 } : { _id: 1 };
  const document = await model
    .find(filter)
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .select(getSelectData(select))
    .lean();
  return document;
};

module.exports = {
  findDiscount,
  findAllDiscountUnSelect,
  findAllDiscountSelect,
};
