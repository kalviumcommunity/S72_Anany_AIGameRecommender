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

function cosineSimilarity(a, b) {
  if (!Array.isArray(a) || !Array.isArray(b)) return null;
  const len = Math.min(a.length, b.length);
  if (len === 0) return null;
  let dot = 0;
  let aSq = 0;
  let bSq = 0;
  for (let i = 0; i < len; i++) {
    const av = Number(a[i]) || 0;
    const bv = Number(b[i]) || 0;
    dot += av * bv;
    aSq += av * av;
    bSq += bv * bv;
  }
  const denom = Math.sqrt(aSq) * Math.sqrt(bSq);
  if (!isFinite(denom) || denom === 0) return null;
  return dot / denom;
}

function dotProductSimilarity(a, b) {
  if (!Array.isArray(a) || !Array.isArray(b)) return null;
  const len = Math.min(a.length, b.length);
  if (len === 0) return null;
  let dot = 0;
  for (let i = 0; i < len; i++) {
    const av = Number(a[i]) || 0;
    const bv = Number(b[i]) || 0;
    dot += av * bv;
  }
  return dot;
}

module.exports = { embedText, embedTexts, cosineSimilarity, dotProductSimilarity };


