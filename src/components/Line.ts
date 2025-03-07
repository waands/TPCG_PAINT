import { colorPixel } from './Canvas';

export const drawDDA = (
  ctx: CanvasRenderingContext2D,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  pixelSize: number,
  setDrawnPixels: React.Dispatch<
    React.SetStateAction<{ x: number; y: number; type: string }[]>
  >,
) => {
  let dx = x2 - x1;
  let dy = y2 - y1;
  let passos: number;
  if (Math.abs(dx) > Math.abs(dy)) {
    passos = Math.abs(dx);
  } else {
    passos = Math.abs(dy);
  }
  let x_incr = dx / passos;
  let y_incr = dy / passos;

  let x = x1;
  let y = y1;

  let newPixels = [];

  for (let k = 1; k <= passos; k++) {
    let roundedX = Math.round(x);
    let roundedY = Math.round(y);
    colorPixel(ctx, roundedX, roundedY, pixelSize);
    newPixels.push({ x: roundedX, y: roundedY, type: 'line' });

    x += x_incr;
    y += y_incr;
  }
  // Atualizar o estado dos pixels desenhados
  setDrawnPixels((prev) => [...prev, ...newPixels]);
};
