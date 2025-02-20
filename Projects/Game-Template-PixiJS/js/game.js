const app = new PIXI.Application();
await app.init({
  backgroundColor: "#3398b9",
  width: 800,
  height: 800,
});
document.getElementById("game").appendChild(app.canvas);

// Game elements
const player = new PIXI.Graphics();
let stars = [];
let score = 0;
let timeLeft = 60;
let starInterval, timerInterval;

// UI elements
const scoreText = document.getElementById("score");
const timerText = document.getElementById("timer");
const gameOverScreen = document.getElementById("game-over");
const finalScoreText = document.getElementById("final-score");
const newGameBtn = document.getElementById("new-game-btn");

function startGame() {
  // Reset game state
  score = 0;
  timeLeft = 60;
  stars.forEach((star) => app.stage.removeChild(star));
  stars = [];
  app.stage.removeChildren();

  // Create player
  player.clear();
  player.beginFill("#f5ef42");
  player.drawCircle(0, 0, 20);
  player.endFill();
  player.x = 400;
  player.y = 700;
  app.stage.addChild(player);

  // Reset UI
  scoreText.textContent = "Score: 0";
  timerText.textContent = "Time: 60";
  gameOverScreen.style.display = "none";

  // Set up game mechanics
  app.stage.eventMode = "static";
  app.stage.hitArea = app.screen;
  app.stage.on("pointermove", (event) => {
    player.x = event.global.x;
    player.y = event.global.y;
  });

  starInterval = setInterval(createStar, 1000);
  timerInterval = setInterval(updateTimer, 1000);
  app.ticker.add(gameLoop);
}

function createStar() {
  const star = new PIXI.Graphics();
  star.beginFill("#ffffff");
  star.drawStar(0, 0, 5, 10, 5);
  star.endFill();
  star.x = Math.random() * 800;
  star.y = -20;
  app.stage.addChild(star);
  stars.push(star);
}

function gameLoop(delta) {
  for (let i = stars.length - 1; i >= 0; i--) {
    const star = stars[i];
    star.y += 2;

    if (Math.hypot(star.x - player.x, star.y - player.y) < 25) {
      app.stage.removeChild(star);
      stars.splice(i, 1);
      score++;
      scoreText.textContent = `Score: ${score}`;
    }

    if (star.y > 820) {
      app.stage.removeChild(star);
      stars.splice(i, 1);
    }
  }
}

function updateTimer() {
  timeLeft--;
  timerText.textContent = `Time: ${timeLeft}`;
  if (timeLeft <= 0) {
    endGame();
  }
}

function endGame() {
  clearInterval(timerInterval);
  clearInterval(starInterval);
  app.ticker.remove(gameLoop);
  finalScoreText.textContent = score;
  gameOverScreen.style.display = "block";
}

// New game button
newGameBtn.addEventListener("click", startGame);

// Start initial game
startGame();
