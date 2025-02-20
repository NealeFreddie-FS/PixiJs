import Entity from "./Entity.js";
import Brain from "../ai/Brain.js";

export default class Animal extends Entity {
  constructor(x, y, sprite, options = {}) {
    super(x, y, sprite);

    this.brain = new Brain();
    this.speed = options.speed || 2;
    this.senseRadius = options.senseRadius || 100;
    this.diet = options.diet || [];
    this.hunger = 0;
    this.reproductiveUrge = 0;

    // Genetics
    this.genes = options.genes || {};
  }

  update(deltaTime, environment) {
    super.update(deltaTime);

    if (!this.alive) return;

    // Update energy
    this.energy -= this.genes.metabolism * deltaTime * 0.01;
    if (this.energy <= 0) {
      this.die();
      return;
    }

    this.hunger += deltaTime * this.genes.metabolism;
    this.reproductiveUrge += deltaTime * 0.1;

    // Get sensory input
    const nearbyEntities = this.sense(environment);

    // Make decision using brain
    const decision = this.brain.decide({
      hunger: this.hunger,
      reproductiveUrge: this.reproductiveUrge,
      nearbyEntities: nearbyEntities,
    });

    // Execute decision
    this.executeDecision(decision, deltaTime);
  }

  sense(environment) {
    if (!environment) return [];

    // Get all entities within sense radius
    const nearbyEntities = Array.from(environment.entities).filter((entity) => {
      if (entity === this || !entity.alive) return false;

      const dx = entity.position.x - this.position.x;
      const dy = entity.position.y - this.position.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      return distance <= this.senseRadius;
    });

    return nearbyEntities;
  }

  executeDecision(decision, deltaTime) {
    switch (decision.action) {
      case "move":
        this.move(decision.direction, deltaTime);
        break;
      case "eat":
        this.eat(decision.target);
        break;
      case "reproduce":
        this.reproduce(decision.partner);
        break;
      case "flee":
        this.flee(decision.threat, deltaTime);
        break;
    }
  }

  move(direction, deltaTime) {
    this.position.x += direction.x * this.speed * this.genes.speed * deltaTime;
    this.position.y += direction.y * this.speed * this.genes.speed * deltaTime;

    // Update sprite position
    this.sprite.x = this.position.x;
    this.sprite.y = this.position.y;
  }

  eat(target) {
    if (this.diet.includes(target.type)) {
      this.energy += target.nutritionalValue;
      this.hunger -= target.nutritionalValue;
      target.die();
    }
  }

  reproduce(partner) {
    if (partner && this.energy > 50 && partner.energy > 50) {
      const childGenes = this.combineGenes(partner.genes);
      const child = this.createOffspring(childGenes);

      this.energy -= 30;
      partner.energy -= 30;
      this.reproductiveUrge = 0;

      return child;
    }
    return null;
  }

  combineGenes(partnerGenes) {
    const childGenes = {};
    for (let trait in this.genes) {
      // 50% chance to inherit from each parent, with mutation
      childGenes[trait] =
        Math.random() < 0.5 ? this.genes[trait] : partnerGenes[trait];

      // Small random mutation
      childGenes[trait] += (Math.random() - 0.5) * 0.1;
    }
    return childGenes;
  }
}
