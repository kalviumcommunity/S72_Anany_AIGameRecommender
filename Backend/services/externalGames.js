const fetch = require("cross-fetch");

const genreToSlug = {
  action: "action",
  adventure: "adventure",
  puzzle: "puzzle",
  horror: "horror",
  racing: "racing",
  sports: "sports",
  rpg: "role-playing-games-rpg",
  strategy: "strategy",
  simulation: "simulation",
  indie: "indie",
  // sandbox does not exist as a RAWG genre; skip mapping
};

/**
 * Fetch games from RAWG API.
 * Env: RAWG_API_KEY
 *
 * @param {{ genre?: string, search?: string, limit?: number }} params
 * @returns {Promise<Array<{ name: string, genre: string, description: string }>>}
 */
async function fetchGamesFromRAWG(params = {}) {
  const { genre, search, limit = 3 } = params;

  const apiKey = process.env.RAWG_API_KEY;
  if (!apiKey) {
    return [];
  }

  const qs = new URLSearchParams();
  qs.set("key", apiKey);
  qs.set("page_size", String(Math.max(1, Math.min(limit, 20))));
  qs.set("ordering", "-rating");

  const slug = genre ? genreToSlug[genre.toLowerCase()] : undefined;
  if (slug) qs.set("genres", slug);
  if (search) qs.set("search", search);

  const url = `https://api.rawg.io/api/games?${qs.toString()}`;

  try {
    const res = await fetch(url);
    if (!res.ok) return [];
    const data = await res.json();
    const results = Array.isArray(data?.results) ? data.results : [];

    // If filtered by unmapped genre yielded nothing, retry without genre filter
    if (!results.length && slug) {
      const retryQs = new URLSearchParams(qs);
      retryQs.delete("genres");
      const retryUrl = `https://api.rawg.io/api/games?${retryQs.toString()}`;
      const retryRes = await fetch(retryUrl);
      if (retryRes.ok) {
        const retryData = await retryRes.json();
        const retryResults = Array.isArray(retryData?.results) ? retryData.results : [];
        return retryResults.map((g) => formatGame(g, genre));
      }
    }

    return results.map((g) => formatGame(g, genre));
  } catch (_) {
    return [];
  }
}

function formatGame(g, fallbackGenre) {
  const primaryGenre = Array.isArray(g.genres) && g.genres.length > 0 ? g.genres[0].name : fallbackGenre || "";
  const year = g.released ? new Date(g.released).getFullYear() : undefined;
  const rating = typeof g.rating === "number" ? g.rating.toFixed(1) : undefined;
  const parts = [];
  if (primaryGenre) parts.push(primaryGenre);
  if (year) parts.push(String(year));
  if (rating) parts.push(`${rating}/5 rating`);
  const desc = parts.length ? `Popular ${parts.join(" • ")}.` : "Popular and well-reviewed title.";

  return {
    name: g.name,
    genre: (primaryGenre || "").toString().toLowerCase(),
    description: desc,
  };
}

module.exports = { fetchGamesFromRAWG };


