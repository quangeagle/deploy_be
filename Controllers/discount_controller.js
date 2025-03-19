const discountModel = require("../models/discount_model");

module.exports = {
  createDiscount: async (req, res) => {
    try {
      const { name, category, discount, startDate, endDate } = req.body;
      const newDiscount = new discountModel({
        name,
        category,
        discount,
        startDate,
        endDate,
      });
      const saveDiscount = await newDiscount.save();
      res.json(saveDiscount);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },
  getDiscounts: async (req, res) => {
    const discounts = await discountModel.find();
    return res.status(200).json(discounts);
  },
  updateDiscounts: async (req, res) => {
    const id = req.params.id;
    const body = req.body;
    const updateDiscounts = await discountModel.findByIdAndUpdate(id, body, {
      new: true,
    });
    return res.status(200).json(updateDiscounts);
  },
  deleteDiscounts: async (req, res) => {
    const id = req.params.id;
    const deleteDiscounts = await discountModel.findByIdAndDelete(id);
    return res.status(200).json(deleteDiscounts);
  },
};
