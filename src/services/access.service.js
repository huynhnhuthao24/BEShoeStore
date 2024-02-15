const storeModel = require("../models/store.model");
const { getInfoData } = require("../utils");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const KeyTokenService = require("./keyToken.service");
const { createKeyTokenPair, verifyToken } = require("../auth/authUtil");
const {
  BadRequestError,
  AuthFailureError,
  ForbbidenError,
} = require("../core/error.response");
const { matchEmail } = require("./store.service");

const roleStore = {
  SHOP: "SHOP",
  WRITE: "WRITE",
  EDITOR: "EDITOR",
  ADMIN: "AMDIN",
};
class AccessService {
  static handleRefreshToken = async ({ keyStore, user, refreshToken }) => {
    const { userId, email } = user;
    if (keyStore.refreshTokensUsed.includes(refreshToken)) {
      await KeyTokenService.deleteKeyById(userId);
      throw new ForbbidenError(
        "Phiên bản đăng nhập hết hạn,vui lòng đăng nhập lại"
      );
    }
    if (keyStore.refreshToken !== refreshToken) {
      new AuthFailureError("Store Not Register ");
    }
    const findStore = await matchEmail({ email });
    if (!findStore) throw new AuthFailureError("Store Not Register 2");
    // create new token
    const tokenPairs = await createKeyTokenPair(
      { userId: userId, email },
      keyStore.publicKey,
      keyStore.privateKey
    );
    await keyStore.updateOne({
      $set: {
        refreshToken: tokenPairs.refreshToken,
      },
      $addToSet: {
        refreshTokensUsed: refreshToken, // refreshToken này đã được sử dụng
      },
    });
    return {
      user,
      tokenPairs,
    };
  };

  static logOutService = async ({ keyStore }) => {
    const deleteKey = await KeyTokenService.removeKeyStoreId(keyStore._id);
    return deleteKey;
  };

  static signInService = async ({ email, password, refreshToken = null }) => {
    // check email
    const store = await matchEmail({ email });
    if (!store) {
      throw new BadRequestError("Error: Shop Not Exist");
    }
    // check password request to password DB
    const match = await bcrypt.compare(password, store.password);
    if (!match) {
      throw new AuthFailureError("Authentication Error");
    }
    // create Token
    const { privateKey, publicKey } = crypto.generateKeyPairSync("rsa", {
      modulusLength: 4096,
      publicKeyEncoding: {
        type: "pkcs1",
        format: "pem",
      },
      privateKeyEncoding: {
        type: "pkcs1",
        format: "pem",
      },
    });
    const publicKeyObject = crypto.createPublicKey(publicKey.toString());
    //  generate Token
    const tokenPairs = await createKeyTokenPair(
      { userId: store._id, email },
      publicKeyObject,
      privateKey
    );
    await KeyTokenService.createKeyToken({
      userId: store._id,
      refreshToken: tokenPairs.refreshToken,
      privateKey,
      publicKey,
    });
    console.log("ádasdasd", store);
    return {
      store: getInfoData({
        fields: ["_id", "name", "email", "phone"],
        object: store,
      }),
      tokenPairs,
    };
  };

  static signUpService = async ({ name, email, password, phone }) => {
    // check email
    const holderStore = await storeModel.findOne({ email }).lean();
    if (holderStore) {
      throw new BadRequestError("Error: Store Already Register");
    }

    const passwordHash = await bcrypt.hash(password, 10);
    console.log(passwordHash);
    const newStore = await storeModel.create({
      name,
      email,
      password: passwordHash,
      phone,
      status: "inactive",
      isVerify: false,
      roles: [roleStore.SHOP],
    });
    if (newStore) {
      // create privateKey,publicKey
      const { privateKey, publicKey } = crypto.generateKeyPairSync("rsa", {
        modulusLength: 4096,
        publicKeyEncoding: {
          type: "pkcs1",
          format: "pem",
        },
        privateKeyEncoding: {
          type: "pkcs1",
          format: "pem",
        },
      });
      // create collection keyToken with public key
      const publicKeyString = await KeyTokenService.createKeyToken({
        userId: newStore._id,
        publicKey,
        privateKey,
      });

      if (!publicKeyString) {
        throw new BadRequestError("Error: Public Key Error");
      }
      // change type public key [butter] -> public key [object]
      const publicKeyObject = crypto.createPublicKey(publicKeyString);
      // create token pairs
      const tokenPairs = await createKeyTokenPair(
        { userId: newStore._id, email },
        publicKeyObject,
        privateKey
      );

      return {
        store: getInfoData({
          fields: ["_id", "name", "email", "phone"],
          object: newStore,
        }),
        tokenPairs,
      };
    }
    return {
      code: 200,
      metadata: null,
    };
  };
}

module.exports = AccessService;
