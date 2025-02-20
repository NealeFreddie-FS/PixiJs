import GameUI from "./UserInterfaces/GameUI.js";
import Weather from "./Weather.js";
import Lemonade from "./Lemonade.js";

export default class Game {
  constructor({
    level,
    location,
    initialMoney,
    initialLemons,
    initialSugar,
    initialIce,
  }) {
    this.level = level;
    this.location = location;
    this.day = 1;
    this.money = initialMoney;
    this.weather = new Weather();
    this.lemonade = new Lemonade(this, initialLemons, initialSugar, initialIce);
    this.ui = new GameUI(this);
  }

  init() {
    this.ui.render();
    this.weather.update();
    this.ui.updateUI();
  }

  nextDay() {
    this.day += 1;
    this.weather.update();
    this.ui.updateUI();
  }

  // Save game state to localStorage
  saveGame() {
    const gameState = {
      level: this.level,
      location: this.location,
      day: this.day,
      money: this.money,
      lemons: this.lemonade.lemons,
      sugar: this.lemonade.sugar,
      ice: this.lemonade.ice,
      cups: this.lemonade.cups,
      weatherCondition: this.weather.condition,
      temperature: this.weather.temperature,
    };
    localStorage.setItem("savedGame", JSON.stringify(gameState));
    alert("Game saved successfully!");
  }

  // Load game state from localStorage
  loadGame() {
    const savedGame = JSON.parse(localStorage.getItem("savedGame"));
    if (savedGame) {
      this.level = savedGame.level;
      this.location = savedGame.location;
      this.day = savedGame.day;
      this.money = savedGame.money;
      this.lemonade.lemons = savedGame.lemons;
      this.lemonade.sugar = savedGame.sugar;
      this.lemonade.ice = savedGame.ice;
      this.lemonade.cups = savedGame.cups;
      this.weather.condition = savedGame.weatherCondition;
      this.weather.temperature = savedGame.temperature;
      this.ui.updateUI();
      alert("Game loaded successfully!");
    } else {
      alert("No saved game found!");
    }
  }
}
