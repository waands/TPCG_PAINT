// GridCanvas.tsx
import React, { useRef, useEffect } from 'react';

interface GridCanvasProps {
  pixelSize: number;
  canvasSize: { width: number; height: number };
  gridThickness: number;
  showGrid: boolean;
  clickedHighlight: { x: number; y: number } | undefined;
  transformRectPoints: { x: number; y: number }[];
  transformType: string | null;
}

const GridCanvas: React.FC<GridCanvasProps> = ({
  pixelSize,
  canvasSize,
  gridThickness,
  showGrid,
  clickedHighlight,
  transformRectPoints,
  transformType,
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


    // Se estiver selecionando, e tiver dois pontos, desenhe o retângulo de seleção
    if (transformRectPoints.length === 2) {
      const [p1, p2] = transformRectPoints;
      const selBox = {
        xMin: Math.min(p1.x, p2.x),
        yMin: Math.min(p1.y, p2.y),
        xMax: Math.max(p1.x, p2.x),
        yMax: Math.max(p1.y, p2.y),
      };

      ctx.strokeStyle = 'blue';
      //ctx.setLineDash([5, 5]);
      ctx.lineWidth = 1;
      ctx.strokeRect(
        selBox.xMin * pixelSize,
        selBox.yMin * pixelSize,
        (selBox.xMax - selBox.xMin) * pixelSize,
        (selBox.yMax - selBox.yMin) * pixelSize,
      );

      // Se quiser preencher com uma cor semi-transparente:
      ctx.fillStyle = 'rgba(0, 0, 255, 0.2)';
      ctx.fillRect(
        selBox.xMin * pixelSize,
        selBox.yMin * pixelSize,
        (selBox.xMax - selBox.xMin) * pixelSize,
        (selBox.yMax - selBox.yMin) * pixelSize,
      );
    }
  }, [pixelSize, canvasSize, gridThickness, showGrid, clickedHighlight, transformRectPoints, transformType]);

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
