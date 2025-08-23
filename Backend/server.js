// server.js
require("dotenv").config();
const express = require("express");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

// ---- Gemini client ----
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const GEN_MODEL = process.env.GEMINI_MODEL || "gemini-1.5-flash";

// ---- Data (no embeddings) ----
let games = [
  { id: 1, name: "Chess", genre: "strategy", description: "A strategy board game of kings and queens." },
  { id: 2, name: "Minecraft", genre: "sandbox", description: "A sandbox game for creativity and survival." },
  { id: 3, name: "Valorant", genre: "action", description: "A tactical first-person shooter with agents." },
  { id: 4, name: "Stardew Valley", genre: "simulation", description: "A cozy farm-life sim with exploration." },
  { id: 5, name: "Elden Ring", genre: "adventure", description: "Open-world action RPG with challenging combat." },
];

// ---- Helpers ----
function stripToJson(text) {
  // extract the first top-level JSON object if model wrapped it
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start !== -1 && end !== -1 && end > start) {
    return text.slice(start, end + 1);
  }
  return text;
}

async function llmRecommend(query, limit = 3) {
  const model = genAI.getGenerativeModel({ model: GEN_MODEL });

  const list = games
    .map(
      (g, i) =>
        `${i + 1}. name: "${g.name}", genre: "${g.genre}", description: "${g.description}"`
    )
    .join("\n");

  // CoT-style instruction, but ask for only a concise summary + JSON output
  const prompt = `
You are a helpful games recommender.
Think through the user's request internally in a few brief steps,
but DO NOT show your steps. Return ONLY compact JSON.

User query: "${query}"
Pick at most ${limit} games from the LIST (do not invent games).
For each chosen game, include a one-sentence reason.

Format exactly:
{
  "thought_summary": "1-2 sentence high-level explanation (no steps).",
  "recommendations": [
    { "name": "...", "reason": "..." }
  ]
}

LIST:
${list}
`;

  const result = await model.generateContent(prompt);
  const text = result.response.text();
  let parsed;

  try {
    parsed = JSON.parse(stripToJson(text));
  } catch {
    // Fallback: simple genre substring filter
    const q = query.toLowerCase();
    const recs = games
      .filter((g) => g.genre.toLowerCase().includes(q) || g.description.toLowerCase().includes(q))
      .slice(0, limit)
      .map((g) => ({ name: g.name, reason: `Matches "${q}" via genre/description.` }));
    parsed = {
      thought_summary: "Fallback: filtered by genre/description substring.",
      recommendations: recs,
    };
  }

  return parsed;
}

async function llmBrief(message) {
  try {
    const model = genAI.getGenerativeModel({ model: GEN_MODEL });
    const r = await model.generateContent(
      `${message}\nReply in 1–2 sentences, no lists, no code blocks.`
    );
    return r.response.text();
  } catch {
    return "";
  }
}

// ---- Routes ----

// GET /recommend  -> LLM ranks from our in-memory list; returns concise reasoning + picks
app.get("/recommend", async (req, res) => {
  try {
    const query = (req.query.query || "").trim();
    const limit = Math.max(1, Math.min(parseInt(req.query.limit) || 3, games.length));
    if (!query) return res.status(400).json({ error: "Query parameter is required" });

    const { thought_summary, recommendations } = await llmRecommend(query, limit);
    res.json({ reasoning: thought_summary, recommendations });
  } catch (e) {
    console.error("GET /recommend error:", e);
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /add-game   -> add game; LLM returns brief confirmation/explanation
app.post("/add-game", async (req, res) => {
  try {
    const { name, genre, description } = req.body || {};
    if (!name || !genre || !description) {
      return res.status(400).json({ error: "name, genre, and description are required" });
    }

    const newId = games.length ? Math.max(...games.map((g) => g.id)) + 1 : 1;
    const game = { id: newId, name, genre: genre.toLowerCase(), description };
    games.push(game);

    const reasoning = await llmBrief(
      `A new game was added: name="${name}", genre="${genre}", description="${description}". 
       Explain how this will appear in future recommendations (brief).`
    );

    res.status(201).json({ reasoning, message: "Game added", game });
  } catch (e) {
    console.error("POST /add-game error:", e);
    res.status(500).json({ error: "Internal server error" });
  }
});

// PUT /update-game/:id  -> update game; LLM summarizes impact
app.put("/update-game/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { name, genre, description } = req.body || {};

    const idx = games.findIndex((g) => g.id === id);
    if (idx === -1) return res.status(404).json({ error: "Game not found" });

    const before = { ...games[idx] };
    if (name) games[idx].name = name;
    if (genre) games[idx].genre = genre.toLowerCase();
    if (description) games[idx].description = description;

    const reasoning = await llmBrief(
      `Game updated from ${JSON.stringify(before)} to ${JSON.stringify(games[idx])}. 
       Briefly describe how this affects future recommendations.`
    );

    res.json({ reasoning, message: "Game updated", before, after: games[idx] });
  } catch (e) {
    console.error("PUT /update-game error:", e);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ---- Start ----
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
