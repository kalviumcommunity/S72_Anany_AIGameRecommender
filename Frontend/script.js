// JavaScript for AI Game Recommender Frontend

const API_BASE = "http://localhost:5000/api";

// DOM Elements
const queryInput = document.getElementById("queryInput");
const searchBtn = document.getElementById("searchBtn");
const limitSelect = document.getElementById("limitSelect");
const statusSection = document.getElementById("statusSection");
const resultsSection = document.getElementById("resultsSection");
const errorSection = document.getElementById("errorSection");
const recommendationsGrid = document.getElementById("recommendationsGrid");
const reasoningText = document.getElementById("reasoningText");
const embeddingsInfo = document.getElementById("embeddingsInfo");
const embeddingsDetails = document.getElementById("embeddingsDetails");
const errorText = document.getElementById("errorText");

// Event Listeners
searchBtn.addEventListener("click", handleSearch);
queryInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        handleSearch();
    }
});

// Main search handler
async function handleSearch() {
    const query = queryInput.value.trim();
    const limit = parseInt(limitSelect.value);

    if (!query) {
        showError("Please enter a search query");
        return;
    }

    showLoading();
    clearResults();
    clearError();

    try {
        const encodedQuery = encodeURIComponent(query);
        const url = `${API_BASE}/recommend?query=${encodedQuery}&limit=${limit}`;

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Server error: ${response.status}`);
        }

        const data = await response.json();

        if (!data.success) {
            throw new Error(data.error || "Failed to get recommendations");
        }

        displayResults(data, limit);
    } catch (err) {
        console.error("Search error:", err);
        showError(err.message || "Failed to fetch recommendations. Make sure the backend is running.");
    }
}

// Display results
function displayResults(data, limit) {
    // Show reasoning
    if (data.reasoning) {
        reasoningText.textContent = data.reasoning;
    }

    // Display recommendations
    const recommendations = Array.isArray(data.recommendations) ? data.recommendations : [];

    if (recommendations.length === 0) {
        showError("No recommendations found for your query.");
        return;
    }

    recommendationsGrid.innerHTML = recommendations
        .slice(0, limit)
        .map((game, index) => `
            <div class="game-card">
                <span class="game-rank">#${index + 1}</span>
                <div class="game-name">${escapeHtml(game.name || "Unknown Game")}</div>
                <span class="game-genre">${escapeHtml(game.genre || "Unknown Genre")}</span>
                <p class="game-description">${escapeHtml(game.description || "No description available")}</p>
            </div>
        `)
        .join("");

    // Show similarity scores if available
    if (data.similarity && data.similarity.length > 0) {
        const scoresHtml = data.similarity
            .map((score, index) => {
                const game = recommendations[index];
                const cosine = score.cosine !== null ? score.cosine.toFixed(4) : "N/A";
                const dot = score.dot !== null ? score.dot.toFixed(4) : "N/A";
                const euc = score.euclidean !== null ? score.euclidean.toFixed(4) : "N/A";

                return `
                    <div style="margin-bottom: 20px;">
                        <div style="font-weight: 600; color: var(--primary); margin-bottom: 8px;">
                            ${escapeHtml(game.name || "Unknown Game")}
                        </div>
                        <div class="similarity-row">
                            <span>Cosine Similarity:</span>
                            <strong>${cosine}</strong>
                        </div>
                        <div class="similarity-row">
                            <span>Dot Product:</span>
                            <strong>${dot}</strong>
                        </div>
                        <div class="similarity-row">
                            <span>Euclidean Distance:</span>
                            <strong>${euc}</strong>
                        </div>
                    </div>
                `;
            })
            .join("");

        embeddingsDetails.innerHTML = scoresHtml;
        embeddingsInfo.style.display = "block";
    } else {
        embeddingsInfo.style.display = "none";
    }

    // Show results section
    resultsSection.style.display = "block";
    statusSection.style.display = "none";
}

// Show loading state
function showLoading() {
    statusSection.style.display = "block";
    resultsSection.style.display = "none";
    errorSection.style.display = "none";
    searchBtn.disabled = true;
    searchBtn.textContent = "Searching...";
}

// Show error
function showError(message) {
    errorText.textContent = message;
    errorSection.style.display = "block";
    statusSection.style.display = "none";
    resultsSection.style.display = "none";
    searchBtn.disabled = false;
    searchBtn.textContent = "Search";
}

// Clear results
function clearResults() {
    recommendationsGrid.innerHTML = "";
    reasoningText.textContent = "";
    embeddingsInfo.style.display = "none";
}

// Clear error
function clearError() {
    errorSection.style.display = "none";
    errorText.textContent = "";
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
}

// Re-enable search button after results
document.addEventListener("DOMContentLoaded", () => {
    searchBtn.disabled = false;
    searchBtn.textContent = "Search";
    queryInput.focus();
});
