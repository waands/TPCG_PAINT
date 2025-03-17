import React from 'react';
import { Shape } from '../utils/Shapes';

interface ActionsTimelineProps {
  drawnShapes: Shape[];
  selectedShape: React.Dispatch<React.SetStateAction<Shape | null>>;
  mode: string | null;
  selectedAlgorithm: 'DDA' | 'Bresenham';
  selectedColor: string;
  newClicks: { x: number; y: number }[];
  transformType: string | null;
  //drawn: boolean;
}

export const ActionsTimeline: React.FC<ActionsTimelineProps> = ({
  drawnShapes,
  selectedShape,
  mode,
  selectedAlgorithm,
  selectedColor,
  newClicks,
  transformType,
  //drawn,
}) => {
  return (
    <div className="timeline">
      {mode != null ? (
        <div
          className={`badge ${
            mode === 'transform'
              ? 'badge-accent'
              : mode === 'line'
              ? 'badge-primary'
              : mode === 'circle'
              ? 'badge-secondary'
              : 'badge-ghost'
          }`}
          style={{ marginRight: '5px' }}
        >
          {mode === 'transform'
            ? 'Transformar'
            : mode === 'line'
            ? 'Reta'
            : mode === 'circle'
            ? 'Círculo'
            : ''}
        </div>
      ) : null}

      {selectedAlgorithm && mode != null && mode != 'transform' ? (
        <div
          className={`badge badge-soft ${
            mode === 'transform'
              ? 'badge-accent'
              : mode === 'line'
              ? 'badge-primary'
              : mode === 'circle'
              ? 'badge-secondary'
              : 'badge-ghost'
          }`}
          style={{ marginRight: '5px' }}
        >
          {selectedAlgorithm}
        </div>
      ) : null}
      {selectedColor && mode != null && mode != 'transform' ? (
        <div
          className="badge badge-soft"
          style={{
            backgroundColor: `${selectedColor}`,
            color: 'white',
            marginRight: '5px',
          }}
        >
          {selectedColor}
        </div>
      ) : null}

      {newClicks[0] &&
      selectedAlgorithm &&
      mode != null &&
      mode != 'transform' ? (
        <div
          className={`badge badge-soft ${
            mode === 'transform'
              ? 'badge-accent'
              : mode === 'line'
              ? 'badge-primary'
              : mode === 'circle'
              ? 'badge-secondary'
              : 'badge-ghost'
          }`}
          style={{ marginRight: '5px' }}
        >
          P1
        </div>
      ) : null}
      {newClicks[1] &&
      selectedAlgorithm &&
      mode != null &&
      mode != 'transform' ? (
        <div
          className={`badge badge-soft ${
            mode === 'transform'
              ? 'badge-accent'
              : mode === 'line'
              ? 'badge-primary'
              : mode === 'circle'
              ? 'badge-secondary'
              : 'badge-ghost'
          }`}
          style={{ marginRight: '5px' }}
        >
          P2
        </div>
      ) : null}

      {newClicks[0] && newClicks[1] && mode != 'transform' ? (
        <div
          className={`badge badge-soft ${
            mode === 'transform'
              ? 'badge-accent'
              : mode === 'line'
              ? 'badge-primary'
              : mode === 'circle'
              ? 'badge-secondary'
              : 'badge-ghost'
          }`}
          style={{ marginRight: '5px' }}
        >
          Desenhado
        </div>
      ) : null}
      {mode === 'transform' && drawnShapes.some(shape => shape.isSelected) ? (
        <div
          className={`badge badge-soft badge-accent`}
          style={{ marginRight: '5px' }}
        >
          Selecionada
        </div>
      ) : null}
      {mode === 'transform' && transformType != null ? (
        <div
          className={`badge badge-soft badge-accent`}
          style={{ marginRight: '5px' }}
        >
          {transformType === 'translate'
            ? 'Transladar'
            : transformType === 'scale'
            ? 'Escalar'
            : transformType === 'rotate'
            ? 'Rotacionar'
            : transformType === 'reflect'
            ? 'Refletir'
            : ''}
        </div>
      ) : null}
    </div>
  );
};

export default ActionsTimeline;
