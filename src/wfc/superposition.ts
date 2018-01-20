export interface ISuperposition {
  readonly width: number;
  readonly height: number;
  readonly wave: boolean[][];
  readonly changes: boolean[];
  periodic: boolean;
  change(i: number): void;
  getChange(): number | null;
  clear(): void;
}

export function createSuperposition(
  coefficients: number,
  {width = 48, height = 48, periodic = false} = {},
): ISuperposition {

  const wave: boolean[][] = [];
  const changes: boolean[] = [];

  for (let i = 0; i < width * height; i++) {
    const w: boolean[] = [];

    for (let t = 0; t < coefficients; t++) {
      w.push(true);
    }

    wave.push(w);
    changes.push(false);
  }

  const stack: number[] = [];
  let stacksize = 0;

  return {
    wave,
    changes,
    width,
    height,
    periodic,
    change: (i: number) => {
      if (changes[i]) {
        return;
      }
      stack[stacksize] = i;
      stacksize++;
      changes[i] = true;
    },
    getChange: () => {
      if (stacksize === 0) {
        return null;
      }
      const i = stack[stacksize - 1];
      stacksize--;
      changes[i] = false;
      return i;
    },
    clear: () => {
      for (const w of wave) {
        w.fill(true);
      }
    },
  };;
}
