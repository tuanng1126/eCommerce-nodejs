const { Schema, model } = require("mongoose"); // Erase if already required

const MODEL_NAME = "Product";
const COLLECTION_NAME = "Products";

// Declare the Schema of the Mongo model
const productSchema = Schema(
  {
    product_name: {type: String, required: true},
    product_thumb: {type: String, required: true},
    product_description: String,
    product_price: {type: Number, required: true},
    product_quantity: {type: Number, required: true},
    product_type: {type: String, required: true, enum: ['Electronics', 'Clothing', 'Furniture']},
    product_shop: {type: Schema.Types.ObjectId, ref: 'Shop'},
    product_attributes: {type: Schema.Types.Mixed, required: true}
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

// Define product = clothing
const clothingSchema = new Schema({
  brand: {type: String, required: true},
  size: String,
  material: String,
}, {
  collection: 'clothes',
  timestamps: true
})

// Define product = electronic
const electronicSchema = new Schema({
  manufacturer: {type: String, required: true},
  model: String,
  color: String,
}, {
  collection: 'electronics',
  timestamps: true
})

//Export the model
module.exports = {
  product: model(MODEL_NAME, productSchema),
  clothing: model('Clothing', clothingSchema),
  electronic: model('Electronic', electronicSchema),
}
