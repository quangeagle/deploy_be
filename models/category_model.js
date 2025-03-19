const mongoose = require("mongoose");

const categorySchema = mongoose.Schema({
  category_name: {
    type: String,
  },
  NCC: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "NCC",
    required: true,
  },
});

module.exports = mongoose.model("category", categorySchema);
