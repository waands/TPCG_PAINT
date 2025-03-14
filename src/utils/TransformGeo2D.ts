import { Shape, Line, Circle } from './Shapes';

export const translacao = (shape: Shape, tx: number, ty: number) => {
  if (shape instanceof Line) {
    //console.log(tx, ty);
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

export const createRotationMatrix = (theta: number) => {
  const radians = (theta * Math.PI) / 180; // Conversão para radianos
  return [
    [Math.cos(radians), -Math.sin(radians), 0],
    [Math.sin(radians), Math.cos(radians), 0],
    [0, 0, 1],
  ];
};

export const createReflectionMatrix = (eixo: number) => {
  //eixo x = 1, eixo y = 2, eixo xy = 3
  if (eixo == 1) {
    return [
      [1, 0, 0],
      [0, -1, 0],
      [0, 0, 1],
    ];
  } else if (eixo == 2) {
    return [
      [-1, 0, 0],
      [0, 1, 0],
      [0, 0, 1],
    ];
  } else if (eixo == 3) {
    return [
      [-1, 0, 0],
      [0, -1, 0],
      [0, 0, 1],
    ];
  } else {
    return [
      [1, 0, 0],
      [0, 1, 0],
      [0, 0, 1],
    ];
  }
};

export const compositeTransform = (
  shape: Shape,
  tx: number,
  ty: number,
  sx: number,
  sy: number,
  theta: number,
  eixo: number,
) => {
  let refX = 0,
    refY = 0;

  if (shape instanceof Line) {
    refX = (shape.start.x + shape.end.x) / 2;
    refY = (shape.start.y + shape.end.y) / 2;
  } else if (shape instanceof Circle) {
    refX = shape.center.x;
    refY = shape.center.y;
  }

  //console.log('aaaaaaaaaaaaa ERIXOOOOOO', eixo);

  // Matrizes de transformação

  const T1 = createTranslationMatrix(-refX, -refY); // Move para a origem
  const L = createReflectionMatrix(eixo); // Reflete
  const R = createRotationMatrix(theta); // Rotaciona
  const S = createScaleMatrix(sx, sy); // Aplica escala
  const T2 = createTranslationMatrix(refX, refY); // Volta para posição original

  const T = createTranslationMatrix(tx, ty); // Translação final

  // Composição das matrizes: T * (T2 * (R * (S * L * T1)))
  let transformMatrix = multiplyMatrices(
    T,
    multiplyMatrices(
      T2,
      multiplyMatrices(R, multiplyMatrices(S, multiplyMatrices(L, T1))),
    ),
  );

  // Aplicar a matriz ao shape
  return applyTransformation(shape, transformMatrix);
};

const applyTransformation = (shape: Shape, matrix: number[][]) => {
  if (shape instanceof Line) {
    shape.start = applyMatrixToPoint(shape.start, matrix);
    shape.end = applyMatrixToPoint(shape.end, matrix);
  } else if (shape instanceof Circle) {
    shape.center = applyMatrixToPoint(shape.center, matrix);
  }
  return shape;
};

const applyMatrixToPoint = (
  point: { x: number; y: number },
  matrix: number[][],
) => {
  const [x, y] = [point.x, point.y];
  return {
    x: matrix[0][0] * x + matrix[0][1] * y + matrix[0][2],
    y: matrix[1][0] * x + matrix[1][1] * y + matrix[1][2],
  };
};
