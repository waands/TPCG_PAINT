import React, { useRef, useEffect, useState } from 'react';
import { drawDDA } from '../utils/Line';
import { translacao } from '../utils/TransformGeo2D';

interface CanvasProps {
  mode: string | null;
  showGrid: boolean;
  gridThickness: number;
  pixelSize: number;
  canvasSize: { width: number; height: number };
  drawnShapes: { type: string; pixels: { x: number; y: number }[] }[];
  setDrawnShapes: React.Dispatch<
    React.SetStateAction<{ type: string; pixels: { x: number; y: number }[] }[]>
  >;
}

export const colorPixel = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  pixelSize: number,
) => {
  ctx.fillStyle = 'black';
  ctx.fillRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);

  console.log(`Pintando pixel em (${x}, ${y})`);
};

const Canvas: React.FC<CanvasProps> = ({
  mode,
  showGrid,
  gridThickness,
  pixelSize,
  canvasSize,
  drawnShapes,
  setDrawnShapes,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [clicks, setClicks] = useState<{ x: number; y: number }[]>([]);
  const lastHighlightedRef = useRef<{ x: number; y: number } | null>(null);
  const [selectedShape, setSelectedShape] = useState<{ type: string; pixels: { x: number; y: number }[] } | null>(null);

  // Função para destacar a posição do mouse
  const highlightMousePosition = (event: MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = Math.floor((event.clientX - rect.left) / pixelSize);
    const y = Math.floor((event.clientY - rect.top) / pixelSize);

    // Clear previous highlight if exists
    if (lastHighlightedRef.current) {
      const { x: lastX, y: lastY } = lastHighlightedRef.current;

      // Fill with white background first
      ctx.fillStyle = 'white';
      ctx.fillRect(lastX * pixelSize, lastY * pixelSize, pixelSize, pixelSize);

      // Redraw grid for this cell if needed
      if (showGrid) {
        ctx.strokeStyle = 'lightgray';
        ctx.lineWidth = gridThickness;
        ctx.strokeRect(
          lastX * pixelSize,
          lastY * pixelSize,
          pixelSize,
          pixelSize,
        );
      }

      // Verifica se o pixel foi desenhado antes
      const wasDrawn = drawnShapes.some((shape) =>
        shape.pixels.some((p) => p.x === lastX && p.y === lastY)
      );

      if (wasDrawn) {
        colorPixel(ctx, lastX, lastY, pixelSize);
      }

    }

    // Draw new highlight
    ctx.strokeStyle = 'grey';
    ctx.lineWidth = 2;
    ctx.strokeRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);

    // Update last highlighted position
    lastHighlightedRef.current = { x, y };
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

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height); // Limpar o canvas
      drawGrid(ctx, canvas.width, canvas.height); // Redesenhar a grade

      // Redesenhar todos os pixels armazenados
      drawnShapes.forEach(({ pixels }) => {
        pixels.forEach(({ x, y }) => {
          colorPixel(ctx, x, y, pixelSize);
        });
      });
      
    };

    requestAnimationFrame(draw);

    // Adicionar o evento de mousemove para destacar o pixel do mouse
    //canvas.addEventListener('mousemove', highlightMousePosition);

    return () => {
      //canvas.removeEventListener('mousemove', highlightMousePosition);
    };
  }, [canvasSize, drawnShapes, showGrid, gridThickness, pixelSize]);


  const applyTranslation = (tx: number, ty: number) => {
    if (!selectedShape) return;
  
    setDrawnShapes((prevShapes) =>
      prevShapes.map((shape) =>
        shape === selectedShape ? translacao(shape, tx, ty) : shape
      )
    );
  };
  

const getClickedShape = (x: number, y: number) => {
  return drawnShapes.find((shape) =>
    shape.pixels.some((p) => Math.abs(p.x - x) < pixelSize && Math.abs(p.y - y) < pixelSize)
  );
};

const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
  const rect = canvasRef.current?.getBoundingClientRect();
  if (!rect) return;
  const x = Math.floor((event.clientX - rect.left) / pixelSize);
  const y = Math.floor((event.clientY - rect.top) / pixelSize);

  // Verifica se o usuário clicou em uma forma já desenhada
  const clickedShape = getClickedShape(x, y);

  if (clickedShape) {
    setSelectedShape(clickedShape);
    console.log("Forma selecionada:", clickedShape);
    applyTranslation(10, 10);
    return; // Evita que o clique crie uma nova forma
  }

  // Se não clicou em nenhuma forma, verifica se é para desenhar uma nova
  setClicks((prev) => {
    const newClicks = [...prev, { x, y }];
    if (newClicks.length === 2) {
      console.log('Ponto 1:', newClicks[0]);
      console.log('Ponto 2:', newClicks[1]);

      if (mode === 'line') {
        drawDDA(
          canvasRef.current?.getContext('2d') as CanvasRenderingContext2D,
          newClicks[0].x,
          newClicks[0].y,
          newClicks[1].x,
          newClicks[1].y,
          pixelSize,
          setDrawnShapes
        );
      }

      return []; // Reseta os cliques após desenhar a linha
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
