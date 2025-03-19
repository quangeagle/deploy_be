const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const Admin = require("./models/Admin.js");

// Kết nối tới MongoDB
mongoose
  .connect("mongodb://localhost:27017/Sieuthi", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Đã kết nối thành công với MongoDB"))
  .catch((error) => console.error("Lỗi kết nối MongoDB:", error));

async function AdminAccount() {
  const admins = [
    { username: "admin1", password: "adminpassword1", role: "adminPage1" },
  ];

  try {
    const adminCount = await Admin.countDocuments();
    if (adminCount === 0) {
      for (let admin of admins) {
        const hashPassword = await bcrypt.hash(admin.password, 10);
        const newAdmin = new Admin({
          username: admin.username,
          password: hashPassword,
          role: admin.role,
        });
        await newAdmin.save();
        console.log(`Tạo tài khoản cho ${admin.username} thành công`);
      }
    } else {
      console.log("Các tài khoản admin đã tồn tại");
    }
  } catch (err) {
    console.log("Lỗi:", err);
  }
}

AdminAccount();
