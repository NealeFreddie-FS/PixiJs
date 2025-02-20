import { showMenu, hideMenu, exitGame } from "./utils.js";
import Menu from "./components/Menu.js";
import Settings from "./components/Settings.js";
import Game from "./components/Game.js";

// Initialize PixiJS Application
let app; // Declare app globally

document.addEventListener("DOMContentLoaded", () => {
  const startButton = document.getElementById("start-game");
  const settingsButton = document.getElementById("settings");
  const exitButton = document.getElementById("exit-game");
  const backButton = document.getElementById("back-to-menu");

  startButton.addEventListener("click", startGame);
  settingsButton.addEventListener("click", () => showMenu("settings-menu"));
  backButton.addEventListener("click", () => showMenu("main-menu"));
  exitButton.addEventListener("click", exitGame);
});

function startGame() {
  hideMenu("main-menu");
  document.getElementById("game").classList.remove("hidden");
  initializeGame();
}

function initializeGame() {
  // Create PixiJS Application if it doesn't exist
  if (!app) {
    app = new PIXI.Application({
      backgroundColor: 0x3398b9,
      width: 800,
      height: 800,
      antialias: true,
    });
    document.getElementById("game").appendChild(app.view);
  }

  // Initialize Components
  const menu = new Menu();
  const settings = new Settings();
  const game = new Game(app);

  // Listen for game start to initialize game components
  document.addEventListener("startGame", () => {
    // Set default difficulty
    const selectedDifficulty = document.getElementById("difficulty").value;
    game.setDifficulty(selectedDifficulty);
  });

  // Listen for game reset to reset game components
  document.addEventListener("resetGame", () => {
    showMenu("main-menu");
    document.getElementById("game").classList.add("hidden");
    game.resetGame();
  });
}
