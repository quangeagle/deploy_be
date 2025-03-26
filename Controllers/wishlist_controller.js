const wishlistModel = require("../models/wishlist_model");

module.exports = {
  // Thêm sản phẩm vào danh sách yêu thích
  AddToWishlist: async (req, res) => {
    const { account_id, product_id } = req.body;

    try {
      let wishlist = await wishlistModel.findOne({ account_id });

      if (!wishlist) {
        wishlist = await wishlistModel.create({
          account_id,
          items: [{ product: product_id }]
        });
      } else {
        const exists = wishlist.items.some(item => item.product.toString() === product_id);
        if (!exists) {
          wishlist.items.push({ product: product_id });
          await wishlist.save();
        }
      }
      return res.status(201).json(wishlist);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  // Lấy danh sách yêu thích của người dùng
  GetWishlist: async (req, res) => {
    const { account_id } = req.params;

    try {
      const wishlist = await wishlistModel
        .findOne({ account_id })
        .populate("items.product");

      return res.status(200).json(wishlist || {});
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  // Xóa một sản phẩm khỏi danh sách yêu thích
  RemoveFromWishlist: async (req, res) => {
    const { account_id, productId } = req.params;

    try {
      let wishlist = await wishlistModel.findOne({ account_id });

      if (!wishlist) {
        return res.status(404).json({ message: "Wishlist not found" });
      }

      wishlist.items = wishlist.items.filter(item => item.product.toString() !== productId);
      await wishlist.save();

      return res.status(200).json({ message: "Item removed successfully", wishlist });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  // Xóa toàn bộ danh sách yêu thích của người dùng
  DeleteWishlist: async (accountId) => {
    try {
      const result = await wishlistModel.deleteOne({ account_id: accountId });
      console.log(result.deletedCount > 0 ? "Wishlist deleted." : "No wishlist found to delete.");
    } catch (error) {
      console.error("Error deleting wishlist:", error);
    }
  }
};
