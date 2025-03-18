import React, { useEffect, useState } from 'react';

interface ControlsProps {
  showGrid: boolean;
  setShowGrid: (value: boolean) => void;
  gridThickness: number;
  setGridThickness: (value: number) => void;
  pixelSize: number;
  setPixelSize: (value: number) => void;
  canvasSize: { width: number; height: number };
  setCanvasSize: (value: { width: number; height: number }) => void;
  setHighlight: (value: boolean) => void;
  highlight: boolean;
}

const Controls: React.FC<ControlsProps> = ({
  showGrid,
  setShowGrid,
  gridThickness,
  setGridThickness,
  pixelSize,
  setPixelSize,
  canvasSize,
  setCanvasSize,
  setHighlight,
  highlight,
}) => {
  const [screenSize, setScreenSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const [newCanvasSize, setNewCanvasSize] = useState(canvasSize);
  const [menu, setMenu] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      setScreenSize({ width: window.innerWidth, height: window.innerHeight });
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleCanvasSizeChange = () => {
    // Evita valores inválidos ou menores que o mínimo
    if (newCanvasSize.width < 500 || newCanvasSize.height < 500) {
      alert('O tamanho mínimo do canvas é 500x500.');
      return;
    }
    if (
      newCanvasSize.width > screenSize.width ||
      newCanvasSize.height > screenSize.height
    ) {
      alert('O tamanho do canvas não pode ultrapassar o tamanho da tela.');
      return;
    }
    setNewCanvasSize({
      width: Math.floor(newCanvasSize.width / pixelSize) * pixelSize,
      height: Math.floor(newCanvasSize.height / pixelSize) * pixelSize,
    });
    console.log(newCanvasSize);
    setCanvasSize({
      width: Math.floor(newCanvasSize.width / pixelSize) * pixelSize,
      height: Math.floor(newCanvasSize.height / pixelSize) * pixelSize,
    });
    console.log(canvasSize);
  };

  return (
    <div
      style={{ position: 'absolute', top: '100px', left: '35px', zIndex: 1000 }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          gap: '10px',
          marginBottom: '10px',
        }}
      >
        <label
          className="btn btn-circle btn-dash swap swap-rotate"
          style={{ backgroundColor: '#f5f5f5' }}
        >
          {/* this hidden checkbox controls the state */}
          <input type="checkbox" onClick={() => setMenu(!menu)} />

          {/* hamburger icon */}
          <svg
            className="swap-off fill-current"
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            viewBox="0 0 512 512"
          >
            <path d="M64,384H448V341.33H64Zm0-106.67H448V234.67H64ZM64,128v42.67H448V128Z" />
          </svg>

          {/* close icon */}
          <svg
            className="swap-on fill-current"
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            viewBox="0 0 512 512"
          >
            <polygon points="400 145.49 366.51 112 256 222.51 145.49 112 112 145.49 222.51 256 112 366.51 145.49 400 256 289.49 366.51 400 400 366.51 289.49 256 400 145.49" />
          </svg>
        </label>
      </div>
      <div
        style={
          menu
            ? { display: 'none' }
            : {
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                gap: '10px',
                marginBottom: '10px',
              }
        }
      >
        <button
          className="btn btn-dash"
          style={{ backgroundColor: '#f5f5f5' }}
          onClick={() => setShowGrid(!showGrid)}
        >
          {showGrid ? (
            <>
              Ocultar
              <br /> Grade
            </>
          ) : (
            <>
              Mostrar <br />
              Grade
            </>
          )}
        </button>

        {
          /*se o ocultar a grade for false ele pergunta a expessura se não nem mostra*/
          showGrid ? (
            <label>
              <div className="dropdown dropdown-right">
                <div
                  tabIndex={3}
                  role="button"
                  className="btn btn-dash m-1"
                  style={{ backgroundColor: '#f5f5f5' }}
                >
                  <>
                    Espessura <br />
                    da grade
                  </>
                </div>
                <ul
                  tabIndex={3}
                  className="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm"
                  style={{ width: '150px', backgroundColor: '#f5f5f5' }}
                >
                  <input
                    type="range"
                    min={1}
                    max={5}
                    value={gridThickness}
                    onChange={(e) => setGridThickness(Number(e.target.value))}
                    className="range range-xs"
                  />
                </ul>
              </div>
            </label>
          ) : null
        }

        <div className="dropdown dropdown-right">
          <div
            tabIndex={0}
            role="button"
            className="btn btn-dash m-1"
            style={{ backgroundColor: '#f5f5f5' }}
          >
            <>
              Tamanho <br />
              dos Pixels
            </>
          </div>
          <ul
            tabIndex={0}
            className="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm"
            style={{ backgroundColor: '#f5f5f5' }}
          >
            <li>
              <a
                style={{
                  backgroundColor: pixelSize === 1 ? '#e0e0e0' : '',
                }}
                onClickCapture={() => setPixelSize(1)}
              >
                1
              </a>
            </li>
            <li>
              <a style={{
                  backgroundColor: pixelSize === 5 ? '#e0e0e0' : '',
                }}
                onClickCapture={() => setPixelSize(5)}>2</a>
            </li>
            <li>
              <a style={{
                  backgroundColor: pixelSize === 10 ? '#e0e0e0' : '',
                }}
                onClickCapture={() => setPixelSize(10)}>3</a>
            </li>
            <li>
              <a style={{
                  backgroundColor: pixelSize === 20 ? '#e0e0e0' : '',
                }}
                onClickCapture={() => setPixelSize(20)}>4</a>
            </li>
            <li>
              <a style={{
                  backgroundColor: pixelSize === 25 ? '#e0e0e0' : '',
                }}
                onClickCapture={() => setPixelSize(25)}>5</a>
            </li>
          </ul>
        </div>

        <div className="dropdown dropdown-right">
          <div
            tabIndex={1}
            role="button"
            className="btn btn-dash m-1"
            style={{ backgroundColor: '#f5f5f5' }}
          >
            <>
              Tamanho <br />
              do Canvas
            </>
          </div>
          <ul
            tabIndex={1}
            className="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm"
            style={{ backgroundColor: '#f5f5f5' }}
          >
            <li>
              <label
                className="pt-10"
                onClick={() => {
                  setNewCanvasSize((prev) => ({
                    ...prev,
                    width: window.innerWidth - 50,
                  }));
                }}
              >
                Largura ({window.innerWidth.toString()})
              </label>
              <input
                type="number"
                className="input validator"
                style={{ maxWidth: '50px', alignContent: 'center' }}
                required
                value={newCanvasSize.width}
                onChange={(e) =>
                  setNewCanvasSize((prev) => ({
                    ...prev,
                    width: parseInt(e.target.value) || 0,
                  }))
                }
                min="500"
                max={screenSize.width}
              />
            </li>

            <li>
              <label
                className="mt-5"
                onClick={() => {
                  setNewCanvasSize((prev) => ({
                    ...prev,
                    height: window.innerHeight - 120,
                  }));
                }}
              >
                Altura ({window.innerHeight.toString()})
              </label>
              <input
                type="number"
                className="input validator"
                style={{ maxWidth: '50px', alignContent: 'center' }}
                required
                value={newCanvasSize.height}
                onChange={(e) =>
                  setNewCanvasSize((prev) => ({
                    ...prev,
                    height: parseInt(e.target.value) || 0,
                  }))
                }
                min="500"
                max={screenSize.height}
              />
            </li>
            <p></p>
            <li
              className="mt-0"
              style={{ backgroundColor: 'white', marginTop: '-20px' }}
            >
              <button
                className="btn btn-outline btn-info"
                onClick={handleCanvasSizeChange}
              >
                OK
              </button>
            </li>
          </ul>
        </div>
        <button
          className="btn btn-dash"
          style={{ backgroundColor: '#f5f5f5' }}
          onClick={() => setHighlight(!highlight)}
        >
          {highlight ? (
            <>
              Ocultar
              <br /> Highlight
            </>
          ) : (
            <>
              Mostrar <br />
              Highlight
            </>
          )}
        </button>
        
      </div>
    </div>
  );
};

export default Controls;
