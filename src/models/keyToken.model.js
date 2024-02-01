"use strict";
const { Schema, model } = require("mongoose"); // Erase if already required

const DOCUMENT_NAME = "Key";
const COLLECTIOM_NAME = "Keys";

// Declare the Schema of the Mongo model
var keyTokenSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      require: true,
      ref: "Store",
    },
    publicKey: {
      type: Schema.Types.String,
      require: true,
    },
    privateKey:{
      type: Schema.Types.String,
      require: true,
    },
    refreshTokensUsed: {
      type: Schema.Types.Array,
      default: [],
    },
    refreshToken: {
      type: String,
      require: true,
    },
  },
  {
    timestamps: true,
    collection: COLLECTIOM_NAME,
  }
);

//Export the model
module.exports = model(DOCUMENT_NAME, keyTokenSchema);
