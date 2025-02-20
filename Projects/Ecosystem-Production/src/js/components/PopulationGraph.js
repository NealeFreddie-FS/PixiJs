export default class PopulationGraph {
  constructor(container) {
    this.container = container;
    this.width = container.clientWidth;
    this.height = container.clientHeight;

    this.app = new PIXI.Application({
      width: this.width,
      height: this.height,
      backgroundColor: 0x000000,
      resolution: window.devicePixelRatio || 1,
      antialias: true,
    });

    this.container.appendChild(this.app.view);

    this.colors = {
      wolf: 0x808080, // Gray
      rabbit: 0xffffff, // White
      carrot: 0xff6b2c, // Orange
    };

    this.graphics = new PIXI.Graphics();
    this.app.stage.addChild(this.graphics);

    // Add legend
    this.createLegend();

    // Start update loop
    this.app.ticker.add(() => this.update());
  }

  createLegend() {
    const legend = new PIXI.Container();
    legend.position.set(10, 10);

    Object.entries(this.colors).forEach(([type, color], index) => {
      const item = new PIXI.Container();
      item.position.set(0, index * 20);

      // Color box
      const box = new PIXI.Graphics();
      box.beginFill(color);
      box.drawRect(0, 0, 10, 10);
      box.endFill();
      item.addChild(box);

      // Label
      const text = new PIXI.Text(type, {
        fontSize: 12,
        fill: color,
        fontFamily: "Arial",
      });
      text.position.set(15, -2);
      item.addChild(text);

      legend.addChild(item);
    });

    this.app.stage.addChild(legend);
  }

  update() {
    const history = window.simulation.statsManager.getHistory().population;
    if (history.length < 2) return;

    this.graphics.clear();

    // Draw grid
    this.graphics.lineStyle(1, 0x333333, 0.5);
    for (let y = 0; y < this.height; y += 20) {
      this.graphics.moveTo(0, y);
      this.graphics.lineTo(this.width, y);
    }

    // Draw population lines
    Object.entries(this.colors).forEach(([type, color]) => {
      this.graphics.lineStyle(2, color);

      const points = history.map((stat, i) => ({
        x: (i / (history.length - 1)) * this.width,
        y:
          this.height -
          (stat.populations[type] / this.getMaxPopulation(type)) * this.height,
      }));

      this.graphics.moveTo(points[0].x, points[0].y);
      points.forEach((point) => {
        this.graphics.lineTo(point.x, point.y);
      });
    });
  }

  getMaxPopulation(type) {
    const history = window.simulation.statsManager.getHistory().population;
    return Math.max(50, ...history.map((stat) => stat.populations[type] || 0));
  }

  resize() {
    this.width = this.container.clientWidth;
    this.height = this.container.clientHeight;
    this.app.renderer.resize(this.width, this.height);
  }
}
