const express = require("express");
const router = express.Router();

const {
  createNCC,
  getNCCs,
  updateNCC,
  deleteNCC,
} = require("../Controllers/NCC_controller");

router.route("/").post(createNCC).get(getNCCs);
router.route("/:id").patch(updateNCC).delete(deleteNCC);

module.exports = router;
