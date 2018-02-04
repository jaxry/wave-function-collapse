import { IOverlappingModel } from "./overlappingModel";
import { ISuperposition } from "./superposition";

export function setGround(
  ground = 0,
  { wave, width, height, numCoefficients, setCoefficient, collapse }: ISuperposition,
): void {
  if (ground === 0) {
    return;
  }

  ground = (ground + numCoefficients) % numCoefficients;

  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height - 1; y++) {
      setCoefficient(x + y * width, ground, false);
    }
    collapse(x + (height - 1) * width, ground);
  }
}
