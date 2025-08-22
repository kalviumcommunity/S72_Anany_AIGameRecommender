const express = require("express");
const app = express();
const PORT = 3000;

// Middleware to parse JSON body
app.use(express.json());

// Simple dataset
let games = [
  { name: "The Legend of Zelda", genre: "adventure" },
  { name: "Elden Ring", genre: "adventure" },
  { name: "Call of Duty", genre: "action" },
  { name: "Minecraft", genre: "sandbox" },
];

// ------------------- GET API (basic recommend) -------------------
app.get("/recommend", (req, res) => {
  const query = req.query.query?.toLowerCase();
  const limit = parseInt(req.query.limit) || games.length;

  if (!query) {
    return res.status(400).json({ error: "Query parameter is required" });
  }

  const filteredGames = games.filter((game) =>
    game.genre.toLowerCase().includes(query)
  );

  res.json(filteredGames.slice(0, limit));
});

// ------------------- POST API (add a new game) -------------------
app.post("/add-game", (req, res) => {
  const { name, genre } = req.body;

  if (!name || !genre) {
    return res.status(400).json({ error: "Name and genre are required" });
  }

  const newGame = { name, genre: genre.toLowerCase() };
  games.push(newGame);

  // Chain of thought reasoning
  const reasoning = [
    `Step 1: Received request to add new game with name "${name}" and genre "${genre}".`,
    `Step 2: Converted genre to lowercase for consistency.`,
    `Step 3: Added the new game to our dataset of ${games.length} games.`,
    `Step 4: Returning success confirmation with added game details.`
  ];

  res.status(201).json({
    reasoning: reasoning,
    message: "Game added successfully!",
    game: newGame,
  });
});

// ------------------- PUT API (update a game's details) -------------------
app.put("/update-game/:name", (req, res) => {
  const gameName = req.params.name;
  const { genre } = req.body;

  // Find the game
  const gameIndex = games.findIndex(
    (g) => g.name.toLowerCase() === gameName.toLowerCase()
  );

  if (gameIndex === -1) {
    return res.status(404).json({ error: "Game not found" });
  }

  // Chain of thought reasoning
  let reasoning = [
    `Step 1: Received request to update game "${gameName}".`,
    `Step 2: Located the game at index ${gameIndex} in our dataset.`,
  ];

  if (genre) {
    games[gameIndex].genre = genre.toLowerCase();
    reasoning.push(`Step 3: Updated the game's genre to "${genre.toLowerCase()}".`);
  } else {
    reasoning.push(`Step 3: No new genre provided, keeping existing genre.`);
  }

  reasoning.push("Step 4: Returning updated game details.");

  res.json({
    reasoning: reasoning,
    message: "Game updated successfully",
    game: games[gameIndex],
  });
});

// ------------------- NEW: GET API with Chain of Thought reasoning -------------------
app.get("/recommend-with-reasoning", (req, res) => {
  const query = req.query.query?.toLowerCase();

  if (!query) {
    return res.status(400).json({ error: "Query parameter is required" });
  }

  const filteredGames = games.filter((game) =>
    game.genre.toLowerCase().includes(query)
  );

  // Simulated "chain of thought" reasoning steps
  const reasoning = [
    `Step 1: User requested games in genre "${query}".`,
    `Step 2: We checked our dataset of ${games.length} games.`,
    `Step 3: Found ${filteredGames.length} games that match the genre.`,
    `Step 4: Returning those recommendations.`
  ];

  res.json({
    reasoning: reasoning,
    recommendations: filteredGames,
  });
});

// ------------------- START SERVER -------------------
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
