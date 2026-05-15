const nodemailer = require("nodemailer");
const Otp = require("../models/Otp");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


// ================= EMAIL SENDER =================
const sendEmailOtp = async (email, otp) => {
  try {

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,

      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },

      tls: {
        rejectUnauthorized: false,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "OTP Verification",
      text: `Your OTP is ${otp}. Valid for 10 minutes.`,
    });

    console.log("OTP Email Sent Successfully");

  } catch (error) {

    console.log("EMAIL ERROR =>", error);

    throw error;
  }
};


// ================= REGISTER OTP SEND =================
exports.sendOtp = async (req, res) => {
  try {

    const { email } = req.body;

    const user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const otp =
      Math.floor(100000 + Math.random() * 900000).toString();

    await Otp.deleteMany({
      email,
      type: "register",
    });

    await Otp.create({
      email,
      otp,
      type: "register",
      expiresAt: Date.now() + 10 * 60 * 1000,
    });

    await sendEmailOtp(email, otp);

    res.json({
      message: "OTP sent to email",
    });

  } catch (err) {

    console.log("SEND OTP ERROR =>", err);

    res.status(500).json({
      message: "OTP send error",
      error: err.message,
    });
  }
};


// ================= REGISTER VERIFY =================
exports.verifyRegisterOtp = async (req, res) => {
  try {

    const { name, email, password, otp } = req.body;

    const record = await Otp.findOne({
      email,
      otp,
      type: "register",
    });

    if (!record) {
      return res.status(400).json({
        message: "Invalid OTP",
      });
    }

    if (record.expiresAt < Date.now()) {
      return res.status(400).json({
        message: "OTP expired",
      });
    }

    const hashedPassword =
      await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    await Otp.deleteMany({
      email,
      type: "register",
    });

    res.status(201).json({
      message: "User created successfully",
      user,
    });

  } catch (err) {

    console.log("REGISTER VERIFY ERROR =>", err);

    res.status(500).json({
      message: "Register error",
      error: err.message,
    });
  }
};


// ================= LOGIN =================
exports.login = async (req, res) => {
  try {

    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "User not found",
      });
    }

    const isMatch =
      await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid password",
      });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      token,
      user,
    });

  } catch (err) {

    console.log("LOGIN ERROR =>", err);

    res.status(500).json({
      message: "Login error",
      error: err.message,
    });
  }
};


// ================= RESET OTP SEND =================
exports.sendResetOtp = async (req, res) => {
  try {

    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const otp =
      Math.floor(100000 + Math.random() * 900000).toString();

    await Otp.deleteMany({
      email,
      type: "reset",
    });

    await Otp.create({
      email,
      otp,
      type: "reset",
      expiresAt: Date.now() + 10 * 60 * 1000,
    });

    await sendEmailOtp(email, otp);

    res.json({
      message: "Reset OTP sent",
    });

  } catch (err) {

    console.log("RESET OTP ERROR =>", err);

    res.status(500).json({
      message: "Reset OTP error",
      error: err.message,
    });
  }
};


// ================= RESET PASSWORD =================
exports.resetPassword = async (req, res) => {
  try {

    const { email, otp, newPassword } = req.body;

    const record = await Otp.findOne({
      email,
      otp,
      type: "reset",
    });

    if (!record) {
      return res.status(400).json({
        message: "Invalid OTP",
      });
    }

    if (record.expiresAt < Date.now()) {
      return res.status(400).json({
        message: "OTP expired",
      });
    }

    const hashedPassword =
      await bcrypt.hash(newPassword, 10);

    await User.findOneAndUpdate(
      { email },
      { password: hashedPassword }
    );

    await Otp.deleteMany({
      email,
      type: "reset",
    });

    res.json({
      message: "Password reset successful",
    });

  } catch (err) {

    console.log("RESET PASSWORD ERROR =>", err);

    res.status(500).json({
      message: "Reset password error",
      error: err.message,
    });
  }
};
