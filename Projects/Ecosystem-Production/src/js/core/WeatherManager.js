export default class WeatherManager {
  constructor() {
    this.conditions = ["sunny", "cloudy", "rainy", "stormy"];
    this.currentWeather = "sunny";
    this.temperature = 20; // Celsius
    this.changeChance = 0.001; // Chance to change weather per update
    this.transitionDuration = 5000; // Weather transition duration in ms
    this.transitionTime = 0;
    this.targetWeather = null;

    // Weather effects on entities
    this.weatherEffects = {
      sunny: {
        plantGrowthModifier: 1.2,
        waterEvaporationRate: 1.5,
        temperature: { min: 20, max: 30 },
      },
      cloudy: {
        plantGrowthModifier: 0.8,
        waterEvaporationRate: 0.8,
        temperature: { min: 15, max: 25 },
      },
      rainy: {
        plantGrowthModifier: 1.5,
        waterEvaporationRate: 0.2,
        temperature: { min: 10, max: 20 },
      },
      stormy: {
        plantGrowthModifier: 0.5,
        waterEvaporationRate: 0.1,
        temperature: { min: 5, max: 15 },
      },
    };
  }

  update(deltaTime) {
    // Handle weather transitions
    if (this.targetWeather) {
      this.transitionTime += deltaTime;
      if (this.transitionTime >= this.transitionDuration) {
        this.currentWeather = this.targetWeather;
        this.targetWeather = null;
        this.transitionTime = 0;
      }
    }

    // Random weather changes
    else if (Math.random() < this.changeChance * deltaTime) {
      this.changeWeather();
    }

    // Update temperature based on weather and time
    this.updateTemperature();
  }

  changeWeather() {
    const availableConditions = this.conditions.filter(
      (w) => w !== this.currentWeather
    );
    this.targetWeather =
      availableConditions[
        Math.floor(Math.random() * availableConditions.length)
      ];
    this.emitWeatherChange();
  }

  updateTemperature() {
    const effect = this.weatherEffects[this.currentWeather];
    const range = effect.temperature.max - effect.temperature.min;
    const variation = Math.sin(Date.now() / 10000) * (range / 4);
    this.temperature = effect.temperature.min + range / 2 + variation;
  }

  getCurrentWeather() {
    return this.currentWeather;
  }

  getTemperature() {
    return Math.round(this.temperature);
  }

  getWeatherIcon() {
    switch (this.currentWeather) {
      case "sunny":
        return "fa-sun";
      case "cloudy":
        return "fa-cloud";
      case "rainy":
        return "fa-cloud-rain";
      case "stormy":
        return "fa-cloud-bolt";
      default:
        return "fa-sun";
    }
  }

  getWeatherEffect(type) {
    return this.weatherEffects[this.currentWeather][type] || 1;
  }

  emitWeatherChange() {
    document.dispatchEvent(
      new CustomEvent("weatherChange", {
        detail: {
          weather: this.currentWeather,
          temperature: this.temperature,
          effects: this.weatherEffects[this.currentWeather],
        },
      })
    );
  }
}
