const express = require("express");
const router = express.Router();

const {
  addQuantity,
  reduceQuantity,
  getKho,
  getProductWithQuantity,
  getQuantityByProductId,
} = require("../Controllers/kho_controller");
const { getProducts } = require("../Controllers/product_controller");

router.route("/").get(getKho).get(getProducts);
router.route("/add").patch(addQuantity);
router.route("/add").post(addQuantity);
router.route("/reduce").patch(reduceQuantity);
router.route("/quantity/:productId").get(getQuantityByProductId);
// Định tuyến để lấy sản phẩm với số lượng
router.route("/products/:id").get(getProductWithQuantity);

module.exports = router;
