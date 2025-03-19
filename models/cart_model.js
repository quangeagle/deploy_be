const mongoose = require("mongoose");

const cartSchema = mongoose.Schema({
  account_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "account",
  },
  items: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "product",
      },
      quantity: {
        type: Number,
        default: 1,
      },
    },
  ],
});

module.exports = mongoose.model("cart", cartSchema);
