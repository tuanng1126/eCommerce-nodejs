'use strict';

const ShopModel = require('../models/shop.model')
const bcrypt = require('bcrypt')
const crypto = require("crypto");
const KeyTokenService = require('./keyToken.service');
const createTokenPair = require('../auth/auth.utils');
const getInfoData = require('../utils');

const RoleShop = {
    SHOP: "SHOP",
    WRITER: "WRITER",
    EDITOR: "EDITOR",
    ADMIN: "ADMIN"
}

class AccessService {
    static signUp = async ({ name, email, password}) => {
        try {
            const shop = await ShopModel.findOne({email}).lean()
            if (shop) {
                return {
                    code: 'xxx',
                    message: 'Shop already registered!'
                }
            }
            
            const passwordHash = await bcrypt.hash(password, 10)
            const newShop = await ShopModel.create({
                name, email, password: passwordHash, roles: [RoleShop.SHOP]
            })
            if (newShop) {
                const privateKey = crypto.randomBytes(64).toString('hex')
                const publicKey = crypto.randomBytes(64).toString('hex')
                const keyStore = await KeyTokenService.createKeyToken({
                    userId: newShop._id,
                    privateKey,
                    publicKey
                })
                if (!keyStore) {
                    return {
                        code: 'xxx',
                        message: 'keyStore error'
                    }
                }
                const tokens = await createTokenPair({userId: newShop._id, email}, publicKey, privateKey)
                return {
                    code: 201,
                    metadata: {
                        shop: getInfoData({fields: ['_id', 'name', 'email'], object: newShop}),
                        tokens
                    }
                }
            }
        } catch (error) {
            
        }
    }
}

module.exports = AccessService