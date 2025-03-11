import { drawDDA } from './LineAlg';
//import { drawBresenham } from "../algorithms/Bresenham";

abstract class Shape {
  type: string;

  constructor(type: string) {
    this.type = type;
  }

  abstract draw(ctx: CanvasRenderingContext2D, pixelSize: number): void;
  abstract translate(tx: number, ty: number): void;
}

// Classe para Linhas
class Line extends Shape {
  start: { x: number; y: number };
  end: { x: number; y: number };
  algorithm: 'DDA' | 'Bresenham'; // Algoritmo escolhido

  constructor(
    start: { x: number; y: number },
    end: { x: number; y: number },
    algorithm: 'DDA' | 'Bresenham' = 'DDA', // Padrão é DDA
  ) {
    super('line');
    this.start = start;
    this.end = end;
    this.algorithm = algorithm;
  }

  draw(ctx: CanvasRenderingContext2D, pixelSize: number) {
    if (this.algorithm === 'DDA') {
      drawDDA(
        ctx,
        this.start.x,
        this.start.y,
        this.end.x,
        this.end.y,
        pixelSize,
      );
    } else {
      //drawBresenham(ctx, this.start.x, this.start.y, this.end.x, this.end.y, pixelSize);
    }
  }

  translate(tx: number, ty: number) {
    this.start.x += tx;
    this.start.y += ty;
    this.end.x += tx;
    this.end.y += ty;
    console.log(this);
  }
}

// Classe para Círculos
class Circle extends Shape {
  center: { x: number; y: number };
  radius: number;

  constructor(center: { x: number; y: number }, radius: number) {
    super('circle');
    this.center = center;
    this.radius = radius;
  }

  draw(ctx: CanvasRenderingContext2D, pixelSize: number) {
    ctx.beginPath();
    ctx.arc(
      this.center.x * pixelSize,
      this.center.y * pixelSize,
      this.radius * pixelSize,
      0,
      Math.PI * 2,
    );
    ctx.stroke();
  }

  translate(tx: number, ty: number) {
    this.center.x += tx;
    this.center.y += ty;
  }
}

export { Shape, Line, Circle };
