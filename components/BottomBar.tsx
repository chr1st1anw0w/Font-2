import React from 'react';
import { ToolType, GlyphProperties, ShapeType, VectorNode } from '../types';

interface BottomBarProps {
  activeTool: ToolType;
  setActiveTool: (tool: ToolType) => void;
  zoomLevel: number;
  currentGlyph: string;
  glyphProperties: GlyphProperties;
  updateProperty: (key: keyof GlyphProperties, value: string | number) => void;
  activeShapeType: ShapeType;
  setActiveShapeType: (type: ShapeType) => void;
  nodes: VectorNode[];
  selectedNodeId: string | null;
  updateSelectedNode: (key: 'x' | 'y', value: number) => void;
  convertNodesToPath: () => void;
}

const BottomBar: React.FC<BottomBarProps> = ({
    activeTool, setActiveTool, zoomLevel, currentGlyph, glyphProperties, updateProperty,
    activeShapeType, setActiveShapeType, nodes, selectedNodeId, updateSelectedNode, convertNodesToPath
}) => {

  const toolBtnClass = (isActive: boolean) =>
    `p-2 rounded transition-colors ${isActive ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`;

  const inputClass = "bg-gray-900 border border-gray-700 text-gray-300 rounded px-2 py-1 text-xs w-14 text-center focus:border-indigo-500 focus:outline-none";
  const colorInputClass = "bg-gray-900 border border-gray-700 rounded h-6 w-8 p-0.5 cursor-pointer";
  const labelClass = "text-gray-500 text-xs uppercase mr-1.5 font-semibold";

  const selectedNode = selectedNodeId ? nodes.find(n => n.id === selectedNodeId) : null;

  const handleGlyphInputChange = (key: keyof GlyphProperties, e: React.ChangeEvent<HTMLInputElement>) => {
      let value: string | number = e.target.value;
      if (key !== 'fillColor' && key !== 'strokeColor') {
          value = Number(value) || 0;
      }
      updateProperty(key, value);
  };

  const handleNodeInputChange = (key: 'x' | 'y', e: React.ChangeEvent<HTMLInputElement>) => {
      const value = Number(e.target.value) || 0;
      updateSelectedNode(key, value);
  }

  return (
    <div className="h-14 bg-gray-900 border-t border-gray-800 flex items-center px-4 justify-between select-none relative z-10 text-sm">
      {/* Group 1: Status */}
      <div className="flex items-center space-x-6 w-1/4">
        <div className="flex flex-col">
            <span className="text-gray-500 text-xs">Tool</span>
            <span className="text-gray-300 capitalize">{activeTool}</span>
        </div>
        <div className="h-8 w-px bg-gray-800"></div>
        <div className="flex flex-col">
             <span className="text-gray-500 text-xs">Glyph</span>
             <span className="text-gray-300 font-mono">{currentGlyph}</span>
        </div>
        <div className="h-8 w-px bg-gray-800"></div>
        <div className="text-gray-300">{zoomLevel}%</div>
      </div>

      {/* Group 2: Tools & Path Actions */}
      <div className="flex items-center justify-center space-x-4">
          <div className="flex items-center space-x-2 bg-gray-950/50 px-4 py-2 rounded-lg border border-gray-800 relative">
            <button className={toolBtnClass(activeTool === 'selection')} onClick={() => setActiveTool('selection')} title="Selection Tool (V)">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 3 7.07 16.97 2.51-7.39 7.39-2.51L3 3z"/><path d="m13 13 6 6"/></svg>
            </button>
            <button className={toolBtnClass(activeTool === 'pen')} onClick={() => setActiveTool('pen')} title="Pen Tool (P)">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 19l7-7 3 3-7 7-3-3z"/><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/><path d="M2 2l7.586 7.586"/><circle cx="11" cy="11" r="2"/></svg>
            </button>
            <button className={toolBtnClass(activeTool === 'node')} onClick={() => setActiveTool('node')} title="Node Tool (A)">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M3 7V5a2 2 0 0 1 2-2h2"/><path d="M17 3h2a2 2 0 0 1 2 2v2"/><path d="M21 17v2a2 2 0 0 1-2 2h-2"/><path d="M7 21H5a2 2 0 0 1-2-2v-2"/></svg>
            </button>
            <div className="relative flex items-center">
                 <button className={toolBtnClass(activeTool === 'shape')} onClick={() => setActiveTool('shape')} title="Shape Tool (U)">
                    {activeShapeType === 'rect' ? (
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/></svg>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><ellipse cx="12" cy="12" rx="9" ry="6"/></svg>
                    )}
                </button>
                {activeTool === 'shape' && (
                    <div className="absolute top-full left-0 mt-2 bg-gray-900 border border-gray-800 rounded flex flex-col shadow-lg p-1 z-20">
                         <button className={`p-1.5 rounded ${activeShapeType === 'rect' ? 'bg-indigo-600' : 'hover:bg-gray-800'}`} onClick={() => setActiveShapeType('rect')} title="Rectangle">
                             <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/></svg>
                         </button>
                         <button className={`p-1.5 rounded ${activeShapeType === 'ellipse' ? 'bg-indigo-600' : 'hover:bg-gray-800'}`} onClick={() => setActiveShapeType('ellipse')} title="Ellipse">
                             <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><ellipse cx="12" cy="12" rx="9" ry="6"/></svg>
                         </button>
                    </div>
                )}
            </div>
          </div>

          {/* Path Action */}
          {nodes.length >= 2 && (
              <button
                  onClick={convertNodesToPath}
                  className="px-3 py-1.5 bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white border border-indigo-500/30 rounded-md text-xs font-medium transition-all flex items-center"
              >
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1.5"><path d="M6 21a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"/><path d="M18 9a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"/><path d="M8.6 16.4l9-11"/></svg>
                  Complete Path
              </button>
          )}
      </div>

      {/* Group 3 & 4: Layers & Properties */}
      <div className="flex items-center justify-end space-x-6 w-fit ml-auto">
        {/* Properties */}
        <div className="flex items-center space-x-3 text-gray-400">
            {/* Node or Global Transforms */}
            {selectedNode ? (
                <div className="flex items-center space-x-2 bg-indigo-900/20 px-2 py-1 rounded border border-indigo-500/30">
                     <span className="text-indigo-300 text-xs font-semibold uppercase mr-1">Node</span>
                     <div className="flex items-center"><span className={labelClass}>X</span><input type="text" className={inputClass} value={selectedNode.x} onChange={(e) => handleNodeInputChange('x', e)} /></div>
                     <div className="flex items-center"><span className={labelClass}>Y</span><input type="text" className={inputClass} value={selectedNode.y} onChange={(e) => handleNodeInputChange('y', e)} /></div>
                </div>
            ) : (
                <div className="flex items-center space-x-2 opacity-50 pointer-events-none" title="Select glyph or shape to edit properties">
                    <div className="flex items-center"><span className={labelClass}>X</span><input type="text" className={inputClass} value={glyphProperties.x} onChange={(e) => handleGlyphInputChange('x', e)} disabled /></div>
                    <div className="flex items-center"><span className={labelClass}>Y</span><input type="text" className={inputClass} value={glyphProperties.y} onChange={(e) => handleGlyphInputChange('y', e)} disabled /></div>
                    <div className="flex items-center"><span className={labelClass}>W</span><input type="text" className={inputClass} value={glyphProperties.w} onChange={(e) => handleGlyphInputChange('w', e)} disabled /></div>
                    <div className="flex items-center"><span className={labelClass}>H</span><input type="text" className={inputClass} value={glyphProperties.h} onChange={(e) => handleGlyphInputChange('h', e)} disabled /></div>
                </div>
            )}

             <div className="h-6 w-px bg-gray-800 mx-1"></div>
            {/* Advanced Styles */}
            <div className="flex items-center space-x-3">
                 <div className="flex items-center" title="Stroke">
                    <span className={labelClass}>Str</span>
                    <input type="color" className={colorInputClass} value={glyphProperties.strokeColor} onChange={(e) => handleGlyphInputChange('strokeColor', e)} />
                    <input type="text" className={`${inputClass} ml-1 !w-10`} value={glyphProperties.strokeWidth} onChange={(e) => handleGlyphInputChange('strokeWidth', e)} />
                 </div>
                 <div className="flex items-center" title="Fill Color">
                     <span className={labelClass}>Fill</span>
                    <input type="color" className={colorInputClass} value={glyphProperties.fillColor} onChange={(e) => handleGlyphInputChange('fillColor', e)} />
                 </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default BottomBar;