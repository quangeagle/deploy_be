const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
  product_name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  img: {
    type: String,
    required: true,
  },
  des_product: {
    type: String,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "category",
    required: true,
  },
  discount: {
    type: Number,
    default: 0,
  },
  newPrice: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model("product", productSchema);
