import React, { useRef, useEffect, useState } from "react";

interface CanvasProps {
  mode: string | null;
  showGrid: boolean;
  gridThickness: number;
  pixelSize: number;
  canvasSize: { width: number; height: number; };
}

const Canvas: React.FC<CanvasProps> = ({ mode, showGrid, gridThickness, pixelSize, canvasSize }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [clicks, setClicks] = useState<{ x: number; y: number }[]>([]);

  // Função para destacar a posição do mouse
  const highlightMousePosition = (event: MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
  
    const rect = canvas.getBoundingClientRect();
    const x = Math.floor((event.clientX - rect.left) / pixelSize) * pixelSize;
    const y = Math.floor((event.clientY - rect.top) / pixelSize) * pixelSize;
  
    // Redesenhar a grade
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawGrid(ctx, canvas.width, canvas.height); 
  
    // Desenha o destaque no pixel atual
    ctx.strokeStyle = "grey";
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, pixelSize, pixelSize);
  };

  const drawGrid = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    if (!showGrid) return;
    ctx.strokeStyle = "lightgray";
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
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawGrid(ctx, canvas.width, canvas.height);
    canvas.addEventListener("mousemove", highlightMousePosition);
    return () => {
      canvas.removeEventListener("mousemove", highlightMousePosition);
    };

    // Desenhar formas
    /*
    if (mode === "line" && clicks.length === 2) {
      ctx.strokeStyle = "black";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(clicks[0].x, clicks[0].y);
      ctx.lineTo(clicks[1].x, clicks[1].y);
      ctx.stroke();
      setClicks([]);
    }
    */
    

  }, [highlightMousePosition, clicks, mode, showGrid, gridThickness, pixelSize]);

  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = Math.floor((event.clientX - rect.left) / pixelSize);
    const y = Math.floor((event.clientY - rect.top) / pixelSize);

    setClicks((prev) => {
      const newClicks = [...prev, { x, y }];
      if (newClicks.length === 2) {
        console.log("Ponto 1:", newClicks[0]);
        console.log("Ponto 2:", newClicks[1]);
        // Adicionar a lógica para desenhar a linha entre os pontos
        return [];
      }
      return newClicks;
    });
  };


  // retornar o canvas com o tamanho da tela inteira

  return <canvas ref={canvasRef} width={canvasSize.width} height={canvasSize.height} onClick={handleCanvasClick} style={{ border: "1px solid black", cursor:"crosshair" }} />;
};

export default Canvas;