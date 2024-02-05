"Use Strict";


const headers = require("../constant/headers");
const { findKeyApi } = require("../services/keyApi.service");

// check req api key
const apiKey = async (req, res, next) => {
  try {
    const key = req.headers[headers.API_KEY]?.toString();
    if (!key) {
      return res.status(403).json({
        message: "Forbidden Error",
      });
    }
    const objKey = await findKeyApi(key);
    console.log("objKey", objKey, key);
    if (!objKey) {
      return res.status(403).json({
        message: "Forbidden Error",
      });
    }
    req.objKey = objKey;
    return next();
  } catch (error) {
    console.log(error);
  }
};
//  validate permisstion
const validPermission = (permission) => {
  return (req, res, next) => {
    if (!req.objKey.permissions) {
      return res.status(403).json({
        message: "Permission Denied",
      });
    }
    const validPermission = req.objKey?.permissions?.includes(permission);
    if (!validPermission) {
      return res.status(403).json({
        message: "Permission Denied",
      });
    }
    return next();
  };
};

module.exports = {
  apiKey,
  validPermission,
};
