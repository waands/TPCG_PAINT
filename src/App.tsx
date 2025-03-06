import { useState } from "react";
import CanvasGrid from "./components/CanvasGrid";
import Controls from "./components/Controls";
import Functionalities from "./components/Functionalities";

function App() {
  const [showGrid, setShowGrid] = useState(true);
  const [gridThickness, setGridThickness] = useState(1);
  const [pixelSize, setPixelSize] = useState(10);

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
      <CanvasGrid showGrid={showGrid} gridThickness={gridThickness} pixelSize={pixelSize} />
      <Functionalities onDrawLine={handleDrawLine}/>
    </div>
  );
}

export default App;
