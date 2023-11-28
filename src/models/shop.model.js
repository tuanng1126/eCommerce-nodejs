const mongoose = require("mongoose"); // Erase if already required

// key !dmbg
// Declare the Schema of the Mongo model
const COLLECTION_NAME = "Shops";
const MODEL_NAME = "Shop";
const shopSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            trim: true,
            maxLength: 150,
        },
        email: {
            type: String,
            unique: true,
            trim: true,
        },
        password: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            enum: ["active", "inactive"],
            default: "inactive",
        },
        verify: {
            type: Boolean,
            default: false,
        },
        roles: {
            type: Array,
            default: [],
        },
    },
    {
        timestamps: true,
        collection: COLLECTION_NAME,
    }
);

//Export the model
module.exports = mongoose.model(MODEL_NAME, shopSchema);
