const { GoogleGenerativeAI } = require("@google/generative-ai");

let cachedClient = null;

function getClient() {
  if (cachedClient) return cachedClient;
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  cachedClient = new GoogleGenerativeAI(apiKey);
  return cachedClient;
}

async function embedText(text) {
  const client = getClient();
  if (!client) return null;
  try {
    const model = client.getGenerativeModel({ model: "text-embedding-004" });
    const res = await model.embedContent(text);
    const values = res?.embedding?.values;
    if (Array.isArray(values)) return values;
  } catch (_) {}
  return null;
}

async function embedTexts(texts) {
  const client = getClient();
  if (!client) return Array(texts.length).fill(null);
  try {
    const model = client.getGenerativeModel({ model: "text-embedding-004" });
    const res = await model.batchEmbedContents({
      requests: texts.map((t) => ({ content: { parts: [{ text: t }] } })),
    });
    const embeddings = res?.embeddings || [];
    return texts.map((_, i) => Array.isArray(embeddings[i]?.values) ? embeddings[i].values : null);
  } catch (_) {
    return Array(texts.length).fill(null);
  }
}

module.exports = { embedText, embedTexts };


