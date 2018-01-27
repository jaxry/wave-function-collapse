export interface IOverlappingModel {
  readonly numCoefficients: number;
  readonly N: number;
  readonly colors: number[];
  readonly patterns: number[][];
  readonly propagator: number[][][][];
  readonly patternCount: number[];
}

export function createOverlappingModel(
  { width, height, data }: ImageData,
  {N = 3, periodicInput = true, symmetry = 8} = {},
): IOverlappingModel {

  const bitmap = new Uint32Array(data.buffer);

  const colors: number[] = [];
  const sample: number[] = [];

  for (const color of bitmap) {
    let i = 0;
    for (const c of colors) {
      if (c === color) {
        break;
      }
      i++;
    }
    if (i === colors.length) {
      colors.push(color);
    }
    sample.push(i);
  }

  const pattern = (f: (x: number, y: number) => number) => {
    const result = [];
    for (let y = 0; y < N; y++) {
      for (let x = 0; x < N; x++) {
        result.push(f(x, y));
      }
    }
    return result;
  };

  const patternFromSample = (x: number, y: number) => {
    return pattern((dx, dy) => sample[(x + dx) % width + ((y + dy) % height) * width]);
  };
  const rotate = (p: number[]) => pattern((x, y) => p[N - 1 - y + x * N]);
  const reflect = (p: number[]) => pattern((x, y) => p[N - 1 - x + y * N]);

  const C = colors.length;
  const W = C ** (N * N);

  const index = (p: number[]) => {
    let result = 0;
    let power = 1;

    for (let i = 0; i < p.length; i++) {
      result += p[p.length - 1 - i] * power;
      power *= C;
    }

    return result;
  };

  const patternFromIndex = (ind: number) => {
    let residue = ind;
    let power = W;
    const result: number[] = [];

    for (let i = 0; i < N * N; i++) {
      power /= C;
      let count = 0;

      while (residue >= power) {
        residue -= power;
        count++;
      }

      result.push(count);
    }

    return result;
  };

  const weights = new Map<number, number>();

  const lenY = periodicInput ? height : height - N + 1;
  const lenX = periodicInput ? width : width - N + 1;
  for (let y = 0; y < lenY; y++) {
    for (let x = 0; x < lenX; x++) {
      const ps: number[][] = [];

      ps[0] = patternFromSample(x, y);
      ps[1] = reflect(ps[0]);
      ps[2] = rotate(ps[0]);
      ps[3] = reflect(ps[2]);
      ps[4] = rotate(ps[2]);
      ps[5] = reflect(ps[4]);
      ps[6] = rotate(ps[4]);
      ps[7] = reflect(ps[6]);

      for (let k = 0; k < symmetry; k++) {
        const ind = index(ps[k]);
        const weight = weights.get(ind) || 0;
        weights.set(ind, weight + 1);
      }
    }
  }

  const numCoefficients = weights.size;
  const patterns: number[][] = [];
  const patternCount: number[] = [];

  for (const [ind, weight] of weights) {
    patterns.push(patternFromIndex(ind));
    patternCount.push(weight);
  }

  const agrees = (pattern1: number[], pattern2: number[], dx: number, dy: number) => {
    const xmin = dx < 0 ? 0 : dx;
    const xmax = dx < 0 ? dx + N : N;
    const ymin = dy < 0 ? 0 : dy;
    const ymax = dy < 0 ? dy + N : N;
    for (let y = ymin; y < ymax; y++) {
      for (let x = xmin; x < xmax; x++) {
        if (pattern1[x + N * y] !== pattern2[x - dx + N * (y - dy)]) {
          return false;
        }
      }
    }
    return true;
  };

  const propagator: number[][][][] = [];
  for (let x = 0; x < 2 * N - 1; x++) {
    propagator[x] = [];
    for (let y = 0; y < 2 * N - 1; y++) {
      propagator[x][y] = [];
      for (let t = 0; t < numCoefficients; t++) {
        propagator[x][y][t] = [];
        for (let t2 = 0; t2 < numCoefficients; t2++) {
          if (agrees(patterns[t], patterns[t2], x - N + 1, y - N + 1)) {
            propagator[x][y][t].push(t2);
          }
        }
      }
    }
  }

  return {
    numCoefficients,
    colors,
    N,
    patterns,
    propagator,
    patternCount,
  };
}
