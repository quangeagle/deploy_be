const mongoose = require("mongoose");

async function connectDB() {
  try {
    await mongoose.connect("mongodb+srv://quangeagle:Kidoking258@emart.w5an1.mongodb.net/?retryWrites=true&w=majority&appName=Emart")
    console.log("kết nối thành công...")
  } catch (error) {
    console.log("thất bại...")
  }
}

module.exports = connectDB;
