const mongoose = require("mongoose");

async function connectDB() {
  try {
    await mongoose.connect("mongodb://localhost:27017/Sieuthi")
    console.log("kết nối thành công...")
  } catch (error) {
    console.log("thất bại...")
  }
}

module.exports = connectDB;
