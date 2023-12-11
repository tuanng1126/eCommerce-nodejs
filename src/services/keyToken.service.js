"use strict";

const { Types } = require("mongoose");
const keyTokenModel = require("../models/keyToken.model");

class KeyTokenService {
  static createKeyToken = async ({
    userId,
    publicKey,
    privateKey,
    refreshToken,
  }) => {
    try {
      // lv0
      // const tokens = await keyTokenModel.create({
      //     user: userId,
      //     privateKey,
      //     publicKey
      // })

      // return tokens ? tokens.publicKey : null

      // lv xxx
      const filter = { user: userId },
        update = {
          publicKey,
          privateKey,
          refreshTokenUsed: [],
          refreshToken,
        },
        options = { upsert: true, new: true };
      const tokens = await keyTokenModel.findOneAndUpdate(
        filter,
        update,
        options
      );
      return tokens ? tokens.publicKey : null;
    } catch (error) {
      return error;
    }
  };

  static findByUserId = async (userId) => {
    return await keyTokenModel.findOne({ user: new Types.ObjectId(userId) });
  };

  static removeKeyById = async (id) => {
    return await keyTokenModel.deleteOne(new Types.ObjectId(id)).lean();
  };

  static findByRefreshTokenUsed = async (refreshToken) => {
    return await keyTokenModel
      .findOne({ refreshTokenUsed: refreshToken })
      .lean();
  };

  static findByRefreshToken = async (refreshToken) => {
    return await keyTokenModel.findOne({ refreshToken });
  };
}

module.exports = KeyTokenService;
