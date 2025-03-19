const express = require("express");
const router = express.Router();
const trafficController = require("../Controllers/traffic_controller"); // Đường dẫn đến controller

// Định nghĩa route cho endpoint /api/traffic
router
  .route("/")
  .get(trafficController.getTrafficData)
  .post(trafficController.createTrafficData);

module.exports = router;
