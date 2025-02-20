export default class Camera {
  constructor(app, world) {
    this.app = app;
    this.world = world;
    this.position = { x: 0, y: 0 };
    this.targetPosition = { x: 0, y: 0 };
    this.zoom = 1;
    this.targetZoom = 1;
    this.minZoom = 0.1;
    this.maxZoom = 3;
    this.isDragging = false;
    this.lastPosition = { x: 0, y: 0 };
    this.moveSpeed = 10;
    this.zoomSpeed = 0.1;
    this.smoothing = 0.85; // 0 = no smoothing, 1 = infinite smoothing

    this.setupControls();
  }

  setupControls() {
    // Mouse wheel zoom
    this.app.view.addEventListener("wheel", (e) => {
      if (e.target === this.app.view) {
        e.preventDefault();
        const zoomDelta = -Math.sign(e.deltaY) * this.zoomSpeed;
        this.targetZoom = Math.max(
          this.minZoom,
          Math.min(this.maxZoom, this.targetZoom * (1 + zoomDelta))
        );
      }
    });

    // Mouse drag pan (right click only)
    this.app.view.addEventListener("mousedown", (e) => {
      if (e.button === 2 && e.target === this.app.view) {
        e.preventDefault();
        this.isDragging = true;
        this.lastPosition = { x: e.clientX, y: e.clientY };
      }
    });

    window.addEventListener("mousemove", (e) => {
      if (this.isDragging) {
        const dx = (e.clientX - this.lastPosition.x) * (1 / this.zoom);
        const dy = (e.clientY - this.lastPosition.y) * (1 / this.zoom);

        this.targetPosition.x += dx * this.moveSpeed;
        this.targetPosition.y += dy * this.moveSpeed;

        this.lastPosition = { x: e.clientX, y: e.clientY };
      }
    });

    window.addEventListener("mouseup", () => {
      this.isDragging = false;
    });

    // Prevent context menu on right click
    this.app.view.addEventListener("contextmenu", (e) => {
      e.preventDefault();
    });

    // Keyboard controls
    window.addEventListener("keydown", (e) => {
      switch (e.key) {
        case "w":
        case "ArrowUp":
          this.position.y += this.moveSpeed / this.zoom;
          break;
        case "s":
        case "ArrowDown":
          this.position.y -= this.moveSpeed / this.zoom;
          break;
        case "a":
        case "ArrowLeft":
          this.position.x += this.moveSpeed / this.zoom;
          break;
        case "d":
        case "ArrowRight":
          this.position.x -= this.moveSpeed / this.zoom;
          break;
        case "q":
          this.zoom = Math.max(this.minZoom, this.zoom - this.zoomSpeed);
          break;
        case "e":
          this.zoom = Math.min(this.maxZoom, this.zoom + this.zoomSpeed);
          break;
      }
      this.updateTransform();
    });
  }

  update(deltaTime) {
    // Convert deltaTime to seconds
    const dt = deltaTime / 1000;

    // Smooth position interpolation
    const smoothFactor = Math.min(1, (1 - this.smoothing) * dt * 60);

    this.position.x += (this.targetPosition.x - this.position.x) * smoothFactor;
    this.position.y += (this.targetPosition.y - this.position.y) * smoothFactor;

    // Smooth zoom interpolation
    this.zoom += (this.targetZoom - this.zoom) * smoothFactor;

    // Update the world transform
    this.updateTransform();
  }

  updateTransform() {
    // Update world position and scale
    this.world.position.set(
      this.app.screen.width / 2 - this.position.x * this.zoom,
      this.app.screen.height / 2 - this.position.y * this.zoom
    );
    this.world.scale.set(this.zoom);
  }

  reset() {
    this.targetPosition = { x: 0, y: 0 };
    this.targetZoom = 1;
  }

  fitToView() {
    // Calculate bounds of all content
    const bounds = this.world.getBounds();
    const viewWidth = this.app.screen.width;
    const viewHeight = this.app.screen.height;

    // Calculate zoom to fit
    const scaleX = viewWidth / bounds.width;
    const scaleY = viewHeight / bounds.height;
    this.targetZoom = Math.min(scaleX, scaleY) * 0.9; // 90% to add some padding

    // Center on content
    this.targetPosition.x = bounds.x + bounds.width / 2;
    this.targetPosition.y = bounds.y + bounds.height / 2;
  }

  screenToWorld(screenX, screenY) {
    const x =
      (screenX - this.app.screen.width / 2) / this.zoom + this.position.x;
    const y =
      (screenY - this.app.screen.height / 2) / this.zoom + this.position.y;
    return { x, y };
  }

  worldToScreen(worldX, worldY) {
    const x =
      (worldX - this.position.x) * this.zoom + this.app.screen.width / 2;
    const y =
      (worldY - this.position.y) * this.zoom + this.app.screen.height / 2;
    return { x, y };
  }
}
