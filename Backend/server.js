require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const recommendRoutes = require("./routes/recommend");
const gameRoutes = require("./routes/games");

const app = express();
app.use(cors());
app.use(express.json());

// Serve React dist folder as static files
const distPath = path.join(__dirname, "../Frontend/dist");
app.use(express.static(distPath));

// API Routes
app.use("/api/recommend", recommendRoutes);
app.use("/api/games", gameRoutes);

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "AI Game Recommender API is running" });
});

// Serve React app for all other GET requests (SPA fallback)
app.get("*", (req, res) => {
  res.sendFile(path.join(distPath, "index.html"));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
