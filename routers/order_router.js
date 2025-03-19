// const express = require("express");
// const router = express.Router();

// const {
//   createOrder,
//   getOrder,
//   getOrderByAccount,
//   getOrderDetails,
// } = require("../Controllers/order_controller");

// router.route("/").get(getOrder).post(createOrder);
// router.route("/:account_id").get(getOrderByAccount);
// router.route("/details/:orderId").get(getOrderDetails);

// module.exports = router;
const express = require("express");
const router = express.Router();

const {
  createOrder,
  getOrder,
  getOrderByAccount,
  getOrderDetails,
  updatePaymentStatus, // Import controller updatePaymentStatus
} = require("../Controllers/order_controller");

// Đường dẫn cho các API
router.route("/").get(getOrder).post(createOrder);
router.route("/:account_id").get(getOrderByAccount);
router.route("/details/:orderId").get(getOrderDetails);

// Thêm route mới để cập nhật trạng thái thanh toán
router.route("/update-payment").post(updatePaymentStatus);

module.exports = router;
