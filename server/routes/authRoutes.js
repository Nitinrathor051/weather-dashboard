const express = require("express");
const router = express.Router();

const {
  sendOtp,
  verifyRegisterOtp,
  login,
  sendResetOtp,
  resetPassword,
} = require("../controllers/authController");


// ================= REGISTER OTP =================
router.post("/send-otp", sendOtp);
router.post("/verify-register", verifyRegisterOtp);


// ================= LOGIN =================
router.post("/login", login);


// ================= RESET PASSWORD =================
router.post("/send-reset-otp", sendResetOtp);
router.post("/reset-password", resetPassword);


module.exports = router;