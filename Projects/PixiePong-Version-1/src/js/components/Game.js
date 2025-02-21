import Pixie from "./Pixie.js";
import Ball from "./Ball.js";
import Tutorial from "./Tutorial.js";
import SoundManager from "./SoundManager.js";

export default class Game {
  constructor(app, character) {
    this.app = app;
    this.character = character;
    this.score = {
      player: 0,
      opponent: 0,
    };

    // Game settings
    this.settings = {
      paddleSpeed: 10,
      ballSpeed: 4,
      difficulty: document.getElementById("difficulty").value,
      maxScore: 5,
      mouseSmoothness: 0.5,
    };

    // Game state
    this.isPlaying = false;
    this.mouseControl = false;
    this.targetPaddleY = 0;
    this.keyState = {
      up: false,
      down: false,
    };

    // Initialize game immediately
    this.createGameObjects();
    this.createScoreDisplay();
    this.createParticleContainer();

    // Initialize sound manager after game objects
    this.soundManager = new SoundManager();
  }

  createGameObjects() {
    // Create background effect
    this.background = new PIXI.Graphics();
    this.background.beginFill(0x120458);
    this.background.drawRect(
      0,
      0,
      this.app.screen.width,
      this.app.screen.height
    );
    this.background.endFill();
    this.app.stage.addChild(this.background);

    // Add grid effect
    this.grid = new PIXI.Graphics();
    this.drawGrid();
    this.app.stage.addChild(this.grid);

    // Create player paddle with glow
    this.playerPaddle = new PIXI.Graphics();
    this.playerPaddle.beginFill(0x00bfff);
    this.playerPaddle.drawRect(0, 0, 10, 100);
    this.playerPaddle.endFill();
    this.playerPaddle.filters = [new PIXI.BlurFilter(2, 5)];
    this.playerPaddle.x = 50;
    this.playerPaddle.y = this.app.screen.height / 2 - 50;

    // Create opponent paddle with glow
    this.opponentPaddle = new PIXI.Graphics();
    this.opponentPaddle.beginFill(0xff69b4);
    this.opponentPaddle.drawRect(0, 0, 10, 100);
    this.opponentPaddle.endFill();
    this.opponentPaddle.filters = [new PIXI.BlurFilter(2, 5)];
    this.opponentPaddle.x = this.app.screen.width - 60;
    this.opponentPaddle.y = this.app.screen.height / 2 - 50;

    // Create ball with glow
    this.ball = new PIXI.Graphics();
    this.ball.beginFill(0xffffff);
    this.ball.drawCircle(0, 0, 5);
    this.ball.endFill();
    this.ball.filters = [new PIXI.BlurFilter(2, 5)];
    this.ball.x = this.app.screen.width / 2;
    this.ball.y = this.app.screen.height / 2;

    // Add all objects to stage
    this.app.stage.addChild(this.playerPaddle);
    this.app.stage.addChild(this.opponentPaddle);
    this.app.stage.addChild(this.ball);

    // Initialize ball velocity
    this.ballVelocity = {
      x: this.settings.ballSpeed,
      y: this.settings.ballSpeed,
    };

    // Setup keyboard controls
    this.setupControls();
  }

  drawGrid() {
    this.grid.clear();
    this.grid.lineStyle(1, 0x304070, 0.3);

    // Draw vertical lines
    for (let x = 0; x < this.app.screen.width; x += 30) {
      this.grid.moveTo(x, 0);
      this.grid.lineTo(x, this.app.screen.height);
    }

    // Draw horizontal lines
    for (let y = 0; y < this.app.screen.height; y += 30) {
      this.grid.moveTo(0, y);
      this.grid.lineTo(this.app.screen.width, y);
    }

    // Draw center line
    this.grid.lineStyle(2, 0x304070, 0.5);
    this.grid.moveTo(this.app.screen.width / 2, 0);
    this.grid.lineTo(this.app.screen.width / 2, this.app.screen.height);
  }

  createScoreDisplay() {
    // Update score display style
    this.scoreText = new PIXI.Text("0 - 0", {
      fontFamily: "Press Start 2P",
      fontSize: 32,
      fill: 0x00bfff,
      align: "center",
      dropShadow: true,
      dropShadowColor: 0xff69b4,
      dropShadowBlur: 4,
      dropShadowAngle: Math.PI / 6,
      dropShadowDistance: 6,
    });

    this.scoreText.anchor.set(0.5);
    this.scoreText.position.set(this.app.screen.width / 2, 30);
    this.app.stage.addChild(this.scoreText);
  }

