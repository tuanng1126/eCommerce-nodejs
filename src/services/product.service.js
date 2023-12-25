"use strict";

const {
  product,
  clothing,
  electronic,
  furniture,
} = require("../models/product.models");
const { BadRequest } = require("../core/error.response");
const {
  findAllDraftForShop,
  publishProductByShop,
  unPublishProductByShop,
  findAllPublishForShop,
  searchProduct,
  findAllProducts,
  findProduct,
  updateProductById,
} = require("../models/repositories/product.repo");
const {
  removeUndefinedObject,
  updateNestedObjectParser
} = require('../utils')

class ProductFactory {
  // static async createProduct(type, payload) {
  //   switch (type) {
  //     case "Electronic":
  //       return new Electronic(payload).createProduct();
  //     case "Clothing":
  //       console.log(new Clothing(payload));

  //       return new Clothing(payload).createProduct();
  //     default:
  //       throw new BadRequest(`Invalid product type ${type}`);
  //   }
  // }
  static productRegistry = {};
  static registerProductType(type, classRef) {
    ProductFactory.productRegistry[type] = classRef;
  }

  static async createProduct(type, payload) {
    const productClass = ProductFactory.productRegistry[type];
    if (!productClass) throw new BadRequest(`Invalid product type ${type}`);

    return new productClass(payload).createProduct();
  }

  static async updateProduct(type, productId, payload) {
    const productClass = ProductFactory.productRegistry[type];
    if (!productClass) throw new BadRequest(`Invalid product type ${type}`);

    return new productClass(payload).updateProduct(productId);
  }

  static async findAllDraftForShop({ product_shop, limit = 60, skip = 0 }) {
    const query = { product_shop, isDraft: true };
    return await findAllDraftForShop({ query, limit, skip });
  }

  static async findAllPublishForShop({ product_shop, limit = 60, skip = 0 }) {
    const query = { product_shop, isPublished: true };
    return await findAllPublishForShop({ query, limit, skip });
  }

  static async publishProductByShop({ product_shop, product_id }) {
    return await publishProductByShop({ product_shop, product_id });
  }

  static async unPublishProductByShop({ product_shop, product_id }) {
    return await unPublishProductByShop({ product_shop, product_id });
  }

  static async searchProducts({ keySearch }) {
    return searchProduct({ keySearch });
  }

  static async findAllProducts({
    limit = 50,
    sort = "ctime",
    page = 1,
    filter = { isPublished: true },
  }) {
    return findAllProducts({
      limit,
      sort,
      page,
      filter,
      select: ["product_name", "product_price", "product_thumb"],
    });
  }

  static async findProduct({ product_id }) {
    return findProduct({ product_id, unSelect: ["__v"] });
  }
}

class Product {
  constructor({
    product_name,
    product_thumb,
    product_description,
    product_price,
    product_quantity,
    product_type,
    product_shop,
    product_attributes,
  }) {
    this.product_name = product_name;
    this.product_thumb = product_thumb;
    this.product_description = product_description;
    this.product_price = product_price;
    this.product_quantity = product_quantity;
    this.product_type = product_type;
    this.product_shop = product_shop;
    this.product_attributes = product_attributes;
  }

  async createProduct(product_id) {
    return await product.create({
      ...this,
      _id: product_id,
    });
  }

  async updateProduct(product_id, bodyUpdate) {
    console.log(`bodyUpdate:::`, bodyUpdate)
    return await updateProductById({productId: product_id, bodyUpdate, model: product});
  }
}

class Clothing extends Product {
  async createProduct() {
    const newClothing = await clothing.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    });
    if (!newClothing) throw BadRequest("Create newClothing error");

    const newProduct = await super.createProduct(newClothing._id);
    if (!newProduct) throw BadRequest("Create newProduct error");
    return newProduct;
  }

  async updateProduct(product_id) {
    const objectParam = removeUndefinedObject(this);
    if (objectParam.product_attributes) {
      await updateProductById({
        productId: product_id,
        bodyUpdate: updateNestedObjectParser(removeUndefinedObject(objectParam.product_attributes)), 
        model: clothing})
    }
    const updateProduct = await super.updateProduct(product_id, updateNestedObjectParser(objectParam));
    return updateProduct;
  }
}

class Electronic extends Product {
  async createProduct() {
    const newElectronic = await electronic.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    });
    if (!newElectronic) throw BadRequest("Create newElectronic error");

    const newProduct = await super.createProduct(newElectronic._id);
    if (!newProduct) throw BadRequest("Create newProduct error");
    return newProduct;
  }
}

class Furniture extends Product {
  async createProduct() {
    const newFurniture = await furniture.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    });
    if (!newFurniture) throw BadRequest("Create newFurniture error");

    const newProduct = await super.createProduct(newFurniture._id);
    if (!newProduct) throw BadRequest("Create newProduct error");
    return newProduct;
  }
}

// register product type
ProductFactory.registerProductType("Electronic", Electronic);
ProductFactory.registerProductType("Clothing", Clothing);
ProductFactory.registerProductType("Furniture", Furniture);

module.exports = ProductFactory;
