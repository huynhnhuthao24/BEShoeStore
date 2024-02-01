"use strict";

const keyApiModel = require("../models/keyApi.model");
const crypto = require("node:crypto");

const findKeyApi =async (key) => {
  const objKey =await keyApiModel.findOne({ key, status: true }).lean();
  return objKey;
};

module.exports = {
  findKeyApi,
};
