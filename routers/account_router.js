const express = require("express");
const router = express.Router();

const {
  sendOtp,
  verifyOtpAndCreateAccount,
  sendOtpForLogin,
  verifyOtpForLogin,
  sendOtpForPasswordReset,
  verifyOtp,
  resetPassword,

} = require("../Controllers/account_controller");

// Đăng ký tài khoản: gửi OTP và xác minh OTP
router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtpAndCreateAccount);

// Đăng nhập: gửi OTP và xác minh OTP
router.post("/send-otp-login", sendOtpForLogin);
router.post("/verify-otp-login", verifyOtpForLogin);

// Quên mật khẩu: gửi OTP và thay đổi mật khẩu
router.post("/send-otp-password-reset", sendOtpForPasswordReset);
router.post("/reset-password", resetPassword);
router.post("/verify-otp-password-reset", verifyOtp);

module.exports = router;





// const express = require("express");
// const router = express.Router();

// const {
//   sendOtp,
//   verifyOtpAndCreateAccount,
// } = require("../Controllers/account_controller");

// router.post("/send-otp", sendOtp);
// router.post("/verify-otp", verifyOtpAndCreateAccount);

// module.exports = router;
