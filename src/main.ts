
import getImageData from "./getImageData";
import { IWaveFunctionCollapse, createWaveFunctionCollapse } from "./wfc/run";
import { createElem, buildDomTree } from "./util";

let wfc: IWaveFunctionCollapse | undefined;

const canvas = createElem<HTMLCanvasElement>("canvas", { class: "wfcOutput", width: 0, height: 0 });

function processImage(image: ImageData) {
  if (wfc) {
    wfc.stop();
  }

  wfc = createWaveFunctionCollapse(image, canvas, {
    N: 3,
    symmetry: 8,
    ground: 0,
    periodicInput: true,
    periodicOutput: true,
    outputWidth: 48,
    outputHeight: 48,
  });
}

const imageInput = createElem<HTMLInputElement>("input", { type: "file", accept: "image/*" });
imageInput.addEventListener("change", () => {
  if (imageInput.files) {
    getImageData(imageInput.files[0]).then(processImage);
  }
});

document.body.appendChild(
  buildDomTree(
    createElem("main"), [
      createElem("label", undefined, "Image: "), [ imageInput ],
      canvas,
    ],
  ),
);
