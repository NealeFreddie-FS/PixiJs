export class PerlinNoise {
  constructor(seed = Math.random()) {
    this.seed = seed;
    this.permutation = new Array(256);
    this.p = new Array(512);

    // Initialize permutation array
    for (let i = 0; i < 256; i++) {
      this.permutation[i] = i;
    }

    // Shuffle based on seed
    this.shuffle(this.permutation, seed);

    // Extend permutation to avoid overflow
    for (let i = 0; i < 512; i++) {
      this.p[i] = this.permutation[i & 255];
    }
  }

  shuffle(array, seed) {
    let currentIndex = array.length;
    let randomValue, temporaryValue;

    // Seeded random number generator
    const random = () => {
      seed = (seed * 9301 + 49297) % 233280;
      return seed / 233280;
    };

    while (currentIndex !== 0) {
      randomValue = Math.floor(random() * currentIndex);
      currentIndex -= 1;

      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomValue];
      array[randomValue] = temporaryValue;
    }

    return array;
  }

  fade(t) {
    return t * t * t * (t * (t * 6 - 15) + 10);
  }

  lerp(t, a, b) {
    return a + t * (b - a);
  }

  grad(hash, x, y) {
    const h = hash & 15;
    const grad2 = 1 + (h & 7);
    const u = h < 8 ? x : y;
    const v = h < 4 ? y : h === 12 || h === 14 ? x : 0;
    return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v);
  }

  noise(x, y) {
    const X = Math.floor(x) & 255;
    const Y = Math.floor(y) & 255;

    x -= Math.floor(x);
    y -= Math.floor(y);

    const u = this.fade(x);
    const v = this.fade(y);

    const A = this.p[X] + Y;
    const B = this.p[X + 1] + Y;

    return this.lerp(
      v,
      this.lerp(u, this.grad(this.p[A], x, y), this.grad(this.p[B], x - 1, y)),
      this.lerp(
        u,
        this.grad(this.p[A + 1], x, y - 1),
        this.grad(this.p[B + 1], x - 1, y - 1)
      )
    );
  }
}
