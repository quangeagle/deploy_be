const NCCModel = require("../models/NCC_model");

module.exports = {
  createNCC: async (req, res) => {
    try {
      const newNCC = new NCCModel(req.body);
      const savedNCC = await newNCC.save();
      res.json(savedNCC);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },
  getNCCs: async (req, res) => {
    const NCCs = await NCCModel.find();
    return res.status(200).json(NCCs);
  },
  updateNCC: async (req, res) => {
    const id = req.params.id;
    const body = req.body;
    const updatedNCC = await NCCModel.findByIdAndUpdate(id, body, {
      new: true,
    });
    return res.status(200).json(updatedNCC);
  },
  deleteNCC: async (req, res) => {
    const id = req.params.id;
    const deleteNCC = await NCCModel.findByIdAndDelete(id);
    return res.status(200).json(deleteNCC);
  },
};
