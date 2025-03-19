const mongoose = require("mongoose");

const trafficSchema = new mongoose.Schema({
  accountId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Account", // Liên kết với model account
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  date: {
    type: String,
    required: true,
    unique: true,
  },
});

module.exports = mongoose.model("Traffic", trafficSchema);
