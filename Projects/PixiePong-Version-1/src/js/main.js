import { showMenu, hideMenu, exitGame } from "./utils.js";
import Game from "./components/Game.js";
import Menu from "./components/Menu.js";
import CharacterSelect from "./components/CharacterSelect.js";
import SoundManager from "./components/SoundManager.js";

// Initialize game state
let game = null;
let app = null;
let currentCharacter = null;
let soundManager = null;

// Wait for DOM to be loaded
document.addEventListener("DOMContentLoaded", async () => {
  // Initialize PIXI Application
  app = new PIXI.Application({
    width: 800,
    height: 600,
    backgroundColor: 0x000000,
    resolution: window.devicePixelRatio || 1,
    antialias: true,
  });

  // Initialize and wait for sound manager
  soundManager = new SoundManager();
  await soundManager.init();

  // Add event listeners
  setupEventListeners();
});

function setupEventListeners() {
  const startButton = document.getElementById("start-game");
  const settingsButton = document.getElementById("settings");
  const exitButton = document.getElementById("exit-game");
  const backButton = document.getElementById("back-to-menu");
  const exitCharacterSelect = document.getElementById("exit-character-select");

  // Add a click handler to the document for the first interaction
  const unlockAudio = async () => {
    await soundManager.unlockAudio();
    // Start menu music after first click
    await soundManager.playMenuMusic();
    document.removeEventListener("click", unlockAudio);
  };
  document.addEventListener("click", unlockAudio);

  // Add hover sounds to all buttons
  document.querySelectorAll("button").forEach((button) => {
    button.addEventListener("mouseenter", async () => {
      await soundManager.playHover();
    });
  });

  startButton.addEventListener("click", async () => {
    await soundManager.playClick();
    hideMenu("main-menu");
    showMenu("character-select");
  });

  settingsButton.addEventListener("click", async () => {
    await soundManager.playClick();
    hideMenu("main-menu");
    showMenu("settings-menu");
  });

  backButton.addEventListener("click", async () => {
    await soundManager.playBack();
    hideMenu("settings-menu");
    showMenu("main-menu");
  });

  exitButton.addEventListener("click", async () => {
    await soundManager.playClick();
    exitGame();
  });

  exitCharacterSelect.addEventListener("click", () => {
    soundManager.playBack();
    hideMenu("character-select");
    showMenu("main-menu");
  });

  // Character selection
  const characters = document.querySelectorAll(".character-card:not(.locked)");
  characters.forEach((character) => {
    character.addEventListener("mouseenter", () => {
      soundManager.playHover();
    });
    character.addEventListener("click", () => {
      soundManager.playClick();
      selectCharacter(character.id);
    });
  });

  // Volume controls
  const masterVolume = document.getElementById("master-volume");
  const musicVolume = document.getElementById("music-volume");
  const sfxVolume = document.getElementById("sfx-volume");

  masterVolume.addEventListener("input", (e) => {
    soundManager.setMasterVolume(e.target.value / 100);
  });

  musicVolume.addEventListener("input", (e) => {
    soundManager.setMusicVolume(e.target.value / 100);
  });

  sfxVolume.addEventListener("input", (e) => {
    soundManager.setSFXVolume(e.target.value / 100);
  });
}

function selectCharacter(characterId) {
  currentCharacter = characterId;
  hideMenu("character-select");
  startGame();
}

async function startGame() {
  const gameContainer = document.getElementById("game");
  gameContainer.classList.remove("hidden");
  gameContainer.innerHTML = "";

  gameContainer.appendChild(app.view);

  game = new Game(app, currentCharacter, soundManager);
  await game.start();
}

// Handle window resize
window.addEventListener("resize", () => {
  if (app) {
    // Update renderer size
    app.renderer.resize(800, 600);

    // Update game if it exists
    if (game) {
      game.handleResize();
    }
  }
});
