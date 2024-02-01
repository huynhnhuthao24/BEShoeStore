const keyTokenModel = require("../models/keyToken.model");

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
      console.log("ádasd", tokens);
      return tokens ? tokens.publicKey : null;
    } catch (error) {}
  };
}
module.exports = KeyTokenService;
