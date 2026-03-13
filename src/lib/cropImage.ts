export type PixelCrop = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export const getCroppedImg = (
  imageSrc: string,
  pixelCrop: PixelCrop,
): Promise<string> => {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  const image = new Image();
  image.src = imageSrc;

  return new Promise((resolve, reject) => {
    image.onload = () => {
      canvas.width = pixelCrop.width;
      canvas.height = pixelCrop.height;

      ctx?.drawImage(
        image,
        pixelCrop.x,
        pixelCrop.y,
        pixelCrop.width,
        pixelCrop.height,
        0,
        0,
        pixelCrop.width,
        pixelCrop.height,
      );

      canvas.toBlob((file) => {
        resolve(URL.createObjectURL(file!));
      }, "image/jpeg");
    };

    image.onerror = reject;
  });
};
