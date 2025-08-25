// routes/games.js
const express = require("express");
const { getLLMRecommendation } = require("../services/recommender");
const router = express.Router();

// Add new game
router.post("/add", async (req, res) => {
  const game = req.body;

  const aiResponse = await getLLMRecommendation("add", game);

  res.json({
    success: true,
    game,
    aiResponse,
  });
});

// Update existing game
router.put("/update", async (req, res) => {
  const { before, after } = req.body;

  const aiResponse = await getLLMRecommendation("update", { before, after });

  res.json({
    success: true,
    before,
    after,
    aiResponse,
  });
});

// Recommend games for user
router.post("/recommend", async (req, res) => {
  const { preferences } = req.body;

  const aiResponse = await getLLMRecommendation("recommend", {}, preferences);

  res.json({
    success: true,
    preferences,
    aiResponse,
  });
});

module.exports = router;
