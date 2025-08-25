// utils/stripToJson.js
/**
 * Extracts the first JSON object from a string
 */
function stripToJson(text = "") {
  const firstBrace = text.indexOf("{");
  const lastBrace = text.lastIndexOf("}");
  if (firstBrace === -1 || lastBrace === -1) return "{}";
  return text.slice(firstBrace, lastBrace + 1);
}

module.exports = stripToJson;
