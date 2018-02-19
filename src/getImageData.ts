export default function getImageData(url: string): Promise<ImageData> {
  const img = document.createElement("img");
  img.src = url;

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

  return new Promise((resolve, reject) => {
    img.addEventListener("load", () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      resolve(ctx.getImageData(0, 0, canvas.width, canvas.height));
    });
  });
}
