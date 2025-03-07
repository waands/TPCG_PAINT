import React, { useRef, useEffect, useState } from 'react';
import { drawDDA } from './Line';

interface CanvasProps {
  mode: string | null;
  showGrid: boolean;
  gridThickness: number;
  pixelSize: number;
  canvasSize: { width: number; height: number };
  drawnPixels: { x: number; y: number; type:string }[];
  setDrawnPixels: React.Dispatch<
    React.SetStateAction<{ x: number; y: number; type: string }[]>
  >;
}

export const colorPixel = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  pixelSize: number,
) => {
  ctx.fillStyle = 'black';
  ctx.fillRect(x*pixelSize, y*pixelSize, pixelSize, pixelSize);
  
  console.log(`Pintando pixel em (${x}, ${y})`);
};

const Canvas: React.FC<CanvasProps> = ({
  mode,
  showGrid,
  gridThickness,
  pixelSize,
  canvasSize,
  drawnPixels,
  setDrawnPixels,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [clicks, setClicks] = useState<{ x: number; y: number }[]>([]);

  // Função para destacar a posição do mouse
  const highlightMousePosition = (event: MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
  
    const rect = canvas.getBoundingClientRect();
    const x = Math.floor((event.clientX - rect.left) / pixelSize);
    const y = Math.floor((event.clientY - rect.top) / pixelSize);
  
    // Redesenha o canvas SEM apagar os pixels desenhados
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawGrid(ctx, canvas.width, canvas.height);
    
    // Redesenha todos os pixels armazenados
    drawnPixels.forEach(({ x, y }) => {
      colorPixel(ctx, x, y, pixelSize);
    });
  
    // Desenha o destaque no pixel atual
    ctx.strokeStyle = 'grey';
    ctx.lineWidth = 2;
    ctx.strokeRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);
  };
  
  

  const drawGrid = (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
  ) => {
    if (!showGrid) return;
    ctx.strokeStyle = 'lightgray';
    ctx.lineWidth = gridThickness;
    for (let x = 0; x <= width; x += pixelSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y <= height; y += pixelSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
  
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Limpar o canvas
    drawGrid(ctx, canvas.width, canvas.height); // Redesenhar a grade
  
    // Redesenhar todos os pixels armazenados
    drawnPixels.forEach(({ x, y }) => {
      colorPixel(ctx, x, y, pixelSize);
    });
  
    // Adicionar o evento de mousemove para destacar o pixel do mouse
    canvas.addEventListener('mousemove', highlightMousePosition);
  
    return () => {
      canvas.removeEventListener('mousemove', highlightMousePosition);
    };
  }, [drawnPixels, showGrid, gridThickness, pixelSize]); 

  

  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = Math.floor((event.clientX - rect.left) / pixelSize);
    const y = Math.floor((event.clientY - rect.top) / pixelSize);

    setClicks((prev) => {
      const newClicks = [...prev, { x, y }];
      if (newClicks.length === 2) {
        console.log('Ponto 1:', newClicks[0]);
        console.log('Ponto 2:', newClicks[1]);
        // Adicionar a lógica para desenhar a linha entre os pontos
        // Desenhar formas
        if (mode === 'line' && newClicks.length === 2) {
          drawDDA(
            canvasRef.current?.getContext('2d') as CanvasRenderingContext2D,
            newClicks[0].x,
            newClicks[0].y,
            newClicks[1].x,
            newClicks[1].y,
            pixelSize,
            setDrawnPixels,
          );
        }

        return [];
      }
      return newClicks;
    });
  };

  // retornar o canvas com o tamanho da tela inteira

  return (
    <canvas
      ref={canvasRef}
      width={canvasSize.width}
      height={canvasSize.height}
      onClick={handleCanvasClick}
      style={{ border: '1px solid black', cursor: 'crosshair' }}
    />
  );
};

export default Canvas;
