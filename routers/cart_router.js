const express = require("express");
const router = express.Router();

const {
  AddToCart,
  GetCart,
  // DeleteItem,
  removeItem,
  UpdateItem,
} = require("../Controllers/cart_controller");

router.route("/").post(AddToCart);
router.route("/account/:account_id").get(GetCart);
router
  .route("/account/:account_id/item/:productId")
  .delete(removeItem)
  .patch(UpdateItem);

module.exports = router;
