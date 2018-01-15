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
  coefficients: number, width: number, height: number, periodic = false,
): ISuperposition {

  const wave: boolean[][] = [];
  const changes: boolean[] = [];

  for (let i = 0; i < width * height; i++) {
    wave[i] = new Array(coefficients);
    wave[i].fill(true);
    changes[i] = false;
  }

  const stack = new Array(width * height);
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
