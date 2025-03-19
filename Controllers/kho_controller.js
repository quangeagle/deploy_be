const Kho = require("../models/kho_model");
const product = require("../models/product_model");
;
module.exports = {
  //Thêm số lượng sản phẩm
  addQuantity: async (req, res) => {
    const { productId, quantity } = req.body;
    try {
      let item = await Kho.findOne({ Product: productId });
      if (item) {
        item.quantity += quantity;
      } else {
        item = new Kho({ Product: productId, quantity });
      }
      await item.save();
      res.json(item);
    } catch (error) {
      res.status(500).json({ message: "Lỗi khi thêm số lượng sản phẩm" });
    }
  },

  // Giảm số lượng sản phẩm sau khi mua
  reduceQuantity: async (req, res) => {
    const { productId, quantity } = req.body;
    try {
      const item = await Kho.findOne({ Product: productId });
      if (!item || item.quantity < quantity) {
        return res.status(400).json({ message: "Sản phẩm không đủ hàng" });
      }
      item.quantity -= quantity;
      await item.save();
      res.json(item);
    } catch (error) {
      res.status(500).json({ message: "Lỗi khi giảm số lượng sản phẩm" });
    }
  },

  // Lấy thông tin của kho
  getKho: async (req, res) => {
    try {
      const kho = await Kho.find().populate("Product");
      res.json(kho);
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ message: "Lỗi khi lấy thông tin kho" });
    }
  },
// Lấy thông tin số lượng của một sản phẩm theo productId
getQuantityByProductId: async (req, res) => {
  try {
    const { productId } = req.params; // Lấy productId từ URL parameter
    const kho = await Kho.findOne({ Product: productId });

    if (!kho) {
      return res.status(404).json({ message: "Sản phẩm không có trong kho" });
    }

    // Trả về thông tin sản phẩm cùng với số lượng trong kho
    res.json({ productId: kho.Product, quantity: kho.quantity });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ message: "Lỗi khi lấy thông tin số lượng sản phẩm" });
  }
},

  getProductWithQuantity: async (req, res) => {
    try {
      const Product = await product.findById(req.params.id);
      if (!Product) {
        return res.status(404).json({ message: "Product not found" });
      }
      const kho = await Kho.findOne({ Product: product._id });
      const quantity = kho ? kho.quantity : 0;
      res.json({ ...Product.toObject(), quantity });
    } catch (err) {
      res.status(500).json({ message: "Server error", error: err });
    }
  },
};
