// data/games.js

let games = [
  // --- Strategy ---
  { id: 1, name: "Chess", genre: "strategy", description: "A classic strategy board game of kings and queens." },
  { id: 2, name: "StarCraft II", genre: "strategy", description: "A real-time strategy game with competitive multiplayer." },
  { id: 3, name: "Civilization VI", genre: "strategy", description: "Turn-based strategy game about building an empire." },
  { id: 4, name: "Age of Empires II", genre: "strategy", description: "Historical real-time strategy game of civilizations." },
  { id: 5, name: "Total War: Warhammer II", genre: "strategy", description: "Combines grand strategy and real-time battles." },

  // --- Sandbox ---
  { id: 6, name: "Minecraft", genre: "sandbox", description: "A sandbox game for creativity and survival." },
  { id: 7, name: "Terraria", genre: "sandbox", description: "2D sandbox adventure with crafting and exploration." },
  { id: 8, name: "Roblox", genre: "sandbox", description: "Platform for user-created games and virtual worlds." },
  { id: 9, name: "Garry's Mod", genre: "sandbox", description: "Sandbox game with physics and modding freedom." },
  { id: 10, name: "The Sims 4", genre: "sandbox", description: "Life simulation sandbox with endless customization." },

  // --- Action ---
  { id: 11, name: "Valorant", genre: "action", description: "A tactical first-person shooter with agents." },
  { id: 12, name: "Counter-Strike: Global Offensive", genre: "action", description: "Competitive FPS with tactical gameplay." },
  { id: 13, name: "Call of Duty: Modern Warfare II", genre: "action", description: "Fast-paced military FPS with multiplayer modes." },
  { id: 14, name: "Overwatch 2", genre: "action", description: "Team-based hero shooter with unique abilities." },
  { id: 15, name: "Apex Legends", genre: "action", description: "Battle royale shooter with hero-based mechanics." },

  // --- Simulation ---
  { id: 16, name: "Stardew Valley", genre: "simulation", description: "A cozy farm-life sim with exploration." },
  { id: 17, name: "Cities: Skylines", genre: "simulation", description: "City-building simulator with deep systems." },
  { id: 18, name: "Planet Zoo", genre: "simulation", description: "Zoo management simulation with detailed animal care." },
  { id: 19, name: "Football Manager 2024", genre: "simulation", description: "Soccer management simulator with realism." },
  { id: 20, name: "Microsoft Flight Simulator", genre: "simulation", description: "Realistic flight simulation across the globe." },

  // --- Adventure ---
  { id: 21, name: "Elden Ring", genre: "adventure", description: "Open-world action RPG with challenging combat." },
  { id: 22, name: "The Legend of Zelda: Breath of the Wild", genre: "adventure", description: "Exploration-based open-world fantasy adventure." },
  { id: 23, name: "The Witcher 3: Wild Hunt", genre: "adventure", description: "Story-driven open-world RPG set in a dark fantasy world." },
  { id: 24, name: "Horizon Zero Dawn", genre: "adventure", description: "Post-apocalyptic action RPG with robot creatures." },
  { id: 25, name: "Assassin’s Creed Valhalla", genre: "adventure", description: "Open-world Viking adventure with stealth and combat." },

  // --- Puzzle ---
  { id: 26, name: "Portal 2", genre: "puzzle", description: "First-person puzzle game using portals." },
  { id: 27, name: "The Witness", genre: "puzzle", description: "Exploration-based puzzle game with line puzzles." },
  { id: 28, name: "Tetris Effect", genre: "puzzle", description: "Classic Tetris with immersive visuals and music." },
  { id: 29, name: "Baba Is You", genre: "puzzle", description: "Logic-based puzzle game where rules are manipulable." },
  { id: 30, name: "Human: Fall Flat", genre: "puzzle", description: "Physics-based puzzle platformer with co-op." },

  // --- Horror ---
  { id: 31, name: "Resident Evil 4 Remake", genre: "horror", description: "Survival horror game with action elements." },
  { id: 32, name: "Outlast", genre: "horror", description: "First-person survival horror in an asylum." },
  { id: 33, name: "Dead by Daylight", genre: "horror", description: "Asymmetrical multiplayer horror survival." },
  { id: 34, name: "Silent Hill 2", genre: "horror", description: "Psychological survival horror classic." },
  { id: 35, name: "Amnesia: The Dark Descent", genre: "horror", description: "First-person survival horror focused on fear." },

  // --- Racing ---
  { id: 36, name: "Forza Horizon 5", genre: "racing", description: "Open-world racing game with realistic cars." },
  { id: 37, name: "Gran Turismo 7", genre: "racing", description: "Realistic racing simulator with detailed tracks." },
  { id: 38, name: "Need for Speed: Heat", genre: "racing", description: "Street racing game with police chases." },
  { id: 39, name: "Mario Kart 8 Deluxe", genre: "racing", description: "Fun arcade racing with Nintendo characters." },
  { id: 40, name: "F1 23", genre: "racing", description: "Official Formula One racing simulator." },

  // --- Sports ---
  { id: 41, name: "FIFA 23", genre: "sports", description: "Soccer simulator with realistic gameplay." },
  { id: 42, name: "NBA 2K24", genre: "sports", description: "Basketball simulation with MyCareer mode." },
  { id: 43, name: "Madden NFL 24", genre: "sports", description: "American football simulation game." },
  { id: 44, name: "WWE 2K23", genre: "sports", description: "Professional wrestling simulator." },
  { id: 45, name: "Rocket League", genre: "sports", description: "Car soccer with fast-paced action." },

  // --- RPG ---
  { id: 46, name: "Final Fantasy XV", genre: "rpg", description: "Fantasy RPG with real-time combat and open world." },
  { id: 47, name: "Persona 5 Royal", genre: "rpg", description: "Stylized RPG about high schoolers and alternate worlds." },
  { id: 48, name: "Dragon Age: Inquisition", genre: "rpg", description: "Fantasy RPG with party-based combat." },
  { id: 49, name: "Dark Souls III", genre: "rpg", description: "Challenging dark fantasy RPG with intricate combat." },
  { id: 50, name: "Skyrim", genre: "rpg", description: "Open-world fantasy RPG with exploration and freedom." },

  // --- Indie & Misc ---
  { id: 51, name: "Hades", genre: "indie", description: "Action roguelike about escaping the underworld." },
  { id: 52, name: "Celeste", genre: "indie", description: "Challenging platformer about climbing a mountain." },
  { id: 53, name: "Undertale", genre: "indie", description: "Story-driven RPG where choices matter." },
  { id: 54, name: "Hollow Knight", genre: "indie", description: "Metroidvania action-adventure in a bug kingdom." },
  { id: 55, name: "Cuphead", genre: "indie", description: "Challenging run-and-gun game with 1930s art style." },
];

module.exports = games;


