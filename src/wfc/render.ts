import { ISuperposition } from "./superposition";
import { IOverlappingModel } from "./overlappingModel";

export function observationRender(width: number, height: number) {
  const image = new ImageData(width, height);
  const bitmap = new Uint32Array(image.data.buffer);

  return (
    { N, colors, patterns, coefficients }: IOverlappingModel,
    { wave, width, height }: ISuperposition,
  ) => {

    for (let i = 0; i < wave.length; i++) {
      const x = i % width;
      const y = Math.floor(i / width);
      const active = wave[i];

      let count = 0;
      let lastPattern = 0;
      for (let j = 0; j < active.length; j++) {
        if (active[j]) {
          count++;
          lastPattern = j;
        }
      }
      if (count === 1) {
        bitmap[i] = colors[patterns[lastPattern][0]];
      } else {
        const val = 255 * (1 - count / coefficients);
        bitmap[i] = 0xff000000 | (val << 16) | (val << 8) | (val);
      }
    }

    return image;
  };
}
