export default class StatsManager {
  constructor() {
    this.stats = {
      population: {
        wolf: 0,
        rabbit: 0,
        carrot: 0,
      },
      births: {
        wolf: 0,
        rabbit: 0,
        carrot: 0,
      },
      deaths: {
        wolf: 0,
        rabbit: 0,
        carrot: 0,
      },
      history: {
        population: [],
        maxHistoryLength: 100,
      },
    };

    // Listen for entity events
    document.addEventListener("entity:birth", this.handleBirth.bind(this));
    document.addEventListener("entity:death", this.handleDeath.bind(this));

    // Update history periodically
    setInterval(() => this.updateHistory(), 1000);
  }

  update(deltaTime) {
    // Count current populations
    this.countPopulations();
  }

  countPopulations() {
    const entities = window.simulation.entities;

    // Reset counts
    Object.keys(this.stats.population).forEach((type) => {
      this.stats.population[type] = 0;
    });

    // Count living entities
    entities.forEach((entity) => {
      if (entity.alive) {
        this.stats.population[entity.type]++;
      }
    });
  }

  handleBirth(event) {
    const entity = event.detail;
    this.stats.births[entity.type]++;
    this.stats.population[entity.type]++;
  }

  handleDeath(event) {
    const entity = event.detail;
    this.stats.deaths[entity.type]++;
    this.stats.population[entity.type]--;
  }

  updateHistory() {
    const currentStats = {
      timestamp: Date.now(),
      populations: { ...this.stats.population },
    };

    this.stats.history.population.push(currentStats);

    // Maintain history length
    if (
      this.stats.history.population.length > this.stats.history.maxHistoryLength
    ) {
      this.stats.history.population.shift();
    }
  }

  getPopulation(type) {
    return this.stats.population[type] || 0;
  }

  getBirths(type) {
    return this.stats.births[type] || 0;
  }

  getDeaths(type) {
    return this.stats.deaths[type] || 0;
  }

  getHistory() {
    return this.stats.history;
  }

  getStats() {
    return {
      population: { ...this.stats.population },
      births: { ...this.stats.births },
      deaths: { ...this.stats.deaths },
    };
  }
}
