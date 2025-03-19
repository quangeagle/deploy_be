const mongoose = require("mongoose");

const orderSchema = mongoose.Schema({
  customer: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  payment_method: {
    type: String,
    enum: ["COD", "ZaloPay"],
    default: "COD",
  },
  is_payment: {
    type: Boolean,
    default: false,
  },

  date: {
    type: Date,
    required: true,
  },
  time: {
    type: String,
    required: true,

  },
  items: [
    {
      product_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "product",
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
    },
  ],
});

module.exports = mongoose.model("order", orderSchema);
