const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema({
  email: String,
  otp: String,
  type: {
    type: String,
    enum: ["register", "reset"],
  },
  expiresAt: Date,
});

module.exports = mongoose.model("Otp", otpSchema);