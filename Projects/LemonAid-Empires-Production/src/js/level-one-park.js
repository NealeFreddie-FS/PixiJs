import Game from "../components/Game.js";

// Initialize the game for the Park level
const game = new Game({
  level: 1,
  location: "Park",
  initialMoney: 50.0,
  initialLemons: parseInt(localStorage.getItem("initialLemons")) || 10,
  initialSugar: parseInt(localStorage.getItem("initialSugar")) || 10,
  initialIce: parseInt(localStorage.getItem("initialIce")) || 10,
});

game.init();
