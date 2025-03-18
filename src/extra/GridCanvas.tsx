// GridCanvas.tsx
import React, { useRef, useEffect } from 'react';

interface GridCanvasProps {
  pixelSize: number;
  canvasSize: { width: number; height: number };
  gridThickness: number;
  showGrid: boolean;
  clickedHighlight: { x: number; y: number } | undefined;
}

const GridCanvas: React.FC<GridCanvasProps> = ({
  pixelSize,
  canvasSize,
  gridThickness,
  showGrid,
  clickedHighlight,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Limpa o canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (!showGrid) return;

    ctx.strokeStyle = 'lightgray';
    ctx.lineWidth = gridThickness;

    // Desenha as linhas verticais
    for (let x = 0; x <= canvas.width; x += pixelSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }

    // Desenha as linhas horizontais
    for (let y = 0; y <= canvas.height; y += pixelSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }
    if (clickedHighlight !== undefined) {
        const gridX = clickedHighlight.x * pixelSize;
        const gridY = clickedHighlight.y * pixelSize;
    
        ctx.strokeStyle = 'red'; 
        ctx.lineWidth = gridThickness; 
        ctx.strokeRect(gridX, gridY, pixelSize, pixelSize); // Desenha apenas a borda
    }
  }, [pixelSize, canvasSize, gridThickness, showGrid, clickedHighlight]);

  return (
    <canvas
      ref={canvasRef}
      width={canvasSize.width}
      height={canvasSize.height}
      style={{
        position: 'absolute',
        top: 1,
        marginLeft: '1px',
        zIndex: 1,
        pointerEvents: 'none',
      }}
    />
  );
};

export default GridCanvas;
