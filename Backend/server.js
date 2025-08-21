import express from "express";
import fetch from "node-fetch"; 

const app = express();
const PORT = 3000;

// --- GET API ---
// Example usage: http://localhost:3000/recommend?query=dark fantasy rpg
app.get("/recommend", async (req, res) => {
  try {
    const userQuery = req.query.query; // read ?query=
    if (!userQuery) {
      return res.status(400).json({ error: "Query parameter is required" });
    }

    // --- Call Ollama ---
    const ollamaResponse = await fetch("http://localhost:11434/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "llama3", // or any Ollama model installed
        prompt: `Recommend 3 video games similar to "${userQuery}". 
        Respond ONLY in JSON array format:
        [
          {"title": "Game Name", "genre": "Genre", "reason": "Why recommended"},
          ...
        ]`
      })
    });

    // Ollama streams JSON line by line → collect full response
    const reader = ollamaResponse.body.getReader();
    let fullOutput = "";
    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const chunk = decoder.decode(value);
      try {
        const parsed = JSON.parse(chunk);
        if (parsed.response) {
          fullOutput += parsed.response;
        }
      } catch {
        fullOutput += chunk; // fallback if chunk isn’t JSON
      }
    }

    res.json({
      query: userQuery,
      recommendations: fullOutput.trim()
    });

  } catch (err) {
    console.error("❌ Error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
