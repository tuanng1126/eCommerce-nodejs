const ProductService = require('../services/product.service')
const {OK} = require('../core/success.response')

class ProductController {

    static createProduct = async (req, res, next) => {
        new OK({
            message: "Create new Product success!",
            metadata: await ProductService.createProduct(req.body.product_type,{
                ...req.body,
                product_shop: req.user.userId
            })
        }).send(res)
    }
}

module.exports = ProductController
