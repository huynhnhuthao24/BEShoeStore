"use strict";

const mongoose = require("mongoose"); // Erase if already required
const slugify = require("slugify");

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
      enum: ["Clothes", "Electronics", "Funitures"],
      default: [],
    },
    product_slug: {
      type: String,
    },
    product_store: {
      type: mongoose.Schema.ObjectId,
      ref: "Store",
    },
    product_ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, "Rating must be above 1.0"],
      max: [5, "Rating must be above 5.0"],
      set: (val) => Math.round(val * 10) / 10,
    },
    product_variations: {
      type: Array,
      default: [],
    },
    isDraft: {
      type: Boolean,
      default: true,
      index: true,
      select: false,
    },
    isPublished: {
      type: Boolean,
      default: false,
      index: true,
      select: false,
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
// Document middleware: run before .save() and .create()
productModel.pre("save", function (next) {
  this.product_slug = slugify(this.product_name, { lower: true });
  next();
});
//  create index search
productModel.index({ product_name: "text", product_description: "text" });

const clothingModel = new mongoose.Schema(
  {
    brand: { type: String, require: true },
    size: String,
    material: String,
    color: String,
    product_store: {
      type: mongoose.Schema.ObjectId,
      ref: "Store",
    },
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
    product_store: {
      type: mongoose.Schema.ObjectId,
      ref: "Store",
    },
  },
  {
    timestamps: true,
    collection: "Electronics",
  }
);
const funitureModel = new mongoose.Schema(
  {
    brand: { type: String, require: true },
    size: String,
    material: String,
    color: String,
    product_store: {
      type: mongoose.Schema.ObjectId,
      ref: "Store",
    },
  },
  {
    timestamps: true,
    collection: "Funitures",
  }
);
//Export the model
module.exports = {
  product: mongoose.model(DOCUMENT_NAME, productModel),
  clothing: mongoose.model("Clothes", clothingModel),
  electronic: mongoose.model("Electronics", electronicModel),
  funiture: mongoose.model("Funitures", funitureModel),
};
