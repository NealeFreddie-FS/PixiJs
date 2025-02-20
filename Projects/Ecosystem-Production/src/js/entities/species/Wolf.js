import Animal from "../Animal.js";
import { createPlaceholderSprite } from "../../utils/PlaceholderSprites.js";

export default class Wolf extends Animal {
  constructor(x, y) {
    const sprite = createPlaceholderSprite("wolf");
    const options = {
      speed: 4,
      senseRadius: 200,
      diet: ["rabbit"], // Wolves eat rabbits
      genes: {
        size: Math.random() * 0.4 + 0.8, // 0.8 to 1.2
        speed: Math.random() * 0.5 + 0.8, // 0.8 to 1.3
        senseRadius: Math.random() * 0.6 + 0.7, // 0.7 to 1.3
        metabolism: Math.random() * 0.4 + 0.8, // 0.8 to 1.2
      },
    };

    super(x, y, sprite, options);

    this.type = "wolf";
    this.maxEnergy = 150;
    this.energy = this.maxEnergy;
    this.reproductionEnergyCost = 50;
    this.reproductionCooldown = 0;
    this.huntingRange = 30; // Distance at which wolf can catch prey
    this.state = "hunting"; // hunting, resting, reproducing
    this.restThreshold = 30; // Energy level at which wolf needs to rest
    this.targetPrey = null;
  }

  update(deltaTime, environment) {
    super.update(deltaTime);

    if (!this.alive) return;

    // Update reproduction cooldown
    if (this.reproductionCooldown > 0) {
      this.reproductionCooldown -= deltaTime;
    }

    // Get nearby entities
    const nearbyEntities = this.sense(environment);

    // State machine
    switch (this.state) {
      case "hunting":
        if (this.energy < this.restThreshold) {
          this.state = "resting";
          break;
        }

        // Look for prey
        const nearbyPrey = nearbyEntities.filter(
          (e) => e.type === "rabbit" && e.alive
        );

        if (nearbyPrey.length > 0) {
          // Target closest prey
          this.targetPrey = this.findClosestEntity(nearbyPrey);
          this.huntPrey(this.targetPrey, deltaTime);
        } else {
          this.wander(deltaTime);
        }
        break;

      case "resting":
        this.rest(deltaTime);
        if (this.energy > this.maxEnergy * 0.8) {
          this.state = "hunting";
        }
        break;

      case "reproducing":
        if (this.reproductionCooldown <= 0) {
          const nearbyMates = nearbyEntities.filter(
            (e) => e.type === "wolf" && e.canReproduce()
          );
          if (nearbyMates.length > 0) {
            this.reproduce(nearbyMates[0]);
          }
          this.state = "hunting";
        }
        break;
    }

    // Check for reproduction opportunity
    if (
      this.canReproduce() &&
      this.state !== "reproducing" &&
      Math.random() < 0.005
    ) {
      this.state = "reproducing";
    }
  }

  huntPrey(prey, deltaTime) {
    if (!prey || !prey.alive) {
      this.targetPrey = null;
      return;
    }

    const distance = this.distanceTo(prey);

    if (distance < this.huntingRange) {
      this.eat(prey);
      this.targetPrey = null;
    } else {
      this.moveTowards(prey.position, deltaTime);
    }
  }

  rest(deltaTime) {
    this.energy += deltaTime * 0.5; // Recover energy while resting
    this.energy = Math.min(this.energy, this.maxEnergy);

    // Slight movement while resting
    if (Math.random() < 0.1) {
      this.wander(deltaTime * 0.3);
    }
  }

  findClosestEntity(entities) {
    let closest = null;
    let minDistance = Infinity;

    entities.forEach((entity) => {
      const distance = this.distanceTo(entity);
      if (distance < minDistance) {
        minDistance = distance;
        closest = entity;
      }
    });

    return closest;
  }

  createOffspring(genes) {
    const spawnDistance = 30;
    const angle = Math.random() * Math.PI * 2;
    const x = this.position.x + Math.cos(angle) * spawnDistance;
    const y = this.position.y + Math.sin(angle) * spawnDistance;

    return new Wolf(x, y, genes);
  }
}
