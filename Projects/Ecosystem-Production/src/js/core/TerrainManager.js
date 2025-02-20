import { PerlinNoise } from "../utils/PerlinNoise.js";

const TEXTURES = {
  water: [
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6QjY0NjY4NjE5RjY4MTFFQkE5NzZCNjY0NjY4NjE5RjYiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6QjY0NjY4NjI5RjY4MTFFQkE5NzZCNjY0NjY4NjE5RjYiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpCNjQ2Njg1RjlGNjgxMUVCQTk3NkI2NjQ2Njg2MTlGNiIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpCNjQ2Njg2MDlGNjgxMUVCQTk3NkI2NjQ2Njg2MTlGNiIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PgH//v38+/r5+Pf29fTz8vHw7+7t7Ovq6ejn5uXk4+Lh4N/e3dzb2tnY19bV1NPS0dDPzs3My8rJyMfGxcTDwsHAv769vLu6ubi3trW0s7KxsK+urayrqqmop6alpKOioaCfnp2cm5qZmJeWlZSTkpGQj46NjIuKiYiHhoWEg4KBgH9+fXx7enl4d3Z1dHNycXBvbm1sa2ppaGdmZWRjYmFgX15dXFtaWVhXVlVUU1JRUE9OTUxLSklIR0ZFRENCQUA/Pj08Ozo5ODc2NTQzMjEwLy4tLCsqKSgnJiUkIyIhIB8eHRwbGhkYFxYVFBMSERAPDg0MCwoJCAcGBQQDAgEAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==",
  ],
  grass: [
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6QjY0NjY4NjE5RjY4MTFFQkE5NzZCNjY0NjY4NjE5RjYiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6QjY0NjY4NjI5RjY4MTFFQkE5NzZCNjY0NjY4NjE5RjYiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpCNjQ2Njg1RjlGNjgxMUVCQTk3NkI2NjQ2Njg2MTlGNiIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpCNjQ2Njg2MDlGNjgxMUVCQTk3NkI2NjQ2Njg2MTlGNiIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PgH//v38+/r5+Pf29fTz8vHw7+7t7Ovq6ejn5uXk4+Lh4N/e3dzb2tnY19bV1NPS0dDPzs3My8rJyMfGxcTDwsHAv769vLu6ubi3trW0s7KxsK+urayrqqmop6alpKOioaCfnp2cm5qZmJeWlZSTkpGQj46NjIuKiYiHhoWEg4KBgH9+fXx7enl4d3Z1dHNycXBvbm1sa2ppaGdmZWRjYmFgX15dXFtaWVhXVlVUU1JRUE9OTUxLSklIR0ZFRENCQUA/Pj08Ozo5ODc2NTQzMjEwLy4tLCsqKSgnJiUkIyIhIB8eHRwbGhkYFxYVFBMSERAPDg0MCwoJCAcGBQQDAgEAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==",
  ],
};

export default class TerrainManager {
  constructor(width, height, seed = Math.random()) {
    console.log("TerrainManager constructor:", { width, height, seed });
    this.width = width * 3; // Make terrain 3x larger
    this.height = height * 3;
    this.noise = new PerlinNoise(seed);
    this.tileSize = 32;
    this.container = new PIXI.Container();

    // Single graphics object for all terrain
    this.terrainGraphics = new PIXI.Graphics();
    this.container.addChild(this.terrainGraphics);

    // Adjusted parameters for better terrain
    this.parameters = {
      scale: 0.015, // Reduced scale for larger features
      height: 1.2, // Increased height for more variation
      octaves: 6, // More octaves for detail
      persistence: 0.5,
      lacunarity: 2.0,
      waterLevel: 0.35, // Increased water level threshold
      mountainLevel: 0.75,
      deepWater: 0.25, // Adjusted for ponds
      beachLevel: 0.4,
      snowLevel: 0.85,
      pondFrequency: 0.02, // New parameter for pond generation
      pondSize: 0.4, // New parameter for pond size
    };

    console.log("Container created at:", this.container.position);
  }

  async initialize() {
    console.log("Initializing terrain...");
    try {
      await this.generateTerrainData();
      await this.renderTerrain();
      console.log("Terrain dimensions:", {
        width: this.width * this.tileSize,
        height: this.height * this.tileSize,
      });
      console.log("Container bounds:", this.container.getBounds());
      return true;
    } catch (error) {
      console.error("Failed to initialize terrain:", error);
      throw error;
    }
  }

