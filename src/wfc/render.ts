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

export function initRender(model: IOverlappingModel, superposition: ISuperposition, ctx: CanvasRenderingContext2D) {
  const maxPatternCount = orderedArraySum(model.patternCount);

  return {
    drawWave(waveIndex: number) {
      const w = superposition.wave[waveIndex];

      let activeCoefficients = 0;
      let sum = 0;
      let lastPatternIndex = 0;

      const  angleConstant = 2 * Math.PI / w.length;
      let hueX = 0;
      let hueY = 0;

      for (let i = 0; i < w.length; i++) {
        if (w[i]) {
          activeCoefficients++;
          sum += model.patternCount[i];
          lastPatternIndex = i;
          hueX += Math.cos(angleConstant * i);
          hueY += Math.sin(angleConstant * i);
        }
      }

      if (activeCoefficients === 1) {
        const color = model.colors[model.patterns[lastPatternIndex][0]];
        ctx.fillStyle = `rgb(${color & 255},${(color >> 8) & 255},${(color >> 16) & 255})`;
      } else {
        // circular average of active coefficients
        const hue = 180 * (Math.PI + Math.atan2(hueY, hueX)) / Math.PI;

        const saturation = 100 * (sum / maxPatternCount[activeCoefficients]);
        const lightness = Math.round(80 - 80 * activeCoefficients / w.length);
        ctx.fillStyle = `hsl(${hue},${saturation}%,${lightness}%)`;
      }

      const x = waveIndex % superposition.width;
      const y = Math.floor(waveIndex / superposition.width);
      ctx.fillRect(x, y, 1, 1);
    },
  };
}
