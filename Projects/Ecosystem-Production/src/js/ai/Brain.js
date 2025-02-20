export default class Brain {
  constructor() {
    this.memories = [];
    this.maxMemories = 10;
    this.learningRate = 0.1;

    // Decision weights
    this.weights = {
      hunger: 0.8,
      energy: 0.6,
      reproduction: 0.4,
      safety: 0.7,
      exploration: 0.3,
    };
  }

  decide(inputs) {
    const {
      hunger,
      reproductiveUrge,
      nearbyEntities,
      energy = 100,
      lastDecision = null,
    } = inputs;

    // Store current state in memory
    this.addMemory({
      hunger,
      reproductiveUrge,
      nearbyEntitiesCount: nearbyEntities.length,
      energy,
      decision: lastDecision,
    });

    // Calculate priorities
    const priorities = {
      eat: this.calculateEatingPriority(hunger, energy, nearbyEntities),
      reproduce: this.calculateReproductionPriority(
        reproductiveUrge,
        energy,
        nearbyEntities
      ),
      flee: this.calculateFleePriority(nearbyEntities, energy),
      explore: this.calculateExplorationPriority(nearbyEntities),
    };

    // Get highest priority action
    const action = Object.entries(priorities).reduce((a, b) =>
      a[1] > b[1] ? a : b
    )[0];

    // Make decision based on highest priority
    switch (action) {
      case "eat":
        const food = this.findBestFood(nearbyEntities);
        return food
          ? { action: "eat", target: food }
          : { action: "move", direction: this.getRandomDirection() };

      case "reproduce":
        const mate = this.findPotentialMate(nearbyEntities);
        return mate
          ? { action: "reproduce", partner: mate }
          : { action: "move", direction: this.getRandomDirection() };

      case "flee":
        const threat = this.findBiggestThreat(nearbyEntities);
        return threat
          ? { action: "flee", threat }
          : { action: "move", direction: this.getRandomDirection() };

      case "explore":
      default:
        return { action: "move", direction: this.getRandomDirection() };
    }
  }

  calculateEatingPriority(hunger, energy, nearbyEntities) {
    const foodAvailable = nearbyEntities.some(
      (e) => e.type === "plant" || e.type === "rabbit"
    );
    const hungerPriority = (hunger / 100) * this.weights.hunger;
    const energyFactor = (1 - energy / 100) * this.weights.energy;
    return foodAvailable ? hungerPriority + energyFactor : 0;
  }

  calculateReproductionPriority(reproductiveUrge, energy, nearbyEntities) {
    const mateAvailable = nearbyEntities.some(
      (e) => e.type === this.type && e.canReproduce
    );
    const reproductionPriority =
      (reproductiveUrge / 100) * this.weights.reproduction;
    const energyFactor = (energy / 100) * this.weights.energy;
    return mateAvailable ? reproductionPriority * energyFactor : 0;
  }

  calculateFleePriority(nearbyEntities, energy) {
    const threats = nearbyEntities.filter((e) => e.type === "wolf");
    const threatLevel = threats.length * this.weights.safety;
    const energyFactor = (1 - energy / 100) * this.weights.energy;
    return threats.length > 0 ? threatLevel + energyFactor : 0;
  }

  calculateExplorationPriority(nearbyEntities) {
    const crowding = nearbyEntities.length / 10; // Normalize to 0-1
    return this.weights.exploration * (1 - crowding);
  }

  findBestFood(entities) {
    return entities
      .filter((e) => e.type === "plant" || e.type === "rabbit")
      .sort((a, b) => b.nutritionalValue - a.nutritionalValue)[0];
  }

  findPotentialMate(entities) {
    return entities.find((e) => e.type === this.type && e.canReproduce);
  }

  findBiggestThreat(entities) {
    return entities
      .filter((e) => e.type === "wolf")
      .sort((a, b) => b.energy - a.energy)[0];
  }

  getRandomDirection() {
    const angle = Math.random() * Math.PI * 2;
    return {
      x: Math.cos(angle),
      y: Math.sin(angle),
    };
  }

  addMemory(memory) {
    this.memories.push(memory);
    if (this.memories.length > this.maxMemories) {
      this.memories.shift();
    }
  }

  learn(outcome) {
    // Simple reinforcement learning
    const lastMemory = this.memories[this.memories.length - 1];
    if (!lastMemory) return;

    // Adjust weights based on outcome
    if (outcome.success) {
      this.weights[outcome.type] += this.learningRate;
    } else {
      this.weights[outcome.type] -= this.learningRate;
    }

    // Normalize weights
    const total = Object.values(this.weights).reduce((a, b) => a + b, 0);
    Object.keys(this.weights).forEach((key) => {
      this.weights[key] = this.weights[key] / total;
    });
  }

  // Utility method to clone brain for offspring
  clone() {
    const newBrain = new Brain();
    newBrain.weights = { ...this.weights };
    // Add small mutations
    Object.keys(newBrain.weights).forEach((key) => {
      newBrain.weights[key] += (Math.random() - 0.5) * 0.1;
    });
    return newBrain;
  }
}
