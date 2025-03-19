const express = require("express");
const router = express.Router();

const {
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory,
  getCategoryById, // Thêm phương thức này
  // getCategoryNameById,
} = require("../Controllers/category_controller");
const { getNCCs } = require("../Controllers/NCC_controller");

// Các route hiện tại
router.route("/").post(createCategory).get(getCategories).get(getNCCs);
router.route("/:id").patch(updateCategory).delete(deleteCategory);

// Thêm route mới cho getCategoryById
router.route("/:id").get(getCategoryById);
// router.get("/name/:id").get(getCategoryNameById);

module.exports = router;
