// services/promptBuilder.js

/**
 * Builds a strict prompt for Gemini to return game recommendations in JSON.
 * @param {string} userQuery - user request, e.g. "I want a fun RPG on PC"
 * @param {number} limit - number of recommendations
 */
function buildPrompt(userQuery, limit = 3) {
  return `
You are a game recommendation assistant. Always respond with valid JSON following the exact schema below.

Here are examples of the expected format:

EXAMPLE 1:
User: "I want a fun RPG on PC"
Response: {
  "reasoning": "Based on your request for a fun PC RPG, here are engaging role-playing games with rich storytelling and character development.",
  "recommendations": [
    { "name": "The Witcher 3: Wild Hunt", "genre": "rpg", "description": "Epic open-world RPG with compelling story and monster hunting." },
    { "name": "Persona 5 Royal", "genre": "rpg", "description": "Stylized JRPG about high schoolers with supernatural powers." },
    { "name": "Dragon Age: Inquisition", "genre": "rpg", "description": "Fantasy RPG with party-based combat and moral choices." }
  ]
}

EXAMPLE 2:
User: "I like strategy games with historical themes"
Response: {
  "reasoning": "Historical strategy games offer deep tactical gameplay with real-world historical contexts and empire building.",
  "recommendations": [
    { "name": "Civilization VI", "genre": "strategy", "description": "Turn-based strategy about building civilizations from ancient to modern times." },
    { "name": "Age of Empires II", "genre": "strategy", "description": "Real-time strategy featuring medieval warfare and castle building." },
    { "name": "Total War: Warhammer II", "genre": "strategy", "description": "Grand strategy with real-time battles in fantasy setting." }
  ]
}

Now, for your request:

User request: "${userQuery}"

Return ONLY valid JSON using this exact schema:
{
  "reasoning": "short reasoning why these games fit",
  "recommendations": [
    { "name": "string", "genre": "string", "description": "string" }
  ]
}

Rules:
- Provide exactly ${limit} items in recommendations.
- Keep descriptions concise (<= 1 sentence).
- Do not include platform availability unless asked; prefer general PC-friendly titles if platform unspecified.
- Follow the exact format shown in the examples above.
`;
}

module.exports = { buildPrompt };
