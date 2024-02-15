"use strict";

const storeModel = require("../models/store.model");

const matchEmail = async ({
  email,
  select = {
    email: 1,
    password: 2,
    name: 1,
    phone: 1,
    status: 1,
    roles: 1,
  },
}) => {
  return await storeModel.findOne({ email }).select(select).lean();
};

module.exports = {
  matchEmail,
};
