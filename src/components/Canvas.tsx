import React, {
  useRef,
  useEffect,
  useState,
  Dispatch,
  SetStateAction,
} from 'react';
import { Shape, Line, Circle, Polygon } from '../utils/Shapes';
import { Clipper } from '../utils/Clipping';

interface CanvasProps {
  mode: string | null;
  showGrid: boolean;
  setShowGrid: Dispatch<SetStateAction<boolean>>;
  gridThickness: number;
  pixelSize: number;
  canvasSize: { width: number; height: number };
  drawnShapes: Shape[];
  setDrawnShapes: Dispatch<SetStateAction<Shape[]>>;
  selectedAlgorithmLine: 'DDA' | 'Bresenham';
  selectedColor: string;
  setSelectedShape: Dispatch<SetStateAction<Shape | null>>;
  selectedShape: Shape | null;
  setMousePos: Dispatch<SetStateAction<{ x: number; y: number }>>;
  reRender: boolean;
  setReRender: Dispatch<SetStateAction<boolean>>;
  newClicks: { x: number; y: number }[];
  setNewClicks: Dispatch<SetStateAction<{ x: number; y: number }[]>>;
  setClickedHighlight: Dispatch<
    SetStateAction<{ x: number; y: number } | undefined>
  >;
  setDrawnClipper: Dispatch<SetStateAction<Clipper[]>>;
  drawnClipper: Clipper[];
  selectedAlgorithmClipping: 'CoSu' | 'LiBa';
  setClippedShapes: Dispatch<SetStateAction<Shape[]>>;
  clippedShapes: Shape[];
  //setDrawn: Dispatch<SetStateAction<boolean>>;
}

export const colorPixel = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  pixelSize: number,
  selectedColor: string,
) => {
  ctx.fillStyle = selectedColor;
  ctx.fillRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);

  //console.log(`Pintando pixel em (${x}, ${y})`);
};

