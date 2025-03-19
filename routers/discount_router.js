const express = require("express");
const router = express.Router();

const {
  createDiscount,
  getDiscounts,
  updateDiscount,
  deleteDiscount,
} = require("../Controllers/discount_controller");
const { getCategories } = require("../Controllers/category_controller");

router.route("/").post(createDiscount).get(getDiscounts).get(getCategories);

module.exports = router;
