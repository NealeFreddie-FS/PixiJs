import TimeManager from "./TimeManager.js";
import WeatherManager from "./WeatherManager.js";
import StatsManager from "./StatsManager.js";
import TerrainManager from "./TerrainManager.js";
import PopulationGraph from "../components/PopulationGraph.js";
import Camera from "./Camera.js";
import TimePropertiesWindow from "../ui/windows/TimePropertiesWindow.js";
import WindowManager from "../ui/WindowManager.js";
import ViewportWindow from "../ui/windows/ViewportWindow.js";
import StatsWindow from "../ui/windows/StatsWindow.js";
import ControlsWindow from "../ui/windows/ControlsWindow.js";
import CameraPropertiesWindow from "../ui/windows/CameraPropertiesWindow.js";
import TerrainPropertiesWindow from "../ui/windows/TerrainPropertiesWindow.js";

// Entity imports
import Carrot from "../entities/species/Carrot.js";
import Rabbit from "../entities/species/Rabbit.js";
import Wolf from "../entities/species/Wolf.js";

export default class SimulationManager {
  constructor() {
    // Initialize properties
    this.entities = new Set();
    this.isPaused = false;
    this.speedMultiplier = 1;
    this.lastUpdate = performance.now();

    // Find project panel
    this.projectPanel = document.querySelector(".project-panel");
    if (!this.projectPanel) {
      throw new Error("Project panel not found");
    }

    // Create PIXI Application
    this.app = new PIXI.Application({
      width: window.innerWidth,
      height: window.innerHeight,
      backgroundColor: 0x060c17, // --darker-color
      resolution: window.devicePixelRatio || 1,
      antialias: true,
    });

    // Add PIXI view to project panel
    this.projectPanel.appendChild(this.app.view);

    // Create world container
    this.world = new PIXI.Container();
    this.app.stage.addChild(this.world);

    // Initialize core managers
    this.initializeManagers();

    // Initialize camera
    this.camera = new Camera(this.app, this.world);

    // Initialize window manager
    this.windowManager = new WindowManager();

    // Create windows
    this.viewportWindow = new ViewportWindow(this, this.windowManager);
    this.statsWindow = new StatsWindow(this, this.windowManager);
    this.controlsWindow = new ControlsWindow(this, this.windowManager);
    this.timeWindow = new TimePropertiesWindow(
      this.timeManager,
      this.windowManager
    );
    this.cameraWindow = new CameraPropertiesWindow(this, this.windowManager);
    this.terrainWindow = new TerrainPropertiesWindow(this, this.windowManager);

    // Dock windows to their default positions
    const dockManager = window.dockManager;
    if (dockManager) {
      dockManager.dockWindow(this.viewportWindow.window, "center");
      dockManager.dockWindow(this.statsWindow.window, "left");
      dockManager.dockWindow(this.controlsWindow.window, "right");
      dockManager.dockWindow(this.timeWindow.window, "right");
      dockManager.dockWindow(this.cameraWindow.window, "right");
      dockManager.dockWindow(this.terrainWindow.window, "right");
    }

    // Initialize terrain
    this.generateTerrain()
      .then(() => {
        this.app.ticker.add(this.update.bind(this));
      })
      .catch((error) => {
        console.error("Failed to initialize terrain:", error);
      });

    // Handle window resize
    window.addEventListener("resize", this.handleResize.bind(this));
  }

  initializeManagers() {
    this.timeManager = new TimeManager(this);
    this.weatherManager = new WeatherManager();
    this.statsManager = new StatsManager();

    // Create grid after world container is initialized
    this.createGrid();
  }

  createGrid() {
    const grid = new PIXI.Graphics();
    grid.lineStyle(1, 0x1a1a1a);

    // Draw vertical lines
    for (let x = 0; x < this.app.screen.width; x += 50) {
      grid.moveTo(x, 0);
      grid.lineTo(x, this.app.screen.height);
    }

    // Draw horizontal lines
    for (let y = 0; y < this.app.screen.height; y += 50) {
      grid.moveTo(0, y);
      grid.lineTo(this.app.screen.width, y);
    }

    this.world.addChild(grid);
  }

  setupViewOptions() {
    this.showFertility = document.getElementById("show-fertility");
    this.showWaterDistance = document.getElementById("show-water-distance");

    this.showFertility.addEventListener("change", () => this.updateOverlays());
    this.showWaterDistance.addEventListener("change", () =>
      this.updateOverlays()
    );
  }

  setupTerrainControls() {
    this.terrainSeedInput = document.getElementById("terrain-seed");
    this.currentSeedDisplay = document.getElementById("current-seed");
    this.generateTerrainBtn = document.getElementById("generate-terrain");
    this.randomizeSeedBtn = document.getElementById("randomize-seed");
    this.copySeedBtn = document.getElementById("copy-seed");

    // Setup event listeners
    this.generateTerrainBtn.addEventListener("click", () => {
      this.generateTerrain(this.terrainSeedInput.value);
    });

    this.randomizeSeedBtn.addEventListener("click", () => {
      this.terrainSeedInput.value = "";
      this.generateTerrain();
    });

    this.copySeedBtn.addEventListener("click", () => {
      navigator.clipboard.writeText(this.currentSeed.toString()).then(() => {
        // Visual feedback
        this.copySeedBtn.innerHTML = '<i class="fas fa-check"></i>';
        setTimeout(() => {
          this.copySeedBtn.innerHTML = '<i class="fas fa-copy"></i>';
        }, 1000);
      });
    });
  }

