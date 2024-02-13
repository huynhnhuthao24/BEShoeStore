"use strict";
const JWT = require("jsonwebtoken");
const asyncHandle = require("../helpers/asyncHandle");
const {
  BadRequestError,
  NotFoundError,
  AuthFailureError,
} = require("../core/error.response");
const { findUserId } = require("../services/keyToken.service");
const headers = require("../constant/headers");

const createKeyTokenPair = async (payload, publicKey, privateKey) => {
  try {
    // create access token
    const accessToken = await JWT.sign(payload, privateKey, {
      algorithm: "RS256",
      expiresIn: "2 days",
    });
    // create refresh Token
    const refreshToken = await JWT.sign(payload, privateKey, {
      algorithm: "RS256",
      expiresIn: "7 days",
    });
    JWT.verify(accessToken, publicKey, (err, decode) => {
      if (err) {
        console.error(`error verify`, err);
      } else {
        console.log(`decode verify`, decode);
      }
    });
    return { accessToken, refreshToken };
  } catch (error) {}
};

const authentication = asyncHandle(async (req, res, next) => {
  // 1 - check userId missing
  const userId = req.headers[headers.CLIENT_ID];
  if (!userId) throw new AuthFailureError("Invalid Request");
  // 2 - get accessToken
  const keyStore = await findUserId({ userId });
  if (!keyStore) throw new NotFoundError("Not Found Key Store");
  const refreshToken = req.headers[headers.REFRESH_TOKEN];
  if (refreshToken) {
    try {
      const decodeUser = JWT.verify(refreshToken, keyStore.privateKey);
      if (userId !== decodeUser.userId) {
        throw new AuthFailureError("Invalid User");
      }
      req.keyStore = keyStore;
      req.user = decodeUser;
      req.refreshToken = refreshToken;
      return next();
    } catch (error) {
      throw error;
    }
  }
  // 3 - verify Token
  const accessToken = req.headers[headers.AUTHORIZATION];
  if (!accessToken) throw new AuthFailureError("Invalid Request");
  try {
    const decodeUser = JWT.verify(accessToken, keyStore.publicKey);
    if (userId !== decodeUser.userId) {
      throw new AuthFailureError("Invalid User");
    }
    req.keyStore = keyStore;
    return next();
  } catch (error) {
    throw error;
  }
  // 4 - check user in db
  // 5 - check key store with this userId
  // 6 - Ok all => return next()
});

const verifyToken = async (token, ketSecret) => {
  return await JWT.verify(token, ketSecret);
};

module.exports = {
  createKeyTokenPair,
  authentication,
  verifyToken,
};