  async generateTerrainData() {
    console.log("Generating terrain data...");
    this.terrainData = {
      elevation: Array(this.height)
        .fill()
        .map(() => Array(this.width).fill(0)),
      moisture: Array(this.height)
        .fill()
        .map(() => Array(this.width).fill(0)),
    };

    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        this.terrainData.elevation[y][x] = this.generateElevation(x, y);
        this.terrainData.moisture[y][x] = this.generateMoisture(x, y);
      }
    }
    console.log("Terrain data sample:", {
      elevation: this.terrainData.elevation[0][0],
      moisture: this.terrainData.moisture[0][0],
    });
  }

  async renderTerrain() {
    console.log("Rendering terrain...");
    this.terrainGraphics.clear();

    const totalTiles = this.width * this.height;
    let renderedTiles = 0;

    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        const elevation = this.terrainData.elevation[y][x];
        const moisture = this.terrainData.moisture[y][x];
        const xPos = x * this.tileSize;
        const yPos = y * this.tileSize;

        let color;
        if (elevation < this.parameters.deepWater) {
          color = 0x0a4f7c; // Deep water
        } else if (elevation < this.parameters.waterLevel) {
          color = 0x0f6faf; // Shallow water
        } else if (elevation < this.parameters.beachLevel) {
          color = 0xdcd16a; // Beach
        } else if (elevation < this.parameters.mountainLevel) {
          color = this.getGroundColor(elevation, moisture); // Ground
        } else if (elevation < this.parameters.snowLevel) {
          color = 0x6b6b6b; // Mountains
        } else {
          color = 0xffffff; // Snow
        }

        this.terrainGraphics.beginFill(color);
        this.terrainGraphics.drawRect(xPos, yPos, this.tileSize, this.tileSize);
        this.terrainGraphics.endFill();

        renderedTiles++;
        if (renderedTiles % 100 === 0) {
          console.log(
            `Rendering progress: ${Math.floor(
              (renderedTiles / totalTiles) * 100
            )}%`
          );
        }
      }
    }

    console.log("Terrain rendering complete");
    console.log("Graphics bounds:", this.terrainGraphics.getBounds());
  }

  generateElevation(x, y) {
    const {
      scale,
      height,
      octaves,
      persistence,
      lacunarity,
      pondFrequency,
      pondSize,
    } = this.parameters;

    // Base terrain with multiple octaves
    let elevation = 0;
    let amplitude = 1;
    let frequency = 1;
    let maxValue = 0;

    for (let i = 0; i < octaves; i++) {
      elevation +=
        this.noise.noise(x * scale * frequency, y * scale * frequency) *
        amplitude *
        height;
      maxValue += amplitude;
      amplitude *= persistence;
      frequency *= lacunarity;
    }

    elevation = (elevation / maxValue + 1) / 2;

    // Add scattered ponds
    const pondNoise = this.noise.noise(
      (x + 1000) * pondFrequency,
      (y + 1000) * pondFrequency
    );
    const pondValue = (pondNoise + 1) / 2;

    if (pondValue < pondSize) {
      // Create depression for pond
      const pondDepth = Math.pow(1 - pondValue / pondSize, 2) * 0.3;
      elevation = Math.max(0.2, elevation - pondDepth);
    }

    // Add some variation to coastlines
    const coastNoise = this.noise.noise((x + 2000) * 0.05, (y + 2000) * 0.05);
    elevation += coastNoise * 0.1;

    // Ensure mostly land with scattered water bodies
    elevation = Math.pow(elevation, 1.2); // Adjust curve to favor land

    return elevation;
  }

  generateMoisture(x, y) {
    const scale = 0.03;
    let moisture =
      (this.noise.noise(x * scale + 1000, y * scale + 1000) + 1) / 2;

    // Increase moisture near water
    const elevation = this.terrainData.elevation[y][x];
    if (elevation < this.parameters.waterLevel + 0.1) {
      const waterProximity =
        (this.parameters.waterLevel + 0.1 - elevation) / 0.1;
      moisture = moisture * (1 - waterProximity) + waterProximity;
    }

    return moisture;
  }

  getGroundColor(elevation, moisture) {
    // Enhanced ground coloring
    const baseColors = {
      desert: 0xd4b790,
      grassland: 0x3d8f40,
      forest: 0x1f5f25,
      wetland: 0x2d7d32,
    };

    let color;
    if (moisture < 0.3) {
      color = baseColors.desert;
    } else if (moisture < 0.5) {
      color = baseColors.grassland;
    } else if (moisture < 0.7) {
      color = baseColors.forest;
    } else {
      color = baseColors.wetland;
    }

    // Apply elevation-based shading
    const heightEffect = Math.floor(
      (elevation - this.parameters.beachLevel) * 30
    );

    const r = ((color >> 16) & 0xff) - heightEffect;
    const g = ((color >> 8) & 0xff) - heightEffect;
    const b = (color & 0xff) - heightEffect;

    return (
      (Math.max(0, Math.min(255, r)) << 16) |
      (Math.max(0, Math.min(255, g)) << 8) |
      Math.max(0, Math.min(255, b))
    );
  }

  getSpawnPoint(type) {
    if (!this.terrainData?.elevation) {
      return {
        x: this.tileSize / 2,
        y: this.tileSize / 2,
      };
    }

    let attempts = 0;
    const maxAttempts = 100;

    while (attempts < maxAttempts) {
      const x = Math.floor(Math.random() * this.width);
      const y = Math.floor(Math.random() * this.height);

      try {
        if (type === "carrot") {
          const moisture = this.terrainData.moisture[y][x];
          const elevation = this.terrainData.elevation[y][x];

          if (
            elevation > this.parameters.waterLevel &&
            elevation < this.parameters.mountainLevel &&
            moisture > 0.4
          ) {
            return {
              x: x * this.tileSize + this.tileSize / 2,
              y: y * this.tileSize + this.tileSize / 2,
            };
          }
        } else if (
          this.terrainData.elevation[y][x] > this.parameters.waterLevel
        ) {
          return {
            x: x * this.tileSize + this.tileSize / 2,
            y: y * this.tileSize + this.tileSize / 2,
          };
        }
      } catch (error) {
        console.warn("Error finding spawn point:", error);
      }

      attempts++;
    }

    // Fallback spawn point
    return {
      x: this.tileSize / 2,
      y: this.tileSize / 2,
    };
  }

  isWater(x, y) {
    if (!this.terrainData?.elevation) return true;

    const tileX = Math.floor(x / this.tileSize);
    const tileY = Math.floor(y / this.tileSize);

    if (tileX < 0 || tileX >= this.width || tileY < 0 || tileY >= this.height) {
      return true;
    }

    return (
      this.terrainData.elevation[tileY][tileX] < this.parameters.waterLevel
    );
  }

  getFertilityAt(x, y) {
    if (!this.terrainData?.moisture || !this.terrainData?.elevation) return 0;

    const tileX = Math.floor(x / this.tileSize);
    const tileY = Math.floor(y / this.tileSize);

    if (tileX < 0 || tileX >= this.width || tileY < 0 || tileY >= this.height) {
      return 0;
    }

    const moisture = this.terrainData.moisture[tileY][tileX];
    const elevation = this.terrainData.elevation[tileY][tileX];

    return Math.max(0, Math.min(1, moisture * (1 - Math.abs(elevation - 0.5))));
  }

  getDistanceToWater(x, y) {
    if (!this.terrainData?.elevation) return 0;

    const tileX = Math.floor(x / this.tileSize);
    const tileY = Math.floor(y / this.tileSize);

    let minDistance = Infinity;
    const searchRadius = 10;

    for (let dy = -searchRadius; dy <= searchRadius; dy++) {
      for (let dx = -searchRadius; dx <= searchRadius; dx++) {
        const checkX = tileX + dx;
        const checkY = tileY + dy;

        if (
          checkX >= 0 &&
          checkX < this.width &&
          checkY >= 0 &&
          checkY < this.height
        ) {
          if (
            this.terrainData.elevation[checkY][checkX] <
            this.parameters.waterLevel
          ) {
            const distance = Math.sqrt(dx * dx + dy * dy);
            minDistance = Math.min(minDistance, distance);
          }
        }
      }
    }

    return minDistance * this.tileSize;
  }
}