  async generateTerrain(inputSeed = "") {
    try {
      console.log("Starting terrain generation...");

      // Show loading state
      this.viewportWindow?.window.setContent(`
        <div class="loading-overlay">
          <i class="fas fa-spinner fa-spin"></i>
          <span>Generating Terrain...</span>
        </div>
      `);

      // Clear existing entities and terrain
      this.entities.clear();
      if (this.terrain) {
        this.world.removeChild(this.terrain.container);
      }

      // Generate seed
      let seed = inputSeed
        ? this.stringToSeed(inputSeed)
        : Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);

      console.log("Using seed:", seed);
      this.currentSeed = seed;

      // Create new terrain with viewport-based size
      const width = Math.floor(this.app.screen.width / 32) * 2;
      const height = Math.floor(this.app.screen.height / 32) * 2;

      console.log("Creating terrain with dimensions:", { width, height });
      this.terrain = new TerrainManager(width, height, seed);
      await this.terrain.initialize();

      // Center terrain in world
      const terrainWidth = this.terrain.width * this.terrain.tileSize;
      const terrainHeight = this.terrain.height * this.terrain.tileSize;
      this.terrain.container.position.set(
        -terrainWidth / 2,
        -terrainHeight / 2
      );

      console.log("Terrain position:", this.terrain.container.position);
      console.log("World bounds:", this.world.getBounds());

      this.world.addChild(this.terrain.container);

      // Reset camera to center
      this.camera.position = { x: 0, y: 0 };
      this.camera.targetPosition = { x: 0, y: 0 };
      this.camera.zoom = 1;
      this.camera.targetZoom = 0.5;
      this.camera.updateTransform();

      // Restore viewport content
      this.viewportWindow?.window.setContent(`
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
      `);

      // Re-attach PIXI view
      const viewport =
        this.viewportWindow?.window.element.querySelector(".viewport-content");
      if (viewport && this.app.view) {
        viewport.appendChild(this.app.view);
      }

      console.log("Terrain generation complete");
      return this.terrain;
    } catch (error) {
      console.error("Failed to generate terrain:", error);
      throw error;
    }
  }

  stringToSeed(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
  }

  togglePause() {
    this.isPaused = !this.isPaused;
    this.pauseBtn.innerHTML = this.isPaused
      ? '<i class="fas fa-play"></i> Play'
      : '<i class="fas fa-pause"></i> Pause';
  }

  adjustSpeed(factor) {
    this.speedMultiplier = Math.max(
      0.25,
      Math.min(4, this.speedMultiplier * factor)
    );
    this.updateSpeedDisplay();
  }

  updateSpeedDisplay() {
    const speedText =
      this.speedMultiplier === 1 ? "Normal" : `${this.speedMultiplier}x`;
    document.getElementById("time-stats").innerHTML += `
      <div class="stat-item">
        <span class="stat-label">Speed:</span>
        <span class="stat-value">${speedText}</span>
      </div>
    `;
  }

  async spawnEntities(type, amount) {
    if (!this.terrain?.terrainData) {
      console.warn("Terrain not ready yet");
      return;
    }

    for (let i = 0; i < amount; i++) {
      try {
        const spawnPoint = this.terrain.getSpawnPoint(type);
        let entity;

        switch (type) {
          case "carrot":
            entity = new Carrot(spawnPoint.x, spawnPoint.y);
            break;
          case "rabbit":
            entity = new Rabbit(spawnPoint.x, spawnPoint.y);
            break;
          case "wolf":
            entity = new Wolf(spawnPoint.x, spawnPoint.y);
            break;
        }

        if (entity) {
          this.entities.add(entity);
          this.world.addChild(entity.sprite);
        }
      } catch (error) {
        console.error("Failed to spawn entity:", error);
      }
    }

    // Instead of calling this.updateStats(), notify the StatsWindow
    if (this.statsWindow) {
      this.statsWindow.updateStats();
    }
  }

  updateOverlays() {
    if (!this.terrain?.layers?.overlay) return;

    this.terrain.layers.overlay.removeChildren();

    if (this.showFertility?.checked) {
      this.terrain.renderFertilityOverlay();
    }

    if (this.showWaterDistance?.checked) {
      this.terrain.renderWaterDistanceOverlay();
    }
  }

  update(currentTime) {
    if (this.isPaused) return;

    const deltaTime = (currentTime - this.lastUpdate) * this.speedMultiplier;
    this.lastUpdate = currentTime;

    this.timeManager.update(deltaTime);
    this.weatherManager.update(deltaTime);
    this.camera.update(deltaTime);
    this.updateEntities(deltaTime);

    requestAnimationFrame(this.update.bind(this));
  }

  updateEntities(deltaTime) {
    // Convert Set to Array for filtering
    const entitiesArray = Array.from(this.entities);

    // Update each entity
    entitiesArray.forEach((entity) => {
      if (entity.alive) {
        // Pass this (SimulationManager) as the environment
        entity.update(deltaTime, this);
      }
    });

    // Remove dead entities
    this.entities = new Set(entitiesArray.filter((entity) => entity.alive));
  }

  handleResize() {
    this.app.renderer.resize(window.innerWidth, window.innerHeight);
    this.camera.updateTransform();
    if (window.dockManager) {
      window.dockManager.updateDockZones();
    }
  }

  toggleGrid(show) {
    if (this.grid) {
      this.grid.visible = show;
    }
  }
}
