import { useState } from 'react';
import MouseHighlight from './extra/MouseHighlight';
import Controls from './components/Controls';
import Functionalities from './components/Functionalities';
import Canvas from './components/Canvas';
import { Shape } from './components/Shapes';
import {ActionsTimeline} from './extra/ActionsTimeline';
import GridCanvas from './extra/GridCanvas';
import {Clipper } from './utils/Clipping';


function App() {
  const [showGrid, setShowGrid] = useState(true); //mostrar grid
  const [gridThickness, setGridThickness] = useState(1); //grossura do grid
  const [pixelSize, setPixelSize] = useState(10); //tamanho do pixel
  const [canvasSize, setCanvasSize] = useState({
    width: Math.floor((window.innerWidth - 200) / pixelSize) * pixelSize,
    height: Math.floor((window.innerHeight - 290) / pixelSize) * pixelSize,
  }); //tamanho do canvas
  const [mode, setMode] = useState<string | null>(null); //modo de desenho
  const [drawnShapes, setDrawnShapes] = useState<Shape[]>([]); //formas desenhadas
  const [clippedShapes, setClippedShapes] = useState<Shape[]>([]); //formas recortadas
  const [drawnClipper, setDrawnClipper] = useState<Clipper[]>([]); //clipper desenhado
  const [selectedAlgorithmLine, setSelectedAlgorithmLine] = useState<
    'DDA' | 'Bresenham'
  >('DDA'); //algoritmo de desenho de reta
  const [selectedAlgorithmClipping, setselectedAlgorithmClipping] = useState<
    'CoSu' | 'LiBa'
  >('CoSu'); //algoritmo de recorte
  const [selectedColor, setSelectedColor] = useState<string>('#000'); //cor selecionada
  const [selectedShape, setSelectedShape] = useState<Shape | null>(null); //forma selecionada

  const [mousePos, setMousePos] = useState<{ x: number; y: number }>({ x: 0, y: 0 }); //posição do mouse
  const [highlight, setHighlight] = useState<boolean>(true); //destacar pixel
  
  const [reRender , setReRender] = useState<boolean>(false); //forçar renderização

  const [newClicks, setNewClicks] = useState<{x: number; y: number}[]>([]); //armazena cliques para desenho de formas

  const [transformType, setTransformType] = useState<string | null>(null); //tipo de transformação

  const [clickedHighlight, setClickedHighlight] = useState<{x: number; y: number}>(); //destacar pixel clicado

  // Armazena cliques para construir retangulo de seleção
  const [transformRectPoints, setTransformRectPoints] = useState<{ x: number; y: number }[]>([]);

  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>

      <p>Wanderson Teixeira dos Reis Junior</p>


      <div className="badge badge-soft badge-neutral"
        style={{ position: 'absolute', top: '10px', right: '10px' }}
      >x: {mousePos.x} | y:{mousePos.y}</div>

      <div style={{position: 'absolute', top: '10px', left: '10px' }}>
        {/*componente com indicações das ações do usuário*/}
        <ActionsTimeline
          drawnShapes={drawnShapes}
          mode={mode}
          selectedAlgorithmLine={selectedAlgorithmLine}
          selectedAlgorithmClipping={selectedAlgorithmClipping}
          selectedColor={selectedColor}
          newClicks={newClicks}
          transformType={transformType}
        />
      </div>

      {/*<div className={`badge ${mode === 'transform' ? 'badge-accent' : mode === 'line' ? 'badge-primary' : mode === 'circle' ? 'badge-secondary' : 'badge-ghost' }`}
        style={{ position: 'absolute', top: '10px', left: '10px' }}
      >{mode === 'transform' ? 'Transformada' : mode === 'line' ? 'Reta' : mode === 'circle' ? 'Círculo' : '' }</div>
      */}
      {/*componente com botões e sliders que permitem configurar tamanho do canvas, espessura da grade, tamanho do pixel, entre outros parâmetros de interface.*/}
      <Controls
        showGrid={showGrid}
        setShowGrid={setShowGrid}
        gridThickness={gridThickness}
        setGridThickness={setGridThickness}
        pixelSize={pixelSize}
        setPixelSize={setPixelSize}
        canvasSize={canvasSize}
        setCanvasSize={setCanvasSize}
        setHighlight={setHighlight}
        highlight={highlight}
      />
      <div style={{ position: 'relative' }}>
        {/*camada separada para desenhar a grade e o retângulo de seleção, sem “sujar” o canvas principal.*/}
      <GridCanvas
        pixelSize={pixelSize}
        canvasSize={canvasSize}
        gridThickness={gridThickness}
        showGrid={showGrid}
        clickedHighlight={clickedHighlight}
        transformRectPoints={transformRectPoints}
        transformType={transformType}
      />
      {/*camada separada para desenhar o highlight do mouse, sem “sujar” o canvas principal.*/}
      {highlight && (<MouseHighlight pixelSize={pixelSize} canvasSize={canvasSize} mousePos={mousePos} />)}

      {/*canvas principal, onde as formas são desenhadas.*/}
      <Canvas
        gridThickness={gridThickness}
        pixelSize={pixelSize}
        mode={mode}
        canvasSize={canvasSize}
        drawnShapes={drawnShapes}
        setDrawnShapes={setDrawnShapes}
        selectedAlgorithmLine={selectedAlgorithmLine}
        selectedColor={selectedColor}
        setSelectedShape={setSelectedShape}
        selectedShape={selectedShape}
        setMousePos={setMousePos}
        reRender={reRender}
        newClicks={newClicks}
        setNewClicks={setNewClicks}
        setClickedHighlight={setClickedHighlight}
        setDrawnClipper={setDrawnClipper}
        drawnClipper={drawnClipper}
        selectedAlgorithmClipping={selectedAlgorithmClipping}
        setClippedShapes={setClippedShapes}
        clippedShapes={clippedShapes}
        setTransformRectPoints={setTransformRectPoints}
      />
      </div>
      {/*componente com botões para chamar as funções de desenho de formas, transformar, recortar, apagar e limpar.*/}
      <Functionalities
        mode={mode}
        setMode={setMode}
        setDrawnShapes={setDrawnShapes}
        drawnShapes={drawnShapes}
        setSelectedColor={setSelectedColor}
        selectedColor={selectedColor}
        setSelectedAlgorithmLine={setSelectedAlgorithmLine}
        selectedAlgorithmLine={selectedAlgorithmLine}
        selectedShape={selectedShape}
        setSelectedShape={setSelectedShape}
        setReRender={setReRender}
        reRender={reRender}
        setNewClicks={setNewClicks}
        setTransformType={setTransformType}
        transformType={transformType}
        setSelectedAlgorithmClipping={setselectedAlgorithmClipping}
        selectedAlgorithmClipping={selectedAlgorithmClipping}
        setDrawnClipper={setDrawnClipper}
        drawnClipper={drawnClipper}
        setClippedShapes={setClippedShapes}
        clippedShapes={clippedShapes}
      />
    </div>
  );
}

export default App;
