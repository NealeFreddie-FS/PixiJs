import { ErrorBoundary } from "./utils/ErrorBoundary.js";
import { BootSequence } from "./bootSequence.js";

export default class Homescreen {
  constructor() {
    this.initialize();
  }

  initialize() {
    // Get DOM elements
    this.powerButton = document.querySelector(".power-button");
    this.screen = document.querySelector(".screen-container");
    this.homescreen = document.querySelector(".homescreen");
    this.powerLed = document.querySelector(".power-led");
    this.canvas = document.getElementById("pixi-canvas");

    if (!this.validateElements()) {
      throw new Error("Required DOM elements not found");
    }

    // Get dimensions from screen container
    const bounds = this.screen.getBoundingClientRect();
    this.dimensions = {
      width: bounds.width,
      height: bounds.height,
    };

    this.isOn = false;
    this.isTransitioning = false;

    // Set up PIXI
    this.setupPixi();

    // Add event listeners
    this.powerButton.addEventListener("click", this.togglePower.bind(this));
    this.setupGameCards();
  }

  validateElements() {
    return (
      this.powerButton &&
      this.screen &&
      this.homescreen &&
      this.powerLed &&
      this.canvas
    );
  }

  setupPixi() {
    this.app = new PIXI.Application({
      view: this.canvas,
      width: this.dimensions.width,
      height: this.dimensions.height,
      backgroundColor: 0x000000,
      resolution: window.devicePixelRatio || 1,
      antialias: false,
    });

    // Hide canvas initially
    this.canvas.style.display = "none";

    // Create main stage container
    this.stage = new PIXI.Container();
    this.app.stage.addChild(this.stage);
  }

  setupGameCards() {
    document.querySelectorAll(".game-card").forEach((card) => {
      card.addEventListener("click", () => {
        if (this.isOn) {
          this.launchGame(card.dataset.game);
        }
      });
    });
  }

  async togglePower() {
    if (this.isTransitioning) return;
    this.isTransitioning = true;

    try {
      this.isOn = !this.isOn;
      if (this.isOn) {
        await this.powerOn();
      } else {
        await this.powerOff();
      }
    } catch (error) {
      console.error("Power toggle failed:", error);
    } finally {
      this.isTransitioning = false;
    }
  }

  async powerOn() {
    try {
      // Update button state
      this.powerButton.classList.add("on");

      // Power LED animation
      gsap.to(this.powerLed, {
        opacity: 1,
        duration: 0.2,
      });

      // Show screen
      this.screen.classList.remove("off");
      this.canvas.style.display = "block";

      // Run boot sequence
      const bootSequence = new BootSequence(this.app, this.dimensions);
      await bootSequence.play();

      // Show portal
      await this.showPortal();
    } catch (error) {
      console.error("Power on failed:", error);
      this.powerOff();
    }
  }

  async showPortal() {
    // Clear previous content
    this.stage.removeChildren();

    // Create portal container
    const portal = new PIXI.Container();
    this.stage.addChild(portal);

    // Create circular mask
    const mask = new PIXI.Graphics();
    mask.beginFill(0xffffff);
    mask.drawCircle(this.dimensions.width / 2, this.dimensions.height / 2, 0);
    mask.endFill();
    portal.mask = mask;

    // Create portal background
    const bg = new PIXI.Graphics();
    bg.beginFill(0x000033);
    bg.drawRect(0, 0, this.dimensions.width, this.dimensions.height);
    bg.endFill();
    portal.addChild(bg);

    // Create portal effect
    const portalEffect = new PIXI.Graphics();
    portalEffect.lineStyle(2, 0xff3333);
    const centerX = this.dimensions.width / 2;
    const centerY = this.dimensions.height / 2;
    for (let i = 0; i < 10; i++) {
      portalEffect.drawCircle(
        centerX,
        centerY,
        i * (this.dimensions.width * 0.05)
      );
    }
    portal.addChild(portalEffect);

    // Animate portal opening
    await gsap.to(mask, {
      radius: Math.max(this.dimensions.width, this.dimensions.height),
      duration: 1.5,
      ease: "power2.out",
    });

    // Show homescreen content
    gsap.to(this.homescreen, {
      opacity: 1,
      duration: 0.5,
    });

    // Rotate portal effect
    const animate = () => {
      portalEffect.rotation += 0.01;
      if (this.isOn) {
        requestAnimationFrame(animate);
      }
    };
    animate();
  }

  powerOff() {
    // Update button state
    this.powerButton.classList.remove("on");

    // Stop any ongoing animations
    this.isOn = false;

    // Start power-off sequence
    return gsap
      .timeline()
      .to(this.homescreen, {
        opacity: 0,
        duration: 0.3,
      })
      .to(this.stage, {
        alpha: 0,
        duration: 0.3,
      })
      .to(this.screen, {
        backgroundColor: "#000",
        duration: 0.5,
        onComplete: () => {
          this.screen.classList.add("off");
          this.canvas.style.display = "none";
          this.stage.removeChildren();
          this.stage.alpha = 1;
        },
      })
      .to(this.powerLed, {
        opacity: 0.6,
        duration: 0.2,
      });
  }

  launchGame(gameId) {
    // Fade out homescreen
    gsap.to(this.homescreen, {
      opacity: 0,
      duration: 0.5,
      onComplete: () => {
        this.homescreen.style.display = "none";
        // Initialize the selected game
        switch (gameId) {
          case "rpg":
            new Game(); // Your existing RPG game
            break;
          case "platformer":
            // Initialize platformer game
            break;
          // Add more games as needed
        }
      },
    });
  }

  cleanup() {
    this.isOn = false;

    // Remove event listeners
    this.powerButton.removeEventListener("click", this.togglePower.bind(this));
    document.querySelectorAll(".game-card").forEach((card) => {
      card.removeEventListener("click", () =>
        this.launchGame(card.dataset.game)
      );
    });

    // Cleanup PIXI application
    if (this.app) {
      this.app.destroy(true, {
        children: true,
        texture: true,
        baseTexture: true,
      });
    }
  }
}
