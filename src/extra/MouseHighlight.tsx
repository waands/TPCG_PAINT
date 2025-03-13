import React, { useRef, useEffect } from 'react';

interface CanvasGridProps {
  pixelSize: number;
  canvasSize: { width: number; height: number };
  mousePos: { x: number; y: number };
}

const CanvasGrid: React.FC<CanvasGridProps> = ({ pixelSize, canvasSize, mousePos }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const drawOutline = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const gridX = mousePos.x * pixelSize;
      const gridY = mousePos.y * pixelSize;

      ctx.strokeStyle = 'rgb(148, 148, 148)'; // Cor do outline (LightGray)
      ctx.lineWidth = 2; // Espessura da borda
      ctx.strokeRect(gridX, gridY, pixelSize, pixelSize); // Desenha apenas a borda
    };

    requestAnimationFrame(drawOutline); // Atualiza de forma fluida
  }, [mousePos, pixelSize]); // Atualiza sempre que o mouse se move

  return (
    <canvas
      ref={canvasRef}
      width={canvasSize.width}
      height={canvasSize.height}
      style={{
        position: 'absolute', // Sobrepor o Canvas principal
        pointerEvents: 'none', // Permite interações no Canvas abaixo
      }}
    />
  );
};

export default CanvasGrid;
