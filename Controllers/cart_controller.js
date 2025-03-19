const cartModel = require("../models/cart_model");

module.exports = {
  AddToCart: async (req, res) => {
    const { account_id, product_id, quantity } = req.body;

    let cart = await cartModel.findOne({ account_id });
    if (!cart) {
      cart = await cartModel.create({
        account_id,
        items: [{ product: product_id, quantity: quantity || 1 }],
      });
    } else {
      const itemIndex = cart.items.findIndex(
        (item) => item.product == product_id
      );
      if (itemIndex > -1) {
        cart.items[itemIndex].quantity += quantity || 1;
      } else {
        cart.items.push({ product: product_id, quantity: quantity || 1 });
      }
      await cart.save();
    }
    return res.status(201).json(cart);
  },

  GetCart: async (req, res) => {
    const account_id = req.params.account_id;
    const cart = await cartModel
      .findOne({
        // is_order: false,
        account_id: account_id,
      })
      .populate("items.product");

    return res.status(200).json(cart || {});
  },
  // DeleteItem: async (req, res) => {
  //   const account_id = req.params.account_id;
  //   const item_id = req.params.item_id;
  //   let cart = await cartModel.findOne({
  //     account_id: account_id,
  //   });

  //   const items = cart.items.filter((v) => v._id != item_id);
  //   cart = await cartModel.findByIdAndUpdate(
  //     cart._id,
  //     { items },
  //     { new: true }
  //   );

  //   return res.status(200).json(cart);
  // },
  UpdateItem: async (req, res) => {
    const { account_id, item_id } = req.params;
    const { quantity } = req.body;
  
    try {
      // Tìm giỏ hàng của người dùng
      let cart = await cartModel.findOne({ account_id: account_id });
  
      if (!cart) {
        return res.status(404).json({ message: "Cart not found" });
      }
  
      // Cập nhật số lượng sản phẩm trong giỏ
      cart.items = cart.items.map((item) => {
        if (item._id.toString() === item_id) {
          item.quantity = quantity;
        }
        return item;
      });
  
      // Lưu lại giỏ hàng
      await cart.save();
  
      res.status(200).json(cart); // Trả lại giỏ hàng đã được cập nhật
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  },
  
  
  removeItem: async (req, res) => {
    const { account_id, productId } = req.params;
  
  
    try {
      const cart = await cartModel.findOne({ account_id: account_id });
  
      if (!cart) {
        return res.status(404).json({ message: "Cart not found" });
      }
  
      // Kiểm tra lại các mục trong giỏ hàng trước khi xóa
      console.log("Cart items before removal:", cart.items);
  
      // Lọc các sản phẩm không phải là sản phẩm cần xóa
      cart.items = cart.items.filter(item => item.product.toString() !== productId);
  
      // Kiểm tra lại sau khi xóa
      console.log("Cart items after removal:", cart.items);
  
      await cart.save();  // Lưu thay đổi
  
      return res.status(200).json({ message: "Item removed successfully", cart });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  },
 deleteCart :async (accountId) => {
    console.log(`Attempting to delete cart for account: ${accountId}`);
    try {
      
      const cartBeforeDeletion = await cartModel.find({ account_id: accountId });
      console.log("Cart before deletion:", cartBeforeDeletion);
  
      const result = await cartModel.deleteOne({ account_id: accountId });
  
      if (result.deletedCount > 0) {
        console.log("Giỏ hàng đã được xóa.");
      } else {
        console.log("Không tìm thấy giỏ hàng để xóa.");
      }
  
      const cartAfterDeletion = await cartModel.find({ account_id: accountId });
      console.log("Cart after deletion:", cartAfterDeletion);
    } catch (error) {
      console.error("Lỗi khi xóa giỏ hàng:", error);
    }
  }
  
  
  
  
};
