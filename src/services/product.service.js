"use strict";

const { BadRequestError } = require("../core/error.response");
const {
  electronic: electronic,
  product: product,
  clothing: clothing,
} = require("../models/product.model");
// define Factory class to create Product
class ProductFactory {
  /*
        type: 'Clothing',
        payload:data
    */
  static async createProduct(type, payload) {
    switch (type) {
      case "Electonics":
        return new Electronics(payload).createProduct();
      case "Clothes":
        return new Clothing(payload).createProduct();
      default:
        throw new BadRequestError(`Invalid Product Type ${type}`);
    }
  }
}
// define base product class
class Product {
  constructor({
    product_name,
    product_thumb,
    product_description,
    product_price,
    product_quantity,
    product_type,
    product_store,
    product_attributes,
  }) {
    this.product_name = product_name;
    this.product_thumb = product_thumb;
    this.product_description = product_description;
    this.product_price = product_price;
    this.product_quantity = product_quantity;
    this.product_type = product_type;
    this.product_store = product_store;
    this.product_attributes = product_attributes;
  }
  async createProduct(product_id) {
    return await product.create({ ...this, _id: product_id });
  }
}
// define sub-class
class Clothing extends Product {
  async createProduct() {
    const newClothing = await clothing.create({
      ...this.product_attributes,
      product_store: this.product_store,
    });
    if (!newClothing) throw new BadRequestError("Thêm sản phẩm thất bại");

    const newProduct = await super.createProduct(newClothing._id);
    if (!newProduct) throw new BadRequestError("Thêm sản phẩm thất bại");
    return newProduct;
  }
}

class Electronics extends Product {
  async createProduct() {
    const newElectronic = await electronic.create({
      ...this.product_attributes,
      product_store: this.product_store,
    });
    if (!newElectronic) throw new BadRequestError("Thêm sản phẩm thất bại");

    const newProduct = await super.createProduct(newElectronic._id);
    if (!newProduct) throw new BadRequestError("Thêm sản phẩm thất bại");
    return newProduct;
  }
}

module.exports = ProductFactory;