const Canvas: React.FC<CanvasProps> = ({
  mode,
  showGrid,
  setShowGrid,
  gridThickness,
  pixelSize,
  canvasSize,
  drawnShapes,
  setDrawnShapes,
  selectedAlgorithmLine,
  selectedColor,
  setSelectedShape,
  selectedShape,
  setMousePos,
  reRender,
  setReRender,
  newClicks,
  setNewClicks,
  setClickedHighlight,
  setDrawnClipper,
  drawnClipper,
  selectedAlgorithmClipping,
  setClippedShapes,
  clippedShapes,
  //setDrawn,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [prevSelectedShape, setPrevSelectedShape] = useState<Shape | null>(
    null,
  );
  const [clicks, setClicks] = useState<{ x: number; y: number }[]>([]);
  const [polygonVertices, setPolygonVertices] = useState<
    { x: number; y: number }[]
  >([]);

  // Função para destacar a posição do mouse

  const highlightMousePosition = (event: MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = Math.floor((event.clientX - rect.left) / pixelSize);
    const y = Math.floor((event.clientY - rect.top) / pixelSize);

    setMousePos({ x, y }); // Atualiza a posição do mouse no estado
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (clippedShapes.length <= 0) {
      drawnShapes.forEach((shape) => shape.draw(ctx, pixelSize));
    } else {
      clippedShapes.forEach((shape) => shape.draw(ctx, pixelSize));
    }
    drawnClipper.forEach((clipper) => {
      clipper.drawRegion(ctx, pixelSize);
    });
    // Adicionar o evento de mousemove para destacar o pixel do mouse
    canvas.addEventListener('mousemove', highlightMousePosition);
    return () =>
      canvas.removeEventListener('mousemove', highlightMousePosition);
  }, [canvasSize, gridThickness, pixelSize, reRender, drawnClipper]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (mode != 'transform') {
      prevSelectedShape?.deselect();
    }
    console.log('🎨 Redesenhando canvas');
    console.log(clippedShapes);
    if (clippedShapes.length <= 0) {
      if (selectedShape) {
        //console.log("prevSelected: ", prevSelectedShape);
        if (mode != 'transform') {
          prevSelectedShape?.deselect();
        }
        if (prevSelectedShape != null) {
          drawnShapes.map((shape) => {
            if (shape === prevSelectedShape) {
              shape.draw(ctx, pixelSize);
            }
            return shape;
          });
          setPrevSelectedShape(null);
        }
        drawnShapes.map((shape) => {
          if (shape === selectedShape) {
            shape.draw(ctx, pixelSize);
          }
          return shape;
        });
      } else if (drawnShapes.length > 0) {
        const lastShape = drawnShapes[drawnShapes.length - 1];
        lastShape.draw(ctx, pixelSize);
      }
    }
  }, [drawnShapes, selectedShape, mode]);

  const getClickedShape = (x: number, y: number): Shape | undefined => {
    console.log('🔍 Buscando forma no ponto:', x, y);

    // Passo 1: Filtrar formas cujo bounding box contém o ponto
    const possibleShapes = drawnShapes.filter((shape) => {
      if (shape instanceof Line) {
        const { start, end } = shape;
        const xMin = Math.min(start.x, end.x) - pixelSize;
        const xMax = Math.max(start.x, end.x) + pixelSize;
        const yMin = Math.min(start.y, end.y) - pixelSize;
        const yMax = Math.max(start.y, end.y) + pixelSize;
        return x >= xMin && x <= xMax && y >= yMin && y <= yMax;
      } else if (shape instanceof Circle) {
        // Supondo que a classe Circle possua { center: {x, y}, radius }
        const { center, radius } = shape;
        const xMin = center.x - radius - pixelSize;
        const xMax = center.x + radius + pixelSize;
        const yMin = center.y - radius - pixelSize;
        const yMax = center.y + radius + pixelSize;
        return x >= xMin && x <= xMax && y >= yMin && y <= yMax;
      }
      return false;
    });

    console.log(`🎯 ${possibleShapes.length} formas possíveis`);

    // Passo 2: Refinar com a distância real
    let closestShape: Shape | undefined = undefined;
    let minDistance = Infinity;

    possibleShapes.forEach((shape) => {
      if (shape instanceof Line) {
        const { start, end } = shape;
        // Função para calcular a distância do ponto à linha
        const distanceToLine = (
          px: number,
          py: number,
          x1: number,
          y1: number,
          x2: number,
          y2: number,
        ) => {
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
          if (dot < 0 || dot > lenSq) return Infinity;
          return distance;
        };

        const dist = distanceToLine(x, y, start.x, start.y, end.x, end.y);
        console.log(`📏 Distância até linha ${shape}: ${dist}`);

        //ajuda para selecionar
        let folgaSelection;
        if (pixelSize >= 10) {
          folgaSelection = 2;
        } else if (pixelSize >= 5) {
          folgaSelection = 5;
        } else {
          folgaSelection = 30;
        }

        if (dist < pixelSize * folgaSelection && dist < minDistance) {
          minDistance = dist;
          closestShape = shape;
        }
      } else if (shape instanceof Circle) {
        // Supondo que a classe Circle possua propriedades center e radius
        const { center, radius } = shape;
        const dx = x - center.x;
        const dy = y - center.y;
        // Distância do clique ao centro
        const distanceFromCenter = Math.sqrt(dx * dx + dy * dy);
        // Diferença entre a distância do clique e o raio
        const distanceToCircumference = Math.abs(distanceFromCenter - radius);
        console.log(
          `📏 Distância até círculo ${shape}: ${distanceToCircumference}`,
        );

        if (
          distanceToCircumference < pixelSize &&
          distanceToCircumference < minDistance
        ) {
          minDistance = distanceToCircumference;
          closestShape = shape;
        }
      }
    });

    console.log('✅ Forma mais próxima encontrada:', closestShape);
    return closestShape;
  };

  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
  
    const x = Math.floor((event.clientX - rect.left) / pixelSize);
    const y = Math.floor((event.clientY - rect.top) / pixelSize);
    const newPoint = { x, y };
  
    if (mode !== 'transform' && mode) {
      setClickedHighlight(newPoint);
    }
  
    if (mode !== 'transform') {
      // Se o modo for POLYGON, trata separadamente
      if (mode === 'polygon') {
        const tolerance = 1; // ajuste conforme necessário
  
        setPolygonVertices((prevVertices) => {
          // Se já há vértices, verifica se o clique fecha o polígono
          if (prevVertices.length > 0) {
            const first = prevVertices[0];
            // Se houver pelo menos 3 vértices e o novo clique estiver próximo do primeiro, fecha o polígono
            if (
              prevVertices.length >= 3 &&
              Math.abs(newPoint.x - first.x) <= tolerance &&
              Math.abs(newPoint.y - first.y) <= tolerance
            ) {
              // Desenha a reta de fechamento (do último vértice ao primeiro)
              const closingLine = new Line(
                prevVertices[prevVertices.length - 1],
                first,
                selectedAlgorithmLine,
                selectedColor,
              );
              setDrawnShapes((prevShapes) => [...prevShapes, closingLine]);
  
              // Cria o objeto Polygon com os vértices acumulados
              const newPolygon = new Polygon(prevVertices, selectedAlgorithmLine, selectedColor);
              // Se preferir, você pode optar por remover as linhas individuais e exibir apenas o polígono
              setDrawnShapes((prevShapes) => [...prevShapes, newPolygon]);
  
              setClickedHighlight(undefined);
              return []; // Limpa os vértices para iniciar um novo polígono
            } else {
              // Se não estiver fechando, desenha a reta do último vértice para o novo ponto
              const lastPoint = prevVertices[prevVertices.length - 1];
              const newLine = new Line(
                { ...lastPoint },
                { ...newPoint },
                selectedAlgorithmLine,
                selectedColor,
              );
              setDrawnShapes((prevShapes) => [...prevShapes, newLine]);
              return [...prevVertices, newPoint];
            }
          } else {
            // Se for o primeiro clique, apenas adiciona o vértice
            return [newPoint];
          }
        });
      } else {
        // Lógica para os outros modos (line, circle, clipping) que dependem de dois cliques
        setClicks((prev) => {
          const newClicks = [...prev, newPoint];
          setNewClicks(newClicks);
          if (newClicks.length === 2) {
            console.log('Ponto 1:', newClicks[0], 'Ponto 2:', newClicks[1]);
            console.log('🔴 Modo:', mode);
  
            setClickedHighlight(undefined);
            setMousePos({ x: -1, y: -1 });
  
            if (mode === 'line') {
              setSelectedShape(null);
              const newLine = new Line(
                newClicks[0],
                newClicks[1],
                selectedAlgorithmLine,
                selectedColor,
              );
  
              setDrawnShapes((prevShapes) => {
                const alreadyExists = prevShapes.some(
                  (shape) =>
                    shape instanceof Line &&
                    ((shape.start.x === newLine.start.x &&
                      shape.start.y === newLine.start.y &&
                      shape.end.x === newLine.end.x &&
                      shape.end.y === newLine.end.y) ||
                      (shape.start.x === newLine.end.x &&
                        shape.start.y === newLine.end.y &&
                        shape.end.x === newLine.start.x &&
                        shape.end.y === newLine.start.y)),
                );
                if (alreadyExists) {
                  return prevShapes;
                }
                return [...prevShapes, newLine];
              });
            } else if (mode === 'circle') {
              setSelectedShape(null);
              const newCircle = new Circle(
                newClicks[0],
                Math.round(
                  Math.sqrt(
                    Math.pow(newClicks[1].x - newClicks[0].x, 2) +
                      Math.pow(newClicks[1].y - newClicks[0].y, 2),
                  ),
                ),
                'Bresenham',
                selectedColor,
              );
              setDrawnShapes((prevShapes) => {
                const alreadyExists = prevShapes.some(
                  (shape) =>
                    shape instanceof Circle &&
                    shape.center.x === newCircle.center.x &&
                    shape.center.y === newCircle.center.y &&
                    shape.radius === newCircle.radius,
                );
                if (alreadyExists) {
                  return prevShapes;
                }
                return [...prevShapes, newCircle];
              });
            } else if (mode === 'clipping') {
              const newClipper = new Clipper(selectedAlgorithmClipping);
              newClipper.setRegion(newClicks[0], newClicks[1]);
              newClipper.drawRegion(
                canvasRef.current?.getContext('2d')!,
                pixelSize,
              );
  
              setDrawnClipper((prevClipper) => {
                const alreadyExists = prevClipper.some(
                  (clipper) =>
                    clipper.getRegion().xMin === newClipper.getRegion().xMin &&
                    clipper.getRegion().yMin === newClipper.getRegion().yMin &&
                    clipper.getRegion().xMax === newClipper.getRegion().xMax &&
                    clipper.getRegion().yMax === newClipper.getRegion().yMax,
                );
                if (alreadyExists) {
                  return prevClipper;
                }
  
                return [...prevClipper, newClipper];
              });
              // Itera por todas as linhas e aplica o clipping
              const newShapes = drawnShapes
                .map((shape) => {
                  if (shape.type === 'line') {
                    const lineShape = shape as Line;
                    const clippedLine = newClipper.clipLine(lineShape);
                    return clippedLine; // Pode ser null se a linha estiver totalmente fora
                  }
                  // Se não for linha, mantém o shape original ou implementa outro clipping se necessário
                  return shape;
                })
                .filter((shape) => shape !== null); // Remove as linhas que ficaram totalmente fora
  
              // Atualiza o estado com as novas formas (clippadas)
              setClippedShapes((prevClippedShapes) => [
                ...prevClippedShapes,
                ...newShapes,
              ]);
  
              return [];
            }
  
            return []; // Limpa o array de cliques para os modos que usam dois cliques
          }
          return newClicks;
        });
      }
    } else if (mode === 'transform') {
      // Lógica para o modo de transformação
      const clickedShape = getClickedShape(x, y);
      if (clickedShape) {
        setDrawnShapes((prevShapes) =>
          prevShapes.map((shape) => {
            if (shape === clickedShape) {
              shape.select();
            } else {
              shape.deselect();
            }
            return shape;
          }),
        );
        if (selectedShape) {
          setPrevSelectedShape(selectedShape);
        }
        setSelectedShape(clickedShape);
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
