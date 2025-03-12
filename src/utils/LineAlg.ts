import { colorPixel } from '../components/Canvas';

export const drawDDA = (
  ctx: CanvasRenderingContext2D,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  pixelSize: number,
  selectedColor: string,
) => {
  let dx = x2 - x1;
  let dy = y2 - y1;
  let passos = Math.max(Math.abs(dx), Math.abs(dy));
  let x_incr = dx / passos;
  let y_incr = dy / passos;

  let x = x1;
  let y = y1;

  for (let k = 0; k <= passos; k++) {
    let roundedX = Math.round(x);
    let roundedY = Math.round(y);
    colorPixel(ctx, roundedX, roundedY, pixelSize, selectedColor);

    x += x_incr;
    y += y_incr;
  }
};
