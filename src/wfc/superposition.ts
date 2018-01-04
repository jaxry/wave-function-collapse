export interface ISuperposition {
  readonly wave: boolean[][];
  readonly changes: boolean[];
  readonly stack: number[];
  stacksize: number;
  readonly width: number;
  readonly height: number;
  change(i: number): void;
  getChange(): number | null;
  clear(): void;
}

function change(this: ISuperposition, i: number) {
  if (this.changes[i]) {
    return;
  }
  this.stack[this.stacksize] = i;
  this.stacksize++;
  this.changes[i] = true;
}

function getChange(this: ISuperposition): number | null {
  if (this.stacksize === 0) {
    return null;
  }
  const i = this.stack[this.stacksize - 1];
  this.stacksize--;
  this.changes[i] = false;
  return i;
}

function clear(this: ISuperposition) {
  for (const w of this.wave) {
    w.fill(true);
  }
}

export function superposition(
  coefficients: number, width: number, height: number,
): ISuperposition {

  const wave: boolean[][] = [];
  const changes: boolean[] = [];

  for (let i = 0; i < width * height; i++) {
    wave[i] = new Array(coefficients);
    wave[i].fill(true);
    changes[i] = false;
  }

  return {
    wave,
    changes,
    stack: new Array(width * height),
    stacksize: 0,
    width,
    height,
    change,
    getChange,
    clear,
  };
}
