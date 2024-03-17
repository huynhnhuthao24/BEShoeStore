"use strict";

const { Types } = require("mongoose");
const { BadRequestError } = require("../core/error.response");
const {
  electronic: electronic,
  product: product,
  clothing: clothing,
  funiture: funiture,
} = require("../models/product.model");
const {
  findAllDraftStore,
  findAllPublishProduct,
  publishOrUnPublishProduct,
  searchProduct,
} = require("../models/repository/product.repo");
// define Factory class to create Product
class ProductFactory {
  /*
        type: 'Clothing',
        payload:data
    */
  static productRegister = {};
  static registerProductType(type, classRef) {
    ProductFactory.productRegister[type] = classRef;
  }
  static async factoryCreate(type, payload) {
    const productClass = ProductFactory.productRegister[type];

    if (!productClass) throw new BadRequestError(`Invalid Type ${type}`);
    return new productClass(payload).createProduct();
  }
  // Publish Product
  static async publishProduct({ product_store, product_id }) {
    return await publishOrUnPublishProduct({ product_store, product_id });
  }
  // unPublish Product
  static async unPublishProduct({
    product_store,
    product_id,
    unPublish = true,
  }) {
    return await publishOrUnPublishProduct({
      product_store,
      product_id,
      unPublish,
    });
  }

  // query
  static async findAllDraftStore({ product_store, limit = 50, skip = 0 }) {
    const query = {
      product_store,
      isDraft: true,
    };
    return await findAllDraftStore({ query, limit, skip });
  }
  static async findAllPublishProduct({ product_store, limit = 50, skip = 0 }) {
    const query = {
      product_store,
      isPublished: true,
    };
    return await findAllPublishProduct({ query, limit, skip });
  }
  // search Product
  static async findAllDraftStore({ product_store, limit = 50, skip = 0 }) {
    const query = {
      product_store,
      isDraft: true,
    };
    return await findAllDraftStore({ query, limit, skip });
  }
  static async searchProducts({ keyWord }) {
    return await searchProduct({ keyWord });
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

class Funitures extends Product {
  async createProduct() {
    const newFuniture = await funiture.create({
      ...this.product_attributes,
      product_store: this.product_store,
    });
    if (!newFuniture) throw new BadRequestError("Thêm sản phẩm thất bại");

    const newProduct = await super.createProduct(newFuniture._id);
    if (!newProduct) throw new BadRequestError("Thêm sản phẩm thất bại");
    return newProduct;
  }
}

ProductFactory.registerProductType("Clothes", Clothing);
ProductFactory.registerProductType("Electronics", Electronics);
ProductFactory.registerProductType("Funitures", Funitures);

module.exports = ProductFactory;
