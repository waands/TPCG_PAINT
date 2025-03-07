import React from "react";
import Canvas from "../components/Canvas"

interface CanvasGridProps {
  showGrid: boolean;
  gridThickness: number;
  pixelSize: number;
}

const CanvasGrid: React.FC<CanvasGridProps> = ({ showGrid, gridThickness, pixelSize }) => {
  const draw = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    const width = canvas.width;
    const height = canvas.height;

    // Limpa o canvas antes de desenhar
    ctx.clearRect(0, 0, width, height);

    if (showGrid) {
      // Desenha a grade de pixels
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
    }

    // Exemplo: Desenha um retângulo vermelho fixo
    
  };

  return <Canvas mode={""} />;
};

export default CanvasGrid;