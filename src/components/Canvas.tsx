import React, {
  useRef,
  useEffect,
  useState,
  Dispatch,
  SetStateAction,
} from 'react';
import { Shape, Line, Circle, Polygon } from '../utils/Shapes';
import { Clipper } from '../utils/Clipping';
import { drawDDA, drawBresenham } from '../utils/LineAlg';

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
}

/**
 * Preenche um pixel específico no canvas com a cor selecionada.
 * 
 * @param ctx - Contexto 2D do Canvas.
 * @param x - Posição X do pixel (em unidades de grid).
 * @param y - Posição Y do pixel (em unidades de grid).
 * @param pixelSize - Tamanho de cada pixel na tela.
 * @param selectedColor - Cor atual selecionada.
 */
export const colorPixel = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  pixelSize: number,
  selectedColor: string,
) => {
  ctx.fillStyle = selectedColor;
  ctx.fillRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);
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
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Armazena a forma selecionada anteriormente, para poder desselar caso mudemos de modo.
  const [prevSelectedShape, setPrevSelectedShape] = useState<Shape | null>(null);

  // Controla os cliques necessários para desenhar figuras que necessitam mais de um ponto (ex: linhas).
  const [clicks, setClicks] = useState<{ x: number; y: number }[]>([]);

  // Armazena os vértices temporários de um polígono antes dele ser fechado.
  const [polygonVertices, setPolygonVertices] = useState<
    { x: number; y: number }[]
  >([]);

  /**
   * Atualiza a posição do mouse (em coordenadas de grid) sempre que o mouse se move sobre o canvas.
   * Usado para desenhar o “highlight” ou exibir a posição atual.
   */
  const highlightMousePosition = (event: MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = Math.floor((event.clientX - rect.left) / pixelSize);
    const y = Math.floor((event.clientY - rect.top) / pixelSize);

    // Atualiza a posição do mouse no estado global ou local
    setMousePos({ x, y });
  };

  /**
   * Desenha (ou redesenha) no canvas sempre que ocorrer alguma mudança nos estados importantes:
   * - Tamanho do canvas
   * - Tamanho do pixel
   * - Redesenho (reRender)
   * - Clipper
   * - Formas desenhadas ou recortadas
   */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Limpa toda a área do canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Se não houver formas recortadas, desenha as formas originais.
    // Caso contrário, desenha as formas recortadas (clippedShapes).
    if (clippedShapes.length === 0) {
      drawnShapes.forEach((shape) => shape.draw(ctx, pixelSize));
    } else {
      clippedShapes.forEach((shape) => shape.draw(ctx, pixelSize));
    }

    // Desenha as regiões definidas pelos clippers
    drawnClipper.forEach((clipper) => {
      clipper.drawRegion(ctx, pixelSize);
    });

    // Adiciona o listener para destacar a posição do mouse
    canvas.addEventListener('mousemove', highlightMousePosition);

    // Remove o listener ao desmontar ou refazer o efeito
    return () => {
      canvas.removeEventListener('mousemove', highlightMousePosition);
    };
  }, [
    canvasSize,
    gridThickness,
    pixelSize,
    reRender,
    drawnClipper,
    clippedShapes,
    drawnShapes,
  ]);

  /**
   * Efeito que lida principalmente com a seleção de formas e o reset de polígonos inacabados
   * quando o modo muda.
   */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Se não estamos mais no modo polígono, limpa os vértices temporários.
    if (mode !== 'polygon') {
      setPolygonVertices([]);
    }

    // Se não estamos mais no modo de transformação, desselar a forma anterior, se existir.
    if (mode !== 'transform') {
      prevSelectedShape?.deselect();
    }

    // Se há uma forma selecionada, desenhamos novamente para ressaltar.
    // Caso contrário, desenhamos a última forma que foi adicionada (se houver).
    if (clippedShapes.length === 0) {
      if (selectedShape) {
        if (mode !== 'transform') {
          prevSelectedShape?.deselect();
        }
        if (prevSelectedShape != null) {
          drawnShapes.forEach((shape) => {
            if (shape === prevSelectedShape) {
              shape.draw(ctx, pixelSize);
            }
          });
          setPrevSelectedShape(null);
        }
        drawnShapes.forEach((shape) => {
          if (shape === selectedShape) {
            shape.draw(ctx, pixelSize);
          }
        });
      } else if (drawnShapes.length > 0) {
        const lastShape = drawnShapes[drawnShapes.length - 1];
        lastShape.draw(ctx, pixelSize);
      }
    }
  }, [drawnShapes, selectedShape, mode, clippedShapes, prevSelectedShape]);

  /**
   * Retorna a forma mais próxima ao ponto clicado (x, y), se existir alguma dentro da "tolerância".
   * - Primeiro filtra por bounding box.
   * - Depois faz uma verificação de distância até a linha ou circunferência.
   */
  const getClickedShape = (x: number, y: number): Shape | undefined => {
    // Filtra apenas as formas cujo “bounding box” (ou aproximação) inclua o ponto clicado
    const possibleShapes = drawnShapes.filter((shape) => {
      if (shape instanceof Line) {
        const { start, end } = shape;
        const xMin = Math.min(start.x, end.x) - pixelSize;
        const xMax = Math.max(start.x, end.x) + pixelSize;
        const yMin = Math.min(start.y, end.y) - pixelSize;
        const yMax = Math.max(start.y, end.y) + pixelSize;
        return x >= xMin && x <= xMax && y >= yMin && y <= yMax;
      } else if (shape instanceof Circle) {
        const { center, radius } = shape;
        const xMin = center.x - radius - pixelSize;
        const xMax = center.x + radius + pixelSize;
        const yMin = center.y - radius - pixelSize;
        const yMax = center.y + radius + pixelSize;
        return x >= xMin && x <= xMax && y >= yMin && y <= yMax;
      }
      return false;
    });

    let closestShape: Shape | undefined;
    let minDistance = Infinity;

    possibleShapes.forEach((shape) => {
      if (shape instanceof Line) {
        const { start, end } = shape;

        // Função auxiliar para calcular a distância do ponto (px, py) até a linha (x1, y1)-(x2, y2)
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

          if (denominator === 0) return Infinity; // Linha degenerada

          const distance = numerator / denominator;
          // Verifica se o ponto projetado está dentro do segmento
          const dot = (px - x1) * A + (py - y1) * B;
          const lenSq = A * A + B * B;

          if (dot < 0 || dot > lenSq) return Infinity;
          return distance;
        };

        const dist = distanceToLine(x, y, start.x, start.y, end.x, end.y);

        // “Folga” para facilitar a seleção de linhas conforme o tamanho do pixel
        let selectionTolerance;
        if (pixelSize >= 10) {
          selectionTolerance = 2;
        } else if (pixelSize >= 5) {
          selectionTolerance = 5;
        } else {
          selectionTolerance = 30;
        }

        if (dist < pixelSize * selectionTolerance && dist < minDistance) {
          minDistance = dist;
          closestShape = shape;
        }
      } else if (shape instanceof Circle) {
        const { center, radius } = shape;
        const dx = x - center.x;
        const dy = y - center.y;
        const distanceFromCenter = Math.sqrt(dx * dx + dy * dy);
        const distanceToCircumference = Math.abs(distanceFromCenter - radius);

        if (
          distanceToCircumference < pixelSize &&
          distanceToCircumference < minDistance
        ) {
          minDistance = distanceToCircumference;
          closestShape = shape;
        }
      }
    });

    return closestShape;
  };

  /**
   * Trata o clique no canvas:
   * 1. Captura as coordenadas de grid (x, y).
   * 2. Dependendo do modo (line, circle, polygon, transform, clipping), executa ações específicas.
   */
  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = Math.floor((event.clientX - rect.left) / pixelSize);
    const y = Math.floor((event.clientY - rect.top) / pixelSize);
    const newPoint = { x, y };

    // Se não estamos em modo de transformação, registra o ponto para highlight
    if (mode !== 'transform' && mode) {
      setClickedHighlight(newPoint);
    }

    // Modo de transformação
    if (mode === 'transform') {
      const clickedShape = getClickedShape(x, y);
      if (clickedShape) {
        // Seleciona a forma clicada e dessela as outras
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
      return;
    }

    // Modo polígono
    if (mode === 'polygon') {
      setNewClicks([]);
      // Duplo clique: fecha o polígono
      if (event.detail === 2) {
        setPolygonVertices((prevVertices) => {
          if (prevVertices.length >= 3) {
            const firstVertex = prevVertices[0];

            // Ajusta o estado dos cliques e desenha a reta que fecha o polígono
            setNewClicks(prev => [...newClicks.slice(-1), firstVertex]);

            // Cria o objeto Polygon a partir dos vértices acumulados
            const newPolygon = new Polygon(
              prevVertices,
              selectedAlgorithmLine,
              selectedColor,
            );

            // Insere no array de formas desenhadas, se ainda não existir
            setDrawnShapes((shapes) => {
              const alreadyExists = shapes.some(
                (shape) =>
                  shape instanceof Polygon &&
                  shape.vertices.length === newPolygon.vertices.length &&
                  shape.vertices.every(
                    (v, i) =>
                      v.x === newPolygon.vertices[i].x &&
                      v.y === newPolygon.vertices[i].y,
                  ),
              );
              if (!alreadyExists) {
                return [...shapes, newPolygon];
              }
              return shapes;
            });

            setClickedHighlight(undefined);
            return [];
          }
          return prevVertices;
        });
      } else {
        // Clique único: adiciona novo vértice e desenha a linha até ele

        setNewClicks([...newClicks.slice(-1), newPoint]);

        
        console.log(newClicks);


        
        setPolygonVertices((prevVertices) => {
          const updatedVertices = [...prevVertices, newPoint];         
          

          if (prevVertices.length > 0) {
            const lastPoint = prevVertices[prevVertices.length - 1];

            if (selectedAlgorithmLine === 'DDA') {
              drawDDA(
                canvasRef.current?.getContext('2d')!,
                lastPoint.x,
                lastPoint.y,
                newPoint.x,
                newPoint.y,
                pixelSize,
                selectedColor,
              );
            } else {
              drawBresenham(
                canvasRef.current?.getContext('2d')!,
                lastPoint.x,
                lastPoint.y,
                newPoint.x,
                newPoint.y,
                pixelSize,
                selectedColor,
              );
            }
          }

          return updatedVertices;
        });
      }
      return;
    }

    // Qualquer outro modo que necessite de dois cliques para desenhar (line, circle, clipping)
    setClicks((prev) => {
      const newClicksArray = [...prev, newPoint];
      setNewClicks(newClicksArray);

      // Se coletamos dois cliques, executamos a ação final (desenha ou faz o clipping)
      if (newClicksArray.length === 2) {
        const [p1, p2] = newClicksArray;

        setClickedHighlight(undefined);
        setMousePos({ x: -1, y: -1 });

        if (mode === 'line') {
          setSelectedShape(null);
          const newLine = new Line(p1, p2, selectedAlgorithmLine, selectedColor);

          setDrawnShapes((shapes) => {
            const alreadyExists = shapes.some(
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
            return alreadyExists ? shapes : [...shapes, newLine];
          });
        } else if (mode === 'circle') {
          setSelectedShape(null);
          const radius = Math.round(
            Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2)),
          );
          const newCircle = new Circle(p1, radius, 'Bresenham', selectedColor);

          setDrawnShapes((shapes) => {
            const alreadyExists = shapes.some(
              (shape) =>
                shape instanceof Circle &&
                shape.center.x === newCircle.center.x &&
                shape.center.y === newCircle.center.y &&
                shape.radius === newCircle.radius,
            );
            return alreadyExists ? shapes : [...shapes, newCircle];
          });
        } else if (mode === 'clipping') {
          // Cria um novo clipper e desenha a área de recorte
          const newClipper = new Clipper(selectedAlgorithmClipping);
          newClipper.setRegion(p1, p2);
          newClipper.drawRegion(canvasRef.current?.getContext('2d')!, pixelSize);

          setDrawnClipper((prevClippers) => {
            const alreadyExists = prevClippers.some((clip) => {
              const region = clip.getRegion();
              const newRegion = newClipper.getRegion();
              return (
                region.xMin === newRegion.xMin &&
                region.yMin === newRegion.yMin &&
                region.xMax === newRegion.xMax &&
                region.yMax === newRegion.yMax
              );
            });
            return alreadyExists ? prevClippers : [...prevClippers, newClipper];
          });

          // Aplica o clipping em cada shape (neste exemplo, linhas)
          const shapesAfterClipping = drawnShapes
            .map((shape) => {
              if (shape.type === 'line') {
                const lineShape = shape as Line;
                return newClipper.clipLine(lineShape);
              }
              // Caso queira recortar outras formas, implementar a lógica adequada aqui
              return shape;
            })
            .filter((s) => s !== null) as Shape[];

          setClippedShapes((prevClipped) => [...prevClipped, ...shapesAfterClipping]);
        }

        // Limpa o array de cliques depois de usar
        return [];
      }

      return newClicksArray;
    });
  };

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
