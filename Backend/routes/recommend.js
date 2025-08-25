// routes/recommend.js
const express = require("express");
const router = express.Router();
const { llmRecommend } = require("../services/recommender");

// GET /recommend?query=I+like+RPG&limit=3
router.get("/", async (req, res) => {
  try {
    const query = (req.query.query || "").trim();
    const limit = Math.max(1, Math.min(parseInt(req.query.limit) || 3, 10));

    if (!query) {
      return res.status(400).json({ error: "Query parameter is required" });
    }

    const { reasoning, recommendations } = await llmRecommend(query, limit);

    res.json({ reasoning, recommendations });
  } catch (err) {
    console.error("GET /recommend error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
