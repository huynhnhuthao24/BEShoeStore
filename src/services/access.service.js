const storeModel = require("../models/store.model");
const { getInfoData } = require("../utils");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const KeyTokenService = require("./keyToken.service");
const { createKeyTokenPair } = require("../auth/authUtil");
const { BadRequestError } = require("../core/error.response");
const roleStore = {
  SHOP: "SHOP",
  WRITE: "WRITE",
  EDITOR: "EDITOR",
  ADMIN: "AMDIN",
};
class AccessService {
  static signUpService = async ({ name, email, password }) => {
    // check email
    const holderStore = await storeModel.findOne({ email }).lean();
    if (holderStore) {
      throw new BadRequestError("Error: Shop Already Register");
    }

    const passwordHash = await bcrypt.hash(password, 10);
    console.log(passwordHash);
    const newStore = await storeModel.create({
      name,
      email,
      password: passwordHash,
      status: "inactive",
      verify: false,
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
        code: 201,
        metadata: {
          store: getInfoData({
            fields: ["_id", "name", "email"],
            object: newStore,
          }),
          tokenPairs,
        },
      };
    }
    return {
      code: 200,
      metadata: null,
    };
  };
}

module.exports = AccessService;
