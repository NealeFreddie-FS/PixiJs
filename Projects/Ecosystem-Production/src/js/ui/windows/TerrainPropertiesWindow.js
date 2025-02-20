export default class TerrainPropertiesWindow {
  constructor(simulation, windowManager) {
    this.simulation = simulation;

    this.window = windowManager.createWindow({
      id: "terrain-properties",
      title: "Terrain Properties",
      width: 300,
      height: 400,
      x: window.innerWidth - 320,
      y: 440,
      content: this.createContent(),
    });

    this.setupControls();
  }

  createContent() {
    return `
      <div class="property-group">
        <h4>Terrain Generation</h4>
        <div class="property-row">
          <label for="terrain-seed">Seed</label>
          <input type="text" id="terrain-seed" placeholder="Enter seed or random">
          <button id="copy-seed" class="btn" title="Copy current seed">
            <i class="fas fa-copy"></i>
          </button>
        </div>
        <div class="button-row">
          <button id="generate-terrain" class="btn">
            <i class="fas fa-globe"></i> Generate New
          </button>
          <button id="randomize-seed" class="btn">
            <i class="fas fa-dice"></i> Random
          </button>
        </div>
      </div>

      <div class="property-group">
        <h4>Terrain Settings</h4>
        <div class="property-row">
          <label for="terrain-scale">Scale</label>
          <input type="range" id="terrain-scale" 
            min="16" max="128" step="16" 
            value="${this.simulation.terrain?.cellSize || 32}">
          <span class="value-display">${
            this.simulation.terrain?.cellSize || 32
          }</span>
        </div>
        <div class="property-row">
          <label for="terrain-octaves">Octaves</label>
          <input type="range" id="terrain-octaves" 
            min="1" max="8" step="1" 
            value="${this.simulation.terrain?.octaves || 4}">
          <span class="value-display">${
            this.simulation.terrain?.octaves || 4
          }</span>
        </div>
      </div>

      <div class="property-group">
        <h4>View Options</h4>
        <div class="view-options">
          <label class="checkbox-label">
            <input type="checkbox" id="show-grid">
            Show Grid
          </label>
          <label class="checkbox-label">
            <input type="checkbox" id="show-fertility">
            Show Fertility
          </label>
          <label class="checkbox-label">
            <input type="checkbox" id="show-water">
            Show Water Distance
          </label>
        </div>
      </div>
    `;
  }

  setupControls() {
    // Terrain generation controls
    const seedInput = this.window.element.querySelector("#terrain-seed");
    const generateBtn = this.window.element.querySelector("#generate-terrain");
    const randomizeBtn = this.window.element.querySelector("#randomize-seed");
    const copyBtn = this.window.element.querySelector("#copy-seed");

    generateBtn?.addEventListener("click", () => {
      this.simulation.generateTerrain(seedInput.value);
    });

    randomizeBtn?.addEventListener("click", () => {
      seedInput.value = "";
      this.simulation.generateTerrain();
    });

    copyBtn?.addEventListener("click", () => {
      navigator.clipboard.writeText(this.simulation.currentSeed.toString());
      copyBtn.innerHTML = '<i class="fas fa-check"></i>';
      setTimeout(() => {
        copyBtn.innerHTML = '<i class="fas fa-copy"></i>';
      }, 1000);
    });

    // View options
    const showGrid = this.window.element.querySelector("#show-grid");
    const showFertility = this.window.element.querySelector("#show-fertility");
    const showWater = this.window.element.querySelector("#show-water");

    showGrid?.addEventListener("change", () => {
      this.simulation.toggleGrid(showGrid.checked);
    });

    showFertility?.addEventListener("change", () => {
      this.simulation.updateOverlays();
    });

    showWater?.addEventListener("change", () => {
      this.simulation.updateOverlays();
    });
  }
}