  setupControls() {
    // Keyboard controls - Improved for smoother movement
    window.addEventListener("keydown", (e) => {
      switch (e.key) {
        case "ArrowUp":
          this.keyState.up = true;
          break;
        case "ArrowDown":
          this.keyState.down = true;
          break;
      }
    });

    window.addEventListener("keyup", (e) => {
      switch (e.key) {
        case "ArrowUp":
          this.keyState.up = false;
          break;
        case "ArrowDown":
          this.keyState.down = false;
          break;
      }
    });

    // Mouse/Touch controls
    this.app.view.addEventListener("mousemove", (e) => {
      if (this.isPlaying) {
        const rect = this.app.view.getBoundingClientRect();
        const mouseY = e.clientY - rect.top;
        this.targetPaddleY = Math.max(
          0,
          Math.min(this.app.screen.height - 100, mouseY)
        );
        this.mouseControl = true;
      }
    });

    // Touch controls for mobile
    this.app.view.addEventListener(
      "touchmove",
      (e) => {
        if (this.isPlaying) {
          e.preventDefault();
          const rect = this.app.view.getBoundingClientRect();
          const touchY = e.touches[0].clientY - rect.top;
          this.targetPaddleY = Math.max(
            0,
            Math.min(this.app.screen.height - 100, touchY)
          );
          this.mouseControl = true;
        }
      },
      { passive: false }
    );

    // Reset mouse control when using keyboard
    window.addEventListener("keydown", () => {
      this.mouseControl = false;
    });
  }

  updatePaddlePosition(deltaTime) {
    if (this.mouseControl) {
      // Smooth mouse following
      const diff = this.targetPaddleY - this.playerPaddle.y;
      this.playerPaddle.y += diff * this.settings.mouseSmoothness;
    } else {
      // Keyboard controls
      if (this.keyState.up && this.playerPaddle.y > 0) {
        this.playerPaddle.y -= this.settings.paddleSpeed;
      }
      if (
        this.keyState.down &&
        this.playerPaddle.y < this.app.screen.height - 100
      ) {
        this.playerPaddle.y += this.settings.paddleSpeed;
      }
    }
  }

  start() {
    this.isPlaying = true;
    if (this.soundManager.loaded) {
      this.soundManager.playGameMusic();
    }
    this.tutorial = new Tutorial(this);
  }

  startGameplay() {
    this.isPlaying = true;
    this.resetBall();
    this.app.ticker.add(() => this.gameLoop());
  }

  gameLoop() {
    // Add deltaTime for smooth animation
    const deltaTime = this.app.ticker.deltaTime;

    this.updatePaddlePosition(deltaTime);
    this.updateBall();
    this.updateOpponent();
    this.checkCollisions();
  }

  updateBall() {
    this.ball.x += this.ballVelocity.x;
    this.ball.y += this.ballVelocity.y;

    // Ball hits top or bottom
    if (this.ball.y <= 0 || this.ball.y >= this.app.screen.height) {
      this.ballVelocity.y *= -1;
    }

    // Ball goes out of bounds
    if (this.ball.x <= 0 || this.ball.x >= this.app.screen.width) {
      if (this.ball.x <= 0) {
        this.score.opponent++;
      } else {
        this.score.player++;
      }
      this.resetBall();
    }
  }

  updateOpponent() {
    // Simple AI - follow the ball
    const targetY = this.ball.y - 50;
    if (
      this.opponentPaddle.y < targetY &&
      this.opponentPaddle.y < this.app.screen.height - 100
    ) {
      this.opponentPaddle.y += this.settings.paddleSpeed * 0.8;
    } else if (this.opponentPaddle.y > targetY && this.opponentPaddle.y > 0) {
      this.opponentPaddle.y -= this.settings.paddleSpeed * 0.8;
    }
  }

  checkCollisions() {
    // Paddle collisions
    if (
      this.ball.x <= 60 &&
      this.ball.y >= this.playerPaddle.y &&
      this.ball.y <= this.playerPaddle.y + 100
    ) {
      this.ballVelocity.x *= -1;
      this.soundManager.playPaddleHit();
      this.createParticleExplosion(this.ball.x, this.ball.y, 0x00bfff);
    }

    // Wall collisions
    if (this.ball.y <= 0 || this.ball.y >= this.app.screen.height) {
      this.ballVelocity.y *= -1;
      this.soundManager.playWallHit();
    }

    // Scoring
    if (this.ball.x <= 0) {
      this.score.opponent++;
      this.soundManager.playScore();
      this.createScoreAnimation(this.app.screen.width * 0.75, 100, false);
      this.updateScore();
      this.resetBall();
    } else if (this.ball.x >= this.app.screen.width) {
      this.score.player++;
      this.soundManager.playScore();
      this.createScoreAnimation(this.app.screen.width * 0.25, 100, true);
      this.updateScore();
      this.resetBall();
    }
  }

