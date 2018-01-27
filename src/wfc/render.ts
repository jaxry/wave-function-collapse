import { ISuperposition } from "./superposition";
import { IOverlappingModel } from "./overlappingModel";

function orderedArraySum(array: number[]): number[] {
  const sorted = array.slice().sort((a, b) => b - a);
  const sum = [sorted[0]];
  for (let i = 1; i < sorted.length; i++) {
    sum[i] = sum[i - 1] + sorted[i];
  }
  return sum;
}

function drawPixelFromColor(ctx: CanvasRenderingContext2D, x: number, y: number, color: number) {
  ctx.fillStyle = `rgb(${color & 255},${(color >> 8) & 255},${(color >> 16) & 255})`;
  ctx.fillRect(x, y, 1, 1);
}

export function createRender(
  { colors, patterns, patternCount, N }: IOverlappingModel,
  { wave, width, height, periodic }: ISuperposition,
  ctx: CanvasRenderingContext2D,
) {
  const maxPatternCount = orderedArraySum(patternCount);

  return (waveIndex: number): void => {
    const w = wave[waveIndex];

    let activeCoefficients = 0;
    let sum = 0;
    let lastPatternIndex = 0;

    const  angleConstant = 2 * Math.PI / w.length;
    let hueX = 0;
    let hueY = 0;

    for (let i = 0; i < w.length; i++) {
      if (w[i]) {
        activeCoefficients++;
        sum += patternCount[i];
        lastPatternIndex = i;
        hueX += Math.cos(angleConstant * i);
        hueY += Math.sin(angleConstant * i);
      }
    }

    const x = waveIndex % width;
    const y = Math.floor(waveIndex / width);

    if (activeCoefficients === 1) {
      const pattern = patterns[lastPatternIndex];
      if (!periodic && (x >= width - N || y >= height - N)) {
        for (let i = 0; i < N; i++) {
          for (let j = 0; j < N; j++) {
            drawPixelFromColor(ctx, x + i, y + j, colors[pattern[i + j * N]]);
          }
        }
      } else {
        drawPixelFromColor(ctx, x, y, colors[pattern[0]]);
      }

    } else {
      // circular average of active coefficients
      const hue = 180 * (Math.PI + Math.atan2(hueY, hueX)) / Math.PI;

      const saturation = 100 * (sum / maxPatternCount[activeCoefficients]);
      const lightness = Math.round(80 - 80 * activeCoefficients / w.length);
      ctx.fillStyle = `hsl(${hue},${saturation}%,${lightness}%)`;
      ctx.fillRect(x, y, 1, 1);
    }
  };
}
