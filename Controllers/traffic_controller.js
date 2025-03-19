const Traffic = require("../models/traffic_model"); // Đường dẫn đến model Traffic

// Lấy dữ liệu lưu lượng truy cập
const getTrafficData = async (req, res) => {
  try {
    // Lấy dữ liệu lưu lượng truy cập và liên kết với bảng Account
    const trafficData = await Traffic.find().populate("accountId");

    // Trả về dữ liệu với mã trạng thái 200
    res.status(200).json({ traffic: trafficData });
  } catch (error) {
    // Xử lý lỗi và trả về mã trạng thái 500 nếu có lỗi xảy ra
    res.status(500).json({ message: error.message });
  }
};

const createTrafficData = async (req, res) => {
  try {
    const traffic = new Traffic(req.body);
    await traffic.save();
    res.status(201).json(traffic); // Trả về dữ liệu traffic đã được tạo
  } catch (error) {
    res
      .status(400)
      .json({ message: "Lỗi khi tạo dữ liệu traffic", error: error.message });
  }
};

// Xuất các hàm cần thiết
module.exports = {
  getTrafficData,
  createTrafficData,
};