  resetBall() {
    this.ball.x = this.app.screen.width / 2;
    this.ball.y = this.app.screen.height / 2;
    this.ballVelocity.x =
      this.settings.ballSpeed * (Math.random() > 0.5 ? 1 : -1);
    this.ballVelocity.y =
      this.settings.ballSpeed * (Math.random() > 0.5 ? 1 : -1);
  }

  destroy() {
    if (this.playerPaddle) this.playerPaddle.destroy();
    if (this.opponentPaddle) this.opponentPaddle.destroy();
    if (this.ball) this.ball.destroy();
  }

  handleResize() {
    // Update paddle positions
    this.playerPaddle.x = 50;
    this.opponentPaddle.x = this.app.screen.width - 60;

    // Keep paddles within bounds
    this.playerPaddle.y = Math.min(
      this.playerPaddle.y,
      this.app.screen.height - 100
    );
    this.opponentPaddle.y = Math.min(
      this.opponentPaddle.y,
      this.app.screen.height - 100
    );

    // Center ball if it's in reset position
    if (this.ball.x === this.app.screen.width / 2) {
      this.resetBall();
    }
  }

  updateScore() {
    this.scoreText.text = `${this.score.player} - ${this.score.opponent}`;

    if (
      this.score.player >= this.settings.maxScore ||
      this.score.opponent >= this.settings.maxScore
    ) {
      this.soundManager.playWin();
      this.endGame();
    } else {
      this.soundManager.playScore();
    }
  }

  endGame() {
    this.soundManager.stopMusic();
    this.isPlaying = false;
    const winner =
      this.score.player > this.score.opponent ? "You win!" : "Game Over!";

    const gameOverText = new PIXI.Text(winner, {
      fontFamily: "Arial",
      fontSize: 48,
      fill: 0xffffff,
      align: "center",
    });

    gameOverText.anchor.set(0.5);
    gameOverText.position.set(
      this.app.screen.width / 2,
      this.app.screen.height / 2
    );
    this.app.stage.addChild(gameOverText);

    // Add restart button
    const restartButton = new PIXI.Text("Play Again", {
      fontFamily: "Arial",
      fontSize: 24,
      fill: 0xffffff,
      align: "center",
    });

    restartButton.anchor.set(0.5);
    restartButton.position.set(
      this.app.screen.width / 2,
      this.app.screen.height / 2 + 50
    );
    restartButton.interactive = true;
    restartButton.buttonMode = true;
    restartButton.on("pointerdown", () => this.restart());

    this.app.stage.addChild(restartButton);
  }

  restart() {
    // Reset scores
    this.score.player = 0;
    this.score.opponent = 0;
    this.updateScore();

    // Clear end game text
    this.app.stage.removeChildren();
    this.createGameObjects();

    // Start new game
    this.startGameplay();
  }

  createParticleContainer() {
    // Use regular Container instead of ParticleContainer
    this.particles = new PIXI.Container();
    this.app.stage.addChild(this.particles);
  }

  createParticleExplosion(x, y, color) {
    for (let i = 0; i < 20; i++) {
      const particle = new PIXI.Graphics();
      particle.beginFill(color);
      particle.drawCircle(0, 0, 2);
      particle.endFill();
      particle.position.set(x, y);

      // Set up particle movement
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 5 + 2;
      particle.velocity = {
        x: Math.cos(angle) * speed,
        y: Math.sin(angle) * speed,
      };
      particle.alpha = 1;
      particle.lifespan = 30; // frames

      this.particles.addChild(particle);

      // Use app.ticker instead of creating new tickers
      const updateParticle = () => {
        particle.x += particle.velocity.x;
        particle.y += particle.velocity.y;
        particle.lifespan--;
        particle.alpha = particle.lifespan / 30;

        if (particle.lifespan <= 0) {
          this.particles.removeChild(particle);
          this.app.ticker.remove(updateParticle);
        }
      };

      this.app.ticker.add(updateParticle);
    }
  }

  createScoreAnimation(x, y, isPlayer) {
    const scoreSprite = new PIXI.Text("+1", {
      fontFamily: "Press Start 2P",
      fontSize: 24,
      fill: isPlayer ? 0x00bfff : 0xff69b4,
    });

    scoreSprite.anchor.set(0.5);
    scoreSprite.position.set(x, y);
    this.app.stage.addChild(scoreSprite);

    let alpha = 1;
    let yPos = y;

    // Use app.ticker instead of creating new ticker
    const updateScore = () => {
      yPos -= 2;
      alpha -= 0.02;
      scoreSprite.position.y = yPos;
      scoreSprite.alpha = alpha;

      if (alpha <= 0) {
        this.app.stage.removeChild(scoreSprite);
        this.app.ticker.remove(updateScore);
      }
    };

    this.app.ticker.add(updateScore);
  }
}
