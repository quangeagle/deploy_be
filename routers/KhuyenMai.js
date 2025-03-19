const express = require("express");
const {
  createPromotion,
  getPromotionByCategory,
  getAllPromotions,
  deletePromotion, // Thêm controller deletePromotion
} = require("../Controllers/promotion_Controller.js");

const router = express.Router();

// Route để tạo khuyến mãi mới
router.post("/add", createPromotion);

// Route để lấy khuyến mãi theo danh mục
router.get("/category/:categoryId", getPromotionByCategory);

// Route để lấy tất cả khuyến mãi
router.get("/list", getAllPromotions);

// Route để xóa khuyến mãi
router.delete("/delete/:id", deletePromotion); // Thêm route DELETE

module.exports = router;
