// const mongoose = require("mongoose");

// const accountSchema = new mongoose.Schema({
//   username: {
//     type: String,
//     required: true,
//     unique: true,
//   },
//   password: {
//     type: String,
//     required: true,
//   },
//   phone: {
//     type: String,
//     required: true,
//   },
//   email: {
//     type: String,
//     required: true,
//   },
//   name: {
//     type: String,
//     required: true,
//   },
//   email: {
//     type: String,
//     unique: true,
//     match: [/\S+@\S+\.\S+/, "Email không hợp lệ"], // Kiểm tra định dạng email
//   },
// });

// // Tạo model từ schema
// const userModel = mongoose.model("account", accountSchema);

// // Xuất model
// module.exports = userModel;
const mongoose = require("mongoose");

const accountSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minlength: [6, "Mật khẩu phải có ít nhất 6 ký tự"],
    },
    phone: {
      type: String,
      required: true,
      match: [/^[0-9]{10}$/, "Số điện thoại phải có đúng 10 chữ số"],
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [/\S+@\S+\.\S+/, "Email không hợp lệ"],
    },
    name: {
      type: String,
      required: true,
    },
    isVerified: {
      type: Boolean,
      default: false, // Người dùng chưa được xác minh mặc định
    },
    otpExpires: {
      type: Date, // Lưu thời gian hết hạn của OTP
    },
   
  },
  {
    timestamps: true, // Tự động thêm createdAt và updatedAt
  }
);

// Tạo model từ schema
const userModel = mongoose.model("account", accountSchema);

// Xuất model
module.exports = userModel;
