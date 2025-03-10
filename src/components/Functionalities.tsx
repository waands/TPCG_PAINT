import React from 'react';

interface FunctionalitiesProps {
  setMode: (mode: string | null) => void;
  setDrawnShapes: React.Dispatch<
    React.SetStateAction<{ type: string; pixels: { x: number; y: number }[] }[]>
  >;
}

const Functionalities: React.FC<FunctionalitiesProps> = ({
  setMode,
  setDrawnShapes,
}) => {
  return (
    <div>
      <button className="btn btn-soft btn-accent" onClick={() => setMode('transform')}>Transformar</button>

      <div className="dropdown dropdown-center">
        <button
          tabIndex={0}
          role="button"
          className="btn btn-soft btn-primary m-1"
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
              />
              {'Bresenham'}
            </a>
          </li>
        </ul>
      </div>
      <button
        className="btn btn-soft btn-secondary"
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
