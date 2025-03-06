import React, { useRef, useEffect, useState } from "react";

interface CanvasProps {
  draw: (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => void;
}

const Canvas: React.FC<CanvasProps> = ({ draw }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [points, setPoints] = useState<{ x: number; y: number }[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    draw(ctx, canvas);

  }, [draw]);

  // Função que gerencia os cliques e os pontos
  const handleClick = (e: React.MouseEvent) => {
    const { clientX, clientY } = e;
    setPoints((prevPoints) => {
      if (prevPoints.length === 0) {
        return [{ x: clientX, y: clientY }];
      } else if (prevPoints.length === 1) {
        return [...prevPoints, { x: clientX, y: clientY }];
      }
      return prevPoints;
    });
  };

  return (
    <canvas
      ref={canvasRef}
      width={500}
      height={500}
      style={{ border: "1px solid gray" }}
      onClick={handleClick} // Lida com os cliques no canvas
    />
  );
};

export default Canvas;
