import React, { useState, useEffect, useRef, useCallback } from 'react';
import { TextureParameters, TextureGenerationResult } from '../types';
import { generateTexture, defaultTextureParameters } from '../services/textureGeneratorService';
import { exportTexture } from '../services/textureExportService';
import TextureControlPanel from './TextureControlPanel';
import TextureToolbar from './TextureToolbar';

interface TextureGeneratorProps {
  onClose?: () => void;
}

const TextureGenerator: React.FC<TextureGeneratorProps> = ({ onClose }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // 參數狀態
  const [parameters, setParameters] = useState<TextureParameters>(defaultTextureParameters);
  const [textureResult, setTextureResult] = useState<TextureGenerationResult | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showPanel, setShowPanel] = useState(true);

  // 縮放狀態
  const [zoom, setZoom] = useState(100);
  const [canvasSize, setCanvasSize] = useState({ width: 800, height: 800 });

  // 生成紋理
  const handleGenerateTexture = useCallback(async () => {
    setIsGenerating(true);
    try {
      const result = generateTexture(parameters);
      setTextureResult(result);
      renderTextureToCanvas(result.svgData);
    } catch (error) {
      console.error('紋理生成失敗:', error);
      alert('紋理生成失敗');
    } finally {
      setIsGenerating(false);
    }
  }, [parameters]);

  // 渲染 SVG 到 Canvas
  const renderTextureToCanvas = useCallback((svgData: string) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml' });
    const svgUrl = URL.createObjectURL(svgBlob);

    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
      URL.revokeObjectURL(svgUrl);
    };

    img.src = svgUrl;
  }, []);

  // 調整畫布大小
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const resizeCanvas = () => {
      const rect = container.getBoundingClientRect();
      const canvas = canvasRef.current;
      if (canvas) {
        canvas.width = rect.width;
        canvas.height = rect.height;
        if (textureResult) {
          renderTextureToCanvas(textureResult.svgData);
        }
      }
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    return () => window.removeEventListener('resize', resizeCanvas);
  }, [textureResult, renderTextureToCanvas]);

  // 初始生成
  useEffect(() => {
    handleGenerateTexture();
  }, []);

  // 匯出
  const handleExport = useCallback(async (format: 'svg' | 'png' | 'css') => {
    if (!textureResult) return;
    try {
      await exportTexture(textureResult, format);
    } catch (error) {
      console.error('匯出失敗:', error);
    }
  }, [textureResult]);

  // 縮放控制
  const handleZoom = (direction: 'in' | 'out' | 'reset' | number) => {
    if (typeof direction === 'number') {
      setZoom(direction);
    } else {
      const step = 10;
      switch (direction) {
        case 'in':
          setZoom(prev => Math.min(prev + step, 200));
          break;
        case 'out':
          setZoom(prev => Math.max(prev - step, 25));
          break;
        case 'reset':
          setZoom(100);
          break;
      }
    }
  };

  return (
    <div className="flex h-full w-full bg-gray-950 relative overflow-hidden">
      {/* 主畫布區域 */}
      <div className="flex-1 flex flex-col relative" ref={containerRef}>
        {/* 工具欄 */}
        <div className="h-12 bg-gray-900 border-b border-gray-800 flex items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <h1 className="text-sm font-semibold text-white">✨ 動態紋理生成工具</h1>
          </div>

          <div className="flex items-center gap-3">
            {/* 縮放控制 */}
            <div className="flex items-center gap-2 px-3 py-1 bg-gray-800 rounded border border-gray-700">
              <button
                onClick={() => handleZoom('out')}
                className="p-1 hover:bg-gray-700 rounded transition-colors text-gray-400 hover:text-white"
                title="縮小"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8"></circle>
                  <path d="m21 21-4.35-4.35"></path>
                  <line x1="8" y1="11" x2="14" y2="11"></line>
                </svg>
              </button>

              <input
                type="range"
                min="25"
                max="200"
                value={zoom}
                onChange={(e) => handleZoom(parseInt(e.target.value))}
                className="w-24"
                style={{ height: '4px' }}
              />

              <button
                onClick={() => handleZoom('in')}
                className="p-1 hover:bg-gray-700 rounded transition-colors text-gray-400 hover:text-white"
                title="放大"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8"></circle>
                  <path d="m21 21-4.35-4.35"></path>
                  <line x1="8" y1="11" x2="14" y2="11"></line>
                  <line x1="11" y1="8" x2="11" y2="14"></line>
                </svg>
              </button>

              <span className="text-xs text-gray-400 min-w-[40px] text-center">{zoom}%</span>

              <button
                onClick={() => handleZoom('reset')}
                className="px-2 py-1 text-xs text-gray-300 hover:text-white bg-gray-700 hover:bg-gray-600 rounded transition-colors"
                title="重置縮放"
              >
                1:1
              </button>
            </div>

            {/* 面板開關 */}
            <button
              onClick={() => setShowPanel(!showPanel)}
              className={`px-3 py-1.5 text-sm font-medium rounded transition-all border ${
                showPanel
                  ? 'bg-purple-600 border-purple-500 text-white'
                  : 'bg-gray-800 border-gray-700 text-gray-300 hover:border-purple-500'
              }`}
            >
              {showPanel ? '🔽 隱藏' : '▶ 顯示'}控制
            </button>
          </div>
        </div>

        {/* 畫布 */}
        <div className="flex-1 overflow-auto bg-gray-950 flex items-center justify-center p-4">
          <div
            className="bg-gray-900 rounded shadow-lg overflow-auto"
            style={{
              width: `${canvasSize.width * (zoom / 100)}px`,
              height: `${canvasSize.height * (zoom / 100)}px`,
              maxWidth: '100%',
              maxHeight: '100%',
            }}
          >
            <canvas
              ref={canvasRef}
              className="w-full h-full"
              style={{ display: 'block' }}
            />
          </div>
        </div>
      </div>

      {/* 控制面板 */}
      {showPanel && (
        <TextureControlPanel
          parameters={parameters}
          onParametersChange={setParameters}
          onGenerate={handleGenerateTexture}
          isGenerating={isGenerating}
        />
      )}

      {/* 匯出工具欄 */}
      <TextureToolbar
        textureResult={textureResult}
        isVisible={true}
        onExport={handleExport}
        isExporting={isGenerating}
      />

      {/* 快速操作按鈕 */}
      <div className="fixed bottom-6 left-6 flex flex-col gap-2">
        <button
          onClick={handleGenerateTexture}
          disabled={isGenerating}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
        >
          {isGenerating ? (
            <>
              <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              生成中...
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 5v14"></path>
                <path d="M5 12h14"></path>
              </svg>
              立即生成
            </>
          )}
        </button>

        {onClose && (
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white rounded-lg font-medium transition-colors"
          >
            關閉
          </button>
        )}
      </div>
    </div>
  );
};

export default TextureGenerator;
