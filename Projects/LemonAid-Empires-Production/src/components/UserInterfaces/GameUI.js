import { createButton, createContainer } from "./UIManager.js";

export default class GameUI {
  constructor(game) {
    this.game = game;
    this.uiContainer = document.getElementById("game-container");
  }

  render() {
    this.uiContainer.innerHTML = `
      <div id="game-ui">
        <div id="stats">
          <h2>LemonAid Empires - ${this.game.location}</h2>
          <p>Stand Name: <span id="stand-name">${localStorage.getItem(
            "standName"
          )}</span></p>
          <p>Lemons: <span id="lemons">${this.game.lemonade.lemons}</span></p>
          <p>Sugar: <span id="sugar">${this.game.lemonade.sugar}</span></p>
          <p>Ice: <span id="ice">${this.game.lemonade.ice}</span></p>
          <p>Day: <span id="day">${this.game.day}</span></p>
          <p>Money: $<span id="money">${this.game.money.toFixed(2)}</span></p>
          <p>Lemonade: <span id="lemonade">${
            this.game.lemonade.cups
          }</span> cups</p>
        </div>
        <div id="controls">
          ${
            createButton("Buy Lemons ($1.00)", () =>
              this.game.lemonade.buyLemons()
            ).outerHTML
          }
          ${
            createButton("Buy Sugar ($0.50)", () =>
              this.game.lemonade.buySugar()
            ).outerHTML
          }
          ${
            createButton("Buy Ice ($0.25)", () => this.game.lemonade.buyIce())
              .outerHTML
          }
          ${
            createButton("Make Lemonade", () =>
              this.game.lemonade.makeLemonade()
            ).outerHTML
          }
          ${
            createButton("Sell Lemonade ($1.00)", () =>
              this.game.lemonade.sellLemonade()
            ).outerHTML
          }
          ${createButton("Next Day", () => this.game.nextDay()).outerHTML}
        </div>
        <div id="weather">
          <p>Weather: <span id="weather-condition">${
            this.game.weather.condition
          }</span></p>
          <p>Temperature: <span id="temperature">${
            this.game.weather.temperature
          }</span>°F</p>
        </div>
      </div>
      <canvas id="game-canvas"></canvas>
    `;
  }

  updateUI() {
    document.getElementById("lemons").textContent = this.game.lemonade.lemons;
    document.getElementById("sugar").textContent = this.game.lemonade.sugar;
    document.getElementById("ice").textContent = this.game.lemonade.ice;
    document.getElementById("day").textContent = this.game.day;
    document.getElementById("money").textContent = this.game.money.toFixed(2);
    document.getElementById("lemonade").textContent = this.game.lemonade.cups;
    document.getElementById("weather-condition").textContent =
      this.game.weather.condition;
    document.getElementById("temperature").textContent =
      this.game.weather.temperature;
  }
}
