export default class Weather {
  constructor() {
    this.condition = "Sunny";
    this.temperature = 75;
  }

  update() {
    const conditions = ["Sunny", "Cloudy", "Rainy"];
    this.condition = conditions[Math.floor(Math.random() * conditions.length)];
    this.temperature = Math.floor(Math.random() * 30) + 60; // Random temperature between 60 and 90
  }
}
