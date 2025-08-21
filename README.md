# 🎮 AI Game Recommender & Lore Generator

**Brief:** AI-powered game recommendation system that retrieves similar games using embeddings, RAG, and generates immersive lore expansions with structured outputs and function calling.

---

## 🚀 Project Overview

This project is a **fun AI assistant for gamers** that:

- Recommends similar games based on player preferences.
- Uses **Retrieval-Augmented Generation (RAG)** to search a small dataset of games.
- Generates **new story lore** for games dynamically.
- Provides structured JSON outputs for easy integration.
- Uses **function calling** for extra actions (e.g., fetch trailer links).
- Implements different **prompting techniques** (zero-shot, one-shot, few-shot, chain-of-thought, dynamic).
- Logs tokens, supports decoding parameters (**temperature, top-k, top-p**).
- Includes **evaluation pipeline** with judge prompt + sample queries.

---

## 🛠️ Tech Stack

- **LLM Backend:** [Ollama](https://ollama.ai) (for chat + embeddings)
- **Vector Database:** FAISS / Chroma
- **Language:** Python 3.10+
- **Framework:** FastAPI (optional, for API interface)
- **Libraries:** `numpy`, `faiss`/`chromadb`, `json`

---

## ⚙️ Features Implemented

- **Embeddings:** Generate and store embeddings for games dataset.
- **Similarity Search:** Cosine, Dot Product, Euclidean distance.
- **RAG:** Retrieve top relevant games from dataset before response.
- **Prompting:** Zero-shot, one-shot, few-shot, multi-shot, CoT, dynamic.
- **Structured Output:** JSON-based recommendations.
- **Function Calling:** Fetch trailer links, generate extra lore.
- **Stop Sequences:** Control response cut-off.
- **Tokens & Logging:** Track token usage after each call.
- **Decoding Controls:** Temperature, top-k, top-p tuning.
- **Evaluation Framework:** Automated test queries + judge prompt scoring.

---

## 🧪 Example Flow

1. User asks: _“Recommend me dark fantasy RPGs with deep story.”_
2. Query is embedded → compared to stored game embeddings.
3. Top matches (e.g., _The Witcher 3, Dark Souls_) retrieved
4. LLM generates structured JSON:
   ```json
   {
     "recommendations": [
       { "title": "The Witcher 3", "reason": "Dark fantasy with rich story" },
       { "title": "Dark Souls", "reason": "Challenging, lore-heavy atmosphere" }
     ]
   }
   ```
