'use strict';

const AccessService = require("../services/access.service");

class AccessController {

    static signUp = async (req, res, next) => {
        try {
            return res.status(200).json(await AccessService.signUp(req.body))
        } catch (error) {
            next(error)
        }
    }
}

module.exports = AccessController