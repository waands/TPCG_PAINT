import { Circle, Line, Polygon, Shape } from '../components/Shapes';

/**
 * Retorna a bounding box de qualquer Shape, no formato:
 * { xMin: number, yMin: number, xMax: number, yMax: number }
 */
export function getBoundingBox(shape: Shape) {
  if (shape instanceof Line) {
    const { start, end } = shape;
    const xMin = Math.min(start.x, end.x);
    const xMax = Math.max(start.x, end.x);
    const yMin = Math.min(start.y, end.y);
    const yMax = Math.max(start.y, end.y);
    return { xMin, yMin, xMax, yMax };
  }

  if (shape instanceof Circle) {
    const { center, radius } = shape;
    const xMin = center.x - radius;
    const xMax = center.x + radius;
    const yMin = center.y - radius;
    const yMax = center.y + radius;
    return { xMin, yMin, xMax, yMax };
  }

  if (shape.type === 'polygon') {
    // Assumindo que Polygon possui a propriedade vertices: Array<{x, y}>
    const polygon = shape as Polygon;
    let xMin = Infinity,
      xMax = -Infinity,
      yMin = Infinity,
      yMax = -Infinity;
    polygon.vertices.forEach((v: { x: number; y: number }) => {
      if (v.x < xMin) xMin = v.x;
      if (v.x > xMax) xMax = v.x;
      if (v.y < yMin) yMin = v.y;
      if (v.y > yMax) yMax = v.y;
    });
    return { xMin, yMin, xMax, yMax };
  }

  return { xMin: 0, yMin: 0, xMax: 0, yMax: 0 };
}

export function intersectsRect(
  shapeBox: { xMin: number; yMin: number; xMax: number; yMax: number },
  selBox: { xMin: number; yMin: number; xMax: number; yMax: number },
): boolean {
  // Caso não haja sobreposição, retorna falso
  if (
    shapeBox.xMax < selBox.xMin ||
    shapeBox.xMin > selBox.xMax ||
    shapeBox.yMax < selBox.yMin ||
    shapeBox.yMin > selBox.yMax
  ) {
    return false;
  }
  return true; // Intersectou
}

export function isContainedInRect(
  shapeBox: { xMin: number; yMin: number; xMax: number; yMax: number },
  selBox: { xMin: number; yMin: number; xMax: number; yMax: number },
): boolean {
  return (
    shapeBox.xMin >= selBox.xMin &&
    shapeBox.xMax <= selBox.xMax &&
    shapeBox.yMin >= selBox.yMin &&
    shapeBox.yMax <= selBox.yMax
  );
}
