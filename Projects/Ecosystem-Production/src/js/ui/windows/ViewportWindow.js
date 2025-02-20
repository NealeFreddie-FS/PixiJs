export default class ViewportWindow {
  constructor(simulation, windowManager) {
    this.simulation = simulation;
    this.window = windowManager.createWindow({
      id: "viewport",
      title: "Simulation Viewport",
      width: 800,
      height: 600,
      x: 300,
      y: 20,
      content: this.createContent(),
    });

    // Create viewport container
    this.viewport = this.window.element.querySelector(".viewport-content");

    // Move PIXI view into viewport
    if (this.viewport && this.simulation.app.view) {
      this.viewport.appendChild(this.simulation.app.view);

      // Update PIXI app size to match viewport
      this.resizeSimulation();

      // Listen for window resize
      this.window.element.addEventListener("resize", () =>
        this.resizeSimulation()
      );
    }

    this.setupControls();
  }

  createContent() {
    return `
      <div class="viewport-controls">
        <div class="viewport-controls-left">
          <button class="view-btn" id="show-grid">
            <i class="fas fa-border-all"></i>
            Grid
          </button>
          <button class="view-btn" id="show-fertility">
            <i class="fas fa-seedling"></i>
            Fertility
          </button>
          <button class="view-btn" id="show-water-distance">
            <i class="fas fa-water"></i>
            Water
          </button>
        </div>
      </div>
      <div class="viewport-content"></div>
    `;
  }

  resizeSimulation() {
    if (this.viewport && this.simulation.app) {
      const bounds = this.viewport.getBoundingClientRect();
      this.simulation.app.renderer.resize(bounds.width, bounds.height);

      // Update camera and terrain if they exist
      if (this.simulation.camera) {
        this.simulation.camera.updateTransform();
      }
      if (this.simulation.terrain) {
        this.simulation.terrain.resize(bounds.width, bounds.height);
      }
    }
  }

  setupControls() {
    // View options
    const showGrid = this.window.element.querySelector("#show-grid");
    const showFertility = this.window.element.querySelector("#show-fertility");
    const showWaterDistance = this.window.element.querySelector(
      "#show-water-distance"
    );

    if (showFertility) {
      showFertility.addEventListener("change", () =>
        this.simulation.updateOverlays()
      );
    }

    if (showWaterDistance) {
      showWaterDistance.addEventListener("change", () =>
        this.simulation.updateOverlays()
      );
    }
  }
}
