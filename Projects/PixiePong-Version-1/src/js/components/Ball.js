export default class Ball {
  constructor(app) {
    this.app = app;
    this.graphics = new PIXI.Graphics();
    this.speed = { x: 5, y: 5 };

    this.createBall();
    this.setupCollisionDetection();
  }

  createBall() {
    this.graphics.beginFill(0xffffff);
    this.graphics.drawCircle(0, 0, 10);
    this.graphics.endFill();
    this.graphics.x = this.app.screen.width / 2;
    this.graphics.y = this.app.screen.height / 2;
    this.app.stage.addChild(this.graphics);
  }

  setupCollisionDetection() {
    this.app.ticker.add(() => this.update());
  }

  update() {
    this.graphics.x += this.speed.x;
    this.graphics.y += this.speed.y;

    // Collision with walls
    if (
      this.graphics.x <= 10 ||
      this.graphics.x >= this.app.screen.width - 10
    ) {
      this.speed.x *= -1;
    }
    if (this.graphics.y <= 10) {
      this.speed.y *= -1;
    }

    // Game Over Condition
    if (this.graphics.y >= this.app.screen.height - 10) {
      this.gameOver();
    }
  }

  gameOver() {
    this.app.ticker.stop();
    alert("Game Over! The pixie missed the ball.");
    // Dispatch a custom event to reset the game
    document.dispatchEvent(new Event("resetGame"));
  }

  reset() {
    this.graphics.x = this.app.screen.width / 2;
    this.graphics.y = this.app.screen.height / 2;
    this.speed = { x: 5, y: 5 };
    this.app.ticker.start();
  }

  destroy() {
    this.app.ticker.remove(this.update, this);
    this.app.stage.removeChild(this.graphics);
    this.graphics.destroy();
  }
}
