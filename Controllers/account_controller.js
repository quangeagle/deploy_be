



const bcrypt = require("bcrypt");
const accountModel = require("../models/account_model");
const nodemailer = require("nodemailer");

const otpStore = {};

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "haoquang16122004@gmail.com", 
    pass: "bzpv nzql mfmd phoh", 
  },
});

module.exports = {
  // Gửi OTP khi đăng ký tài khoản
  sendOtp: async (req, res) => {
    const { email } = req.body;
    console.log("Received request body for sendOtp:", req.body); 

    const emailRegex = /^[^\s@]+@gmail\.com$/;
    if (!email || !emailRegex.test(email)) {
      console.log("Email validation failed:", email);
      return res
        .status(400)
        .json({ success: false, message: "Chỉ chấp nhận email @gmail.com." });
    }
  
    try {
      const existingUser = await accountModel.findOne({ email });
      if (existingUser) {
        console.log("Email already exists:", existingUser); 
        return res.status(400).json({
          success: false,
          message: "Email đã tồn tại.",
        });
      }
  
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      console.log("Generated OTP:", otp); 
  
      otpStore[email] = { otp, expires: Date.now() + 5 * 60 * 1000 }; 
  
      console.log("Sending OTP to email:", email);
      await transporter.sendMail({
        from: "haoquang16122004@gmail.com",
        to: email,
        subject: "OTP đăng ký tài khoản",
        text: `Mã OTP của bạn là: ${otp}`,
        html: `<b>Mã OTP của bạn là: ${otp}</b>`,
      });
  
      console.log(`OTP sent successfully to ${email}`);
      return res.status(200).json({
        success: true,
        message: "OTP đã được gửi đến email của bạn.",
      });
    } catch (error) {
      console.error("Error while sending OTP:", error); 
      return res.status(500).json({
        success: false,
        message: "Không thể gửi OTP.",
      });
    }
  },
  
  // Xác minh OTP và tạo tài khoản
  verifyOtpAndCreateAccount: async (req, res) => {
    const { email, otp, username, name, password, phone } = req.body;
    console.log("Received request body for verifyOtpAndCreateAccount:", req.body); 

    if (!email || !otp) {
      console.log("Email or OTP missing:", { email, otp });
      return res.status(400).json({
        success: false,
        message: "Email và OTP là bắt buộc.",
      });
    }

    const storedOtp = otpStore[email];
    if (!storedOtp) {
      console.log("OTP not found or expired for email:", email); 
      return res.status(400).json({
        success: false,
        message: "OTP không tồn tại hoặc đã hết hạn.",
      });
    }

    if (storedOtp.otp !== otp) {
      console.log("OTP mismatch:", { received: otp, expected: storedOtp.otp }); 
      return res.status(400).json({
        success: false,
        message: "OTP không hợp lệ.",
      });
    }

    if (Date.now() > storedOtp.expires) {
      console.log("OTP expired for email:", email); 
      delete otpStore[email];
      return res.status(400).json({
        success: false,
        message: "OTP đã hết hạn.",
      });
    }

    try {
      delete otpStore[email];
      console.log("OTP verified, proceeding to create account..."); 

      const hashedPassword = await bcrypt.hash(password, 10);
      console.log("Password hashed successfully.");

      const newAccount = await accountModel.create({
        username,
        name,
        email,
        password: hashedPassword,
        phone,
        isVerified: true, // Đánh dấu là đã xác minh
      });

      console.log("Account created successfully:", newAccount); 
      return res.status(201).json({
        success: true,
        message: "Đăng ký thành công.",
        account: newAccount,
      });
    } catch (error) {
      console.error("Error while creating account:", error); 
      return res.status(500).json({
        success: false,
        message: "Không thể tạo tài khoản.",
      });
    }
  },

  // Gửi OTP khi đăng nhập
  sendOtpForLogin: async (req, res) => {
    const { email } = req.body;
    console.log("Received request body for sendOtpForLogin:", req.body);

    const existingUser = await accountModel.findOne({ email });
    if (!existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email không tồn tại.",
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    console.log("Generated OTP for login:", otp);

    otpStore[email] = { otp, expires: Date.now() + 5 * 60 * 1000 };

    try {
      console.log("Sending OTP to email:", email);
      await transporter.sendMail({
        from: "haoquang16122004@gmail.com",
        to: email,
        subject: "OTP đăng nhập",
        text: `Mã OTP của bạn để đăng nhập là: ${otp}`,
        html: `<b>Mã OTP của bạn để đăng nhập là: ${otp}</b>`,
      });

      console.log(`OTP sent successfully to ${email}`);
      return res.status(200).json({
        success: true,
        message: "OTP đã được gửi đến email của bạn.",
      });
    } catch (error) {
      console.error("Error while sending OTP for login:", error);
      return res.status(500).json({
        success: false,
        message: "Không thể gửi OTP.",
      });
    }
  },

  // Xác minh OTP khi đăng nhập
  verifyOtpForLogin: async (req, res) => {
    const { email, otp } = req.body;
    console.log("Received request body for verifyOtpForLogin:", req.body);

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "Email và OTP là bắt buộc.",
      });
    }

    const storedOtp = otpStore[email];
    if (!storedOtp) {
      return res.status(400).json({
        success: false,
        message: "OTP không tồn tại hoặc đã hết hạn.",
      });
    }

    if (storedOtp.otp !== otp) {
      return res.status(400).json({
        success: false,
        message: "OTP không hợp lệ.",
      });
    }

    if (Date.now() > storedOtp.expires) {
      delete otpStore[email];
      return res.status(400).json({
        success: false,
        message: "OTP đã hết hạn.",
      });
    }

    delete otpStore[email];
    return res.status(200).json({
      success: true,
      message: "Đăng nhập thành công.",
    });
  },

  // Gửi OTP khi quên mật khẩu
  sendOtpForPasswordReset: async (req, res) => {
    const { email } = req.body;
    console.log("Received request body for sendOtpForPasswordReset:", req.body);

    const existingUser = await accountModel.findOne({ email });
    if (!existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email không tồn tại.",
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    console.log("Generated OTP for password reset:", otp);

    otpStore[email] = { otp, expires: Date.now() + 5 * 60 * 1000 };

    try {
      console.log("Sending OTP for password reset to email:", email);
      await transporter.sendMail({
        from: "haoquang16122004@gmail.com",
        to: email,
        subject: "OTP quên mật khẩu",
        text: `Mã OTP của bạn để thay đổi mật khẩu là: ${otp}`,
        html: `<b>Mã OTP của bạn để thay đổi mật khẩu là: ${otp}</b>`,
      });

      console.log(`OTP sent successfully to ${email}`);
      return res.status(200).json({
        success: true,
        message: "OTP đã được gửi đến email của bạn.",
      });
    } catch (error) {
      console.error("Error while sending OTP for password reset:", error);
      return res.status(500).json({
        success: false,
        message: "Không thể gửi OTP.",
      });
    }
  },

  resetPassword: async (req, res) => {
    const { email, newPassword } = req.body;

    console.log("Received request body for resetPassword:", req.body);

    if (!email || !newPassword) {
        return res.status(400).json({
            success: false,
            message: "Email và mật khẩu mới là bắt buộc.",
        });
    }

    try {
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        console.log("Password hashed successfully.");

        const updatedUser = await accountModel.updateOne(
            { email },
            { $set: { password: hashedPassword } }
        );

        console.log("Password reset successfully:", updatedUser);

        return res.status(200).json({
            success: true,
            message: "Mật khẩu đã được thay đổi thành công.",
        });
    } catch (error) {
        console.error("Error while resetting password:", error);
        return res.status(500).json({
            success: false,
            message: "Không thể thay đổi mật khẩu.",
        });
    }
},
verifyOtp: async (req, res) => {
  const { email, otp } = req.body;

  console.log("Received request body for verifyOtp:", req.body);

  if (!email || !otp) {
      return res.status(400).json({
          success: false,
          message: "Email và OTP là bắt buộc.",
      });
  }

  const storedOtp = otpStore[email];
  if (!storedOtp) {
      return res.status(400).json({
          success: false,
          message: "OTP không tồn tại hoặc đã hết hạn.",
      });
  }

  if (storedOtp.otp !== otp) {
      return res.status(400).json({
          success: false,
          message: "OTP không hợp lệ.",
      });
  }

  if (Date.now() > storedOtp.expires) {
      delete otpStore[email];
      return res.status(400).json({
          success: false,
          message: "OTP đã hết hạn.",
      });
  }

  // Xóa OTP sau khi xác minh thành công
  delete otpStore[email];

  return res.status(200).json({
      success: true,
      message: "Xác minh OTP thành công.",
  });
},

};
