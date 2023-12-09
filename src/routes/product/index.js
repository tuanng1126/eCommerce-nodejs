"use strict";

const express = require('express')
const router = express.Router()
const ProductController = require('../../controllers/product.controller')
const {asyncHandler} = require("../../helpers/asyncHandler");
const { authentication } = require('../../auth/auth.utils');


/////////  authentication
router.use(authentication)
/////////

router.post('', asyncHandler(ProductController.createProduct))

module.exports = router