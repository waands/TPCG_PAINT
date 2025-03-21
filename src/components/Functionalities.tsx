import React from 'react';
import { Dispatch, SetStateAction } from 'react';
import { Shape } from './Shapes';
import ColorPicker from './ColorPicker';
import { useState } from 'react';
import { Clipper } from '../utils/Clipping';

interface FunctionalitiesProps {
  setMode: (mode: string | null) => void;
  setDrawnShapes: Dispatch<SetStateAction<Shape[]>>;
  drawnShapes: Shape[];
  mode: string | null;
  setSelectedAlgorithmLine: (algorithm: 'DDA' | 'Bresenham') => void;
  selectedAlgorithmLine: 'DDA' | 'Bresenham';
  setSelectedColor: (color: string) => void;
  selectedColor: string;
  selectedShape: Shape | null;
  setSelectedShape: Dispatch<SetStateAction<Shape | null>>;
  setReRender: Dispatch<SetStateAction<boolean>>;
  reRender: boolean;
  setNewClicks: Dispatch<SetStateAction<{ x: number; y: number }[]>>;
  setTransformType: Dispatch<SetStateAction<string | null>>;
  transformType: string | null;
  setSelectedAlgorithmClipping: (algorithm: 'CoSu' | 'LiBa') => void;
  selectedAlgorithmClipping: 'CoSu' | 'LiBa';
  setDrawnClipper: Dispatch<SetStateAction<Clipper[]>>;
  drawnClipper: Clipper[];
  setClippedShapes: Dispatch<SetStateAction<Shape[]>>;
  clippedShapes: Shape[];
}

