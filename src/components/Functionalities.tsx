import React from 'react';

interface FunctionalitiesProps {
  setMode: (mode: string | null) => void;
}

const Functionalities: React.FC<FunctionalitiesProps> = ({ setMode }) => {
  return (
    <div>
      <button
        className="btn btn-soft btn-primary"
        onClick={() => setMode('line')}
      >
        Reta
      </button>
      <button
        className="btn btn-soft btn-secondary"
        onClick={() => setMode('circle')}
      >
        Círculo
      </button>
      <button className="btn btn-soft btn-danger" onClick={() => setMode(null)}>
        Limpar
      </button>
    </div>
  );
};

export default Functionalities;
