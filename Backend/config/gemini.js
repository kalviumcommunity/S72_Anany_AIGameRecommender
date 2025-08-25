const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const GEN_MODEL = process.env.GEMINI_MODEL || "gemini-1.5-flash";

module.exports = { genAI, GEN_MODEL };
