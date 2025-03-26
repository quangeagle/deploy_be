const express = require("express");
const router = express.Router();
const wishlistController = require("../Controllers/wishlist_controller");

// Thêm sản phẩm vào wishlist
router.post("/add", wishlistController.AddToWishlist);

// Lấy danh sách wishlist của người dùng
router.get("/:account_id", wishlistController.GetWishlist);

// Xóa sản phẩm khỏi wishlist
router.delete("/:account_id/:productId", wishlistController.RemoveFromWishlist);

module.exports = router;
