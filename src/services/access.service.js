"use strict";

const ShopModel = require("../models/shop.model");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const KeyTokenService = require("./keyToken.service");
const createTokenPair = require("../auth/auth.utils");
const getInfoData = require("../utils");
const { BadRequest } = require("../core/error.response");

const RoleShop = {
    SHOP: "SHOP",
    WRITER: "WRITER",
    EDITOR: "EDITOR",
    ADMIN: "ADMIN",
};

class AccessService {
    static signUp = async ({ name, email, password }) => {
        const shop = await ShopModel.findOne({ email }).lean();
        if (shop) throw new BadRequest("Shop is already exist");

        const passwordHash = await bcrypt.hash(password, 10);
        const newShop = await ShopModel.create({
            name,
            email,
            password: passwordHash,
            roles: [RoleShop.SHOP],
        });
        if (newShop) {
            const privateKey = crypto.randomBytes(64).toString("hex");
            const publicKey = crypto.randomBytes(64).toString("hex");
            const keyStore = await KeyTokenService.createKeyToken({
                userId: newShop._id,
                privateKey,
                publicKey,
            });
            if (!keyStore) throw new BadRequest("keyStore error")
            const tokens = await createTokenPair(
                { userId: newShop._id, email },
                publicKey,
                privateKey
            );
            return {
                    shop: getInfoData({
                        fields: ["_id", "name", "email"],
                        object: newShop,
                    }),
                    tokens,
            };
        }
    };
}

module.exports = AccessService;
