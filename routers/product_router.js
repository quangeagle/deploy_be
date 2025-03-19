const express = require("express");
const router = express.Router();

const {
  createProduct,
  getProducts,
  updateProduct,
  deleteProduct,
  getProductById,
  getProductsByCategory,
} = require("../Controllers/product_controller");
const { getCategories } = require("../Controllers/category_controller");

router.route("/").post(createProduct).get(getProducts);
router.route("/products").get(getCategories);
router
  .route("/:id")
  .patch(updateProduct)
  .delete(deleteProduct)
  .get(getProductById);
router.get("/category/:categoryId", getProductsByCategory);

module.exports = router;
