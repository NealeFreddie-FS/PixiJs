import Entity from "../Entity.js";
import { createPlaceholderSprite } from "../../utils/PlaceholderSprites.js";

export default class Carrot extends Entity {
  constructor(x, y) {
    const sprite = createPlaceholderSprite("carrot");
    super(x, y, sprite);

    this.type = "plant";
    this.nutritionalValue = 25;
    this.growthStage = 0; // 0: seed, 1: sprout, 2: mature
    this.growthRate = 0.001; // How fast it grows
    this.maxSize = 1.0;
    this.reproductionRange = 50; // How far seeds can spread
    this.reproductionChance = 0.001; // Chance to reproduce per update
    this.waterNeed = 0; // 0-100, increases over time
    this.waterConsumption = 0.02; // Rate at which water need increases
    this.lastWaterDistance = null;
  }

  update(deltaTime, environment) {
    super.update(deltaTime);

    if (!this.alive) return;

    // Update water needs
    this.waterNeed += this.waterConsumption * deltaTime;

    // Get distance to nearest water
    const waterDistance = environment.terrain.getDistanceToWater(
      this.position.x,
      this.position.y
    );
    this.lastWaterDistance = waterDistance;

    // Get soil fertility
    const fertility = environment.terrain.getFertilityAt(
      this.position.x,
      this.position.y
    );

    // Adjust growth based on water and fertility
    if (this.growthStage < 2) {
      const waterFactor = Math.max(0, 1 - waterDistance / 100);
      const growthModifier = waterFactor * fertility;
      this.grow(deltaTime * growthModifier);
    } else {
      // Mature plants have higher chance to reproduce in fertile soil
      this.reproductionChance = 0.001 * fertility;
      this.tryReproduce();
    }

    // Die if too thirsty
    if (this.waterNeed > 100) {
      this.die();
    }
  }

  grow(deltaTime) {
    this.growthStage += this.growthRate * deltaTime;

    // Update visual size based on growth
    const growthScale = 0.3 + this.growthStage * 0.2;
    this.sprite.scale.set(Math.min(growthScale, this.maxSize));

    // Update color to show ripeness
    const tint = this.calculateTint();
    this.sprite.tint = tint;
  }

  calculateTint() {
    // Gradually change color from pale to vibrant orange
    const baseColor = 0xff6b2c; // Bright orange
    const paleness = 1 - this.growthStage / 2;
    return this.lerpColor(baseColor, 0xffffff, paleness);
  }

  lerpColor(color1, color2, amount) {
    const r1 = (color1 >> 16) & 0xff;
    const g1 = (color1 >> 8) & 0xff;
    const b1 = color1 & 0xff;

    const r2 = (color2 >> 16) & 0xff;
    const g2 = (color2 >> 8) & 0xff;
    const b2 = color2 & 0xff;

    const r = Math.round(r1 + (r2 - r1) * amount);
    const g = Math.round(g1 + (g2 - g1) * amount);
    const b = Math.round(b1 + (b2 - b1) * amount);

    return (r << 16) | (g << 8) | b;
  }

  tryReproduce() {
    if (Math.random() < this.reproductionChance) {
      const angle = Math.random() * Math.PI * 2;
      const distance = Math.random() * this.reproductionRange;

      const newX = this.position.x + Math.cos(angle) * distance;
      const newY = this.position.y + Math.sin(angle) * distance;

      // Emit reproduction event for simulation manager to handle
      this.emit("reproduce", {
        type: "carrot",
        x: newX,
        y: newY,
      });
    }
  }
}
