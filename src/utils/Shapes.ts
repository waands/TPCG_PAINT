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

class Polygon extends Shape {
  vertices: { x: number; y: number }[];
  lines: Line[];
  algorithm: 'DDA' | 'Bresenham';
  color: string;
  isSelected: boolean;

  constructor(
    vertices: { x: number; y: number }[],
    algorithm: 'DDA' | 'Bresenham',
    color: string,
  ) {
    super('polygon');
    this.vertices = vertices;
    this.algorithm = algorithm;
    this.color = color;
    this.isSelected = false;
    this.lines = [];
    this.buildLines();
  }

  // Gera as linhas do polígono conectando cada vértice ao próximo e fechando o polígono
  private buildLines() {
    this.lines = [];
    if (this.vertices.length < 2) return;
    for (let i = 0; i < this.vertices.length; i++) {
      const start = this.vertices[i];
      const end = this.vertices[(i + 1) % this.vertices.length]; // Conecta o último com o primeiro
      // Cria uma nova linha a partir dos vértices (usando cópias para evitar referência)
      const line = new Line(
        { x: start.x, y: start.y },
        { x: end.x, y: end.y },
        this.algorithm,
        this.color,
      );
      this.lines.push(line);
    }
  }

  // Desenha cada linha do polígono utilizando os algoritmos já implementados
  draw(ctx: CanvasRenderingContext2D, pixelSize: number): void {
    for (const line of this.lines) {
      line.draw(ctx, pixelSize);
    }

    // Se estiver selecionado, desenha marcadores em cada vértice
    if (this.isSelected) {
      ctx.fillStyle = '#17B29E';
      for (const v of this.vertices) {
        ctx.beginPath();
        ctx.fillRect(
          Math.round(v.x) * pixelSize - pixelSize / 2,
          Math.round(v.y) * pixelSize - pixelSize / 2,
          pixelSize,
          pixelSize,
        );
        ctx.fill();
      }
    }
  }

  translate(): void {}
}
export { Shape, Line, Circle, Polygon };
