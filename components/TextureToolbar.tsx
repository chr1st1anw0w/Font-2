import React, { useState, useRef, useEffect } from 'react';
import { TextureGenerationResult } from '../types';

interface TextureToolbarProps {
  textureResult: TextureGenerationResult | null;
  isVisible: boolean;
  onExport: (format: 'svg' | 'png' | 'css') => Promise<void>;
  isExporting?: boolean;
}

const TextureToolbar: React.FC<TextureToolbarProps> = ({
  textureResult,
  isVisible,
  onExport,
  isExporting = false,
}) => {
  const [showExportMenu, setShowExportMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // 處理外部點擊以關閉菜單
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowExportMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleExport = async (format: 'svg' | 'png' | 'css') => {
    try {
      await onExport(format);
      setShowExportMenu(false);
    } catch (error) {
      console.error('匯出失敗:', error);
    }
  };

  if (!isVisible || !textureResult) {
    return null;
  }

  return (
    <div className="fixed bottom-20 right-6 flex flex-col items-end gap-2 z-40">
      {/* Export Menu */}
      {showExportMenu && (
        <div
          ref={menuRef}
          className="bg-gray-900 border border-gray-700 rounded-lg shadow-xl overflow-hidden"
        >
          <div className="p-2 space-y-1 min-w-[160px]">
            {/* SVG Export */}
            <button
              disabled={isExporting}
              onClick={() => handleExport('svg')}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:bg-purple-600/20 hover:text-purple-200 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
              </svg>
              <div className="text-left">
                <div className="font-medium">SVG</div>
                <div className="text-xs text-gray-500">可縮放向量</div>
              </div>
            </button>

            {/* PNG Export */}
            <button
              disabled={isExporting}
              onClick={() => handleExport('png')}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:bg-purple-600/20 hover:text-purple-200 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <circle cx="8.5" cy="8.5" r="1.5"></circle>
                <polyline points="21 15 16 10 5 21"></polyline>
              </svg>
              <div className="text-left">
                <div className="font-medium">PNG</div>
                <div className="text-xs text-gray-500">光柵圖像</div>
              </div>
            </button>

            {/* CSS Export */}
            <button
              disabled={isExporting}
              onClick={() => handleExport('css')}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:bg-purple-600/20 hover:text-purple-200 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <polyline points="16 18 22 12 16 6"></polyline>
                <polyline points="8 6 2 12 8 18"></polyline>
              </svg>
              <div className="text-left">
                <div className="font-medium">CSS Grid</div>
                <div className="text-xs text-gray-500">網頁就緒</div>
              </div>
            </button>
          </div>
        </div>
      )}

      {/* Export Button */}
      <button
        onClick={() => setShowExportMenu(!showExportMenu)}
        disabled={isExporting}
        className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all shadow-lg border-2 ${
          showExportMenu
            ? 'bg-purple-600 border-purple-500 text-white'
            : 'bg-gray-800 border-gray-700 text-gray-200 hover:border-purple-500 hover:bg-gray-700'
        } disabled:opacity-50 disabled:cursor-not-allowed`}
        title="匯出紋理"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
          <polyline points="7 10 12 15 17 10"></polyline>
          <line x1="12" y1="15" x2="12" y2="3"></line>
        </svg>
        {isExporting ? '匯出中...' : '匯出'}
      </button>

      {/* Info Badge */}
      <div className="text-xs text-gray-500 text-right">
        {textureResult && (
          <>
            <div>ID: {textureResult.id.substring(0, 12)}...</div>
            <div>品質: {textureResult.parameters.quantity} 元素</div>
          </>
        )}
      </div>
    </div>
  );
};

export default TextureToolbar;
