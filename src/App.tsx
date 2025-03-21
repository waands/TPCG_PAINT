import { useState } from 'react';
import MouseHighlight from './extra/MouseHighlight';
import Controls from './components/Controls';
import Functionalities from './components/Functionalities';
import Canvas from './components/Canvas';
import { Shape } from './components/Shapes';
import {ActionsTimeline} from './extra/ActionsTimeline';
import GridCanvas from './extra/GridCanvas';
import {Clipper } from './utils/Clipping';


function App() {
  const [showGrid, setShowGrid] = useState(true);
  const [gridThickness, setGridThickness] = useState(1);
  const [pixelSize, setPixelSize] = useState(10);
  const [canvasSize, setCanvasSize] = useState({
    width: Math.floor((window.innerWidth - 200) / pixelSize) * pixelSize,
    height: Math.floor((window.innerHeight - 290) / pixelSize) * pixelSize,
  });
  const [mode, setMode] = useState<string | null>(null);
  const [drawnShapes, setDrawnShapes] = useState<Shape[]>([]);
  const [clippedShapes, setClippedShapes] = useState<Shape[]>([]);
  const [drawnClipper, setDrawnClipper] = useState<Clipper[]>([]);
  const [selectedAlgorithmLine, setSelectedAlgorithmLine] = useState<
    'DDA' | 'Bresenham'
  >('DDA');
  const [selectedAlgorithmClipping, setselectedAlgorithmClipping] = useState<
    'CoSu' | 'LiBa'
  >('CoSu');
  const [selectedColor, setSelectedColor] = useState<string>('#000');
  const [selectedShape, setSelectedShape] = useState<Shape | null>(null);

  const [mousePos, setMousePos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [highlight, setHighlight] = useState<boolean>(true);
  
  const [reRender , setReRender] = useState<boolean>(false);

  const [newClicks, setNewClicks] = useState<{x: number; y: number}[]>([]);

  const [transformType, setTransformType] = useState<string | null>(null);

  const [clickedHighlight, setClickedHighlight] = useState<{x: number; y: number}>();

  // Armazena cliques para construir retangulo de seleção
  const [transformRectPoints, setTransformRectPoints] = useState<{ x: number; y: number }[]>([]);

  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>

      <p>Wanderson Teixeira dos Reis Junior</p>


      <div className="badge badge-soft badge-neutral"
        style={{ position: 'absolute', top: '10px', right: '10px' }}
      >x: {mousePos.x} | y:{mousePos.y}</div>

      <div style={{position: 'absolute', top: '10px', left: '10px' }}>
        <ActionsTimeline
          drawnShapes={drawnShapes}
          mode={mode}
          selectedAlgorithmLine={selectedAlgorithmLine}
          selectedAlgorithmClipping={selectedAlgorithmClipping}
          selectedColor={selectedColor}
          newClicks={newClicks}
          transformType={transformType}
        />
      </div>

      {/*<div className={`badge ${mode === 'transform' ? 'badge-accent' : mode === 'line' ? 'badge-primary' : mode === 'circle' ? 'badge-secondary' : 'badge-ghost' }`}
        style={{ position: 'absolute', top: '10px', left: '10px' }}
      >{mode === 'transform' ? 'Transformada' : mode === 'line' ? 'Reta' : mode === 'circle' ? 'Círculo' : '' }</div>
      */}
      <Controls
        showGrid={showGrid}
        setShowGrid={setShowGrid}
        gridThickness={gridThickness}
        setGridThickness={setGridThickness}
        pixelSize={pixelSize}
        setPixelSize={setPixelSize}
        canvasSize={canvasSize}
        setCanvasSize={setCanvasSize}
        setHighlight={setHighlight}
        highlight={highlight}
      />
      <div style={{ position: 'relative' }}>
      <GridCanvas
        pixelSize={pixelSize}
        canvasSize={canvasSize}
        gridThickness={gridThickness}
        showGrid={showGrid}
        clickedHighlight={clickedHighlight}
        setTransformRectPoints={setTransformRectPoints}
        transformRectPoints={transformRectPoints}
        transformType={transformType}
      />

      {highlight && (<MouseHighlight pixelSize={pixelSize} canvasSize={canvasSize} mousePos={mousePos} />)}
      <Canvas
        gridThickness={gridThickness}
        pixelSize={pixelSize}
        mode={mode}
        canvasSize={canvasSize}
        drawnShapes={drawnShapes}
        setDrawnShapes={setDrawnShapes}
        selectedAlgorithmLine={selectedAlgorithmLine}
        selectedColor={selectedColor}
        setSelectedShape={setSelectedShape}
        selectedShape={selectedShape}
        setMousePos={setMousePos}
        reRender={reRender}
        newClicks={newClicks}
        setNewClicks={setNewClicks}
        setClickedHighlight={setClickedHighlight}
        setDrawnClipper={setDrawnClipper}
        drawnClipper={drawnClipper}
        selectedAlgorithmClipping={selectedAlgorithmClipping}
        setClippedShapes={setClippedShapes}
        clippedShapes={clippedShapes}
        setTransformRectPoints={setTransformRectPoints}
        transformRectPoints={transformRectPoints}
      />
      </div>
      <Functionalities
        mode={mode}
        setMode={setMode}
        setDrawnShapes={setDrawnShapes}
        drawnShapes={drawnShapes}
        setSelectedColor={setSelectedColor}
        selectedColor={selectedColor}
        setSelectedAlgorithmLine={setSelectedAlgorithmLine}
        selectedAlgorithmLine={selectedAlgorithmLine}
        selectedShape={selectedShape}
        setSelectedShape={setSelectedShape}
        setReRender={setReRender}
        reRender={reRender}
        setNewClicks={setNewClicks}
        setTransformType={setTransformType}
        transformType={transformType}
        setSelectedAlgorithmClipping={setselectedAlgorithmClipping}
        selectedAlgorithmClipping={selectedAlgorithmClipping}
        setDrawnClipper={setDrawnClipper}
        drawnClipper={drawnClipper}
        setClippedShapes={setClippedShapes}
        clippedShapes={clippedShapes}
      />
    </div>
  );
}

export default App;
