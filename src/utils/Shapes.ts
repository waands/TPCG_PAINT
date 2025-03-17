import { drawDDA, drawBresenham } from './LineAlg';
import { compositeTransform } from './TransformGeo2D';
import { drawBresenhamCircle } from './CircleAlg';
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
  algorithm: 'Bresenham';
  color: string;
  isSelected: boolean;

  constructor(
    center: { x: number; y: number },
    radius: number,
    algorithm: 'Bresenham',
    color: string,
  ) {
    super('circle');
    this.center = center;
    this.radius = radius;
    this.algorithm = algorithm;
    this.color = color;
    this.isSelected = false;
  }

  draw(ctx: CanvasRenderingContext2D, pixelSize: number) {
    if (this.algorithm === 'Bresenham') {
      drawBresenhamCircle(
        ctx,
        this.center.x,
        this.center.y,
        this.radius,
        pixelSize,
        this.color,
      );
    }

    if (this.isSelected) {
      ctx.fillStyle = '#17B29E';
      /*
      ctx.beginPath();
      ctx.fillRect(
        Math.round(this.center.x) * pixelSize,
        Math.round(this.center.y) * pixelSize,
        pixelSize,
        pixelSize,
      );
      ctx.fill();
      */
      ctx.beginPath();
      ctx.fillRect(
        this.center.x * pixelSize + this.radius * pixelSize,
        this.center.y * pixelSize,
        pixelSize,
        pixelSize,
      );
      ctx.fill();

      ctx.beginPath();
      ctx.fillRect(
        this.center.x * pixelSize,
        this.center.y * pixelSize + this.radius * pixelSize,
        pixelSize,
        pixelSize,
      );
      ctx.fill();

      ctx.beginPath();
      ctx.fillRect(
        this.center.x * pixelSize,
        this.center.y * pixelSize - this.radius * pixelSize,
        pixelSize,
        pixelSize,
      );
      ctx.fill();

      ctx.beginPath();
      ctx.fillRect(
        this.center.x * pixelSize - this.radius * pixelSize,
        this.center.y * pixelSize,
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
      this.center.x = Math.floor(this.center.x);
      this.center.y = Math.floor(this.center.y);
      this.radius = Math.ceil(this.radius);
    } else {
      this.center.x = Math.round(this.center.x);
      this.center.y = Math.round(this.center.y);
      this.radius = Math.round(this.radius);
    }
  }
}

export { Shape, Line, Circle };
