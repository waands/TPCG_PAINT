export const translacao = (
  shape: { type: string; pixels: { x: number; y: number }[] },
  tx: number,
  ty: number,
) => {
  return {
    ...shape,
    pixels: shape.pixels.map((p) => ({
      x: p.x + tx,
      y: p.y + ty,
    })),
  };
};
