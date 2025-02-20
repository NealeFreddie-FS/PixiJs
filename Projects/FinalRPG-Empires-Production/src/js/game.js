// Remove the import since we're using the global PIXI from the script tag
// import * as PIXI from "../js/pixi.min.js";

// Create Game class
class Game {
  constructor() {
    // Create PIXI Application
    this.app = new PIXI.Application({
      width: 800,
      height: 600,
      backgroundColor: 0x000000,
      resolution: window.devicePixelRatio || 1,
    });

    // Add view to game canvas (which is now empty after homescreen fade-out)
    document.getElementById("game-canvas").appendChild(this.app.view);

    // Create scene container
    this.scene = new PIXI.Container();
    this.app.stage.addChild(this.scene);

    // Asset manifest
    this.manifest = {
      bundles: [
        {
          name: "title-screen",
          assets: {
            mountains: "backgrounds/mountains.png",
            clouds: "backgrounds/clouds.png",
            trees: "backgrounds/trees.png",
            titleMusic: "music/title.mp3",
            "final-fantasy-font": "fonts/final-fantasy.ttf",
          },
        },
        {
          name: "game-assets",
          assets: {
            spritesheet: "sprites/core/biggs/spritesheet.json",
            gameMusic: "music/game.mp3",
          },
        },
      ],
    };

    // Start loading assets
    this.loadAssets();
  }

  async loadAssets() {
    try {
      await PIXI.Assets.init({ manifest: this.manifest });
      await PIXI.Assets.loadBundle("title-screen");
      this.showTitleScreen();
    } catch (error) {
      console.error("Failed to load assets:", error);
    }
  }

  showTitleScreen() {
    this.titleScreen = new TitleScreen(this.app);
    this.app.stage.addChild(this.titleScreen);

    // Listen for game start
    this.titleScreen.on("gameStart", () => {
      this.startGame();
    });

    // Play title music
    this.titleMusic = PIXI.sound.play("titleMusic", {
      loop: true,
      volume: 0.5,
    });
  }

  async startGame() {
    // Fade out title screen
    gsap.to(this.titleScreen, {
      alpha: 0,
      duration: 1,
      onComplete: () => {
        this.titleScreen.destroy();
        this.titleMusic.stop();
      },
    });

    // Load game assets
    await PIXI.Assets.loadBundle("game-assets");

    // Initialize game scene (your existing game code)
    this.initGameScene();
  }

  initGameScene() {
    // Get the spritesheet
    const sheet = PIXI.Assets.get("spritesheet");

    // Create the idle animation
    this.animations = {
      idle: [sheet.textures["idle_down"]],
    };

    // Create player sprite with idle animation
    this.player = new PIXI.AnimatedSprite(this.animations.idle);

    // Configure player sprite
    this.player.anchor.set(0.5); // Center the sprite's pivot point
    this.player.scale.set(3); // Make the sprite bigger

    // Center the sprite on screen
    this.player.x = this.app.screen.width / 2;
    this.player.y = this.app.screen.height / 2;

    // Set up animation speed
    this.player.animationSpeed = 0.1;

    // Start playing the animation
    this.player.play();

    // Add player to scene
    this.scene.addChild(this.player);
  }
}

// Initialize game when PIXI is ready
window.onload = () => new Game();

// Remove the window.addEventListener since we're handling it in game.html