const Functionalities: React.FC<FunctionalitiesProps> = ({
  setMode,
  setDrawnShapes,
  drawnShapes,
  mode,
  setSelectedAlgorithmLine,
  selectedAlgorithmLine,
  setSelectedColor,
  selectedColor,
  selectedShape,
  setSelectedShape,
  setReRender,
  reRender,
  setNewClicks,
  setTransformType,
  transformType,
  setSelectedAlgorithmClipping,
  selectedAlgorithmClipping,
  setDrawnClipper,
  drawnClipper,
  setClippedShapes,
  clippedShapes,
}) => {
  const [showColorPicker, setShowColorPicker] = useState<boolean>(false);
  const [transformValue, setTransformValue] = useState<number>(1);
  const [transformDropdownOpen, setTransformDropdownOpen] = useState(false);

  const handleColorChange = (color: string) => {
    setSelectedColor(color);
  };

  const handleTransform = (dx: number, dy: number) => {
    if (selectedShape) {
      //console.log(drawnShapes)
      // Criar uma cópia de todas as formas existentes, mas manter a mesma referência do selectedShape
      const newShapes = drawnShapes.map((shape) => shape);

      // Aplicar a transformação na forma selecionada
      switch (transformType) {
        case 'translate':
          selectedShape.translate(
            dx * transformValue,
            dy * transformValue,
            1,
            1,
            0,
            0,
          );
          break;
        case 'scale':
          selectedShape.translate(0, 0, transformValue, transformValue, 0, 0);
          break;
        case 'rotate':
          selectedShape.translate(0, 0, 1, 1, transformValue, 0);
          break;
        case 'reflection':
          selectedShape.translate(0, 0, 1, 1, 0, transformValue);
          break;
      }

      /*console.log(
        'Transformação ',
        transformType,
        ' aplicada:',
        selectedShape,
      );*/

      // Atualizar o estado com o novo array de formas
      setDrawnShapes(newShapes);
      setReRender(!reRender);
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        marginTop: '10px',
        gap: '10px',
        justifyContent: 'center',
      }}
    >
      <div style={{ position: 'relative', display: 'inline-block' }}>
        {' '}
        {/* Adicionando position: relative */}
        <div
          style={{
            width: '38px',
            height: '38px',
            backgroundColor: selectedColor,
            cursor: 'pointer',
            border: '1px solid #B9B9B9',
            borderRadius: '5px',
          }}
          onClick={() => setShowColorPicker(!showColorPicker)}
        ></div>
        {showColorPicker && (
          <div
            style={{
              position: 'absolute',
              zIndex: 1,
              right: '100%',
              top: '0%',
              marginRight: '10px',
            }}
          >
            <ColorPicker onChangeComplete={handleColorChange} />
          </div>
        )}
      </div>

      <div className="dropdown dropdown-center">
        <button
          className={`btn ${
            mode === 'transform'
              ? 'btn-accent'
              : 'btn-soft btn-accent hover:btn-accent'
          } `}
          onClick={() => {
            setMode('transform');
            setTransformType(null);
            setTransformDropdownOpen(!transformDropdownOpen);
            setNewClicks([]);
            console.log(selectedShape);
          }}
        >
          Transformar
        </button>
        {transformDropdownOpen && (
          <div className="dropdown-content menu z-1 w-52 p-2 shadow-sm">
            <button
              style={{ marginTop: '4px' }}
              className="btn btn-soft btn-accent btn-sm"
              onClick={() => {
                setTransformType('translate');
                setTransformDropdownOpen(!transformDropdownOpen);
                setTransformValue(1);
              }}
            >
              Transladar
            </button>
            <button
              style={{ marginTop: '4px' }}
              className="btn btn-soft btn-accent btn-sm"
              onClick={() => {
                setTransformType('rotate');
                setTransformDropdownOpen(!transformDropdownOpen);
                setTransformValue(30);
              }}
            >
              Rotacionar
            </button>
            <button
              style={{ marginTop: '4px' }}
              className="btn btn-soft btn-accent btn-sm"
              onClick={() => {
                setTransformType('scale');
                setTransformDropdownOpen(!transformDropdownOpen);
                setTransformValue(2);
              }}
            >
              Escalar
            </button>
            <button
              style={{ marginTop: '4px' }}
              className="btn btn-soft btn-accent btn-sm"
              onClick={() => {
                setTransformType('reflection');
                setTransformDropdownOpen(!transformDropdownOpen);
                setTransformValue(0);
              }}
            >
              Refletir
            </button>
          </div>
        )}
        <div
          style={{
            position: 'absolute',
            zIndex: 1,
            marginTop: '10px',
            right: '50%',
            transform: 'translateX(50%)',
          }}
        >
          {mode === 'transform' && transformType === 'translate' && (
            <div>
              <div
                style={{ gap: '4px', marginTop: '4px' }}
                className="flex w-full justify-center"
              >
                <button
                  className="btn btn-soft btn-accent btn-md"
                  onClick={() => handleTransform(-1, -1)}
                >
                  ↖
                </button>
                <button
                  className="btn btn-soft btn-accent btn-md"
                  onClick={() => handleTransform(0, -1)}
                >
                  ▲
                </button>
                <button
                  className="btn btn-soft btn-accent btn-md"
                  onClick={() => handleTransform(1, -1)}
                >
                  ↗
                </button>
              </div>
              <div
                style={{ gap: '4px', marginTop: '4px' }}
                className="flex w-full justify-center gap-12"
              >
                <button
                  className="btn btn-soft btn-accent btn-md"
                  onClick={() => handleTransform(-1, 0)}
                >
                  ◀︎
                </button>
                <input
                  style={{ width: '20px', height: '40px' }}
                  type=""
                  className="input validator"
                  required
                  value={transformValue}
                  onChange={(e) =>
                    setTransformValue(parseInt(e.target.value) || 0)
                  }
                  min="1"
                  max="1000"
                />
                <button
                  className="btn btn-soft btn-accent btn-md"
                  onClick={() => handleTransform(1, 0)}
                >
                  ▶︎
                </button>
              </div>
              <div
                style={{ gap: '4px', marginTop: '4px' }}
                className="flex w-full justify-center"
              >
                <button
                  className="btn btn-soft btn-accent btn-md"
                  onClick={() => handleTransform(-1, 1)}
                >
                  ↙
                </button>
                <button
                  className="btn btn-soft btn-accent btn-md"
                  onClick={() => handleTransform(0, 1)}
                >
                  ▼
                </button>
                <button
                  className="btn btn-soft btn-accent btn-md"
                  onClick={() => handleTransform(1, 1)}
                >
                  ↘
                </button>
              </div>
            </div>
          )}
          {mode === 'transform' && transformType === 'scale' && (
            <div
              style={{
                minWidth: '200px',
              }}
            >
              <div
                style={{ gap: '4px', marginTop: '4px' }}
                className="flex w-full justify-center"
              >
                <input
                  style={{ marginTop: '10px' }}
                  type="range"
                  min="0"
                  max="10"
                  step="0.1"
                  value={transformValue}
                  className="range range-accent"
                  onChange={(e) => setTransformValue(Number(e.target.value))}
                />
                <input
                  style={{ width: '20px', height: '40px' }}
                  type=""
                  className="input validator"
                  required
                  value={transformValue}
                  onChange={(e) =>
                    setTransformValue(parseFloat(e.target.value) || 0)
                  }
                  min="0"
                  max="10"
                  step="0.1"
                  title=""
                />
              </div>
              <button
                className="btn btn-soft btn-accent"
                onClick={() => handleTransform(0, 0)}
              >
                OK
              </button>
            </div>
          )}
          {mode === 'transform' && transformType === 'rotate' && (
            <div
              style={{
                minWidth: '200px',
              }}
            >
              <div
                style={{ gap: '4px', marginTop: '4px' }}
                className="flex w-full justify-center"
              >
                <input
                  style={{ marginTop: '10px' }}
                  type="range"
                  min={-180}
                  max="180"
                  value={transformValue}
                  className="range range-accent"
                  onChange={(e) => setTransformValue(Number(e.target.value))}
                />
                <input
                  style={{ width: '20px', height: '40px' }}
                  type=""
                  className="input validator"
                  required
                  value={transformValue}
                  onChange={(e) =>
                    setTransformValue(parseInt(e.target.value) || 0)
                  }
                  min={-180}
                  max="180"
                  title=""
                />
              </div>
              <button
                className="btn btn-soft btn-accent"
                onClick={() => handleTransform(0, 0)}
              >
                OK
              </button>
            </div>
          )}
          {mode === 'transform' && transformType === 'reflection' && (
            <div>
              <div
                style={{ gap: '4px' }}
                className="flex w-full justify-center"
              >
                <button
                  className={`btn ${
                    transformValue === 1 ? 'btn-accent' : 'btn-soft btn-accent'
                  } btn-accent `}
                  onClick={() => {
                    setTransformValue(1);
                  }}
                >
                  X
                </button>
                <button
                  className={`btn ${
                    transformValue === 2 ? 'btn-accent' : 'btn-soft btn-accent'
                  } `}
                  onClick={() => {
                    setTransformValue(2);
                  }}
                >
                  Y
                </button>
                <button
                  className={`btn ${
                    transformValue === 3 ? 'btn-accent' : 'btn-soft btn-accent'
                  } btn-accent`}
                  onClick={() => {
                    setTransformValue(3);
                  }}
                >
                  XY
                </button>
              </div>
              <button
                className="btn btn-soft btn-accent"
                style={{ marginTop: '4px' }}
                onClick={() => handleTransform(0, 0)}
              >
                OK
              </button>
            </div>
          )}
        </div>
      </div>

      <div
        className="dropdown dropdown-center"
        onClick={() => {
          setMode('line');
          if (selectedShape) {
            selectedShape.deselect();
            setDrawnShapes((prevShapes) => [...prevShapes]); // Força a atualização
          }
          setNewClicks([]);
          setSelectedShape(null);
        }}
      >
        <button
          tabIndex={0}
          role="button"
          className={`btn m-1 ${
            mode === 'line'
              ? 'btn btn-primary'
              : 'btn-soft btn-primary hover:btn-primary'
          } `}
          onClick={() => {
            setMode('line');
            selectedShape?.deselect();

            setSelectedShape(null);
          }}
        >
          Reta
        </button>
        <ul
          tabIndex={0}
          className="dropdown-content menu bg-primary-content rounded-box z-1 w-52 p-2 shadow-sm"
        >
          <li
            onClick={() => {
              setMode('line');
              setSelectedAlgorithmLine('DDA');
            }}
          >
            <a className="text-primary">
              <input
                type="radio"
                name="radio-4"
                className="radio radio-primary checked:bg-primary-content"
                checked={selectedAlgorithmLine === 'DDA'}
                readOnly
              />
              {'DDA'}
            </a>
          </li>
          <li onClick={() => setSelectedAlgorithmLine('Bresenham')}>
            <a className="text-primary">
              <input
                type="radio"
                name="radio-4"
                className="radio radio-primary checked:bg-primary-content"
                checked={selectedAlgorithmLine === 'Bresenham'}
                readOnly
              />
              {'Bresenham'}
            </a>
          </li>
        </ul>
      </div>
      <button
        className={`btn ${
          mode === 'circle'
            ? 'btn-secondary'
            : 'btn-soft btn-secondary hover:btn-secondary'
        } `}
        onClick={() => {
          setMode('circle');
          setNewClicks([]);
          setSelectedAlgorithmLine('Bresenham');
          if (selectedShape) {
            selectedShape.deselect();
            setDrawnShapes((prevShapes) => [...prevShapes]); // Força a atualização
          }
          setSelectedShape(null);
        }}
      >
        Círculo
      </button>

      <div
        className="dropdown dropdown-center"
        onClick={() => {
          setMode('polygon');
          if (selectedShape) {
            selectedShape.deselect();
            setDrawnShapes((prevShapes) => [...prevShapes]); // Força a atualização
          }
          setNewClicks([]);
          setSelectedShape(null);
        }}
      >
        <button
          tabIndex={4}
          role="button"
          className={`btn m-1 ${
            mode === 'polygon'
              ? 'btn btn-info'
              : 'btn-soft btn-info hover:btn-info'
          } `}
          onClick={() => {
            setMode('polygon');
            selectedShape?.deselect();

            setSelectedShape(null);
          }}
        >
          Polígono
        </button>
        <ul
          tabIndex={4}
          className="dropdown-content menu bg-info-content rounded-box z-1 w-52 p-2 shadow-sm"
          style={{ backgroundColor: '#A6DDF9' }}
        >
          <li
            onClick={() => {
              setMode('polygon');
              setSelectedAlgorithmLine('DDA');
            }}
          >
            <a className="text-info" style={{ color: '#095896 ' }}>
              <input
                type="radio"
                name="radio-6"
                className="radio radio-info"
                style={{ backgroundColor: '#A6DDF9', color: '#095896 ' }}
                checked={selectedAlgorithmLine === 'DDA'}
                readOnly
              />
              {'DDA'}
            </a>
          </li>
          <li onClick={() => setSelectedAlgorithmLine('Bresenham')}>
            <a className="text-info" style={{ color: '#095896 ' }}>
              <input
                type="radio"
                name="radio-6"
                className="radio radio-info checked:bg-info-content"
                style={{ backgroundColor: '#A6DDF9', color: '#095896 ' }}
                checked={selectedAlgorithmLine === 'Bresenham'}
                readOnly
              />
              {'Bresenham'}
            </a>
          </li>
        </ul>
      </div>

      {clippedShapes.length > 0 || drawnClipper.length > 0 ? (
        <div className="indicator"  onClick={() => {setSelectedShape(null)}}>
          <span
            className="indicator-item badge badge-secondary cursor-pointer hover:bg-red-500"
            onClick={(e) => {
              e.stopPropagation();
              setClippedShapes([]);
              setDrawnClipper([]);
            }}
          >
            x
          </span>

          <div
            className="dropdown dropdown-center"
            onClick={() => {
              setSelectedShape(null);
            }}
          >
            <button
              className={`btn ${
                mode === 'clipping'
                  ? 'btn-success'
                  : 'btn-soft btn-success hover:btn-success'
              }`}
              onClick={() => {
                setMode('clipping');
                setSelectedShape(null);
              }}
            >
              Recortar
            </button>
            {
              <ul
                tabIndex={2}
                className="dropdown-content menu bg-success-content rounded-box z-1 w-52 p-2 shadow-sm"
                style={{ backgroundColor: '#94EFB9' }}
              >
                <li
                  onClick={() => {
                    setMode('clipping');
                    setSelectedAlgorithmClipping('CoSu');
                  }}
                >
                  <a className="text-success" style={{ color: '#097B3F' }}>
                    <input
                      type="radio"
                      name="radio-5"
                      className="radio radio-success checked:bg-success-content"
                      style={{ backgroundColor: '#94EFB9', color: '#097B3F' }}
                      checked={selectedAlgorithmClipping === 'CoSu'}
                      readOnly
                    />
                    {'Cohen-Sutherland'}
                  </a>
                </li>
                <li
                  onClick={() => {
                    setMode('clipping');
                    setSelectedAlgorithmClipping('LiBa');
                  }}
                >
                  <a className="text-success" style={{ color: '#097B3F' }}>
                    <input
                      type="radio"
                      name="radio-5"
                      className="radio radio-success checked:bg-success-content"
                      style={{ backgroundColor: '#94EFB9', color: '#097B3F' }}
                      checked={selectedAlgorithmClipping === 'LiBa'}
                      readOnly
                    />
                    {'Liang-Barsky'}
                  </a>
                </li>
              </ul>
            }
          </div>
        </div>
      ) : (
        <div
          className="dropdown dropdown-center"
          onClick={() => {
            setSelectedShape(null);
          }}
        >
          <button
            className={`btn ${
              mode === 'clipping'
                ? 'btn-success'
                : 'btn-soft btn-success hover:btn-success'
            }`}
            onClick={() => {
              setMode('clipping');
              setSelectedShape(null)
            }}
          >
            Recortar
          </button>
          {
            <ul
              tabIndex={2}
              className="dropdown-content menu bg-success-content rounded-box z-1 w-52 p-2 shadow-sm"
              style={{ backgroundColor: '#94EFB9' }}
            >
              <li
                onClick={() => {
                  setMode('clipping');
                  setSelectedAlgorithmClipping('CoSu');
                }}
              >
                <a className="text-success" style={{ color: '#097B3F' }}>
                  <input
                    type="radio"
                    name="radio-5"
                    className="radio radio-success checked:bg-success-content"
                    style={{ backgroundColor: '#94EFB9', color: '#097B3F' }}
                    checked={selectedAlgorithmClipping === 'CoSu'}
                    readOnly
                  />
                  {'Cohen-Sutherland'}
                </a>
              </li>
              <li
                onClick={() => {
                  setMode('clipping');
                  setSelectedAlgorithmClipping('LiBa');
                }}
              >
                <a className="text-success" style={{ color: '#097B3F' }}>
                  <input
                    type="radio"
                    name="radio-5"
                    className="radio radio-success checked:bg-success-content"
                    style={{ backgroundColor: '#94EFB9', color: '#097B3F' }}
                    checked={selectedAlgorithmClipping === 'LiBa'}
                    readOnly
                  />
                  {'Liang-Barsky'}
                </a>
              </li>
            </ul>
          }
        </div>
      )}

      <button
        className={`btn ${
          selectedShape
            ? 'btn-soft btn-warning'
            : 'btn-dash hover:btn-dash btn-neutral'
        } `}
        onClick={() => {
          if (selectedShape) {
            if (window.confirm('Tem certeza que deseja APAGAR a forma?')) {
              setMode('transform');
              setDrawnShapes((prevShapes) =>
                prevShapes.filter((shape) => shape !== selectedShape),
              );
              setSelectedShape(null);
              setNewClicks([]);
              setReRender(!reRender);
            }
          }
        }}
      >
        Apagar
      </button>

      <button
        className="btn btn-soft btn-error"
        onClick={() => {
          if (window.confirm('Tem certeza que deseja LIMPAR todo o canvas?')) {
            setMode(null);
            setDrawnShapes([]);
            setReRender(!reRender);
            setNewClicks([]);
            setDrawnClipper([]);
            setClippedShapes([]);
          }
        }}
      >
        Limpar
      </button>
    </div>
  );
};

export default Functionalities;
