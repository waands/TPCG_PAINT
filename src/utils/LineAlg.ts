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
  //console.log('DDA');
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

export const drawBresenham = (
  ctx: CanvasRenderingContext2D,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  pixelSize: number,
  selectedColor: string,
) => {
  //console.log('Bresenham');
  let dx = x2 - x1;
  let dy = y2 - y1;
  let x = x1;
  let y = y1;
  let x_incr;
  let y_incr;
  let p;
  let c1;
  let c2;

  colorPixel(ctx, x, y, pixelSize, selectedColor);

  if (dx >= 0) {
    x_incr = 1;
  } else {
    x_incr = -1;
    dx = -dx;
  }
  if (dy >= 0) {
    y_incr = 1;
  } else {
    y_incr = -1;
    dy = -dy;
  }

  if (dx > dy) {
    //primeiro caso
    p = 2 * dy - dx;
    c1 = 2 * dy;
    c2 = 2 * (dy - dx);
    for (let i = 0; i < dx; i++) {
      x += x_incr; //1 pixel por coluna
      if (p < 0) {
        p += c1;
      } else {
        p += c2;
        y += y_incr;
      }
      colorPixel(ctx, x, y, pixelSize, selectedColor);
    }
  } else {
    //segundo caso
    p = 2 * dx - dy;
    c1 = 2 * dx;
    c2 = 2 * (dx - dy);
    for (let i = 0; i < dy; i++) {
      y += y_incr; //1 pixel por linha
      if (p < 0) {
        p += c1;
      } else {
        p += c2;
        x += x_incr;
      }
      colorPixel(ctx, x, y, pixelSize, selectedColor);
    }
  }
};
