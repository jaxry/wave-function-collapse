import { ISuperposition } from "./superposition";
import { IOverlappingModel } from "./overlappingModel";

const sumFunc = (a: any, b: any) => a + b;

function pickFromDistribution(array: number[], r: number): number {
  let sum = array.reduce(sumFunc);

  if (sum === 0) {
    array.fill(1);
    sum = array.reduce(sumFunc);
  }

  for (let i = 0; i < array.length; i++) {
    array[i] /= sum;
  }

  let x = 0;
  for (let i = 0; i < array.length; i++) {
    x += array[i];
    if (r <= x) {
      return i;
    }
  }

  return 0;
}

export function createObservation(
  { patternCount, N }: IOverlappingModel,
  { wave, width, height, numCoefficients, periodic, collapse }: ISuperposition,
) {

  const logT = Math.log(numCoefficients);
  const distribution: number[] = [];

  return (): boolean | null => {
    let minEntropy = Infinity;
    let minEntropyWave = -1;

    for (let i = 0; i < wave.length; i++) {

      if (!periodic && (i % width + N > width || Math.floor(i / width) + N > height)) {
        continue;
      }

      const w = wave[i];
      let amount = 0;
      let sum = 0;

      for (let t = 0; t < numCoefficients; t++) {
        if (w[t]) {
          amount += 1;
          sum += patternCount[t];
        }
      }

      if (sum === 0) {
        return false;
      }

      const noise = 1e-6 * Math.random();

      let entropy;
      if (amount === 1) {
        entropy = 0;
      } else {
        let mainSum = 0;
        for (let t = 0; t < numCoefficients; t++) {
          if (w[t]) {
            const p = patternCount[t] / sum;
            mainSum += p * Math.log(p);
          }
        }

        entropy = -mainSum / logT;
      }

      if (entropy > 0 && entropy + noise < minEntropy) {
        minEntropy = entropy + noise;
        minEntropyWave = i;
      }
    }

    if (minEntropyWave === -1) {
      return true;
    }

    for (let t = 0; t < numCoefficients; t++) {
      distribution[t] = wave[minEntropyWave][t] ? patternCount[t] : 0;
    }
    const r = pickFromDistribution(distribution, Math.random());

    collapse(minEntropyWave, r);

    return null;

  };
}
