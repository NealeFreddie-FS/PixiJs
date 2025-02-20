import UIWindow from "../UIWindow.js";

export default class TimePropertiesWindow {
  constructor(timeManager, windowManager) {
    this.timeManager = timeManager;
    this.simulation = timeManager.simulation;
    this.window = windowManager.createWindow({
      id: "time-properties",
      title: "Time Properties",
      width: 350,
      height: 500,
      x: window.innerWidth - 370,
      y: 20,
      content: this.createContent(),
    });

    this.setupControls();
    this.startUpdates();
  }

  createContent() {
    return `
      <div class="property-group">
        <h4>Current Time</h4>
        <div class="time-display">
          <div class="time-info">
            <span id="time-display">00:00</span>
            <span id="day-period">Day</span>
          </div>
          <div class="day-counter">Day <span id="day-count">1</span></div>
        </div>
      </div>

      <div class="property-group">
        <h4>Time Settings</h4>
        <div class="property-row">
          <label>Game Speed</label>
          <div class="speed-controls">
            <button class="btn speed-preset" data-speed="0.5">0.5x</button>
            <button class="btn speed-preset" data-speed="1">1x</button>
            <button class="btn speed-preset" data-speed="2">2x</button>
            <button class="btn speed-preset" data-speed="4">4x</button>
          </div>
        </div>
        <div class="time-controls">
          <button id="slow-down-btn" class="btn">
            <i class="fas fa-backward"></i>
          </button>
          <button id="pause-btn" class="btn">
            <i class="fas fa-pause"></i>
          </button>
          <button id="speed-up-btn" class="btn">
            <i class="fas fa-forward"></i>
          </button>
          <span class="speed-display">1x</span>
        </div>
      </div>

      <div class="property-group">
        <h4>Day/Night Cycle</h4>
        <div class="property-row">
          <label for="sunrise-time">Sunrise</label>
          <input type="time" id="sunrise-time" value="06:00">
        </div>
        <div class="property-row">
          <label for="sunset-time">Sunset</label>
          <input type="time" id="sunset-time" value="18:00">
        </div>
        <div class="property-row">
          <label for="transition-duration">Transition Duration</label>
          <input type="range" id="transition-duration" min="10" max="120" step="5" value="${this.timeManager.dawnDuration}">
          <span class="value-display">${this.timeManager.dawnDuration}m</span>
        </div>
      </div>

      <div class="property-group">
        <h4>Lighting</h4>
        <div class="property-row">
          <label for="day-light">Day Intensity</label>
          <input type="range" id="day-light" min="0.5" max="1" step="0.1" value="${this.timeManager.dayLightIntensity}">
          <span class="value-display">${this.timeManager.dayLightIntensity}</span>
        </div>
        <div class="property-row">
          <label for="night-light">Night Intensity</label>
          <input type="range" id="night-light" min="0" max="0.5" step="0.1" value="${this.timeManager.nightLightIntensity}">
          <span class="value-display">${this.timeManager.nightLightIntensity}</span>
        </div>
      </div>
    `;
  }

  setupControls() {
    // Speed preset buttons
    const speedPresets = this.window.element.querySelectorAll(".speed-preset");
    speedPresets.forEach((button) => {
      button.addEventListener("click", () => {
        const speed = parseFloat(button.dataset.speed);
        this.simulation.speedMultiplier = speed;
        this.updateSpeedDisplay();
      });
    });

    // Time control buttons
    const pauseBtn = this.window.element.querySelector("#pause-btn");
    const slowDownBtn = this.window.element.querySelector("#slow-down-btn");
    const speedUpBtn = this.window.element.querySelector("#speed-up-btn");

    if (pauseBtn) {
      pauseBtn.addEventListener("click", () => this.simulation.togglePause());
    }

    if (slowDownBtn) {
      slowDownBtn.addEventListener("click", () =>
        this.simulation.adjustSpeed(0.75)
      );
    }

    if (speedUpBtn) {
      speedUpBtn.addEventListener("click", () =>
        this.simulation.adjustSpeed(1.5)
      );
    }

    // Day/Night cycle controls
    const sunriseTime = this.window.element.querySelector("#sunrise-time");
    if (sunriseTime) {
      sunriseTime.addEventListener("change", (e) => {
        const [hours, minutes] = e.target.value.split(":").map(Number);
        this.timeManager.sunriseTime = hours * 60 + minutes;
      });
    }

    const sunsetTime = this.window.element.querySelector("#sunset-time");
    if (sunsetTime) {
      sunsetTime.addEventListener("change", (e) => {
        const [hours, minutes] = e.target.value.split(":").map(Number);
        this.timeManager.sunsetTime = hours * 60 + minutes;
      });
    }

    // Transition duration
    const transitionDuration = this.window.element.querySelector(
      "#transition-duration"
    );
    if (transitionDuration) {
      transitionDuration.addEventListener("input", (e) => {
        const value = parseInt(e.target.value);
        this.timeManager.dawnDuration = value;
        this.timeManager.duskDuration = value;
        e.target.nextElementSibling.textContent = `${value}m`;
      });
    }

    // Lighting controls
    const dayLight = this.window.element.querySelector("#day-light");
    if (dayLight) {
      dayLight.addEventListener("input", (e) => {
        this.timeManager.dayLightIntensity = parseFloat(e.target.value);
        e.target.nextElementSibling.textContent = e.target.value;
      });
    }

    const nightLight = this.window.element.querySelector("#night-light");
    if (nightLight) {
      nightLight.addEventListener("input", (e) => {
        this.timeManager.nightLightIntensity = parseFloat(e.target.value);
        e.target.nextElementSibling.textContent = e.target.value;
      });
    }
  }

  updateSpeedDisplay() {
    const speedDisplay = this.window.element.querySelector(".speed-display");
    if (speedDisplay) {
      speedDisplay.textContent = `${this.simulation.speedMultiplier}x`;
    }
  }

  startUpdates() {
    setInterval(() => {
      const timeDisplay = this.window.element.querySelector("#time-display");
      const dayPeriod = this.window.element.querySelector("#day-period");
      const dayCount = this.window.element.querySelector("#day-count");

      if (timeDisplay) {
        timeDisplay.textContent = this.timeManager.getCurrentTimeString();
        timeDisplay.style.color = this.timeManager.getTimeOfDayColor();
      }

      if (dayPeriod) {
        dayPeriod.textContent = this.timeManager.getDayPeriod();
      }

      if (dayCount) {
        dayCount.textContent = this.timeManager.currentDay;
      }

      this.updateSpeedDisplay();
    }, 1000 / 30); // 30fps updates
  }
}
