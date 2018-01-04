import { printPatterns } from "./debug";
import { superposition } from "./superposition";
import { overlappingModel } from "./overlappingModel";
import { startObservation } from "./observe";
import { propagate } from "./propagate";
import { observationRender } from "./render";

export function run(image: ImageData, canvas: HTMLCanvasElement) {
  const model = overlappingModel(image);
  const superpos = superposition(model.coefficients, 48, 48);
  const observe = startObservation(model, superpos);
  const render = observationRender(superpos.width, superpos.height);

  canvas.width = superpos.width;
  canvas.height = superpos.height;
  const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

  function tick() {
    const result = observe();
    ctx.putImageData(render(model, superpos), 0, 0);
    if (result === null) {
      propagate(model, superpos);
      requestAnimationFrame(tick);
    } else if (result === false)  {
      superpos.clear();
      requestAnimationFrame(tick);
    }
  }

  requestAnimationFrame(tick);
}
