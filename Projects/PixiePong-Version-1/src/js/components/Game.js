import Pixie from "./Pixie.js";
import Ball from "./Ball.js";

export default class Game {
  constructor(app) {
    this.app = app;
    this.pixie = null;
    this.ball = null;
    this.selectedCharacter = null;

    // Listen for character selection
    document.addEventListener("characterSelected", (event) =>
      this.setSelectedCharacter(event.detail)
    );
  }

  setSelectedCharacter(character) {
    this.selectedCharacter = character;
    this.initializeGame();
  }

  initializeGame() {
    // Clear existing game objects
    if (this.pixie) {
      this.app.stage.removeChild(this.pixie.graphics);
      this.pixie.destroy();
    }
    if (this.ball) {
      this.app.stage.removeChild(this.ball.graphics);
      this.ball.destroy();
    }

    // Create Pixie Player
    this.pixie = new Pixie(this.app, this.selectedCharacter);
    this.pixie.createPixie();

    // Create Pong Ball
    this.ball = new Ball(this.app);
    this.ball.createBall();

    // Game Loop
    this.app.ticker.add(() => this.update());
  }

  update() {
    // Move Ball
    this.ball.graphics.x += this.ball.speed.x;
    this.ball.graphics.y += this.ball.speed.y;

    // Collision with walls
    if (
      this.ball.graphics.x <= 10 ||
      this.ball.graphics.x >= this.app.screen.width - 10
    ) {
      this.ball.speed.x *= -1;
    }
    if (this.ball.graphics.y <= 10) {
      this.ball.speed.y *= -1;
    }

    // Collision with pixie
    if (
      this.ball.graphics.x >= this.pixie.graphics.x - 20 &&
      this.ball.graphics.x <= this.pixie.graphics.x + 20 &&
      this.ball.graphics.y >= this.pixie.graphics.y - 20 &&
      this.ball.graphics.y <= this.pixie.graphics.y + 20
    ) {
      this.ball.speed.y *= -1;
    }

    // Game Over Condition
    if (this.ball.graphics.y >= this.app.screen.height - 10) {
      this.app.ticker.stop();
      alert("Game Over! The pixie missed the ball.");
      showMenu("main-menu");
      this.app.destroy(true, { children: true });
    }
  }

  destroy() {
    if (this.pixie) this.pixie.destroy();
    if (this.ball) this.ball.destroy();
    document.removeEventListener(
      "characterSelected",
      this.setSelectedCharacter
    );
  }
}
