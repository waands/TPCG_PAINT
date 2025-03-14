import { drawDDA, drawBresenham } from './LineAlg';
import { compositeTransform } from './TransformGeo2D';
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
    eixo: number,
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
        Math.round(this.start.x),
        Math.round(this.start.y),
        Math.round(this.end.x),
        Math.round(this.end.y),
        pixelSize,
        this.color,
      );
    } else if (this.algorithm === 'Bresenham') {
      drawBresenham(
        ctx,
        this.start.x,
        this.start.y,
        this.end.x,
        this.end.y,
        pixelSize,
        this.color,
      );
    }

    if (this.isSelected) {
      ctx.fillStyle = '#17B29E';
      ctx.beginPath();
      ctx.fillRect(
        Math.round(this.start.x) * pixelSize,
        Math.round(this.start.y) * pixelSize,
        pixelSize,
        pixelSize,
      );
      ctx.fill();

      ctx.beginPath();
      ctx.fillRect(
        Math.round(this.end.x) * pixelSize,
        Math.round(this.end.y) * pixelSize,
        pixelSize,
        pixelSize,
      );
      ctx.fill();
    }
  }

  translate(
    tx: number,
    ty: number,
    sx: number,
    sy: number,
    theta: number,
    eixo: number,
  ) {
    compositeTransform(this, tx, ty, sx, sy, theta, eixo);
    if (sx != 0 || sy != 0) {
      this.start.x = Math.floor(this.start.x);
      this.start.y = Math.floor(this.start.y);
      this.end.x = Math.ceil(this.end.x);
      this.end.y = Math.ceil(this.end.y);
    } else {
      this.start.x = Math.round(this.start.x);
      this.start.y = Math.round(this.start.y);
      this.end.x = Math.round(this.end.x);
      this.end.y = Math.round(this.end.y);
    }
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
