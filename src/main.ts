
import getImageData from "./getImageData";
import { IWaveFunctionCollapse, createWaveFunctionCollapse } from "./wfc/run";
import { buildDomTree } from "./util";
import { createWfcInput } from "./components/wfcOptions";

let wfc: IWaveFunctionCollapse | undefined;

const canvas = document.createElement("canvas");
canvas.className = "wfcOutput";
canvas.width = 0;
canvas.height = 0;

const wfcInput = createWfcInput();

function processImage(image: ImageData) {
  if (wfc) {
    wfc.stop();
  }

  wfc = createWaveFunctionCollapse(image, canvas, wfcInput.options);
  wfc.start();
}

const imageInput = document.createElement("input");
imageInput.type = "file";
imageInput.accept = "image/*";
imageInput.onchange = () => {
  if (imageInput.files) {
    getImageData(imageInput.files[0]).then(processImage);
  }
};

const restartWfc = document.createElement("input");
restartWfc.type = "button";
restartWfc.value = "Restart Generation";
restartWfc.onclick = () => {
  if (wfc) {
    wfc.stop();
    wfc.clear();
    wfc.start();
  }
};

document.body.appendChild(
  buildDomTree(
    document.createElement("main"), [
      document.createElement("div"), [
        document.createElement("label"), ["Image ", imageInput],
      ],
      wfcInput.domElement,
      document.createElement("div"), [
        restartWfc,
      ],
      canvas,
    ],
  ),
);
