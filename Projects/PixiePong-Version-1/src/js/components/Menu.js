import CharacterSelect from "./CharacterSelect.js";

export default class Menu {
  constructor() {
    this.menuContainer = document.getElementById("main-menu");
    this.settingsMenu = document.getElementById("settings-menu");
    this.gameContainer = document.getElementById("game");

    this.startButton = document.getElementById("start-game");
    this.settingsButton = document.getElementById("settings");
    this.exitButton = document.getElementById("exit-game");
    this.backButton = document.getElementById("back-to-menu");

    this.characterSelect = new CharacterSelect();

    this.initialize();
  }

  initialize() {
    this.startButton.addEventListener("click", () =>
      this.openCharacterSelect()
    );
    this.settingsButton.addEventListener("click", () => this.openSettings());
    this.backButton.addEventListener("click", () => this.closeSettings());
    this.exitButton.addEventListener("click", () => this.exitGame());
  }

  openCharacterSelect() {
    this.menuContainer.classList.add("hidden");
    this.characterSelect.show();
  }

  openSettings() {
    this.menuContainer.classList.add("hidden");
    this.settingsMenu.classList.remove("hidden");
  }

  closeSettings() {
    this.settingsMenu.classList.add("hidden");
    this.menuContainer.classList.remove("hidden");
  }

  exitGame() {
    // Functionality to exit the game
    // This could redirect to another page or close the window
    window.close(); // Note: May not work in all browsers
  }
}
