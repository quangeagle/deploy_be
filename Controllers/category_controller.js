const categoryModel = require("../models/category_model");

module.exports = {
  createCategory: async (req, res) => {
    try {
      const { NCC, category_name } = req.body;
      const newCategory = new categoryModel({ category_name, NCC });
      const saveCategory = await newCategory.save();
      res.json(saveCategory);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },
  getCategories: async (req, res) => {
    const categories = await categoryModel.find();
    return res.status(200).json(categories);
  },
  updateCategory: async (req, res) => {
    const id = req.params.id;
    const body = req.body;
    const updatedCategory = await categoryModel.findByIdAndUpdate(id, body, {
      new: true,
    });
    return res.status(200).json(updatedCategory);
  },
  deleteCategory: async (req, res) => {
    const id = req.params.id;
    const deleteCategory = await categoryModel.findByIdAndDelete(id);
    return res.status(200).json(deleteCategory);
  },
  getCategoryById: async (req, res) => {
    try {
      const category = await Category.findById(req.params.id);
      if (!category) {
        return res.status(404).json({ message: "Danh mục không tồn tại" });
      }
      res.json(category);
    } catch (error) {
      res.status(500).json({ message: "Lỗi server khi lấy danh mục", error });
    }
  },
  // getCategoryNameById: async (req, res) => {
  //   try {
  //     const { id } = req.params;
  //     const category = await categoryModel.findById(id, "category_name"); // Chỉ lấy trường 'category_name'
  //     if (!category) {
  //       return res.status(404).json({ message: "Danh mục không tồn tại" });
  //     }
  //     res.json({ category_name: category.category_name });
  //   } catch (error) {
  //     res
  //       .status(500)
  //       .json({ message: "Lỗi server khi lấy tên danh mục", error });
  //   }
  // },
};
