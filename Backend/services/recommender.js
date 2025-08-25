// services/recommender.js
const { ChatGoogleGenerativeAI } = require("@langchain/google-genai");
const stripToJson = require("../utils/stripToJson");
const { buildPrompt } = require("./promptBuilder");
const games = require("../data/games");
const { embedText, embedTexts, cosineSimilarity } = require("./embeddings");
const { fetchGamesFromRAWG } = require("./externalGames");

const llm = new ChatGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY,
  model: "gemini-1.5-flash",
});

async function llmRecommend(userQuery, limit = 3) {
  const prompt = buildPrompt(userQuery, limit);

  // Lightweight function-calling: model may request a tool, we execute once, then get final JSON
  const toolInstructions = `\n\nTOOLS AVAILABLE (use only if needed):\n- search_local_games({ genre?: string, search?: string, limit?: number }): Search the local dataset for games.\n- fetch_external_games({ genre?: string, search?: string, limit?: number }): Fetch popular games from RAWG API (needs env RAWG_API_KEY).\n\nIf a tool is needed, reply ONLY with this JSON (no prose):\n{\n  "tool_call": { "name": "search_local_games" | "fetch_external_games", "arguments": { /* args */ } }\n}\nOtherwise, directly return the final JSON per the required schema.`;

  const initialResponse = await llm.invoke([
    {
      role: "system",
      content: `You are a strict JSON API. Always respond ONLY with valid JSON. ${toolInstructions}`
    },
    { role: "user", content: prompt }
  ]);

  let raw = initialResponse?.content?.[0]?.text || "";
  console.log("🟡 RAW AI OUTPUT (initial):", raw);

  // Try to detect a tool call
  let toolCall;
  try {
    const maybe = JSON.parse(stripToJson(raw));
    if (maybe && maybe.tool_call && maybe.tool_call.name) {
      toolCall = maybe.tool_call;
    }
  } catch (_) {}

  let modelFinalRaw = raw;

  if (toolCall) {
    const name = String(toolCall.name || "");
    const args = (toolCall.arguments && typeof toolCall.arguments === "object") ? toolCall.arguments : {};
    const safeLimit = Math.max(1, Math.min(parseInt(args.limit) || limit, 10));

    let toolResult = [];
    if (name === "search_local_games") {
      const genre = (args.genre || "").toString().toLowerCase();
      const search = (args.search || "").toString().toLowerCase();
      const pool = games.filter((g) => {
        const genreOk = genre ? (g.genre || "").toLowerCase() === genre : true;
        const searchOk = search ? (
          (g.name || "").toLowerCase().includes(search) ||
          (g.description || "").toLowerCase().includes(search)
        ) : true;
        return genreOk && searchOk;
      });
      toolResult = pool.slice(0, safeLimit).map((g) => ({ name: g.name, genre: g.genre, description: g.description }));
    } else if (name === "fetch_external_games") {
      const genre = args.genre ? String(args.genre) : undefined;
      const search = args.search ? String(args.search) : undefined;
      toolResult = await fetchGamesFromRAWG({ genre, search, limit: safeLimit });
    }

    // Ask the model to produce the final JSON using tool result
    const followup = await llm.invoke([
      {
        role: "system",
        content: `You are a strict JSON API. Return ONLY final JSON per schema with exactly ${safeLimit} items.`
      },
      { role: "user", content: prompt },
      {
        role: "user",
        content: `Tool '${name}' returned this array (JSON):\n${JSON.stringify(toolResult)}\nUse it (optionally combined with your knowledge) to produce the final JSON.`
      }
    ]);

    modelFinalRaw = followup?.content?.[0]?.text || "";
    console.log("🟡 RAW AI OUTPUT (final):", modelFinalRaw);
  }

  let cleaned = stripToJson(modelFinalRaw);
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

  // Embeddings (optional) and ranking by cosine similarity
  const userEmbedding = await embedText(userQuery);
  const itemEmbeddings = await embedTexts(recommendations.map((r) => `${r.name} - ${r.genre}: ${r.description}`));

  // Score and sort if embeddings are available
  let scored = recommendations.map((r, i) => {
    const itemEmb = itemEmbeddings[i];
    const score = userEmbedding && itemEmb ? cosineSimilarity(userEmbedding, itemEmb) : null;
    return { rec: r, score };
  });
  // Prefer higher scores; keep original order for null scores
  scored.sort((a, b) => {
    if (a.score == null && b.score == null) return 0;
    if (a.score == null) return 1;
    if (b.score == null) return -1;
    return b.score - a.score;
  });
  recommendations = scored.map((s) => s.rec).slice(0, limit);
  return {
    reasoning: parsed.reasoning || (recommendations.length ? "Based on your query and available data." : "No results for this query."),
    embeddings: {
      user: userEmbedding,
      items: itemEmbeddings,
    },
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
