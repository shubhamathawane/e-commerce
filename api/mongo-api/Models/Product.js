// creating model for user

const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
    },
    desc: {
      type: String,
      require: true,
    },
    img: {
      type: String,
      required: true,
    },
    categories: { type: Array },
    size: { type: String },
    color: { type: String },
    price: { type: Number },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Products", productSchema);
