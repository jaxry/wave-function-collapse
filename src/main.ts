
import getImageData from "./getImageData";
import { IWaveFunctionCollapse, createWaveFunctionCollapse } from "./wfc/run";

let wfc: IWaveFunctionCollapse | undefined;

function processImage(image: ImageData) {
  const canvas = document.querySelector("#imageOutput") as HTMLCanvasElement;
  if (wfc) {
    wfc.stop();
  }
  wfc = createWaveFunctionCollapse(image, canvas);
}

const imageInput = document.querySelector("#imageInput") as HTMLInputElement;
imageInput.addEventListener("change", () => {
  if (imageInput.files) {
    getImageData(imageInput.files[0]).then(processImage);
  }
});
