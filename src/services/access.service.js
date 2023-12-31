"use strict";

const ShopModel = require("../models/shop.model");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const KeyTokenService = require("./keyToken.service");
const {createTokenPair} = require("../auth/auth.utils");
const {getInfoData} = require("../utils");
const {BadRequest, AuthFailureError, ForbiddenError} = require("../core/error.response");
const {findByEmail} = require("./shop.service");

const RoleShop = {
    SHOP: "SHOP", WRITER: "WRITER", EDITOR: "EDITOR", ADMIN: "ADMIN",
};

class AccessService {

    static handlerRefreshToken = async ({refreshToken, user, keyStore}) => {
        const {userId, email} = user;

        if ( keyStore.refreshTokenUsed.includes(refreshToken)){
            await KeyTokenService.removeKeyById(userId)
            throw new ForbiddenError("Something wrong happened !!! pls re-login")
        }

        if (!keyStore.refreshToken.includes(refreshToken)) {
            throw new AuthFailureError("Shop not registered")
        }

        const foundShop = findByEmail(email)
        if (!foundShop) throw new AuthFailureError("Shop not registered")

        const tokens = await createTokenPair({userId, email}, keyStore.publicKey, keyStore.privateKey)

        await keyStore.updateOne({
            $set: {
                refreshToken: tokens.refreshToken,
            },
            $addToSet: {
                refreshTokenUsed: refreshToken
            }
        })

        return {
            user: {userId, email},
            tokens
        }
    }

    static logout = async({keyStore}) => {
        return await KeyTokenService.removeKeyById(keyStore._id)
    }

    static login = async ({email, password, refreshToken = null}) => {
        const shopFound = await findByEmail({email})
        if (!shopFound) throw new BadRequest("Shop not registered")

        const match_password = bcrypt.compare(password, shopFound.password)
        if (!match_password) throw new AuthFailureError("Authentication error")

        const privateKey = crypto.randomBytes(64).toString("hex");
        const publicKey = crypto.randomBytes(64).toString("hex");

        const tokens = await createTokenPair({userId: shopFound._id, email}, publicKey, privateKey);
        await KeyTokenService.createKeyToken({
            userId: shopFound._id, privateKey, publicKey, refreshToken: tokens.refreshToken
        });

        return {
            shop: getInfoData({
                fields: ["_id", "name", "email"], object: shopFound,
            }), tokens,
        };
    }

    static signUp = async ({name, email, password}) => {
        const shop = await ShopModel.findOne({email}).lean();
        if (shop) throw new BadRequest("Shop is already exist");

        const passwordHash = await bcrypt.hash(password, 10);
        const newShop = await ShopModel.create({
            name, email, password: passwordHash, roles: [RoleShop.SHOP],
        });
        if (newShop) {
            const privateKey = crypto.randomBytes(64).toString("hex");
            const publicKey = crypto.randomBytes(64).toString("hex");
            const keyStore = await KeyTokenService.createKeyToken({
                userId: newShop._id, privateKey, publicKey,
            });
            if (!keyStore) throw new BadRequest("keyStore error")
            const tokens = await createTokenPair({userId: newShop._id, email}, publicKey, privateKey);
            return {
                shop: getInfoData({
                    fields: ["_id", "name", "email"], object: newShop,
                }), tokens,
            };
        }
    };
}

module.exports = AccessService;
