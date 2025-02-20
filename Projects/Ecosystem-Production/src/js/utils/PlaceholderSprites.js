export function createPlaceholderSprite(type) {
  const graphics = new PIXI.Graphics();

  switch (type) {
    case "carrot":
      graphics.beginFill(0xff6b2c); // Orange
      graphics.drawCircle(0, 0, 8);
      graphics.endFill();
      break;

    case "rabbit":
      graphics.beginFill(0xcccccc); // Light gray
      graphics.drawCircle(0, 0, 12);
      graphics.endFill();
      break;

    case "wolf":
      graphics.beginFill(0x666666); // Dark gray
      graphics.drawCircle(0, 0, 16);
      graphics.endFill();
      break;
  }

  return graphics;
}
