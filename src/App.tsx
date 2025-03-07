import { useState } from 'react';
import CanvasGrid from './zzold/CanvasGrid';
import Controls from './components/Controls';
import Functionalities from './components/Functionalities';
import Canvas from './components/Canvas';

function App() {
  const [showGrid, setShowGrid] = useState(true);
  const [gridThickness, setGridThickness] = useState(1);
  const [pixelSize, setPixelSize] = useState(10);
  const [canvasSize, setCanvasSize] = useState({
    width: Math.floor((window.innerWidth - 200) / pixelSize) * pixelSize,
    height: Math.floor((window.innerHeight - 300) / pixelSize) * pixelSize,
  });
  const [mode, setMode] = useState<string | null>(null);
  const [drawnPixels, setDrawnPixels] = useState<
    { x: number; y: number; type: string }[]
  >([]);

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
        drawnPixels={drawnPixels}
        setDrawnPixels={setDrawnPixels}
      />
      <Functionalities setMode={setMode} setDrawnPixels={setDrawnPixels} />
    </div>
  );
}

export default App;
