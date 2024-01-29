"use strict";

const { Schema, model } = require("mongoose"); // Erase if already required

const DOCUMENT_NAME = "KeyApi";
const COLLECTIOM_NAME = "KeysApi";
// Declare the Schema of the Mongo model
var apiKeyModel = new Schema(
  {
    // apiKey
    key: {
      type: String,
      required: true,
      unique: true,
    },
    // status [key] work or not work
    status: {
      type: Boolean,
      default: true,
    },
    // quyền truy cập api
    permissions: {
      type: [String],
      required: true,
      enum: ["0000", "1111", "2222"],
    },
  },
  {
    timestamps: true,
    collection: COLLECTIOM_NAME,
  }
);

//Export the model
module.exports = model(DOCUMENT_NAME, apiKeyModel);
