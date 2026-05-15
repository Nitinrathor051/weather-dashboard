const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  addCity,
  getCities,
  toggleFavorite,
  deleteCity,
} = require("../controllers/cityController");

router.post("/", authMiddleware, addCity);
router.get("/", authMiddleware, getCities);

// ⭐ FIXED ROUTE (important change)
router.put("/favorite/:id", authMiddleware, toggleFavorite);

router.delete("/:id", authMiddleware, deleteCity);

module.exports = router;