"use strict";

const express = require('express')
const router = express.Router()
const AccessController = require('../../controllers/access.controller')
const {asyncHandler} = require("../../helpers/asyncHandler");
const { authentication } = require('../../auth/auth.utils');


router.post('/shop/signup', asyncHandler(AccessController.signUp))
router.post('/shop/login', asyncHandler(AccessController.login))

/////////  authentication
router.use(authentication)
/////////

router.post('/shop/logout', asyncHandler(AccessController.logout))
router.post('/shop/refreshToken', asyncHandler(AccessController.handlerRefreshToken))

module.exports = router