import { useState, useRef, useEffect } from 'react';
import MouseHighlight from './extra/MouseHighlight';
import Controls from './components/Controls';
import Functionalities from './components/Functionalities';
import Canvas from './components/Canvas';
import { Shape } from './utils/Shapes';
import {ActionsTimeline} from './extra/ActionsTimeline';

function App() {
  const [showGrid, setShowGrid] = useState(true);
  const [gridThickness, setGridThickness] = useState(1);
  const [pixelSize, setPixelSize] = useState(10);
  const [canvasSize, setCanvasSize] = useState({
    width: Math.floor((window.innerWidth - 200) / pixelSize) * pixelSize,
    height: Math.floor((window.innerHeight - 362) / pixelSize) * pixelSize,
  });
  const [mode, setMode] = useState<string | null>(null);
  const [drawnShapes, setDrawnShapes] = useState<Shape[]>([]);
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<
    'DDA' | 'Bresenham'
  >('DDA');
  const [selectedColor, setSelectedColor] = useState<string>('#000');
  const [selectedShape, setSelectedShape] = useState<Shape | null>(null);

  const [mousePos, setMousePos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [highlight, setHighlight] = useState<boolean>(true);
  
  const [reRender , setReRender] = useState<boolean>(false);

  const [newClicks, setNewClicks] = useState<{x: number; y: number}[]>([]);

  const [transformType, setTransformType] = useState<string | null>(null);

  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <h1>Editor Gráfico</h1>
      <p>Wanderson Teixeira dos Reis Junior</p>
      <div className="badge badge-soft badge-neutral"
        style={{ position: 'absolute', top: '10px', right: '10px' }}
      >x: {mousePos.x} | y:{mousePos.y}</div>

      <div style={{position: 'absolute', top: '10px', left: '10px' }}>
        <ActionsTimeline
          drawnShapes={drawnShapes}
          selectedShape={setSelectedShape}
          mode={mode}
          selectedAlgorithm={selectedAlgorithm}
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
      {highlight && (<MouseHighlight pixelSize={pixelSize} canvasSize={canvasSize} mousePos={mousePos} />)}
      <Canvas
        setShowGrid={setShowGrid}
        showGrid={showGrid}
        gridThickness={gridThickness}
        pixelSize={pixelSize}
        mode={mode}
        canvasSize={canvasSize}
        drawnShapes={drawnShapes}
        setDrawnShapes={setDrawnShapes}
        selectedAlgorithm={selectedAlgorithm}
        selectedColor={selectedColor}
        setSelectedShape={setSelectedShape}
        selectedShape={selectedShape}
        setMousePos={setMousePos}
        setReRender={setReRender}
        reRender={reRender}
        newClicks={newClicks}
        setNewClicks={setNewClicks}
      />
      <Functionalities
        mode={mode}
        setMode={setMode}
        setDrawnShapes={setDrawnShapes}
        drawnShapes={drawnShapes}
        setSelectedColor={setSelectedColor}
        selectedColor={selectedColor}
        setSeletedAlgorithm={setSelectedAlgorithm}
        selectedAlgorithm={selectedAlgorithm}
        selectedShape={selectedShape}
        setSelectedShape={setSelectedShape}
        setReRender={setReRender}
        reRender={reRender}
        setNewClicks={setNewClicks}
        setTransformType={setTransformType}
        transformType={transformType}
      />
    </div>
  );
}

export default App;
