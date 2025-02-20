export default class Pixie {
  constructor(app, character = null) {
    this.app = app;
    this.graphics = new PIXI.Graphics();
    this.speed = 10; // Movement speed
    this.stamina = 10; // Stamina stat
    this.abilities = [];
    this.character = character;

    this.createPixie();
    this.setupControls();

    if (this.character) {
      this.setCharacter(this.character);
    }
  }

  createPixie() {
    this.graphics.beginFill(0xffa500); // Default color (orange)
    this.graphics.drawCircle(0, 0, 20); // Draw a circle for the pixie
    this.graphics.endFill();
    this.graphics.x = this.app.screen.width / 2; // Center horizontally
    this.graphics.y = this.app.screen.height - 50; // Position near the bottom
    this.app.stage.addChild(this.graphics);
  }

  setupControls() {
    window.addEventListener("mousemove", (event) => this.move(event));
  }

  move(event) {
    const appWidth = this.app.screen.width;
    let newX = event.clientX;

    // Constrain within the screen
    newX = Math.max(20, Math.min(appWidth - 20, newX));

    this.graphics.x = newX;
  }

  setCharacter(character) {
    this.character = character;

    // Update abilities and stats
    this.abilities = character.abilities;
    this.speed = character.stats.speed;
    this.stamina = character.stats.stamina;

    // Visually differentiate characters (optional)
    switch (character.name) {
      case "Sparkle":
        this.graphics.tint = 0xffa500; // Orange
        break;
      case "Glitter":
        this.graphics.tint = 0x1abc9c; // Turquoise
        break;
      case "Twinkle":
        this.graphics.tint = 0x9b59b6; // Purple
        break;
      default:
        this.graphics.tint = 0xffa500; // Default to orange
    }
  }

  useAbility(abilityIndex) {
    if (this.abilities[abilityIndex]) {
      const ability = this.abilities[abilityIndex];
      switch (ability) {
        case "Fire Burst":
          this.fireBurst();
          break;
        case "Ice Barrier":
          this.iceBarrier();
          break;
        case "Wind Gust":
          this.windGust();
          break;
        case "Lightning Strike":
          this.lightningStrike();
          break;
        case "Earth Shield":
          this.earthShield();
          break;
        case "Water Wave":
          this.waterWave();
          break;
        case "Shadow Dash":
          this.shadowDash();
          break;
        case "Light Shield":
          this.lightShield();
          break;
        case "Meteor Shower":
          this.meteorShower();
          break;
        default:
          console.log("Unknown ability:", ability);
      }
    }
  }

  fireBurst() {
    // Temporarily increase ball speed
    this.app.ticker.addOnce(() => {
      this.ball.speed.x *= 1.5;
      this.ball.speed.y *= 1.5;
      setTimeout(() => {
        this.ball.speed.x /= 1.5;
        this.ball.speed.y /= 1.5;
      }, 2000); // Reset after 2 seconds
    });
  }

  iceBarrier() {
    // Slow down the ball temporarily
    this.app.ticker.addOnce(() => {
      this.ball.speed.x *= 0.5;
      this.ball.speed.y *= 0.5;
      setTimeout(() => {
        this.ball.speed.x /= 0.5;
        this.ball.speed.y /= 0.5;
      }, 2000); // Reset after 2 seconds
    });
  }

  windGust() {
    // Change ball direction randomly
    this.app.ticker.addOnce(() => {
      this.ball.speed.x *= -1;
      this.ball.speed.y *= -1;
    });
  }

  lightningStrike() {
    // Increase pixie speed temporarily
    this.speed *= 2;
    setTimeout(() => {
      this.speed /= 2;
    }, 2000); // Reset after 2 seconds
  }

  earthShield() {
    // Prevent ball from passing the pixie temporarily
    this.app.ticker.addOnce(() => {
      this.ball.speed.y *= -1;
    });
  }

  waterWave() {
    // Push the ball away from the pixie
    this.app.ticker.addOnce(() => {
      this.ball.speed.y *= -1.5;
    });
  }

  shadowDash() {
    // Temporarily make the pixie invisible
    this.graphics.alpha = 0;
    setTimeout(() => {
      this.graphics.alpha = 1;
    }, 2000); // Reset after 2 seconds
  }

  lightShield() {
    // Reflect the ball with increased speed
    this.app.ticker.addOnce(() => {
      this.ball.speed.y *= -1.5;
    });
  }

  meteorShower() {
    // Spawn multiple balls temporarily
    for (let i = 0; i < 3; i++) {
      const newBall = new PIXI.Graphics();
      newBall.beginFill(0xffffff);
      newBall.drawCircle(0, 0, 10);
      newBall.endFill();
      newBall.x = this.app.screen.width / 2;
      newBall.y = this.app.screen.height / 2;
      this.app.stage.addChild(newBall);

      setTimeout(() => {
        this.app.stage.removeChild(newBall);
        newBall.destroy();
      }, 2000); // Remove after 2 seconds
    }
  }

  destroy() {
    window.removeEventListener("mousemove", this.move);
    this.app.stage.removeChild(this.graphics);
    this.graphics.destroy();
  }
}
