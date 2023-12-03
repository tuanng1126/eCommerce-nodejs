"use strict";

const { findById } = require("../services/apiKey.service");
const { ForbiddenError } = require("../core/error.response");
const {verify} = require("jsonwebtoken");

const HEADERS = {
    API_KEY: "x-api-key",
    USER_ID: "x-user-id",
    AUTHORIZATION: "Authorization",
};

const apiKey = async (req, res, next) => {
    try {
        const apiKey = req.headers[HEADERS.API_KEY]?.toString();
        if (!apiKey) {
            return res.status(403).json({
                message: "Forbidden Error",
            });
        }
        const objKey = await findById(apiKey);
        if (!objKey) {
            return res.status(403).json({
                message: "Forbidden Error",
            });
        }

        req.objKey = objKey;
        return next();
    } catch (error) {}
};

const permission = (permission) => {
    return (req, res, next) => {
        if (!req.objKey.permissions) throw new ForbiddenError("Permission denied");
        const validPermission = req.objKey.permissions.includes(permission);
        if (!validPermission) throw new ForbiddenError("Permission denied");
        return next();
    };
};

const verifyJWT = async (token, keySecret) => {
    return await verify(token, keySecret)
}

module.exports = {
    apiKey,
    permission,
    verifyJWT,
};
