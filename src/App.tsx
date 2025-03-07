import { useState } from "react";
import CanvasGrid from "./zzold/CanvasGrid";
import Controls from "./components/Controls";
import Functionalities from "./components/Functionalities";
import Canvas from "./components/Canvas";

function App() {
  const [showGrid, setShowGrid] = useState(true);
  const [gridThickness, setGridThickness] = useState(1);
  const [pixelSize, setPixelSize] = useState(10);
  const [mode, setMode] = useState<string | null>(null);

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h1>Editor Gráfico</h1>
      <p>Wanderson Teixeira dos Reis Junior</p>
      <Controls
        showGrid={showGrid}
        setShowGrid={setShowGrid}
        gridThickness={gridThickness}
        setGridThickness={setGridThickness}
        pixelSize={pixelSize}
        setPixelSize={setPixelSize}
      />
      {/*<CanvasGrid showGrid={showGrid} gridThickness={gridThickness} pixelSize={pixelSize} />*/}
      <Canvas showGrid={showGrid} gridThickness={gridThickness} pixelSize={pixelSize} mode={mode} />
      <Functionalities setMode={setMode} />
    </div>
  );
}

export default App;
