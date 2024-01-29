const { Schema, model } = require("mongoose"); // Erase if already required

const DOCUMENT_NAME = "Store";
const COLLECTIOM_NAME = "Stores";

// Declare the Schema of the Mongo model
var storeSchema = new Schema(
  {
    name: {
      type: Schema.Types.String,
      trim: true,
    },
    email: {
      type: Schema.Types.String,
      trim: true,
      unique: true,
    },
    status: {
      type: Schema.Types.String,
      enum: ["active", "inactive"],
      default: "inactive",
    },
    verify: {
      typre: Boolean,
    },
    password: {
      type: String,
      required: true,
    },
    roles: {
      typeof: Schema.Types.Array,
      default: [],
    },
  },
  {
    timestamps: true,
    collection: COLLECTIOM_NAME,
  }
);

//Export the model
module.exports = model(DOCUMENT_NAME, storeSchema);
