
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
}

const imageInput = document.createElement("input");
imageInput.type = "file";
imageInput.accept = "image/*";
imageInput.addEventListener("change", () => {
  if (imageInput.files) {
    getImageData(imageInput.files[0]).then(processImage);
  }
});

document.body.appendChild(
  buildDomTree(
    document.createElement("main"), [
      document.createElement("label"), [
        "Image",
        imageInput,
      ],
      wfcInput.domElement,
      canvas,
    ],
  ),
);
