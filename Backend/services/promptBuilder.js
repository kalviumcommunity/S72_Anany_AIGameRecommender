// services/promptBuilder.js

/**
 * Builds a strict prompt for Gemini to return game recommendations in JSON.
 * @param {string} userQuery - user request, e.g. "I want a fun RPG on PC"
 * @param {number} limit - number of recommendations
 */
function buildPrompt(userQuery, limit = 3) {
  return `
You are a game recommendation assistant.

User request: "${userQuery}"

Return ONLY valid JSON; no markdown or extra text. Use this exact schema:
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
`;
}

module.exports = { buildPrompt };
