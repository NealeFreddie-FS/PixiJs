export default class Entity {
  constructor(x, y, sprite) {
    this.position = { x, y };
    this.sprite = sprite;
    this.energy = 100;
    this.age = 0;
    this.alive = true;
    this.id = crypto.randomUUID();
  }

  update(deltaTime) {
    this.age += deltaTime;
    this.energy -= deltaTime * 0.1; // Basic energy consumption

    if (this.energy <= 0) {
      this.die();
    }
  }

  die() {
    this.alive = false;
    this.sprite.visible = false;
    // Emit death event for cleanup
    this.emit("death", this);
  }

  emit(event, data) {
    // Event system for entity lifecycle management
    document.dispatchEvent(
      new CustomEvent(`entity:${event}`, { detail: data })
    );
  }
}
