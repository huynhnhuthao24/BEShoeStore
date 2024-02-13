"use strict";

const mongoose = require("mongoose"); // Erase if already required

const DOCUMENT_NAME = "Product";
const COLLECTIOM_NAME = "Products";
// Declare the Schema of the Mongo model
const productModel = new mongoose.Schema(
  {
    product_name: {
      type: String,
      required: true,
    },
    product_thumb: {
      type: String,
      required: true,
    },
    product_description: {
      type: String,
    },
    product_price: {
      type: Number,
      required: true,
    },
    product_quantity: {
      type: Number,
      require: true,
    },
    product_type: {
      type: [String],
      require: true,
      enum: ["Clothes", "Electronics"],
      default: [],
    },
    product_store: {
      type: mongoose.Schema.ObjectId,
      ref: "Store",
    },
    product_attributes: {
      type: mongoose.Schema.Types.Mixed,
      require: true,
    },
  },
  {
    timestamps: true,
    collection: COLLECTIOM_NAME,
  }
);

const clothingModel = new mongoose.Schema(
  {
    brand: { type: String, require: true },
    size: String,
    material: String,
    color: String,
  },
  {
    timestamps: true,
    collection: "Clothes",
  }
);
const electronicModel = new mongoose.Schema(
  {
    manufacturer: { type: String, require: true },
    model: String,
    color: String,
  },
  {
    timestamps: true,
    collection: "Electronics",
  }
);
//Export the model
module.exports = {
  product: mongoose.model(DOCUMENT_NAME, productModel),
  clothing: mongoose.model("Clothes", clothingModel),
  electronic: mongoose.model("Electronics", electronicModel),
};
