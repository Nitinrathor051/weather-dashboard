const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// dotenv only for local
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const authRoutes = require("./routes/authRoutes");
const cityRoutes = require("./routes/cityRoutes");
const aiRoutes = require("./routes/aiRoutes");

const app = express();

// ---------------- MIDDLEWARE ----------------
app.use(
  cors({
    origin: true, // allow all (safe for now, works with Vercel)
    credentials: true,
  })
);

app.use(express.json());

// ---------------- ROUTES ----------------
app.use("/api/auth", authRoutes);
app.use("/api/cities", cityRoutes);
app.use("/api/ai", aiRoutes);

// ---------------- HEALTH CHECK ----------------
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Weather Dashboard API Running",
  });
});

// ---------------- DB CONNECTION ----------------
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected Successfully");
  } catch (err) {
    console.error("MongoDB Connection Error:", err.message);
    process.exit(1);
  }
};

connectDB();

// ---------------- START SERVER ----------------
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
