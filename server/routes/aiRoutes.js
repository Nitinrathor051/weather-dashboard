const express = require("express");
const router = express.Router();

const { getAIResponse } = require("../services/groqService");
const { getWeather } = require("../services/weatherService");

// AI AGENT ROUTE
router.post("/ask", async (req, res) => {
  try {
    const { question, cities } = req.body;

    if (!question || typeof question !== "string") {
      return res.status(400).json({
        message: "Question is required",
      });
    }

    const cityList = Array.isArray(cities) ? cities : [];

    let weatherData = [];

    // fetch weather safely
    for (const city of cityList) {
      try {
        const weather = await getWeather(city);

        if (weather) {
          weatherData.push({
            city,
            temperature: weather.temperature ?? "N/A",
            description: weather.description ?? "N/A",
          });
        }
      } catch (err) {
        console.log(`Weather fetch failed for ${city}:`, err.message);
      }
    }

    // AI prompt
    const prompt = `
You are a smart weather assistant.

User question:
${question}

Weather data:
${JSON.stringify(weatherData, null, 2)}

Rules:
- Keep answer short and natural
- Suggest if user should go out or not
- Suggest clothing if needed
- Be helpful like a human assistant
`;

    let aiResponse;

    try {
      aiResponse = await getAIResponse(prompt);
    } catch (aiErr) {
      console.log("AI Service Error:", aiErr.message);

      return res.status(500).json({
        message: "AI service failed",
        error: aiErr.message,
      });
    }

    return res.json({
      answer: aiResponse || "No response generated",
      weatherData,
    });

  } catch (err) {
    console.log("AI Route Error:", err);

    return res.status(500).json({
      message: "Internal server error",
      error: err.message,
    });
  }
});

module.exports = router;