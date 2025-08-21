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

// GET API (already done)
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

// POST API to add a new game
app.post("/add-game", (req, res) => {
  const { name, genre } = req.body;

  if (!name || !genre) {
    return res.status(400).json({ error: "Name and genre are required" });
  }

  const newGame = { name, genre: genre.toLowerCase() };
  games.push(newGame);

  res.status(201).json({
    message: "Game added successfully!",
    game: newGame,
  });
});

// PUT API - Update a game's details
app.put("/update-game/:name", (req, res) => {
    const gameName = req.params.name;
    const { genre } = req.body;

    // Find the game
    const gameIndex = games.findIndex(g => g.name.toLowerCase() === gameName.toLowerCase());

    if (gameIndex === -1) {
        return res.status(404).json({ error: "Game not found" });
    }

    // Update genre if provided
    if (genre) {
        games[gameIndex].genre = genre;
    }

    res.json({ message: "Game updated successfully", game: games[gameIndex] });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
