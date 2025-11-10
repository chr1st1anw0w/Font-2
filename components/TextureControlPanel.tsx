import React, { useState, useCallback } from 'react';
import { TextureParameters, GeometricShape, ArrangementType, RotationType, ColorMode, AlgorithmType } from '../types';

interface TextureControlPanelProps {
  parameters: TextureParameters;
  onParametersChange: (params: TextureParameters) => void;
  onGenerate: () => void;
  isGenerating?: boolean;
}

const TextureControlPanel: React.FC<TextureControlPanelProps> = ({
  parameters,
  onParametersChange,
  onGenerate,
  isGenerating = false,
}) => {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(['basic'])
  );

  const toggleSection = useCallback((section: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  }, [expandedSections]);

  const updateParam = useCallback(<K extends keyof TextureParameters>(
    key: K,
    value: TextureParameters[K]
  ) => {
    onParametersChange({ ...parameters, [key]: value });
  }, [parameters, onParametersChange]);

  const updateAlgorithmParam = useCallback((key: string, value: any) => {
    onParametersChange({
      ...parameters,
      algorithmParams: { ...parameters.algorithmParams, [key]: value },
    });
  }, [parameters, onParametersChange]);

  const shapeTypes: GeometricShape[] = [
    'circle', 'square', 'triangle', 'hexagon', 'pentagon', 'star',
    'wave', 'spiral', 'radial', 'grid',
  ];

  const arrangementTypes: ArrangementType[] = ['grid', 'spiral', 'radial', 'random', 'linear'];
  const rotationTypes: RotationType[] = ['fixed', 'incremental', 'random'];
  const colorModes: ColorMode[] = ['single', 'gradient', 'palette', 'random'];
  const algorithms: AlgorithmType[] = ['perlin', 'simplex', 'voronoi', 'fibonacci', 'none'];

  return (
    <div className="w-96 bg-gray-900 border-l border-gray-800 flex flex-col shadow-2xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-800 bg-gray-950/50">
        <h2 className="font-semibold text-white flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 text-purple-400">
            <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"/>
          </svg>
          紋理參數
        </h2>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar texture-scrollbar">

        {/* === 級別 1：快速訪問（始終展開）=== */}
        <div className="bg-gradient-to-r from-purple-900/20 to-transparent border border-purple-700/30 rounded-lg p-4 space-y-4">
          <h3 className="text-xs font-bold text-purple-300 uppercase tracking-wide">⚡ 快速調整</h3>

          {/* 形狀類型 */}
          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase mb-2">形狀</label>
            <div className="grid grid-cols-5 gap-1.5">
              {shapeTypes.slice(0, 5).map(shape => (
                <button
                  key={shape}
                  onClick={() => updateParam('shapeType', shape)}
                  className={`text-xs py-1.5 rounded border transition-colors capitalize ${
                    parameters.shapeType === shape
                      ? 'bg-purple-600/40 border-purple-500 text-purple-200 font-semibold'
                      : 'bg-gray-950 border-gray-700 text-gray-400 hover:border-gray-500 hover:bg-gray-850'
                  }`}
                  title={shape}
                >
                  {shape.substring(0, 3)}
                </button>
              ))}
            </div>
          </div>

          {/* 數量 */}
          <div>
            <div className="flex justify-between items-center">
              <label className="text-xs font-semibold text-gray-400 uppercase">數量</label>
              <span className="text-sm font-bold text-purple-300">{parameters.quantity}</span>
            </div>
            <input
              type="range"
              min="1"
              max="100"
              value={parameters.quantity}
              onChange={(e) => updateParam('quantity', parseInt(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>1</span>
              <span>100</span>
            </div>
          </div>

          {/* 排列方式 */}
          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase mb-2">排列</label>
            <div className="grid grid-cols-3 gap-2">
              {arrangementTypes.map(type => (
                <button
                  key={type}
                  onClick={() => updateParam('arrangement', type)}
                  className={`text-xs py-1.5 rounded border transition-colors capitalize ${
                    parameters.arrangement === type
                      ? 'bg-purple-600/40 border-purple-500 text-purple-200 font-semibold'
                      : 'bg-gray-950 border-gray-700 text-gray-400 hover:border-gray-500 hover:bg-gray-850'
                  }`}
                >
                  {type.substring(0, 4)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 旋轉與尺度區 */}
        <div className="border border-gray-700 rounded-lg overflow-hidden">
          <button
            onClick={() => toggleSection('transform')}
            className="w-full px-4 py-3 flex items-center justify-between bg-gray-800 hover:bg-gray-700 transition-colors"
          >
            <span className="font-semibold text-sm">旋轉與尺度</span>
            <svg className={`w-4 h-4 transition-transform ${expandedSections.has('transform') ? 'rotate-180' : ''}`}
              xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </button>
          {expandedSections.has('transform') && (
            <div className="p-4 bg-gray-850 space-y-4 border-t border-gray-700">

              {/* 旋轉角度 */}
              <div>
                <div className="flex justify-between">
                  <label className="text-xs font-semibold text-gray-400 uppercase">旋轉角度</label>
                  <span className="text-sm font-bold text-purple-300">{parameters.rotation}°</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="360"
                  value={parameters.rotation}
                  onChange={(e) => updateParam('rotation', parseInt(e.target.value))}
                  className="w-full"
                />
              </div>

              {/* 尺度 */}
              <div>
                <div className="flex justify-between">
                  <label className="text-xs font-semibold text-gray-400 uppercase">尺度</label>
                  <span className="text-sm font-bold text-purple-300">{parameters.scale.toFixed(2)}x</span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="5"
                  step="0.1"
                  value={parameters.scale}
                  onChange={(e) => updateParam('scale', parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>
            </div>
          )}
        </div>

        {/* 視覺屬性區 */}
        <div className="border border-gray-700 rounded-lg overflow-hidden">
          <button
            onClick={() => toggleSection('visual')}
            className="w-full px-4 py-3 flex items-center justify-between bg-gray-800 hover:bg-gray-700 transition-colors"
          >
            <span className="font-semibold text-sm">視覺屬性</span>
            <svg className={`w-4 h-4 transition-transform ${expandedSections.has('visual') ? 'rotate-180' : ''}`}
              xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </button>
          {expandedSections.has('visual') && (
            <div className="p-4 bg-gray-850 space-y-4 border-t border-gray-700">

              {/* 筆畫寬度 */}
              <div>
                <div className="flex justify-between">
                  <label className="text-xs font-semibold text-gray-400 uppercase">筆畫寬度</label>
                  <span className="text-sm font-bold text-purple-300">{parameters.strokeWidth}px</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="50"
                  value={parameters.strokeWidth}
                  onChange={(e) => updateParam('strokeWidth', parseInt(e.target.value))}
                  className="w-full"
                />
              </div>

              {/* 密度 */}
              <div>
                <div className="flex justify-between">
                  <label className="text-xs font-semibold text-gray-400 uppercase">密度</label>
                  <span className="text-sm font-bold text-purple-300">{parameters.density}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={parameters.density}
                  onChange={(e) => updateParam('density', parseInt(e.target.value))}
                  className="w-full"
                />
              </div>

              {/* 透明度 */}
              <div>
                <div className="flex justify-between">
                  <label className="text-xs font-semibold text-gray-400 uppercase">透明度</label>
                  <span className="text-sm font-bold text-purple-300">{parameters.opacity}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={parameters.opacity}
                  onChange={(e) => updateParam('opacity', parseInt(e.target.value))}
                  className="w-full"
                />
              </div>
            </div>
          )}
        </div>

        {/* 色彩區 */}
        <div className="border border-gray-700 rounded-lg overflow-hidden">
          <button
            onClick={() => toggleSection('color')}
            className="w-full px-4 py-3 flex items-center justify-between bg-gray-800 hover:bg-gray-700 transition-colors"
          >
            <span className="font-semibold text-sm flex items-center gap-2">
              🎨 色彩設定
              <div className="flex gap-1 ml-2">
                <div
                  className="w-4 h-4 rounded border border-gray-600"
                  style={{ backgroundColor: parameters.primaryColor }}
                />
                <div
                  className="w-4 h-4 rounded border border-gray-600"
                  style={{ backgroundColor: parameters.secondaryColor }}
                />
              </div>
            </span>
            <svg className={`w-4 h-4 transition-transform ${expandedSections.has('color') ? 'rotate-180' : ''}`}
              xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </button>
          {expandedSections.has('color') && (
            <div className="p-4 bg-gray-850 space-y-4 border-t border-gray-700">

              {/* 色彩模式 */}
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase mb-2">色彩模式</label>
                <div className="grid grid-cols-2 gap-2">
                  {(['single', 'gradient', 'palette', 'random'] as ColorMode[]).map(mode => (
                    <button
                      key={mode}
                      onClick={() => updateParam('colorMode', mode)}
                      className={`text-xs py-2 rounded border transition-colors capitalize ${
                        parameters.colorMode === mode
                          ? 'bg-purple-600/30 border-purple-500 text-purple-200'
                          : 'bg-gray-950 border-gray-700 text-gray-400 hover:border-gray-500'
                      }`}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
              </div>

              {/* 主要色彩 */}
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase mb-2">主要色彩</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={parameters.primaryColor}
                    onChange={(e) => updateParam('primaryColor', e.target.value)}
                    className="w-12 h-10 rounded cursor-pointer border border-gray-700"
                  />
                  <input
                    type="text"
                    value={parameters.primaryColor}
                    onChange={(e) => updateParam('primaryColor', e.target.value)}
                    className="flex-1 bg-gray-950 border border-gray-700 rounded px-2 py-1 text-xs text-gray-200 uppercase font-mono"
                  />
                </div>
              </div>

              {/* 次要色彩 */}
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase mb-2">次要色彩</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={parameters.secondaryColor || '#FFFFFF'}
                    onChange={(e) => updateParam('secondaryColor', e.target.value)}
                    className="w-12 h-10 rounded cursor-pointer border border-gray-700"
                  />
                  <input
                    type="text"
                    value={parameters.secondaryColor || '#FFFFFF'}
                    onChange={(e) => updateParam('secondaryColor', e.target.value)}
                    className="flex-1 bg-gray-950 border border-gray-700 rounded px-2 py-1 text-xs text-gray-200 uppercase font-mono"
                  />
                </div>
              </div>

              {/* 背景色 */}
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase mb-2">背景色</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={parameters.backgroundColor}
                    onChange={(e) => updateParam('backgroundColor', e.target.value)}
                    className="w-12 h-10 rounded cursor-pointer border border-gray-700"
                  />
                  <input
                    type="text"
                    value={parameters.backgroundColor}
                    onChange={(e) => updateParam('backgroundColor', e.target.value)}
                    className="flex-1 bg-gray-950 border border-gray-700 rounded px-2 py-1 text-xs text-gray-200 uppercase font-mono"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 演算法區 */}
        <div className="border border-gray-700 rounded-lg overflow-hidden">
          <button
            onClick={() => toggleSection('algorithm')}
            className="w-full px-4 py-3 flex items-center justify-between bg-gray-800 hover:bg-gray-700 transition-colors"
          >
            <span className="font-semibold text-sm">演算法設定</span>
            <svg className={`w-4 h-4 transition-transform ${expandedSections.has('algorithm') ? 'rotate-180' : ''}`}
              xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </button>
          {expandedSections.has('algorithm') && (
            <div className="p-4 bg-gray-850 space-y-4 border-t border-gray-700">

              {/* 演算法選擇 */}
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase mb-2">演算法類型</label>
                <div className="grid grid-cols-2 gap-2">
                  {algorithms.map(algo => (
                    <button
                      key={algo}
                      onClick={() => updateParam('algorithm', algo)}
                      className={`text-xs py-2 rounded border transition-colors capitalize ${
                        parameters.algorithm === algo
                          ? 'bg-purple-600/30 border-purple-500 text-purple-200'
                          : 'bg-gray-950 border-gray-700 text-gray-400 hover:border-gray-500'
                      }`}
                    >
                      {algo}
                    </button>
                  ))}
                </div>
              </div>

              {/* 頻率 */}
              <div>
                <div className="flex justify-between">
                  <label className="text-xs font-semibold text-gray-400 uppercase">頻率</label>
                  <span className="text-sm font-bold text-purple-300">{(parameters.algorithmParams.frequency || 0.5).toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="2"
                  step="0.1"
                  value={parameters.algorithmParams.frequency || 0.5}
                  onChange={(e) => updateAlgorithmParam('frequency', parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>

              {/* 振幅 */}
              <div>
                <div className="flex justify-between">
                  <label className="text-xs font-semibold text-gray-400 uppercase">振幅</label>
                  <span className="text-sm font-bold text-purple-300">{(parameters.algorithmParams.amplitude || 0.3).toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={parameters.algorithmParams.amplitude || 0.3}
                  onChange={(e) => updateAlgorithmParam('amplitude', parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 底部按鈕 */}
      <div className="border-t border-gray-800 p-4 bg-gray-950/50">
        <button
          onClick={onGenerate}
          disabled={isGenerating}
          className="w-full py-2.5 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-700 disabled:text-gray-500 rounded-md text-white font-medium transition-colors flex justify-center items-center"
        >
          {isGenerating ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              生成中...
            </>
          ) : '✨ 生成紋理'}
        </button>
      </div>
    </div>
  );
};

export default TextureControlPanel;
