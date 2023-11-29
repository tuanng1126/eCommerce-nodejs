'use strict';

const { findById } = require('../services/apiKey.service')

const HEADERS = {
    API_KEY: 'x-api-key',
    USER_ID: 'x-user-id',
    AUTHORIZATION: 'Authorization'
}

const apiKey = async (req, res, next) => {
    try {
        const apiKey = req.headers[HEADERS.API_KEY]?.toString()
        if (!apiKey) {
            return res.status(403).json({
                message: "Forbidden error"
            })
        }

        const objKey = await findById(apiKey)
        if (!objKey) {
            return res.status(403).json({
                message: "Forbidden error"
            })
        }

        req.objKey = objKey
        return next()

    } catch (error) {
        
    }
}

const permission = ( permission ) => {
    return (req, res, next) => {
        if (!req.objKey.permissions) {
            return res.status(403).json({
                message: "Permission denied"
            })
        }
        const validPermission = req.objKey.permissions.includes(permission)
        if (!validPermission){
            return res.status(403).json({
                message: "Permission denied"
            })
        }
        return next()
    }
}

module.exports = {
    apiKey,
    permission
}