export interface ISuperposition {
  readonly width: number;
  readonly height: number;
  readonly numCoefficients: number;
  readonly wave: boolean[][];
  periodic: boolean;
  change(waveIndex: number): void;
  getChange(): number | null;
  collapse(waveIndex: number, coefficient: number): void;
  setCoefficient(waveIndex: number, coefficient: number, state: boolean): void;
  clear(): void;
}

export function createSuperposition(
  numCoefficients: number,
  {width = 48, height = 48, periodic = true} = {},
): ISuperposition {

  const wave: boolean[][] = [];
  const changes: boolean[] = [];

  for (let i = 0; i < width * height; i++) {
    const w: boolean[] = [];

    for (let t = 0; t < numCoefficients; t++) {
      w.push(true);
    }

    wave.push(w);
    changes.push(false);
  }

  const stack: number[] = [];
  let stacksize = 0;

  const superposition = {
    width,
    height,
    numCoefficients,
    wave,
    periodic,
    change(i: number) {
      if (changes[i]) {
        return;
      }
      stack[stacksize] = i;
      stacksize++;
      changes[i] = true;
    },
    getChange() {
      if (stacksize === 0) {
        return null;
      }
      const i = stack[stacksize - 1];
      stacksize--;
      changes[i] = false;
      return i;
    },
    collapse(i: number, coefficient: number) {
      for (let t = 0; t < numCoefficients; t++) {
        wave[i][t] = t === coefficient;
      }
      superposition.change(i);
    },
    setCoefficient(i: number, coefficient: number, state: boolean) {
      wave[i][coefficient] = state;
      superposition.change(i);
    },
    clear() {
      for (const w of wave) {
        w.fill(true);
      }
    },
  };

  return superposition;
}
