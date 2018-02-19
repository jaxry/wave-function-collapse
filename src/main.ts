
import { IWaveFunctionCollapse, createWaveFunctionCollapse } from "./wfc/run";
import { buildDomTree } from "./util";
import { createWfcOptions } from "./components/wfcOptions";
import { createPresetPicker } from "./components/presetPicker";

let wfc: IWaveFunctionCollapse | undefined;

const canvas = document.createElement("canvas");
canvas.className = "wfcOutput";
canvas.width = 0;
canvas.height = 0;

const wfcOptions = createWfcOptions();
let inputBitmap: ImageData | undefined;

const start = () => {
  if (wfc) {
    wfc.stop();
  }

  if (!inputBitmap) {
    return;
  }

  wfc = createWaveFunctionCollapse(inputBitmap, canvas, wfcOptions.options);
};

const presetPicker = createPresetPicker();
presetPicker.onPick = (image, options) => {
  inputBitmap = image;
  wfcOptions.updateOptions(options);
  start();
};

const restartWfc = document.createElement("input");
restartWfc.type = "button";
restartWfc.value = "Restart Generation";
restartWfc.onclick = start;

const mainElem = document.querySelector("main");
if (mainElem) {
  const content = buildDomTree(
    mainElem, [
      document.createElement("h2"), ["Input bitmap"],
      presetPicker.domElement,
      document.createElement("h2"), ["Options"],
      wfcOptions.domElement,
      document.createElement("h2"), ["Output"],
      document.createElement("div"), [
        restartWfc,
      ],
      canvas,
    ],
  );
  mainElem.appendChild(content);
}
