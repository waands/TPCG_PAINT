import React, { useRef, useEffect, useState, Dispatch, SetStateAction } from 'react';
import { drawDDA } from '../utils/LineAlg';
import { translacao } from '../utils/TransformGeo2D';
import { Shape, Line } from '../utils/Shapes';

interface CanvasProps {
  mode: string | null;
  showGrid: boolean;
  gridThickness: number;
  pixelSize: number;
  canvasSize: { width: number; height: number };
  drawnShapes: Shape[];
  setDrawnShapes: Dispatch<SetStateAction<Shape[]>>;
  selectedAlgorithm: "DDA" | "Bresenham";
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
  selectedAlgorithm,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [clicks, setClicks] = useState<{ x: number; y: number }[]>([]);
  const lastHighlightedRef = useRef<{ x: number; y: number } | null>(null);
  const [selectedShape, setSelectedShape] = useState<Shape | null>(null);

  // Função para destacar a posição do mouse
/*
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
*/
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
  
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawGrid(ctx, canvas.width, canvas.height);
  
    drawnShapes.forEach((shape) => shape.draw(ctx, pixelSize));

    // Adicionar o evento de mousemove para destacar o pixel do mouse
    //canvas.addEventListener('mousemove', highlightMousePosition);
  }, [canvasSize, drawnShapes, showGrid, gridThickness, pixelSize]);


  const applyTranslation = (tx: number, ty: number) => {
    if (!selectedShape) return;
  
    setDrawnShapes((prevShapes) =>
      prevShapes.map((shape) => {
        if (shape === selectedShape) {
          shape.translate(tx, ty);
        }
        return shape;
      })
    );
  };
  
  
  

  const getClickedShape = (x: number, y: number): Shape | undefined => {
    console.log("🔍 Buscando forma no ponto:", x, y);
  
    return drawnShapes.find((shape) => {
      console.log("Shape:", shape);
      console.log("É instância de Line?", shape instanceof Line);
  
      if (shape instanceof Line) {
        console.log("🎯 Verificando linha:", shape);
  
        // Extrai os pontos da linha
        const { start, end } = shape;
  
        // Calcula a distância do ponto (x, y) até a linha
        const distanceToLine = (px: number, py: number, x1: number, y1: number, x2: number, y2: number) => {
          const A = x2 - x1;
          const B = y2 - y1;
          const C = x1 - px;
          const D = y1 - py;
  
          const numerator = Math.abs(A * D - C * B);
          const denominator = Math.sqrt(A * A + B * B);
          if (denominator === 0) return Infinity; // Linha degenerada em um ponto
  
          const distance = numerator / denominator;
  
          // Verifica se o ponto projetado está dentro dos limites da linha
          const dot = (px - x1) * (x2 - x1) + (py - y1) * (y2 - y1);
          const lenSq = (x2 - x1) ** 2 + (y2 - y1) ** 2;
          if (dot < 0 || dot > lenSq) return Infinity; // Fora dos limites da linha
  
          return distance;
        };
  
        const dist = distanceToLine(x, y, start.x, start.y, end.x, end.y);
        console.log("📏 Distância até a linha:", dist);
  
        return dist < pixelSize ? shape : undefined; // Retorna a linha se estiver próxima
      }
      
      return undefined;
    });
  };
  
  

const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
  const rect = canvasRef.current?.getBoundingClientRect();
  if (!rect) return;
  const x = Math.floor((event.clientX - rect.left) / pixelSize);
  const y = Math.floor((event.clientY - rect.top) / pixelSize);

  if (mode != "transform"){
  setClicks((prev) => {
    const newClicks = [...prev, { x, y }];
    if (newClicks.length === 2) {
      console.log("Ponto 1:", newClicks[0], "Ponto 2:", newClicks[1]);

      if (mode === "line") {
        const newLine = new Line(newClicks[0], newClicks[1], selectedAlgorithm);
        setDrawnShapes((prevShapes) =>
          prevShapes.map((shape) =>
            Object.assign(Object.create(Object.getPrototypeOf(shape)), shape)
          ).concat(newLine)      
        );
        console.log("Linhas desenhadas: ", drawnShapes);
      }

      return [];
    }
    return newClicks;
  });
  } else if (mode === "transform") {
    // Verificar se clicou em alguma forma
    const clickedShape = getClickedShape(x, y);
    //console.log("Clique na linhaaa: ", clickedShape);
    if (clickedShape) {
      console.log("Clique na linha: ", clickedShape);
      setSelectedShape(clickedShape);
      applyTranslation(1, 1);
    }
  } 
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
