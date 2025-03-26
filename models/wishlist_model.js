const mongoose = require("mongoose");

const wishlistSchema = new mongoose.Schema({
  account_id: { type: mongoose.Schema.Types.ObjectId, ref: "account", required: true },
  items: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: "product", required: true },
      addedAt: { type: Date, default: Date.now }
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model("Wishlist", wishlistSchema);
