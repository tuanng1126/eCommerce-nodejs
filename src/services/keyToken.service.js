'use strict';

const keyTokenModel = require("../models/keyToken.model");

class KeyTokenService {
    static createKeyToken = async ({ userId, publicKey, privateKey, refreshToken}) => {
        try {
            // lv0
            // const tokens = await keyTokenModel.create({
            //     user: userId,
            //     privateKey,
            //     publicKey
            // })

            // return tokens ? tokens.publicKey : null

            // lv xxx
            const filter = { user: userId}, update = {
                publicKey, privateKey, refreshTokenUsed: [], refreshToken
            }, options = { upsert: true, new: true}
            const tokens = await keyTokenModel.findOneAndUpdate(filter, update, options)
            return tokens ? tokens.publicKey : null
        } catch (error) {
            return error
        }
    } 
}

module.exports = KeyTokenService