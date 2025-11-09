import React, { useRef, useState, MouseEvent } from 'react';
import { ToolType, VectorNode, VectorShape, ShapeType, GlyphProperties } from '../types';

interface CanvasProps {
  showGrid: boolean;
  activeImage: string | null;
  currentGlyph: string;
  setCurrentGlyph: (glyph: string) => void;
  activeTool: ToolType;
  nodes: VectorNode[];
  setNodes: React.Dispatch<React.SetStateAction<VectorNode[]>>;
  selectedNodeId: string | null;
  setSelectedNodeId: (id: string | null) => void;
  shapes: VectorShape[];
  setShapes: React.Dispatch<React.SetStateAction<VectorShape[]>>;
  activeShapeType: ShapeType;
  currentProperties: GlyphProperties;
}

const Canvas: React.FC<CanvasProps> = ({
    showGrid, activeImage, currentGlyph, setCurrentGlyph, activeTool,
    nodes, setNodes, selectedNodeId, setSelectedNodeId, shapes, setShapes, activeShapeType, currentProperties
}) => {
  const GLYPH_PRESETS = ['A', 'B', 'C', 'G', '&', '?', '1', '2'];
  const canvasRef = useRef<HTMLDivElement>(null);
  const [isDraggingNode, setIsDraggingNode] = useState(false);

  // Shape drawing state
  const [isDrawingShape, setIsDrawingShape] = useState(false);
  const [shapeStart, setShapeStart] = useState<{x: number, y: number} | null>(null);
  const [tempShape, setTempShape] = useState<VectorShape | null>(null);

  const cycleGlyph = () => {
      const currentIndex = GLYPH_PRESETS.indexOf(currentGlyph);
      const nextIndex = (currentIndex + 1) % GLYPH_PRESETS.length;
      setCurrentGlyph(GLYPH_PRESETS[nextIndex]);
  }

  // Helper to get coordinates relative to the canvas container with enhanced snapping
  const getLocalCoordinates = (e: MouseEvent, snap: boolean = true) => {
      if (!canvasRef.current) return { x: 0, y: 0 };
      const rect = canvasRef.current.getBoundingClientRect();
      let x = e.clientX - rect.left;
      let y = e.clientY - rect.top;

      if (snap) {
          const SNAP_DIST = 8;
          let snappedX = false;
          let snappedY = false;

          // 1. Snap to Nodes (excluding self if dragging)
          for (const node of nodes) {
               if (selectedNodeId === node.id && isDraggingNode) continue;
               if (!snappedX && Math.abs(node.x - x) < SNAP_DIST) { x = node.x; snappedX = true; }
               if (!snappedY && Math.abs(node.y - y) < SNAP_DIST) { y = node.y; snappedY = true; }
          }

          // 2. Snap to Shapes (Edges and Centers)
          if (!snappedX || !snappedY) {
              for (const shape of shapes) {
                  const centers = { x: shape.x + shape.width / 2, y: shape.y + shape.height / 2 };
                  const edges = {
                      left: shape.x,
                      right: shape.x + shape.width,
                      top: shape.y,
                      bottom: shape.y + shape.height
                  };

                  // Center snap
                  if (!snappedX && Math.abs(centers.x - x) < SNAP_DIST) { x = centers.x; snappedX = true; }
                  if (!snappedY && Math.abs(centers.y - y) < SNAP_DIST) { y = centers.y; snappedY = true; }

                  // Edge snap
                  if (!snappedX) {
                      if (Math.abs(edges.left - x) < SNAP_DIST) { x = edges.left; snappedX = true; }
                      else if (Math.abs(edges.right - x) < SNAP_DIST) { x = edges.right; snappedX = true; }
                  }
                  if (!snappedY) {
                       if (Math.abs(edges.top - y) < SNAP_DIST) { y = edges.top; snappedY = true; }
                       else if (Math.abs(edges.bottom - y) < SNAP_DIST) { y = edges.bottom; snappedY = true; }
                  }
              }
          }

          // 3. Grid snapping (lowest priority)
          if (showGrid && (!snappedX || !snappedY)) {
              const GRID_SIZE = 10;
              if (!snappedX && (Math.abs(x % GRID_SIZE) < SNAP_DIST || Math.abs(x % GRID_SIZE) > GRID_SIZE - SNAP_DIST)) {
                   x = Math.round(x / GRID_SIZE) * GRID_SIZE;
              }
              if (!snappedY && (Math.abs(y % GRID_SIZE) < SNAP_DIST || Math.abs(y % GRID_SIZE) > GRID_SIZE - SNAP_DIST)) {
                   y = Math.round(y / GRID_SIZE) * GRID_SIZE;
              }
          }
      }

      return { x, y };
  };

  const handleMouseDown = (e: MouseEvent) => {
      // Always try to find a clicked node first, regardless of tool, for selection purposes if appropriate
      const { x: rawX, y: rawY } = getLocalCoordinates(e, false); // Raw coords for hit testing
      const clickedNode = [...nodes].reverse().find(n => Math.hypot(n.x - rawX, n.y - rawY) < 12);

      if (clickedNode) {
          setSelectedNodeId(clickedNode.id);
          if (activeTool === 'node') {
              setIsDraggingNode(true);
          }
          return; // Handled node click
      } else {
          // Clicked empty space
           if (activeTool !== 'pen') {
               setSelectedNodeId(null);
           }
      }

      // Tool specific actions if no node was clicked directly (or we want to create one)
      const { x, y } = getLocalCoordinates(e, activeTool !== 'selection'); // Snap for creation

      if (activeTool === 'pen') {
          const newNode: VectorNode = { id: `node-${Date.now()}`, x, y };
          setNodes(prev => [...prev, newNode]);
          setSelectedNodeId(newNode.id); // Select newly created node
      } else if (activeTool === 'shape') {
          setIsDrawingShape(true);
          setShapeStart({x, y});
          setTempShape({
              id: 'temp',
              type: activeShapeType,
              x, y, width: 0, height: 0,
              strokeColor: currentProperties.strokeColor,
              strokeWidth: currentProperties.strokeWidth,
              fillColor: currentProperties.fillColor
          });
          setSelectedNodeId(null);
      }
  };

  const handleMouseMove = (e: MouseEvent) => {
      const { x, y } = getLocalCoordinates(e, activeTool === 'node' || activeTool === 'shape');

      if (activeTool === 'node' && isDraggingNode && selectedNodeId) {
          setNodes(prev => prev.map(n => n.id === selectedNodeId ? { ...n, x, y } : n));
      } else if (activeTool === 'shape' && isDrawingShape && shapeStart) {
          const width = x - shapeStart.x;
          const height = y - shapeStart.y;
          const newX = width > 0 ? shapeStart.x : x;
          const newY = height > 0 ? shapeStart.y : y;
          const newW = Math.abs(width);
          const newH = Math.abs(height);
          setTempShape(prev => prev ? { ...prev, x: newX, y: newY, width: newW, height: newH } : null);
      }
  };

  const handleMouseUp = () => {
      if (activeTool === 'node') {
          setIsDraggingNode(false);
      } else if (activeTool === 'shape' && isDrawingShape && tempShape) {
          setIsDrawingShape(false);
          if (tempShape.width > 2 && tempShape.height > 2) {
              setShapes(prev => [...prev, { ...tempShape, id: `shape-${Date.now()}` }]);
          }
          setTempShape(null);
          setShapeStart(null);
      }
  };

  const pathData = nodes.length > 0
    ? `M ${nodes[0].x} ${nodes[0].y} ` + nodes.slice(1).map(n => `L ${n.x} ${n.y}`).join(' ')
    : '';

  return (
    <div
        ref={canvasRef}
        className={`flex-1 relative overflow-hidden bg-gray-950 ${showGrid ? 'grid-pattern' : ''} cursor-${activeTool === 'pen' || activeTool === 'shape' ? 'crosshair' : 'default'}`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
    >
       {showGrid && <div className="absolute inset-0 grid-pattern-sub pointer-events-none opacity-50"></div>}

      {!activeImage && nodes.length === 0 && shapes.length === 0 && !tempShape && (
          <div className="absolute top-4 left-4 z-10 flex items-center bg-gray-900/80 backdrop-blur-sm border border-gray-800 rounded-md p-1 shadow-lg">
              <button onClick={cycleGlyph} className="flex items-center space-x-2 px-3 py-1.5 hover:bg-gray-800 rounded transition-colors text-gray-300">
                  <span className="text-sm font-semibold text-gray-500 uppercase mr-1">Editing:</span>
                  <span className="font-mono text-lg text-white min-w-[1.5rem] text-center">{currentGlyph}</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500"><path d="m6 9 6 6 6-6"/></svg>
              </button>
          </div>
      )}

      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        {activeImage ? (
            <div className="relative shadow-2xl max-h-[80vh] max-w-[80vw] pointer-events-none">
                 <img src={activeImage} alt="Canvas Content" className="max-h-[80vh] max-w-full object-contain" />
            </div>
        ) : (
            nodes.length === 0 && shapes.length === 0 && !tempShape && (
                <svg width="100%" height="100%" viewBox="0 0 800 800" className="max-h-[80vh] w-auto text-gray-700 opacity-20 select-none p-20">
                  <text x="50%" y="54%" dominantBaseline="middle" textAnchor="middle" fontSize="600" fontFamily="sans-serif" fontWeight="900" fill="currentColor">
                    {currentGlyph}
                  </text>
                </svg>
            )
        )}
      </div>

      <svg className="absolute inset-0 w-full h-full pointer-events-none">
          {/* Shapes */}
          {[...shapes, tempShape].filter((s): s is VectorShape => s !== null).map(shape => {
               if (shape.type === 'path' && shape.pathData) {
                   return <path key={shape.id} d={shape.pathData} stroke={shape.strokeColor} strokeWidth={shape.strokeWidth} fill={shape.fillColor} className="pointer-events-auto" />;
               } else if (shape.type === 'rect') {
                  return <rect key={shape.id} x={shape.x} y={shape.y} width={shape.width} height={shape.height}
                        stroke={shape.strokeColor} strokeWidth={shape.strokeWidth} fill={shape.fillColor} className="pointer-events-auto" />;
               } else {
                  return <ellipse key={shape.id} cx={shape.x + shape.width / 2} cy={shape.y + shape.height / 2}
                           rx={shape.width / 2} ry={shape.height / 2}
                           stroke={shape.strokeColor} strokeWidth={shape.strokeWidth} fill={shape.fillColor} className="pointer-events-auto" />;
               }
          })}

          {/* Current Active Path being drawn */}
          {pathData && <path d={pathData} stroke={currentProperties.strokeColor} strokeWidth={currentProperties.strokeWidth} fill="none" />}

          {/* Nodes */}
          {(nodes.length > 0) && nodes.map((node) => (
              <g key={node.id} transform={`translate(${node.x}, ${node.y})`}>
                  {/* Larger invisible hit target */}
                  <circle r="12" fill="transparent" className="pointer-events-auto cursor-pointer" />
                  {/* Visible Node */}
                  <rect x="-4" y="-4" width="8" height="8"
                        fill={selectedNodeId === node.id ? "#5847eb" : "white"}
                        stroke="#5847eb" strokeWidth={selectedNodeId === node.id ? 2 : 1}
                        className={`pointer-events-none transition-colors`} />
              </g>
          ))}
      </svg>
    </div>
  );
};

export default Canvas;