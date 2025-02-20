import { ErrorBoundary } from "./utils/ErrorBoundary.js";

export class BootSequence {
  constructor(app, dimensions) {
    if (!app) throw new Error("PIXI Application is required");
    if (!dimensions) throw new Error("Dimensions are required");

    this.app = app;
    this.width = dimensions.width;
    this.height = dimensions.height;

    // Create main container
    this.container = new PIXI.Container();
    this.app.stage.addChild(this.container);

    // Create elements
    this.createElements();
  }

  createElements() {
    // Create black background
    const bg = new PIXI.Graphics();
    bg.beginFill(0x000000);
    bg.drawRect(0, 0, this.width, this.height);
    bg.endFill();
    this.container.addChild(bg);

    // Create logo
    this.logo = new PIXI.Text("PIXI POCKET", {
      fontFamily: "Arial",
      fontSize: 60,
      fill: 0xff3333,
      align: "center",
      stroke: "#ff0000",
      strokeThickness: 4,
    });
    this.logo.anchor.set(0.5);
    this.logo.position.set(this.width / 2, this.height / 2);
    this.logo.alpha = 0;
    this.container.addChild(this.logo);

    // Create loading bar
    this.loadingBar = new PIXI.Graphics();
    this.loadingBar.beginFill(0xff3333);
    this.loadingBar.drawRect(0, 0, 0, 4);
    this.loadingBar.position.set(this.width * 0.2, this.height * 0.7);
    this.container.addChild(this.loadingBar);
  }

  async play() {
    return new Promise((resolve) => {
      gsap
        .timeline()
        .to(this.logo, {
          alpha: 1,
          duration: 0.5,
          ease: "power2.out",
        })
        .to(this.loadingBar, {
          width: this.width * 0.6,
          duration: 2,
          ease: "power1.inOut",
          onComplete: () => {
            gsap.to(this.container, {
              alpha: 0,
              duration: 0.5,
              onComplete: resolve,
            });
          },
        });
    });
  }
}
