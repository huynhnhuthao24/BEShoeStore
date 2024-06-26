const keyTokenModel = require("../models/keyToken.model");
const { Types } = require("mongoose");

class KeyTokenService {
  static createKeyToken = async ({
    userId,
    publicKey,
    privateKey,
    refreshToken,
  }) => {
    try {
      // const publicKeyString = publicKey.toString();
      // const token = await keyTokenModel.create({
      //   user: userId,
      //   publicKey: publicKeyString,
      // });
      // return token ? token.publicKey : null;
      const filter = { user: userId },
        update = {
          publicKey,
          privateKey,
          refreshTokenUsed: [],
          refreshToken,
        },
        options = { upsert: true, new: true };
      const tokens = await keyTokenModel.findOneAndUpdate(
        filter,
        update,
        options
      );
      return tokens ? tokens.publicKey : null;
    } catch (error) {}
  };

  static findUserId = async ({ userId }) => {
    return await keyTokenModel.findOne({ user: new Types.ObjectId(userId) });
  };

  static removeKeyStoreId = async (id) => {
    const deleteKey = await keyTokenModel.deleteOne(id);
    return deleteKey;
  };
  static findByTokenUsed = async (refreshToken) => {
    return await keyTokenModel
      .findOne({ refreshTokensUsed: refreshToken })
      .lean();
  };
  static findByRefreshToken = async (refreshToken) => {
    return await keyTokenModel.findOne({ refreshToken: refreshToken });
  };
  static deleteKeyById = async (userId) => {
    return await keyTokenModel.deleteOne({
      user: new Types.ObjectId(userId),
    });
  };
}
module.exports = KeyTokenService;
