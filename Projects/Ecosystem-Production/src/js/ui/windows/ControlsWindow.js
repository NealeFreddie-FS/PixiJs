export default class ControlsWindow {
  constructor(simulation, windowManager) {
    this.simulation = simulation;
    this.window = windowManager.createWindow({
      id: "controls",
      title: "Simulation Controls",
      width: 350,
      height: 600,
      x: window.innerWidth - 370,
      y: 20,
      content: this.createContent(),
    });

    this.setupControls();
  }

  createContent() {
    return `
      <div class="control-section">
        <h4>Time Settings</h4>
        <div class="control-group">
          <div class="setting-row">
            <label>Game Speed</label>
            <div class="speed-controls">
              <button class="btn speed-preset" data-speed="0.5">0.5x</button>
              <button class="btn speed-preset" data-speed="1">1x</button>
              <button class="btn speed-preset" data-speed="2">2x</button>
              <button class="btn speed-preset" data-speed="4">4x</button>
            </div>
          </div>
        </div>
      </div>

      <div class="control-section">
        <h4>Terrain Generation</h4>
        <div class="control-group">
          <div class="seed-input">
            <label for="terrain-seed">Seed:</label>
            <input type="text" id="terrain-seed" placeholder="Enter seed or random">
            <button id="copy-seed" class="btn" title="Copy current seed">
              <i class="fas fa-copy"></i>
            </button>
          </div>
          <div class="terrain-buttons">
            <button id="generate-terrain" class="btn">
              <i class="fas fa-globe"></i> Generate New Terrain
            </button>
            <button id="randomize-seed" class="btn">
              <i class="fas fa-dice"></i> Random Seed
            </button>
          </div>
        </div>
      </div>

      <div class="control-section">
        <h4>Entity Controls</h4>
        <div class="control-group">
          <div class="spawn-controls">
            <label for="spawn-amount">Spawn Amount:</label>
            <input type="number" id="spawn-amount" value="1" min="1" max="50">
          </div>
          <div class="entity-buttons">
            <button id="add-carrot" class="btn entity-btn">
              <i class="fas fa-carrot"></i>
              <span>Add Carrot</span>
            </button>
            <button id="add-rabbit" class="btn entity-btn">
              <i class="fas fa-paw"></i>
              <span>Add Rabbit</span>
            </button>
            <button id="add-wolf" class="btn entity-btn">
              <i class="fas fa-wolf"></i>
              <span>Add Wolf</span>
            </button>
          </div>
        </div>
      </div>
    `;
  }

  setupControls() {
    // Move existing control setup logic here
  }
}
