const { Schema, model } = require("mongoose");

const MODEL_NAME = "Inventory";
const COLLECTION_NAME = "Inventories";
const inventorySchema = new Schema(
  {
    inven_productId: { type: Schema.Types.ObjectId, ref: "Product" },
    inven_location: { type: String, default: "unknown" },
    inven_stock: { type: Number, required: true },
    inven_shopId: { type: Schema.Types.ObjectId, ref: "Shop" },
    inven_reservation: { type: Array, default: [] },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

module.exports = {
  inventory: model(MODEL_NAME, inventorySchema),
};
