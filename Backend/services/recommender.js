// services/recommender.js
const { ChatGoogleGenerativeAI } = require("@langchain/google-genai");
const stripToJson = require("../utils/stripToJson");
const { buildPrompt } = require("./promptBuilder");
const games = require("../data/games");

const llm = new ChatGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY,
  model: "gemini-1.5-flash",
});

async function llmRecommend(userQuery, limit = 3) {
  const prompt = buildPrompt(userQuery, limit);

  const response = await llm.invoke([
    {
      role: "system",
      content: `
You are a strict JSON API. 
Always respond ONLY with valid JSON following the given schema:
{
  "reasoning": "string",
  "recommendations": [ { "name": "string", "genre": "string", "description": "string" } ]
}
Never output text, markdown, or explanations outside JSON.`
    },
    { role: "user", content: prompt }
  ]);

  const raw = response?.content?.[0]?.text || "";
  console.log("🟡 RAW AI OUTPUT:", raw);

  let cleaned = stripToJson(raw);
  let parsed;

  try {
    parsed = JSON.parse(cleaned);
  } catch (err) {
    console.error("❌ Failed to parse AI output as JSON:", err.message);
    console.error("Raw output was:", raw);

    parsed = {
      reasoning: "AI response was not valid JSON.",
      recommendations: [],
    };
  }

  let recommendations = Array.isArray(parsed.recommendations)
    ? parsed.recommendations.slice(0, limit)
    : [];

  // Fallback to local dataset if needed
  const normalized = (userQuery || "").toLowerCase();
  const possibleGenres = [
    "strategy",
    "sandbox",
    "action",
    "simulation",
    "adventure",
    "puzzle",
    "horror",
    "racing",
    "sports",
    "rpg",
    "indie",
  ];
  const matchedGenre = possibleGenres.find((g) => normalized.includes(g)) || null;

  if (recommendations.length < limit) {
    const needed = limit - recommendations.length;
    const pool = matchedGenre ? games.filter((g) => g.genre.toLowerCase() === matchedGenre) : games;
    const topUp = pool.slice(0, needed).map((g) => ({ name: g.name, genre: g.genre, description: g.description }));
    recommendations = [...recommendations, ...topUp].slice(0, limit);
  }

  return {
    reasoning: parsed.reasoning || (recommendations.length ? "Based on your query and available data." : "No results for this query."),
    recommendations,
  };
}

// Maintain compatibility with routes/games.js expecting getLLMRecommendation
async function getLLMRecommendation(mode, payload = {}, preferences = "") {
  if (mode === "recommend") {
    return llmRecommend(preferences, 3);
  }
  // For add/update, just echo back a minimal structured response
  return {
    reasoning: "Operation acknowledged by AI stub.",
    recommendations: [],
  };
}

module.exports = { llmRecommend, getLLMRecommendation };
