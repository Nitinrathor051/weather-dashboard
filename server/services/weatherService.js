const axios = require("axios");

exports.getWeather = async (city) => {
  try {
    const apiKey = process.env.WEATHER_API_KEY;

    if (!apiKey) {
      throw new Error("WEATHER_API_KEY is missing in .env");
    }

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    const response = await axios.get(url);

    if (!response.data) {
      throw new Error("No weather data received");
    }

    return {
      temperature: response.data.main?.temp || null,
      humidity: response.data.main?.humidity || null,
      description: response.data.weather?.[0]?.description || "N/A",
    };

  } catch (error) {
    console.log("Weather API Error:", error.message);

    return {
      temperature: null,
      humidity: null,
      description: "Weather data not available",
    };
  }
};