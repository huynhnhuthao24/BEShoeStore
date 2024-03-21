"use strict";

const _ = require("lodash");

const getInfoData = ({ fields = [], object = {} }) => {
  return _.pick(object, fields);
};

const getSelectData = (select = []) => {
  return Object.fromEntries(select.map((el) => [el, 1]));
};
const unSelectData = (select = []) => {
  return Object.fromEntries(select.map((el) => [el, 0]));
};
const removeNullOrUndefined = (object = {}) => {
  Object.keys(object).forEach((key) => {
    if (object[key] === null || object[key] === undefined) {
      delete object[k];
    }
  });
  return object;
};

const updateNestedObjectParse = (obj) => {
  const final = {};
  Object.keys(obj).forEach((key) => {
    if (typeof obj[key] === "object" && !Array.isArray(obj[key])) {
      const response = updateNestedObjectParse(obj[key]);
      Object.keys(response).forEach((k) => {
        final[`${k}.${a}`] = response[k];
      });
    } else {
      final[k] = obj[key];
    }
  });
  return final;
};

module.exports = {
  getInfoData,
  getSelectData,
  unSelectData,
  removeNullOrUndefined,
  updateNestedObjectParse,
};
