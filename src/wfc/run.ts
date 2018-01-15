import { printPatterns } from "./debug";
import { createSuperposition } from "./superposition";
import { overlappingModel } from "./overlappingModel";
import { startObservation } from "./observe";
import { propagate } from "./propagate";
import { createRender } from "./render";

export interface IWaveFunctionCollapse {
  stop(): void;
}

const outputWidth = 48;
const outputHeight = 48;
const targetFps = 30;
const targetTime = 1000 / targetFps;

export function waveFunctionCollapse(image: ImageData, canvas: HTMLCanvasElement): IWaveFunctionCollapse {
  const model = overlappingModel(image);
  const superpos = createSuperposition(model.coefficients, outputWidth, outputHeight);
  const observe = startObservation(model, superpos);

  canvas.width = superpos.width;
  canvas.height = superpos.height;
  const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

  const clearCanvas = () => {
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  const render = createRender(model, superpos, ctx);

  let propagating = false;
  let propagationLoops = 1;
  let animationFrameId: number;

  const tick = () => {
    if (!propagating) {
      const result = observe();
      if (result === null) {
        propagating = true;
      } else if (result === false)  {
        superpos.clear();
        clearCanvas();
      } else {
        return;
      }
    } else {
      const time = Date.now();
      for (let i = 0; propagating && i < propagationLoops; i++) {
        const waveIndex = propagate(model, superpos);
        if (waveIndex === null) {
          propagating = false;
        } else {
          render.drawWave(waveIndex);
        }
      }
      if (propagating) {
        const elapsed = Date.now() - time;
        if (elapsed > targetTime) {
          propagationLoops = Math.max(1, propagationLoops - 1);
        } else {
          propagationLoops++;
        }
      }
    }
    animationFrameId = requestAnimationFrame(tick);
  };

  clearCanvas();
  tick();

  return {
    stop() {
      cancelAnimationFrame(animationFrameId);
    },
  };
}
