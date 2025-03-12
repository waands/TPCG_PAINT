import { drawDDA } from './LineAlg';
import { translacao, compositeTransform } from './TransformGeo2D';
//import { drawBresenham } from "../algorithms/Bresenham";

abstract class Shape {
  type: string;
  isSelected: boolean;

  constructor(type: string) {
    this.type = type;
    this.isSelected = false;
  }

  abstract draw(ctx: CanvasRenderingContext2D, pixelSize: number): void;
  abstract translate(
    tx: number,
    ty: number,
    sx: number,
    sy: number,
    theta: number,
  ): void;

  select() {
    this.isSelected = true;
  }

  deselect() {
    this.isSelected = false;
  }
}

// Classe para Linhas
class Line extends Shape {
  start: { x: number; y: number };
  end: { x: number; y: number };
  algorithm: 'DDA' | 'Bresenham'; // Algoritmo escolhido
  color: string;
  isSelected: boolean;

  constructor(
    start: { x: number; y: number },
    end: { x: number; y: number },
    algorithm: 'DDA' | 'Bresenham' = 'DDA', // Padrão é DDA
    color: string,
  ) {
    super('line');
    this.start = start;
    this.end = end;
    this.algorithm = algorithm;
    this.color = color;
    this.isSelected = false;
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
        this.color,
      );
    } else {
      //drawBresenham(ctx, this.start.x, this.start.y, this.end.x, this.end.y, pixelSize);
    }

    if (this.isSelected) {
      /*
      if (this.color === '#000000' || this.color === '#FFFFFF') {
        ctx.fillStyle = 'red';
      } else {
        ctx.fillStyle = `#${this.color.slice(1).split('').reverse().join('')}`;
      }
      */
      ctx.fillStyle = '#17B29E';
      ctx.beginPath();
      ctx.fillRect(
        this.start.x * pixelSize,
        this.start.y * pixelSize,
        pixelSize,
        pixelSize,
      );
      ctx.fill();

      ctx.beginPath();
      ctx.fillRect(
        this.end.x * pixelSize,
        this.end.y * pixelSize,
        pixelSize,
        pixelSize,
      );
      ctx.fill();
    }
  }

  translate(tx: number, ty: number, sx: number, sy: number, theta: number) {
    compositeTransform(this, tx, ty, sx, sy, theta);
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
