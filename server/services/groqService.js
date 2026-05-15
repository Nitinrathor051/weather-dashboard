const Groq = require("groq-sdk");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

async function getAIResponse(prompt) {
  try {
    const response = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    return response.choices[0].message.content;
  } catch (err) {
    console.log("Groq Error:", err);
    throw new Error("AI service failed");
  }
}

module.exports = { getAIResponse };