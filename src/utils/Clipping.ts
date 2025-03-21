export type ClippingAlgorithm = 'CoSu' | 'LiBa';
import { colorPixel } from '../components/Canvas';
import { CoSu, LiBa } from './ClippingAlg';
import { Line } from '../components/Shapes';

export interface ClippingRegion {
  xMin: number;
  yMin: number;
  xMax: number;
  yMax: number;
}

export class Clipper {
  private region: ClippingRegion;
  private algorithm: ClippingAlgorithm;

  constructor(algorithm: ClippingAlgorithm) {
    this.algorithm = algorithm;

    this.region = {
      xMin: 0,
      yMin: 0,
      xMax: 0,
      yMax: 0,
    };
  }

  setRegion(
    point1: { x: number; y: number },
    point2: { x: number; y: number },
  ) {
    this.region = {
      xMin: Math.min(point1.x, point2.x),
      yMin: Math.min(point1.y, point2.y),
      xMax: Math.max(point1.x, point2.x),
      yMax: Math.max(point1.y, point2.y),
    };
  }

  getRegion(): ClippingRegion {
    return this.region;
  }

  getAlgorithm(): ClippingAlgorithm {
    return this.algorithm;
  }

  drawRegion(ctx: CanvasRenderingContext2D, pixelSize: number) {
    const { xMin, yMin, xMax, yMax } = this.region;

    console.log('Drawing region:', this.region);

    //bordas do topo e de baixo
    for (let x = xMin; x <= xMax; x++) {
      if (x % 2 === 0) {
        colorPixel(ctx, x, yMin, pixelSize, '#94EFB9');
        colorPixel(ctx, x, yMax, pixelSize, '#94EFB9');
      } else {
        colorPixel(ctx, x, yMin, pixelSize, '#097B3F');
        colorPixel(ctx, x, yMax, pixelSize, '#097B3F');
      }
    }

    //bordas da esquerda e da direita
    for (let y = yMin; y <= yMax; y++) {
      if (y % 2 === 0) {
        colorPixel(ctx, xMin, y, pixelSize, '#94EFB9');
        colorPixel(ctx, xMax, y, pixelSize, '#097B3F');
      } else {
        colorPixel(ctx, xMin, y, pixelSize, '#097B3F');
        colorPixel(ctx, xMax, y, pixelSize, '#94EFB9');
      }
    }
  }

  // Método para recortar uma linha usando o algoritmo definido
  clipLine(line: Line): Line | null {
    if (this.algorithm === 'CoSu') {
      return CoSu(line, this.region);
    } else if (this.algorithm === 'LiBa') {
      return LiBa(line, this.region);
    }
    return null;
  }
}
