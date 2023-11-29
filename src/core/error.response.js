"use strict";

const { ReasonPhrases, StatusCodes } = require("./httpStatusCode");

class ErrorResponse extends Error {
    constructor(message, status) {
        super(message);
        this.status = status;
    }
}

class BadRequest extends ErrorResponse {
    constructor(
        message = ReasonPhrases.BAD_REQUEST,
        status = StatusCodes.BAD_REQUEST
    ) {
        super(message, status);
    }
}

class FORBIDDEN extends ErrorResponse {
    constructor(
        message = ReasonPhrases.FORBIDDEN,
        status = StatusCodes.FORBIDDEN
    ) {
        super(message, status);
    }
}

module.exports = {
    BadRequest,
    FORBIDDEN,
};
