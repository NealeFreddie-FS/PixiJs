export default class CameraPropertiesWindow {
  constructor(simulation, windowManager) {
    this.simulation = simulation;
    this.camera = simulation.camera;

    this.window = windowManager.createWindow({
      id: "camera-properties",
      title: "Camera Properties",
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
        <h4>Camera Movement</h4>
        <div class="property-row">
          <label for="camera-speed">Pan Speed</label>
          <input type="range" id="camera-speed" 
            min="1" max="50" step="1" 
            value="${this.camera.moveSpeed}">
          <span class="value-display">${this.camera.moveSpeed}</span>
        </div>
        <div class="property-row">
          <label for="camera-smoothing">Smoothing</label>
          <input type="range" id="camera-smoothing" 
            min="0" max="0.99" step="0.01" 
            value="${this.camera.smoothing}">
          <span class="value-display">${this.camera.smoothing}</span>
        </div>
      </div>

      <div class="property-group">
        <h4>Camera Zoom</h4>
        <div class="property-row">
          <label for="zoom-speed">Zoom Speed</label>
          <input type="range" id="zoom-speed" 
            min="0.01" max="0.5" step="0.01" 
            value="${this.camera.zoomSpeed}">
          <span class="value-display">${this.camera.zoomSpeed}</span>
        </div>
        <div class="property-row">
          <label for="min-zoom">Min Zoom</label>
          <input type="range" id="min-zoom" 
            min="0.1" max="1" step="0.1" 
            value="${this.camera.minZoom}">
          <span class="value-display">${this.camera.minZoom}</span>
        </div>
        <div class="property-row">
          <label for="max-zoom">Max Zoom</label>
          <input type="range" id="max-zoom" 
            min="1" max="10" step="0.5" 
            value="${this.camera.maxZoom}">
          <span class="value-display">${this.camera.maxZoom}</span>
        </div>
      </div>

      <div class="property-group">
        <h4>Quick Actions</h4>
        <div class="button-row">
          <button id="reset-camera" class="btn">
            <i class="fas fa-crosshairs"></i>
            Reset Camera
          </button>
          <button id="fit-view" class="btn">
            <i class="fas fa-expand"></i>
            Fit to View
          </button>
        </div>
      </div>
    `;
  }

  setupControls() {
    // Movement controls
    const speedSlider = this.window.element.querySelector("#camera-speed");
    const smoothingSlider =
      this.window.element.querySelector("#camera-smoothing");

    speedSlider?.addEventListener("input", (e) => {
      this.camera.moveSpeed = parseFloat(e.target.value);
      e.target.nextElementSibling.textContent = e.target.value;
    });

    smoothingSlider?.addEventListener("input", (e) => {
      this.camera.smoothing = parseFloat(e.target.value);
      e.target.nextElementSibling.textContent = e.target.value;
    });

    // Zoom controls
    const zoomSpeedSlider = this.window.element.querySelector("#zoom-speed");
    const minZoomSlider = this.window.element.querySelector("#min-zoom");
    const maxZoomSlider = this.window.element.querySelector("#max-zoom");

    zoomSpeedSlider?.addEventListener("input", (e) => {
      this.camera.zoomSpeed = parseFloat(e.target.value);
      e.target.nextElementSibling.textContent = e.target.value;
    });

    minZoomSlider?.addEventListener("input", (e) => {
      this.camera.minZoom = parseFloat(e.target.value);
      e.target.nextElementSibling.textContent = e.target.value;
    });

    maxZoomSlider?.addEventListener("input", (e) => {
      this.camera.maxZoom = parseFloat(e.target.value);
      e.target.nextElementSibling.textContent = e.target.value;
    });

    // Quick actions
    const resetBtn = this.window.element.querySelector("#reset-camera");
    const fitViewBtn = this.window.element.querySelector("#fit-view");

    resetBtn?.addEventListener("click", () => this.camera.reset());
    fitViewBtn?.addEventListener("click", () => this.camera.fitToView());
  }
}
