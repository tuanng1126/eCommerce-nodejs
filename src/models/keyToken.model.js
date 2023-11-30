"use strict";
const {Schema, model} = require('mongoose')

const MODEL_NAME = 'KeyToken'
const COLLECTION_NAME = 'KeyTokens'

const keyTokenSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Shop'
    },
    privateKey: {
        type: String,
        required: true
    },
    publicKey: {
        type: String,
        required: true
    },
    refreshToken: {
        type: Array,
        default: []
    },
    refreshTokenUsed: {
        type: Array,
        default: []
    }
},{
    timestamps: true,
    collection: COLLECTION_NAME
})

module.exports = model(MODEL_NAME, keyTokenSchema)