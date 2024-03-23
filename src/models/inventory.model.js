"use strict";

const { Schema, model } = require("mongoose"); // Erase if already required

const DOCUMENT_NAME = "Inventory";
const COLLECTIOM_NAME = "Inventories";
// Declare the Schema of the Mongo model
var inventoryModel = new Schema(
  {
    inven_ProductId: {
      type: Schema.Types.ObjectId,
      ref: "Product",
    },
    inven_location: { type: String, default: "unKnow" },
    inven_stock: { type: Number, require: true },
    inven_storeId: {
      type: Schema.Types.ObjectId,
      ref: "Store",
    },
    inven_reservations: {
      type: Array,
      default: [],
    },
  },
  {
    timestamps: true,
    collection: COLLECTIOM_NAME,
  }
);

//Export the model
module.exports = {
  inventory: model(DOCUMENT_NAME, inventoryModel),
};
