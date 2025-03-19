const mongoose = require("mongoose");

const NCCSchema = mongoose.Schema({
  NCC_name: {
    type: String,
  },
  NCC_phone: {
    type: Number,
  },
  NCC_address: {
    type: String,
  },
});

module.exports = mongoose.model("NCC", NCCSchema);
