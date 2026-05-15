const City = require("../models/City");
const { getWeather } = require("../services/weatherService");

// add new city
exports.addCity = async (req, res) => {
  try {
    const { cityName } = req.body;

    if (!cityName || !cityName.trim()) {
      return res.status(400).json({
        message: "City name required",
      });
    }

    const cleanCity = cityName.trim().toLowerCase();

    // basic format check (only letters + spaces)
    const isValidFormat = /^[a-zA-Z\s]{2,50}$/.test(cityName);

    if (!isValidFormat) {
      return res.status(400).json({
        message: "Invalid city name",
      });
    }

    // check weather API (real city validation)
    let weather;
    try {
      weather = await getWeather(cleanCity);
    } catch (err) {
      return res.status(400).json({
        message: "City not found",
      });
    }

    if (!weather || !weather.temperature) {
      return res.status(400).json({
        message: "City not found",
      });
    }

    // check duplicate city
    const existingCity = await City.findOne({
      userId: req.user.id,
      cityName: cleanCity,
    });

    if (existingCity) {
      return res.status(400).json({
        message: "City already added",
      });
    }

    const city = await City.create({
      userId: req.user.id,
      cityName: cleanCity,
      isFavorite: false,
    });

    res.status(201).json(city);
  } catch (error) {
    console.log("Add City Error:", error.message);

    res.status(500).json({
      message: "Error adding city",
    });
  }
};

// get all cities with weather
exports.getCities = async (req, res) => {
  try {
    const cities = await City.find({ userId: req.user.id });

    const result = await Promise.all(
      cities.map(async (city) => {
        let weather = null;

        try {
          weather = await getWeather(city.cityName);
        } catch (err) {
          console.log("Weather error:", err.message);
        }

        return {
          _id: city._id,
          cityName: city.cityName,
          isFavorite: city.isFavorite,
          weather: weather || {
            temperature: "N/A",
            description: "N/A",
          },
        };
      })
    );

    res.json(result);
  } catch (error) {
    console.log("Get Cities Error:", error.message);

    res.status(500).json({
      message: "Error fetching cities",
    });
  }
};

// mark/unmark favorite
exports.toggleFavorite = async (req, res) => {
  try {
    const city = await City.findById(req.params.id);

    if (!city) {
      return res.status(404).json({
        message: "City not found",
      });
    }

    if (city.userId.toString() !== req.user.id) {
      return res.status(403).json({
        message: "Not allowed",
      });
    }

    city.isFavorite = !city.isFavorite;
    await city.save();

    res.json(city);
  } catch (error) {
    console.log("Toggle Favorite Error:", error.message);

    res.status(500).json({
      message: "Error updating favorite",
    });
  }
};

// delete city
exports.deleteCity = async (req, res) => {
  try {
    const city = await City.findById(req.params.id);

    if (!city) {
      return res.status(404).json({
        message: "City not found",
      });
    }

    if (city.userId.toString() !== req.user.id) {
      return res.status(403).json({
        message: "Not allowed",
      });
    }

    await City.findByIdAndDelete(req.params.id);

    res.json({ message: "City deleted" });
  } catch (error) {
    console.log("Delete City Error:", error.message);

    res.status(500).json({
      message: "Error deleting city",
    });
  }
};