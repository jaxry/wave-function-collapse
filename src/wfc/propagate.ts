import { IOverlappingModel } from "./overlappingModel";
import { ISuperposition } from "./superposition";

export function propagate(
  { N, propagator }: IOverlappingModel,
  { wave, width, height, numCoefficients, periodic, setCoefficient, getChange }: ISuperposition,
): number | null {

  const i1 = getChange();
  if (i1 === null) {
    return null;
  }

  const w1 = wave[i1];
  const x1 = i1 % width;
  const y1 = Math.floor(i1 / width);

  for (let dx = -N + 1; dx < N; dx++) {
    for (let dy = -N + 1; dy < N; dy++) {
      let x2 = x1 + dx;
      if (x2 < 0) {
        x2 += width;
      } else if (x2 >= width) {
        x2 -= width;
      }

      let y2 = y1 + dy;
      if (y2 < 0) {
        y2 += height;
      } else if (y2 >= height) {
        y2 -= height;
      }

      const i2 = x2 + y2 * width;

      if (!periodic && (i2 % width + N > width || Math.floor(i2 / width) + N > height)) {
        continue;
      }

      const w2 = wave[i2];
      const prop = propagator[N - 1 - dx][N - 1 - dy];

      for (let t = 0; t < numCoefficients; t++) {
        if (!w2[t]) {
          continue;
        }
        let b = false;
        const p = prop[t];
        for (let l = 0; !b && l < p.length; l++) {
          b = w1[p[l]];
        }
        if (!b) {
          setCoefficient(i2, t, false);
        }
      }
    }
  }

  return i1;
}
