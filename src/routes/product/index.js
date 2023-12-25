"use strict";

const express = require('express')
const router = express.Router()
const ProductController = require('../../controllers/product.controller')
const {asyncHandler} = require("../../helpers/asyncHandler");
const { authentication } = require('../../auth/auth.utils');


router.get('/search/:keySearch', asyncHandler(ProductController.getListSearchProduct))
router.get('', asyncHandler(ProductController.getListAllProduct))
router.get('/:product_id', asyncHandler(ProductController.getProduct))
/////////  authentication
router.use(authentication)
/////////

router.post('', asyncHandler(ProductController.createProduct))
router.patch('/:productId', asyncHandler(ProductController.updateProduct))
router.post('/publish/:id', asyncHandler(ProductController.publishProductByShop))
router.post('/unpublish/:id', asyncHandler(ProductController.unPublishProductByShop))
router.get('/drafts/all', asyncHandler(ProductController.getAllDraftForShop))
router.get('/published/all', asyncHandler(ProductController.getAllPublishForShop))

module.exports = router