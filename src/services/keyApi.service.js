"use strict";

const keyApiModel = require("../models/keyApi.model");
const crypto = require("node:crypto");

const findKeyApi =async (key) => {
  //   const newKey = await keyApiModel.create({
  //     key: crypto.randomBytes(64).toString("hex"),
  //     permissions: ["0000"],
  //   });
  const objKey =await keyApiModel.findOne({ key, status: true }).lean();
  return objKey;
};

module.exports = {
  findKeyApi,
};
