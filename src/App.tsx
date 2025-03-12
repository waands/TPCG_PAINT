import { useState } from 'react';
import CanvasGrid from './zzold/CanvasGrid';
import Controls from './components/Controls';
import Functionalities from './components/Functionalities';
import Canvas from './components/Canvas';
import { Shape } from './utils/Shapes';

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
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<"DDA" | "Bresenham">("DDA");
  const [selectedColor, setSelectedColor] = useState<string>('#000');
  const [selectedShape, setSelectedShape] = useState<Shape | null>(null);


  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <h1>Editor Gráfico</h1>
      <p>Wanderson Teixeira dos Reis Junior</p>
      <Controls
        showGrid={showGrid}
        setShowGrid={setShowGrid}
        gridThickness={gridThickness}
        setGridThickness={setGridThickness}
        pixelSize={pixelSize}
        setPixelSize={setPixelSize}
        canvasSize={canvasSize}
        setCanvasSize={setCanvasSize}
      />
      {/*<CanvasGrid showGrid={showGrid} gridThickness={gridThickness} pixelSize={pixelSize} />*/}
      <Canvas
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
      />
      <Functionalities mode={mode} setMode={setMode} setDrawnShapes={setDrawnShapes} setSelectedColor={setSelectedColor} selectedColor={selectedColor} setSeletedAlgorithm={setSelectedAlgorithm} selectedAlgorithm={selectedAlgorithm} selectedShape={selectedShape}/>
    </div>
  );
}

export default App;
