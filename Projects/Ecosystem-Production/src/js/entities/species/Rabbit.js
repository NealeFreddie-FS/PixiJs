import Animal from "../Animal.js";
import { createPlaceholderSprite } from "../../utils/PlaceholderSprites.js";

export default class Rabbit extends Animal {
  constructor(x, y) {
    const sprite = createPlaceholderSprite("rabbit");

    const options = {
      speed: 3,
      senseRadius: 150,
      diet: ["plant"],
      genes: {
        size: Math.random() * 0.3 + 0.7, // 0.7 to 1.0
        speed: Math.random() * 0.4 + 0.8, // 0.8 to 1.2
        senseRadius: Math.random() * 0.5 + 0.75, // 0.75 to 1.25
        metabolism: Math.random() * 0.3 + 0.85, // 0.85 to 1.15
      },
    };

    super(x, y, sprite, options);

    this.type = "rabbit";
    this.maxEnergy = 100;
    this.energy = this.maxEnergy;
    this.reproductionEnergyCost = 30;
    this.reproductionCooldown = 0;
    this.fearRadius = 200; // Distance at which it detects predators
    this.state = "idle"; // idle, fleeing, eating, searching
  }

  update(deltaTime, environment) {
    super.update(deltaTime, environment);

    if (!this.alive) return;

    // Update reproduction cooldown
    if (this.reproductionCooldown > 0) {
      this.reproductionCooldown -= deltaTime;
    }

    // Get nearby entities
    const nearbyEntities = this.sense(environment);

    // Check for predators first
    const nearbyPredators = nearbyEntities.filter((e) => e.type === "wolf");
    if (nearbyPredators.length > 0) {
      this.state = "fleeing";
      this.fleeFromPredators(nearbyPredators, deltaTime);
      return;
    }

    // Handle other states
    switch (this.state) {
      case "idle":
        this.wander(deltaTime);
        // Look for food if hungry
        if (this.hunger > 30) {
          this.state = "searching";
        }
        break;

      case "searching":
        const nearbyFood = nearbyEntities.filter(
          (e) => e.type === "plant" && e.growthStage >= 1.5
        );
        if (nearbyFood.length > 0) {
          this.moveTowards(nearbyFood[0].position, deltaTime);
          if (this.distanceTo(nearbyFood[0]) < 20) {
            this.eat(nearbyFood[0]);
            this.state = "idle";
          }
        } else {
          this.wander(deltaTime);
        }
        break;
    }

    // Try to reproduce if conditions are met
    if (this.canReproduce() && Math.random() < 0.01) {
      const nearbyRabbits = nearbyEntities.filter(
        (e) => e.type === "rabbit" && e.canReproduce()
      );
      if (nearbyRabbits.length > 0) {
        this.reproduce(nearbyRabbits[0]);
      }
    }
  }

  wander(deltaTime) {
    const angle = Math.random() * Math.PI * 2;
    this.move(
      {
        x: Math.cos(angle),
        y: Math.sin(angle),
      },
      deltaTime * 0.5
    );
  }

  fleeFromPredators(predators, deltaTime) {
    // Calculate average direction away from all predators
    const fleeVector = { x: 0, y: 0 };
    predators.forEach((predator) => {
      const dx = this.position.x - predator.position.x;
      const dy = this.position.y - predator.position.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      fleeVector.x += dx / dist;
      fleeVector.y += dy / dist;
    });

    // Normalize and move
    const magnitude = Math.sqrt(
      fleeVector.x * fleeVector.x + fleeVector.y * fleeVector.y
    );
    if (magnitude > 0) {
      fleeVector.x /= magnitude;
      fleeVector.y /= magnitude;
      this.move(fleeVector, deltaTime * 1.5); // Move faster when fleeing
    }
  }

  canReproduce() {
    return (
      this.energy > this.reproductionEnergyCost * 1.5 &&
      this.reproductionCooldown <= 0
    );
  }

  distanceTo(entity) {
    const dx = this.position.x - entity.position.x;
    const dy = this.position.y - entity.position.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  moveTowards(target, deltaTime) {
    const dx = target.x - this.position.x;
    const dy = target.y - this.position.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist > 0) {
      this.move(
        {
          x: dx / dist,
          y: dy / dist,
        },
        deltaTime
      );
    }
  }

  createOffspring(genes) {
    const spawnDistance = 30;
    const angle = Math.random() * Math.PI * 2;
    const x = this.position.x + Math.cos(angle) * spawnDistance;
    const y = this.position.y + Math.sin(angle) * spawnDistance;

    return new Rabbit(x, y, genes);
  }
}
