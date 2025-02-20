export default class StatsWindow {
  constructor(simulation, windowManager) {
    this.simulation = simulation;
    this.window = windowManager.createWindow({
      id: "stats",
      title: "Ecosystem Statistics",
      width: 300,
      height: 500,
      x: 20,
      y: 20,
      content: this.createContent(),
    });

    this.setupControls();
    this.setupUpdates();
  }

  createContent() {
    return `
      <div class="stats-container">
        <div class="property-group">
          <h4>Entity Controls</h4>
          <div class="control-group">
            <div class="spawn-controls">
              <label for="spawn-amount">Spawn Amount:</label>
              <input type="number" id="spawn-amount" value="1" min="1" max="50" />
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

        <div class="property-group">
          <h4>Population</h4>
          <div id="population-stats"></div>
        </div>

        <div class="property-group">
          <h4>Weather</h4>
          <div id="weather-stats"></div>
        </div>

        <div class="property-group">
          <h4>Time</h4>
          <div id="time-stats"></div>
        </div>

        <div class="property-group">
          <h4>Population Trends</h4>
          <div class="population-graph"></div>
        </div>
      </div>
    `;
  }

  setupControls() {
    // Entity spawning controls
    const spawnAmount = this.window.element.querySelector("#spawn-amount");
    const addCarrot = this.window.element.querySelector("#add-carrot");
    const addRabbit = this.window.element.querySelector("#add-rabbit");
    const addWolf = this.window.element.querySelector("#add-wolf");

    if (addCarrot) {
      addCarrot.addEventListener("click", () =>
        this.simulation.spawnEntities("carrot", parseInt(spawnAmount.value))
      );
    }

    if (addRabbit) {
      addRabbit.addEventListener("click", () =>
        this.simulation.spawnEntities("rabbit", parseInt(spawnAmount.value))
      );
    }

    if (addWolf) {
      addWolf.addEventListener("click", () =>
        this.simulation.spawnEntities("wolf", parseInt(spawnAmount.value))
      );
    }
  }

  setupUpdates() {
    setInterval(() => {
      this.updateStats();
    }, 1000);
  }

  updateStats() {
    // Update population stats
    const populationStats =
      this.window.element.querySelector("#population-stats");
    if (populationStats) {
      populationStats.innerHTML = `
        <div class="stat-item">
          <span class="stat-label">Wolves:</span>
          <span class="stat-value">${this.simulation.statsManager.getPopulation(
            "wolf"
          )}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">Rabbits:</span>
          <span class="stat-value">${this.simulation.statsManager.getPopulation(
            "rabbit"
          )}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">Plants:</span>
          <span class="stat-value">${this.simulation.statsManager.getPopulation(
            "plant"
          )}</span>
        </div>
      `;
    }

    // Update weather stats
    const weatherStats = this.window.element.querySelector("#weather-stats");
    if (weatherStats) {
      weatherStats.innerHTML = `
        <div class="weather-display">
          <i class="weather-icon fas ${this.simulation.weatherManager.getWeatherIcon()}"></i>
          <div>
            <div>${this.simulation.weatherManager.getCurrentWeather()}</div>
            <div>Temperature: ${this.simulation.weatherManager.getTemperature()}°C</div>
          </div>
        </div>
      `;
    }

    // Update time stats
    const timeStats = this.window.element.querySelector("#time-stats");
    if (timeStats) {
      timeStats.innerHTML = `
        <div class="stat-item">
          <span class="stat-label">Day:</span>
          <span class="stat-value">${
            this.simulation.timeManager.currentDay
          }</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">Time:</span>
          <span class="stat-value">${this.simulation.timeManager.getCurrentTimeString()}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">Period:</span>
          <span class="stat-value">${this.simulation.timeManager.getDayPeriod()}</span>
        </div>
      `;

      const timeValue = timeStats.querySelector(".stat-value");
      if (timeValue) {
        timeValue.style.color = this.simulation.timeManager.getTimeOfDayColor();
      }
    }
  }
}
