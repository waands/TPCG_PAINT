import React from 'react';
import { Shape } from '../utils/Shapes';

interface ActionsTimelineProps {
  drawnShapes: Shape[];
  mode: string | null;
  selectedAlgorithmLine: 'DDA' | 'Bresenham';
  selectedColor: string;
  newClicks: { x: number; y: number }[];
  transformType: string | null;
  selectedAlgorithmClipping: 'CoSu' | 'LiBa';
  //drawn: boolean;
}

export const ActionsTimeline: React.FC<ActionsTimelineProps> = ({
  drawnShapes,
  mode,
  selectedAlgorithmLine,
  selectedAlgorithmClipping,
  selectedColor,
  newClicks,
  transformType,
  //drawn,
}) => {
  let theme =
    mode === 'transform'
      ? 'badge-accent'
      : mode === 'line'
      ? 'badge-primary'
      : mode === 'circle'
      ? 'badge-secondary'
      : mode === 'clipping'
      ? 'badge-success'
      : mode === 'polygon'
      ? 'badge-info'
      : 'badge-ghost';

  return (
    <div className="timeline">
      {mode != null ? (
        <div className={`badge ${theme}`} style={{ marginRight: '5px' }}>
          {mode === 'transform'
            ? 'Transformar'
            : mode === 'line'
            ? 'Reta'
            : mode === 'circle'
            ? 'Círculo'
            : mode === 'clipping'
            ? 'Recorte'
            : mode === 'polygon'
            ? 'Polígono'
            : ''}
        </div>
      ) : null}

      {selectedAlgorithmLine &&
      mode != null &&
      mode != 'transform' &&
      mode != 'clipping' ? (
        <div
          className={`badge badge-soft ${theme}`}
          style={{ marginRight: '5px' }}
        >
          {mode === 'line'  || 'polygon' ? selectedAlgorithmLine : ''}
        </div>
      ) : null}
      {selectedAlgorithmClipping &&
      mode != null &&
      mode != 'transform' &&
      mode != 'line' && mode != 'polygon' && mode != 'circle' ? (
        <div
          className={`badge badge-soft ${theme}`}
          style={{ marginRight: '5px' }}
        >
          {mode === 'clipping'
            ? selectedAlgorithmClipping === 'CoSu'
              ? 'Cohen-Sutherland'
              : 'Liang-Barsky'
            : ''}
        </div>
      ) : null}
      {selectedColor &&
      mode != null &&
      mode != 'transform' &&
      mode != 'clipping' ? (
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
      selectedAlgorithmLine &&
      mode != null &&
      mode != 'transform' ? (
        <div
          className={`tooltip tooltip-bottom ${
            mode === 'transform'
              ? 'tooltip-accent'
              : mode === 'line'
              ? 'tooltip-primary'
              : mode === 'circle'
              ? 'tooltip-secondary'
              : mode === 'clipping'
              ? 'tooltip-success'
              : 'tooltip-ghost'
          }`}
          data-tip={`(${newClicks[0].x}, ${newClicks[0].y})`}
        >
          <div
            className={`badge badge-soft ${theme}`}
            style={{ marginRight: '5px' }}
          >
            P1
          </div>
        </div>
      ) : null}
      {newClicks[1] &&
      selectedAlgorithmLine &&
      mode != null &&
      mode != 'transform' ? (
        <div
          className={`tooltip tooltip-bottom ${
            mode === 'transform'
              ? 'tooltip-accent'
              : mode === 'line'
              ? 'tooltip-primary'
              : mode === 'circle'
              ? 'tooltip-secondary'
              : mode === 'clipping'
              ? 'tooltip-success'
              : 'tooltip-ghost'
          }`}
          data-tip={`(${newClicks[1].x}, ${newClicks[1].y})`}
        >
          <div
            className={`badge badge-soft ${theme}`}
            style={{ marginRight: '5px' }}
          >
            P2
          </div>
        </div>
      ) : null}

      {newClicks[0] && newClicks[1] && mode != 'transform' && mode ? (
        <div
          className={`badge badge-soft ${theme}`}
          style={{ marginRight: '5px' }}
        >
          {mode === 'clipping' ? 'Recortado' : 'Desenhado'}
        </div>
      ) : null}
      {mode === 'transform' && drawnShapes.some((shape) => shape.isSelected) ? (
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
            : transformType === 'reflection'
            ? 'Refletir'
            : ''}
        </div>
      ) : null}
    </div>
  );
};

export default ActionsTimeline;
