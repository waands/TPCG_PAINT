import React from 'react';
import { Dispatch, SetStateAction } from 'react';
import { Shape } from '../utils/Shapes';
import ColorPicker from './ColorPicker';
import { useState, useRef } from 'react';

interface FunctionalitiesProps {
  setMode: (mode: string | null) => void;
  setDrawnShapes: Dispatch<SetStateAction<Shape[]>>;
  drawnShapes: Shape[];
  mode: string | null;
  setSeletedAlgorithm: (algorithm: 'DDA' | 'Bresenham') => void;
  selectedAlgorithm: 'DDA' | 'Bresenham';
  setSelectedColor: (color: string) => void;
  selectedColor: string;
  selectedShape: Shape | null;
}

const Functionalities: React.FC<FunctionalitiesProps> = ({
  setMode,
  setDrawnShapes,
  drawnShapes,
  mode,
  setSeletedAlgorithm,
  selectedAlgorithm,
  setSelectedColor,
  selectedColor,
  selectedShape,
}) => {
  const [showColorPicker, setShowColorPicker] = useState<boolean>(false);
  const [transformValue, setTransformValue] = useState<number>(1);
  const [transformType, setTransformType] = useState<string>();
  const [transformDropdownOpen, setTransformDropdownOpen] = useState(false);

  const handleColorChange = (color: string) => {
    setSelectedColor(color);
  };

  const handleTransform = (dx: number, dy: number) => {
    if (selectedShape) {
      //console.log(drawnShapes)
      // Criar uma cópia de todas as formas existentes, mas manter a mesma referência do selectedShape
      const newShapes = drawnShapes.map(shape => shape);
      
      // Aplicar a transformação na forma selecionada
      switch (transformType) {
        case 'translate':
          selectedShape.translate(
            (dx * transformValue),
            (dy * transformValue),
            1,
            1,
            0,
            0,
          );
          break;
        case 'scale':
          selectedShape.translate(
            0,
            0,
            transformValue,
            transformValue,
            0,
            0,
          );
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
            marginTop: '200px',
            marginLeft: '-660px',
          }}
        >
          <ColorPicker onChangeComplete={handleColorChange} />
        </div>
      )}

      <div className="dropdown dropdown-center">
        <button
          className={`btn ${
            mode === 'transform'
              ? 'btn-soft btn-accent'
              : 'btn-gray hover:btn-accent'
          } `}
          onClick={() => {
            setMode('transform');
            setTransformType('');
            setTransformDropdownOpen(!transformDropdownOpen);
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
      </div>

      {mode === 'transform' && transformType === 'translate' && (
        <div
          style={{
            position: 'absolute',
            zIndex: 1,
            marginTop: '190px',
            marginLeft: '-200px',
          }}
        >
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
              onChange={(e) => setTransformValue(parseInt(e.target.value) || 0)}
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
            position: 'absolute',
            zIndex: 1,
            marginTop: '150px',
            marginLeft: '-200px',
          }}
        >
          <div
            style={{ gap: '4px', marginTop: '4px' }}
            className="flex w-full justify-center"
          >
            <input
              style={{ marginTop: '10px' }}
              type="range"
              min="1"
              max="50"
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
              onChange={(e) => setTransformValue(parseInt(e.target.value) || 0)}
              min="1"
              max="50"
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
            position: 'absolute',
            zIndex: 1,
            marginTop: '150px',
            marginLeft: '-200px',
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
              onChange={(e) => setTransformValue(parseInt(e.target.value) || 0)}
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
        <div
          style={{
            position: 'absolute',
            zIndex: 1,
            marginTop: '150px',
            marginLeft: '-200px',
          }}
        >
          <div style={{ gap: '4px' }} className="flex w-full justify-center">
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

      <div className="dropdown dropdown-center" onClick={() => setMode('line')}>
        <button
          tabIndex={0}
          role="button"
          className={`btn m-1 ${
            mode === 'line'
              ? 'btn-soft btn-primary'
              : 'btn-gray hover:btn-primary'
          } `}
          onClick={() => setMode('line')}
        >
          Reta
        </button>
        <ul
          tabIndex={0}
          className="dropdown-content menu bg-primary-content rounded-box z-1 w-52 p-2 shadow-sm"
        >
          <li onClick={() => setMode('line')}>
            <a className="text-pimary">
              <input
                type="radio"
                name="radio-4"
                className="radio radio-primary checked:bg-primary-content"
                onClick={() => setSeletedAlgorithm('DDA')}
                defaultChecked
              />
              {'DDA'}
            </a>
          </li>
          <li>
            <a className="text-pimary">
              <input
                type="radio"
                name="radio-4"
                className="radio radio-primary checked:bg-primary-content"
                onClick={() => setSeletedAlgorithm('Bresenham')}
              />
              {'Bresenham'}
            </a>
          </li>
        </ul>
      </div>
      <button
        className={`btn ${
          mode === 'circle'
            ? 'btn-soft btn-secondary'
            : 'btn-gray hover:btn-secondary'
        } `}
        onClick={() => setMode('circle')}
      >
        Círculo
      </button>
      <button
        className="btn btn-soft btn-error"
        onClick={() => {
          if (window.confirm('Tem certeza que deseja limpar o canvas?')) {
            setMode(null);
            setDrawnShapes([]);
          }
        }}
      >
        Limpar
      </button>
    </div>
  );
};

export default Functionalities;
