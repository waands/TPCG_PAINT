interface ControlsProps {
    showGrid: boolean;
    setShowGrid: (value: boolean) => void;
    gridThickness: number;
    setGridThickness: (value: number) => void;
    pixelSize: number;
    setPixelSize: (value: number) => void;
  }
  
  const Controls: React.FC<ControlsProps> = ({
    showGrid,
    setShowGrid,
    gridThickness,
    setGridThickness,
    pixelSize,
    setPixelSize,
  }) => {
    return (
      <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
        <button className="btn btn-dash "onClick={() => setShowGrid(!showGrid)}>
        {showGrid ? "Ocultar Grade" : "Mostrar Grade"}</button>

        {/*se o ocultar a grade for false ele pergunta a expessura se não nem mostra*/
        showGrid ? <label>
          Espessura da grade:
          <input
            type="range"
            min={1}
            max={5}
            value={gridThickness}
            onChange={(e) => setGridThickness(Number(e.target.value))}
            className="range range-xs"
          />
        </label> : null
        
        }

        <div className="dropdown dropdown-bottom dropdown-center">
        <div tabIndex={0} role="button" className="btn btn-dash m-1">Tamanho dos Pixels</div>
        <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm">
            <li><a
            onClickCapture={() => setPixelSize(5)}
            >5</a></li>
            <li><a
            onClickCapture={() => setPixelSize(10)}
            >10</a></li>
            <li><a
            onClickCapture={() => setPixelSize(20)}
            >20</a></li>
            <li><a
            onClickCapture={() => setPixelSize(25)}
            >25</a></li>
        </ul>
        </div>



      </div>
    );
  };
  
  export default Controls;
  