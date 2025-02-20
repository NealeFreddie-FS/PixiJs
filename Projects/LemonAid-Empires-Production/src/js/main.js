import Game from "../components/Game.js";

document.addEventListener("DOMContentLoaded", () => {
  // DOM Elements
  const startMenu = document.getElementById("start-menu");
  const gameContainer = document.getElementById("game-container");
  const newGameButton = document.getElementById("new-game");
  const loadGameButton = document.getElementById("load-game");
  const exitButton = document.getElementById("exit-game");

  // Initialize Game
  let game;

  // Initialize the game
  game = new Game({
    level: 1,
    location: "Park",
    initialMoney: 50.0,
    initialLemons: parseInt(localStorage.getItem("initialLemons")) || 10,
    initialSugar: parseInt(localStorage.getItem("initialSugar")) || 10,
    initialIce: parseInt(localStorage.getItem("initialIce")) || 10,
  });
  game.init();

  // Start New Game
  if (newGameButton) {
    newGameButton.addEventListener("click", () => {
      game = new Game({
        level: 1,
        location: "Park",
        initialMoney: 50.0,
        initialLemons: parseInt(localStorage.getItem("initialLemons")) || 10,
        initialSugar: parseInt(localStorage.getItem("initialSugar")) || 10,
        initialIce: parseInt(localStorage.getItem("initialIce")) || 10,
      });
      startMenu.classList.add("hidden");
      gameContainer.classList.remove("hidden");
      game.init();
    });
  }

  // Load Game
  if (loadGameButton) {
    loadGameButton.addEventListener("click", () => {
      game.loadGame();
    });
  }

  // Exit Game
  if (exitButton) {
    exitButton.addEventListener("click", () => {
      if (confirm("Are you sure you want to exit?")) {
        window.close();
      }
    });
  }
});
