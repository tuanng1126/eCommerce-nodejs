"use strict";

const { AuthFailureError, NotFound } = require("../core/error.response");

const HEADER = {
    API_KEY: "x-api-key",
    CLIENT_ID: "x-user-id",
    AUTHORIZATION: "authorization",
    REFRESHTOKEN: "refreshtoken"
};

const JWT = require("jsonwebtoken");
const { asyncHandler } = require("../helpers/asyncHandler");
const KeyTokenService = require("../services/keyToken.service");

const createTokenPair = async (payload, publicKey, privateKey) => {
    try {
        const accessToken = await JWT.sign(payload, privateKey, {
            expiresIn: "2 days",
        });
        const refreshToken = await JWT.sign(payload, publicKey, {
            expiresIn: "7 days",
        });
        return { accessToken, refreshToken };
    } catch (error) {
        return error;
    }
};

const authentication = asyncHandler(async (req, res, next) => {
    const userId = req.headers[HEADER.CLIENT_ID];
    if (!userId) throw new AuthFailureError("Invalid request");

    const keyStore = await KeyTokenService.findByUserId(userId);
    if (!keyStore) throw new NotFound("keyStore not found");

    const refreshToken = req.headers[HEADER.REFRESHTOKEN]
    console.log(`req.headers[HEADER.REFRESHTOKEN]`, req.headers)
    if (refreshToken) {
        try {
            const decodeUser = await JWT.verify(refreshToken, keyStore.publicKey)
            if (userId !== decodeUser.userId) throw new AuthFailureError("Invalid userId")
            req.user = decodeUser
            req.keyStore = keyStore
            req.refreshToken = refreshToken
            return next()
            
        } catch (error) {
            console.log(error);
            throw error
        }
    }

    const accessToken = req.headers[HEADER.AUTHORIZATION]
    if (!accessToken) throw new AuthFailureError("Invalid request accessToken")

    try {
        const decodeUser = await JWT.verify(accessToken, keyStore.privateKey)
        console.log(`decodeUser`, decodeUser);
        if (userId !== decodeUser.userId) throw new AuthFailureError("Invalid userId")

        req.keyStore = keyStore
        req.user = decodeUser
        return next()
    } catch (error) {
        console.log(error);
        throw error
    }
});

module.exports = {
    createTokenPair,
    authentication,
}