const Promotion = require("../models/KhuyenMai.js");
const productModel = require("../models/product_model");
const categoryModel = require("../models/category_model");

module.exports = {
  // Hàm tạo khuyến mãi
  createPromotion: async (req, res) => {
    try {
      console.log("Request body:", req.body);
      const { code, discount, categoryId, startDate, endDate } = req.body;

      // Kiểm tra xem danh mục có tồn tại không
      const categoryData = await categoryModel.findById(categoryId);
      if (!categoryData) {
        return res.status(404).json({ message: "Category not found" });
      }

      // Tạo khuyến mãi mới
      const newPromotion = new Promotion({
        code,
        discount,
        category: categoryId,
        startDate,
        endDate,
      });

      // Lưu khuyến mãi
      const savedPromotion = await newPromotion.save();

      // Cập nhật giá cho các sản phẩm trong danh mục
      const products = await productModel.find({ category: categoryId });
      await Promise.all(
        products.map(async (prod) => {
          try {
            // Tính giá mới của sản phẩm sau giảm giá
            const newPrice = prod.price - (prod.price * discount) / 100;
            const updatedDiscount = discount > 0 ? discount : 0;

            console.log(
              `Updating product ${prod._id} with newPrice: ${newPrice} and discount: ${updatedDiscount}`
            );

            // Cập nhật sản phẩm với giá mới và mức giảm giá
            await productModel.findByIdAndUpdate(prod._id, {
              newPrice,
              discount: updatedDiscount,
            });
          } catch (err) {
            console.error(`Failed to update product ${prod._id}:`, err.message);
          }
        })
      );

      // Trả về thông tin khuyến mãi đã lưu
      res.json(savedPromotion);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  // Hàm lấy khuyến mãi theo danh mục
  getPromotionByCategory: async (req, res) => {
    try {
      const { categoryId } = req.params;
      const promotions = await Promotion.find({ category: categoryId }); // Lấy các khuyến mãi theo danh mục
      res.json(promotions);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  // Hàm lấy tất cả khuyến mãi (nếu cần)
  getAllPromotions: async (req, res) => {
    try {
      const promotions = await Promotion.find(); // Lấy tất cả khuyến mãi
      res.json(promotions);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },
  // Hàm xóa khuyến mãi
  deletePromotion: async (req, res) => {
    try {
      const { id } = req.params;

      // Tìm khuyến mãi theo ID
      const promotion = await Promotion.findById(id);
      if (!promotion) {
        return res.status(404).json({ message: "Promotion not found" });
      }

      // Xóa khuyến mãi
      await Promotion.findByIdAndDelete(id);

      // Cập nhật lại giá cho các sản phẩm trong danh mục
      const products = await productModel.find({
        category: promotion.category,
      });
      await Promise.all(
        products.map(async (prod) => {
          try {
            // Xóa mức giảm giá của sản phẩm sau khi khuyến mãi bị xóa
            await productModel.findByIdAndUpdate(prod._id, {
              newPrice: prod.price, // Reset lại giá sản phẩm
              discount: 0, // Reset giảm giá
            });
          } catch (err) {
            console.error(`Failed to update product ${prod._id}:`, err.message);
          }
        })
      );

      res.json({ message: "Promotion deleted successfully" });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },
};
