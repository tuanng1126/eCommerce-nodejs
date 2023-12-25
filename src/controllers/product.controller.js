const ProductService = require("../services/product.service");
const { OK } = require("../core/success.response");

class ProductController {
  static createProduct = async (req, res, next) => {
    new OK({
      message: "Create new Product success!",
      metadata: await ProductService.createProduct(req.body.product_type, {
        ...req.body,
        product_shop: req.user.userId,
      }),
    }).send(res);
  };

  static updateProduct = async (req, res, next) => {
    new OK({
      message: "updateProduct success!",
      metadata: await ProductService.updateProduct(
        req.body.product_type,
        req.params.productId,
        {
          ...req.body,
          product_shop: req.user.userId,
        }
      ),
    }).send(res);
  };

  static getAllDraftForShop = async (req, res, next) => {
    new OK({
      message: "getAllDraftForShop success!",
      metadata: await ProductService.findAllDraftForShop({
        product_shop: req.user.userId,
      }),
    }).send(res);
  };

  static getAllPublishForShop = async (req, res, next) => {
    new OK({
      message: "getAllPublishForShop success!",
      metadata: await ProductService.findAllPublishForShop({
        product_shop: req.user.userId,
      }),
    }).send(res);
  };

  static publishProductByShop = async (req, res, next) => {
    new OK({
      message: "PublishProductByShop success!",
      metadata: await ProductService.publishProductByShop({
        product_shop: req.user.userId,
        product_id: req.params.id,
      }),
    }).send(res);
  };

  static unPublishProductByShop = async (req, res, next) => {
    new OK({
      message: "unPublishProductByShop success!",
      metadata: await ProductService.unPublishProductByShop({
        product_shop: req.user.userId,
        product_id: req.params.id,
      }),
    }).send(res);
  };

  static getListSearchProduct = async (req, res, next) => {
    new OK({
      message: "getListSearchProduct success!",
      metadata: await ProductService.searchProducts(req.params),
    }).send(res);
  };

  static getListAllProduct = async (req, res, next) => {
    new OK({
      message: "getListAllProduct success!",
      metadata: await ProductService.findAllProducts(req.query),
    }).send(res);
  };

  static getProduct = async (req, res, next) => {
    new OK({
      message: "getProduct success!",
      metadata: await ProductService.findProduct({
        product_id: req.params.product_id,
      }),
    }).send(res);
  };
}

module.exports = ProductController;
