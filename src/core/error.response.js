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

class ForbiddenError extends ErrorResponse {
    constructor(
        message = ReasonPhrases.FORBIDDEN,
        status = StatusCodes.FORBIDDEN
    ) {
        super(message, status);
    }
}

class AuthFailureError extends ErrorResponse {
        constructor(
        message = ReasonPhrases.UNAUTHORIZED,
        status = StatusCodes.UNAUTHORIZED
    ) {
        super(message, status);
    }
}

class NotFound extends ErrorResponse {
    constructor(
    message = ReasonPhrases.NOT_FOUND,
    status = StatusCodes.NOT_FOUND
) {
    super(message, status);
}
}

module.exports = {
    BadRequest,
    ForbiddenError,
    AuthFailureError,
    NotFound,
};
