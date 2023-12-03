'use strict';

const AccessService = require("../services/access.service");
const {OK, CREATED} = require('../core/success.response');

class AccessController {

    static handlerRefreshToken = async (req, res, next) => {
        new OK({
            message: "Get token success", metadata: await AccessService.handlerRefreshToken( {
                refreshToken: req.refreshToken,
                user: req.user,
                keyStore: req.keyStore
            } )
        }).send(res)
    }
    

    static logout = async (req, res, next) => {
        new OK({
            message: "Logout success", metadata: await AccessService.logout( {keyStore: req.keyStore} )
        }).send(res)
    }

    static login = async (req, res, next) => {
        new OK({
            message: "Login success", metadata: await AccessService.login(req.body)
        }).send(res)
    }

    static signUp = async (req, res, next) => {
        new CREATED({
            message: "Registered OK", metadata: await AccessService.signUp(req.body)
        }).send(res)
    }


}

module.exports = AccessController