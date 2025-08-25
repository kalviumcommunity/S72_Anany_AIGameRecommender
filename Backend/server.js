require("dotenv").config();
const express = require("express");
const recommendRoutes = require("./routes/recommend");
const gameRoutes = require("./routes/games");

const app = express();
app.use(express.json());

app.use("/recommend", recommendRoutes);
app.use("/games", gameRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
