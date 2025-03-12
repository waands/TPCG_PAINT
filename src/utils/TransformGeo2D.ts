import { Shape, Line, Circle } from './Shapes';

export const translacao = (shape: Shape, tx: number, ty: number) => {
  if (shape instanceof Line) {
    console.log(tx, ty);
    shape.start.x += tx;
    shape.start.y += ty;
    shape.end.x += tx;
    shape.end.y += ty;
  } else if (shape instanceof Circle) {
    shape.center.x += tx;
    shape.center.y += ty;
  }
  return shape; // Retorna a forma modificada
};

export const multiplyMatrices = (A: number[][], B: number[][]): number[][] => {
  let result = [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
  ];

  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      for (let k = 0; k < 3; k++) {
        result[i][j] += A[i][k] * B[k][j];
      }
    }
  }
  return result;
};

export const createTranslationMatrix = (tx: number, ty: number) => [
  [1, 0, tx],
  [0, 1, ty],
  [0, 0, 1],
];

export const createScaleMatrix = (sx: number, sy: number) => [
  [sx, 0, 0],
  [0, sy, 0],
  [0, 0, 1],
];

export const createRotationMatrix = (theta: number) => [
  [Math.cos(theta), -Math.sin(theta), 0],
  [Math.sin(theta), Math.cos(theta), 0],
  [0, 0, 1],
];

export const applyTransformation = (
  shape: Shape,
  transformationMatrix: number[][],
) => {
  if (shape instanceof Line) {
    const applyMatrix = (x: number, y: number) => {
      const result = [
        transformationMatrix[0][0] * x +
          transformationMatrix[0][1] * y +
          transformationMatrix[0][2],
        transformationMatrix[1][0] * x +
          transformationMatrix[1][1] * y +
          transformationMatrix[1][2],
      ];
      return { x: result[0], y: result[1] };
    };

    shape.start = applyMatrix(shape.start.x, shape.start.y);
    shape.end = applyMatrix(shape.end.x, shape.end.y);
  } else if (shape instanceof Circle) {
    //shape.center = applyMatrix(shape.center.x, shape.center.y);
  }
};

export const compositeTransform = (
  shape: Shape,
  tx: number,
  ty: number,
  sx: number,
  sy: number,
  theta: number,
) => {
  let T = createTranslationMatrix(tx, ty);
  let S = createScaleMatrix(sx, sy);
  let R = createRotationMatrix(theta);

  let M = multiplyMatrices(T, multiplyMatrices(R, S)); // Composição das transformações

  applyTransformation(shape, M);
};
