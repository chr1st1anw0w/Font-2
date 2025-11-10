import React, { useState } from 'react';

interface NavigationBarProps {
  canvasWidth: number;
  canvasHeight: number;
  zoomLevel: number;
  onZoomChange: (zoom: number) => void;
  onResetZoom: () => void;
  onFitToScreen: () => void;
}

const NavigationBar: React.FC<NavigationBarProps> = ({
  canvasWidth,
  canvasHeight,
  zoomLevel,
  onZoomChange,
  onResetZoom,
  onFitToScreen,
}) => {
  const [showZoomMenu, setShowZoomMenu] = useState(false);

  const handleZoomIn = () => {
    onZoomChange(Math.min(zoomLevel + 10, 200));
  };

  const handleZoomOut = () => {
    onZoomChange(Math.max(zoomLevel - 10, 25));
  };

  const handleZoomChange = (value: number) => {
    onZoomChange(value);
    setShowZoomMenu(false);
  };

  const presetZooms = [25, 50, 75, 100, 125, 150, 200];

  return (
    <div className="fixed bottom-6 right-6 bg-gray-800 border border-gray-700 rounded-lg shadow-xl p-4 flex items-center gap-3 z-40">
      {/* 縮放信息 */}
      <div className="flex items-center gap-3">
        {/* 尺寸顯示 */}
        <span className="text-xs text-gray-400 font-mono">
          {canvasWidth} × {canvasHeight}
        </span>

        {/* 分隔線 */}
        <div className="w-px h-6 bg-gray-600"></div>

        {/* 縮放按鈕 */}
        <button
          onClick={handleZoomOut}
          className="p-1.5 hover:bg-gray-700 rounded transition-colors text-gray-400 hover:text-white"
          title="縮小 (Ctrl + -)"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.35-4.35"></path>
            <line x1="8" y1="11" x2="14" y2="11"></line>
          </svg>
        </button>

        {/* 縮放百分比 */}
        <div className="relative">
          <button
            onClick={() => setShowZoomMenu(!showZoomMenu)}
            className="min-w-[70px] px-2 py-1.5 text-sm font-mono font-semibold text-white bg-gray-700 hover:bg-gray-600 rounded transition-colors flex items-center justify-between"
          >
            {zoomLevel}%
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className={`ml-1 transition-transform ${showZoomMenu ? 'rotate-180' : ''}`}
            >
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </button>

          {/* 縮放菜單 */}
          {showZoomMenu && (
            <div className="absolute bottom-full mb-2 right-0 bg-gray-900 border border-gray-700 rounded-lg shadow-xl py-1 min-w-[120px] z-50">
              {presetZooms.map((zoom) => (
                <button
                  key={zoom}
                  onClick={() => handleZoomChange(zoom)}
                  className={`w-full px-4 py-2 text-sm text-left hover:bg-gray-800 transition-colors ${
                    zoomLevel === zoom ? 'bg-purple-600/30 text-purple-200 font-semibold' : 'text-gray-300'
                  }`}
                >
                  {zoom}%
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 放大按鈕 */}
        <button
          onClick={handleZoomIn}
          className="p-1.5 hover:bg-gray-700 rounded transition-colors text-gray-400 hover:text-white"
          title="放大 (Ctrl + +)"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.35-4.35"></path>
            <line x1="8" y1="11" x2="14" y2="11"></line>
            <line x1="11" y1="8" x2="11" y2="14"></line>
          </svg>
        </button>

        {/* 分隔線 */}
        <div className="w-px h-6 bg-gray-600"></div>

        {/* 重置按鈕 */}
        <button
          onClick={onResetZoom}
          className="px-3 py-1.5 text-xs font-semibold text-gray-300 hover:text-white bg-gray-700 hover:bg-gray-600 rounded transition-colors"
          title="重置為 100%"
        >
          1:1
        </button>

        {/* 適應屏幕按鈕 */}
        <button
          onClick={onFitToScreen}
          className="px-3 py-1.5 text-xs font-semibold text-gray-300 hover:text-white bg-gray-700 hover:bg-gray-600 rounded transition-colors flex items-center gap-1"
          title="適應屏幕"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path>
          </svg>
          ⊡
        </button>
      </div>

      {/* 提示 */}
      <div className="text-xs text-gray-500 hidden hover:visible absolute bottom-full mb-2 right-0 bg-gray-900 px-3 py-2 rounded border border-gray-700 whitespace-nowrap">
        使用 Ctrl + 滾輪調整縮放
      </div>
    </div>
  );
};

export default NavigationBar;
