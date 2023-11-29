'use strict';

const { findById } = require('../services/apiKey.service')
const {FORBIDDEN} = require('../core/error.response')

const HEADERS = {
    API_KEY: 'x-api-key',
    USER_ID: 'x-user-id',
    AUTHORIZATION: 'Authorization'
}

const apiKey = async (req, res, next) => {
    try {
        const apiKey = req.headers[HEADERS.API_KEY]?.toString()
        if (!apiKey) throw new FORBIDDEN("Forbidden error")

        const objKey = await findById(apiKey)
        if (!objKey) throw new FORBIDDEN("Forbidden error")

        req.objKey = objKey
        return next()

    } catch (error) {
        
    }
}

const permission = ( permission ) => {
    return (req, res, next) => {
        if (!req.objKey.permissions) throw new FORBIDDEN("Permission denied")
        const validPermission = req.objKey.permissions.includes(permission)
        if (!validPermission) throw new FORBIDDEN("Permission denied")
        return next()
    }
}

const asyncHandler = fn => {
    return (req, res, next) => {
        fn(req, res, next).catch(next)
    }
}

module.exports = {
    apiKey,
    permission,
    asyncHandler
}