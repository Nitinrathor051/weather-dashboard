const express = require("express");

const router = express.Router();

const {
  sendOtp,
  verifyRegisterOtp,
  login,
  sendResetOtp,
  resetPassword,
} = require("../controllers/authController");


// ================= REGISTER FLOW =================

// Send OTP
router.post("/send-otp", sendOtp);

// Verify OTP + Create Account
router.post(
  "/verify-register",
  verifyRegisterOtp
);


// ================= LOGIN =================

router.post("/login", login);


// ================= FORGOT PASSWORD FLOW =================

// Send Reset OTP
router.post(
  "/send-reset-otp",
  sendResetOtp
);

// Verify OTP + Reset Password
router.post(
  "/reset-password",
  resetPassword
);


module.exports = router;
