export default class Tutorial {
  constructor(game) {
    this.game = game;
    this.app = game.app;
    this.currentStep = 0;
    this.steps = [
      {
        text: "Welcome to Pixie Pong! Use UP and DOWN arrows or mouse to move",
        duration: 3000,
      },
      {
        text: "Hit the ball with your paddle to send it back",
        duration: 3000,
      },
      {
        text: "First to 5 points wins! Ready? GO!",
        duration: 2000,
      },
    ];

    this.createTutorialText();
    this.showNextStep();
  }

  createTutorialText() {
    this.tutorialText = new PIXI.Text("", {
      fontFamily: "Arial",
      fontSize: 24,
      fill: 0xffffff,
      align: "center",
    });

    this.tutorialText.anchor.set(0.5);
    this.tutorialText.position.set(this.app.screen.width / 2, 50);
    this.app.stage.addChild(this.tutorialText);
  }

  showNextStep() {
    if (this.currentStep >= this.steps.length) {
      this.endTutorial();
      return;
    }

    const step = this.steps[this.currentStep];
    this.tutorialText.text = step.text;

    setTimeout(() => {
      this.currentStep++;
      this.showNextStep();
    }, step.duration);
  }

  endTutorial() {
    this.tutorialText.text = "";
    this.game.startGameplay();
  }
}
