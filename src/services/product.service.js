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
  findAllProduct,
  findProduct,
  updateProductById,
} = require("../models/repository/product.repo");
const { removeNullOrUndefined, updateNestedObjectParse } = require("../utils");
const { insertInventory } = require("../models/repository/inventory.repo");
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

  static async factoryCreate(type, payload) {
    const productClass = ProductFactory.productRegister[type];

    if (!productClass) throw new BadRequestError(`Invalid Type ${type}`);
    return new productClass(payload).createProduct();
  }

  static async updateProduct(type, productId, payload) {
    const productClass = ProductFactory.productRegister[type];

    if (!productClass) throw new BadRequestError(`Invalid Type ${type}`);
    return new productClass(payload).updateProduct(productId);
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

  static async findAllProducts({
    limit = 50,
    sort = "ctime",
    page = 1,
    filter = { isPublished: true },
  }) {
    return await findAllProduct({
      limit,
      sort,
      filter,
      page,
      select: ["product_name", "product_price", "product_thumb"],
    });
  }

  static async productDetail({ product_id }) {
    return await findProduct({
      product_id,
      unSelect: ["__v", "product_variations"],
    });
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
  async createProduct(productId) {
    const newProduct = await product.create({ ...this, _id: productId });
    if (newProduct) {
      await insertInventory({
        productId: newProduct._id,
        shopId: this.product_store,
        stock: this.product_quantity,
      });
    }
    return newProduct;
  }
  async updateProduct(productId, objectPayload) {
    return await updateProductById({
      productId,
      objectPayload,
      model: product,
    });
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
  async updateProduct(productId) {
    const objectPayload = removeNullOrUndefined(this);
    if (objectPayload.product_attributes) {
      await updateProductById({
        productId,
        objectPayload: updateNestedObjectParse(objectPayload),
        model: clothing,
      });
    }
    const updateProduct = await super.updateProduct(
      productId,
      updateNestedObjectParse(objectPayload)
    );
    return updateProduct;
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
