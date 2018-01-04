
import getImageData from "./getImageData";
import { run } from "./wfc/run";

function processImage(image: ImageData) {
  const canvas = document.querySelector("#imageOutput") as HTMLCanvasElement;
  run(image, canvas);
}

const imageInput = document.querySelector("#imageInput") as HTMLInputElement;
imageInput.addEventListener("change", () => {
  if (imageInput.files) {
    getImageData(imageInput.files[0]).then(processImage);
  }
});
