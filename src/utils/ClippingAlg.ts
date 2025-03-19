import { Line } from '../utils/Shapes';
import { ClippingRegion } from './Clipping';

// Função para obter o código de localização de um ponto em relação à região de recorte
function obtemCodigo(
  x: number,
  y: number,
  xmin: number,
  ymin: number,
  xmax: number,
  ymax: number,
): number {
  let code = 0;
  // Se o ponto estiver à esquerda da janela
  if (x < xmin) {
    code |= 1;
  }
  // Se o ponto estiver à direita da janela
  if (x > xmax) {
    code |= 2;
  }
  // Se o ponto estiver inferior à janela
  if (y < ymin) {
    code |= 4;
  }
  // Se o ponto estiver superior à janela
  if (y > ymax) {
    code |= 8;
  }
  return code;
}

// Função para obter o bit na posição especificada (0: esquerda, 1: direita, 2: inferior, 3: superior)
function obtemBit(bitPos: number, code: number): number {
  return (code >> bitPos) & 1;
}

// Implementação do algoritmo de Cohen-Sutherland
export const CoSu = (line: Line, region: ClippingRegion): Line | null => {
  // Define os limites da região de recorte
  let xmin: number = region.xMin;
  let ymin: number = region.yMin;
  let xmax: number = region.xMax;
  let ymax: number = region.yMax;

  // Pega os pontos inicial e final da linha
  let xA: number = line.start.x;
  let yA: number = line.start.y;
  let xB: number = line.end.x;
  let yB: number = line.end.y;

  let feito: boolean = false; // se cálculos acabaram
  let aceite: boolean = false; // se tem algo pra desenhar

  while (!feito) {
    let codA: number = obtemCodigo(xA, yA, xmin, ymin, xmax, ymax);
    let codB: number = obtemCodigo(xB, yB, xmin, ymin, xmax, ymax);

    if (codA == 0 && codB == 0) {
      // dentro
      aceite = true;
      feito = true;
    } else if ((codA & codB) != 0) {
      // fora da janela TODO calculo bit a bit?
      feito = true;
    } else {
      let cod: number;
      if (codA != 0) {
        cod = codA;
      } else {
        cod = codB;
      }
      let xint: number = 0;
      let yint: number = 0;
      if (obtemBit(0, cod) === 1) {
        // esquerda
        xint = xmin;
        yint = yA + ((yB - yA) * (xmin - xA)) / (xB - xA);
      } else if (obtemBit(1, cod) === 1) {
        // direita
        xint = xmax;
        yint = yA + ((yB - yA) * (xmax - xA)) / (xB - xA);
      } else if (obtemBit(2, cod) === 1) {
        // inferior
        yint = ymin;
        xint = xA + ((xB - xA) * (ymin - yA)) / (yB - yA);
      } else if (obtemBit(3, cod) === 1) {
        // superior
        yint = ymax;
        xint = xA + ((xB - xA) * (ymax - yA)) / (yB - yA);
      }
      if (cod === codA) {
        xA = xint;
        yA = yint;
      } else {
        xB = xint;
        yB = yint;
      }
    }
  }

  if (aceite) {
    // desenha a linha (retorna a nova linha recortada)
    return new Line(
      { x: xA, y: yA },
      { x: xB, y: yB },
      line.algorithm,
      line.color,
    );
  }
  return null;
};

export const LiBa = (line: Line, region: ClippingRegion): Line | null => {
  // Implementação do algoritmo Liang-Barsky (a ser feito)
  return null;
};
