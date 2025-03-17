import { colorPixel } from '../components/Canvas';

export const drawBresenhamCircle = (
  ctx: CanvasRenderingContext2D,
  xc: number,
  yc: number,
  r: number,
  pixelSize: number,
  selectedColor: string,
) => {
  let x = 0;
  let y = r;
  let p = 3 - 2 * r;

  plotaSimetricos(ctx, x, y, xc, yc, pixelSize, selectedColor);

  while (x < y) {
    if (p < 0) {
      p += 4 * x + 6;
    } else {
      p += 4 * (x - y) + 10;
      y--;
    }
    x++;
    plotaSimetricos(ctx, x, y, xc, yc, pixelSize, selectedColor);
  }
};

const plotaSimetricos = (
  ctx: CanvasRenderingContext2D,
  a: number,
  b: number,
  xc: number,
  yc: number,
  pixelSize: number,
  selectedColor: string,
) => {
  colorPixel(ctx, xc + a, yc + b, pixelSize, selectedColor);
  colorPixel(ctx, xc - a, yc + b, pixelSize, selectedColor);
  colorPixel(ctx, xc + a, yc - b, pixelSize, selectedColor);
  colorPixel(ctx, xc - a, yc - b, pixelSize, selectedColor);
  colorPixel(ctx, xc + b, yc + a, pixelSize, selectedColor);
  colorPixel(ctx, xc - b, yc + a, pixelSize, selectedColor);
  colorPixel(ctx, xc + b, yc - a, pixelSize, selectedColor);
  colorPixel(ctx, xc - b, yc - a, pixelSize, selectedColor);
};
