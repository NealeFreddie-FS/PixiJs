export default class Lemonade {
  constructor(game, initialLemons = 0, initialSugar = 0, initialIce = 0) {
    this.game = game;
    this.lemons = initialLemons;
    this.sugar = initialSugar;
    this.ice = initialIce;
    this.cups = 0;
  }

  buyLemons() {
    if (this.game.money >= 1.0) {
      this.game.money -= 1.0;
      this.lemons += 1;
      this.game.ui.updateUI();
    } else {
      alert("Not enough money!");
    }
  }

  buySugar() {
    if (this.game.money >= 0.5) {
      this.game.money -= 0.5;
      this.sugar += 1;
      this.game.ui.updateUI();
    } else {
      alert("Not enough money!");
    }
  }

  buyIce() {
    if (this.game.money >= 0.25) {
      this.game.money -= 0.25;
      this.ice += 1;
      this.game.ui.updateUI();
    } else {
      alert("Not enough money!");
    }
  }

  makeLemonade() {
    if (this.lemons >= 1 && this.sugar >= 1 && this.ice >= 1) {
      this.lemons -= 1;
      this.sugar -= 1;
      this.ice -= 1;
      this.cups += 1;
      this.game.ui.updateUI();
    } else {
      alert("Not enough ingredients!");
    }
  }

  sellLemonade() {
    if (this.cups >= 1) {
      let price = 1.0;
      if (this.game.weather.condition === "Sunny") price *= 1.5;
      if (this.game.weather.temperature > 80) price *= 1.2;
      this.game.money += price;
      this.cups -= 1;
      this.game.ui.updateUI();
    } else {
      alert("No lemonade to sell!");
    }
  }
}
