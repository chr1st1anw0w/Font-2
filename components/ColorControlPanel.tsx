import React, { useState } from 'react';

interface ColorControlPanelProps {
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  onPrimaryColorChange: (color: string) => void;
  onSecondaryColorChange: (color: string) => void;
  onBackgroundColorChange: (color: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

const ColorControlPanel: React.FC<ColorControlPanelProps> = ({
  primaryColor,
  secondaryColor,
  backgroundColor,
  onPrimaryColorChange,
  onSecondaryColorChange,
  onBackgroundColorChange,
  isOpen,
  onClose,
}) => {
  const [colorMode, setColorMode] = useState<'gradient' | 'single' | 'random'>('gradient');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 border border-gray-700 rounded-lg shadow-2xl w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700 bg-gray-950">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            🎨 色彩控制面板
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6l-12 12"></path>
              <path d="M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* 色彩模式選擇 */}
          <div>
            <label className="block text-sm font-semibold text-gray-300 uppercase mb-3">色彩模式</label>
            <div className="grid grid-cols-3 gap-2">
              {['gradient', 'single', 'random'].map(mode => (
                <button
                  key={mode}
                  onClick={() => setColorMode(mode as any)}
                  className={`py-2 rounded border transition-colors text-sm font-medium capitalize ${
                    colorMode === mode
                      ? 'bg-purple-600/40 border-purple-500 text-purple-200'
                      : 'bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-500'
                  }`}
                >
                  {mode === 'gradient' && '漸層'}
                  {mode === 'single' && '單色'}
                  {mode === 'random' && '隨機'}
                </button>
              ))}
            </div>
          </div>

          {/* 主色彩 */}
          <div>
            <label className="block text-sm font-semibold text-gray-300 uppercase mb-3">主色彩</label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={primaryColor}
                onChange={(e) => onPrimaryColorChange(e.target.value)}
                className="w-16 h-16 rounded cursor-pointer border-2 border-gray-700 hover:border-purple-500 transition-colors"
              />
              <div>
                <p className="text-xs text-gray-500 mb-1">HEX 代碼</p>
                <input
                  type="text"
                  value={primaryColor.toUpperCase()}
                  onChange={(e) => {
                    if (/^#[0-9A-F]{6}$/i.test(e.target.value)) {
                      onPrimaryColorChange(e.target.value);
                    }
                  }}
                  className="bg-gray-950 border border-gray-700 rounded px-3 py-2 text-sm text-gray-200 uppercase font-mono w-full"
                  placeholder="#000000"
                />
              </div>
            </div>
          </div>

          {/* 副色彩 - 僅在漸層模式下顯示 */}
          {colorMode === 'gradient' && (
            <div>
              <label className="block text-sm font-semibold text-gray-300 uppercase mb-3">副色彩</label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={secondaryColor}
                  onChange={(e) => onSecondaryColorChange(e.target.value)}
                  className="w-16 h-16 rounded cursor-pointer border-2 border-gray-700 hover:border-purple-500 transition-colors"
                />
                <div>
                  <p className="text-xs text-gray-500 mb-1">HEX 代碼</p>
                  <input
                    type="text"
                    value={secondaryColor.toUpperCase()}
                    onChange={(e) => {
                      if (/^#[0-9A-F]{6}$/i.test(e.target.value)) {
                        onSecondaryColorChange(e.target.value);
                      }
                    }}
                    className="bg-gray-950 border border-gray-700 rounded px-3 py-2 text-sm text-gray-200 uppercase font-mono w-full"
                    placeholder="#000000"
                  />
                </div>
              </div>

              {/* 色彩漸層預覽 */}
              <div className="mt-3 h-12 rounded border border-gray-700 overflow-hidden shadow-inner">
                <div
                  className="w-full h-full"
                  style={{
                    background: `linear-gradient(to right, ${primaryColor}, ${secondaryColor})`,
                  }}
                />
              </div>
            </div>
          )}

          {/* 背景色 */}
          <div>
            <label className="block text-sm font-semibold text-gray-300 uppercase mb-3">背景色</label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={backgroundColor}
                onChange={(e) => onBackgroundColorChange(e.target.value)}
                className="w-16 h-16 rounded cursor-pointer border-2 border-gray-700 hover:border-purple-500 transition-colors"
              />
              <div>
                <p className="text-xs text-gray-500 mb-1">HEX 代碼</p>
                <input
                  type="text"
                  value={backgroundColor.toUpperCase()}
                  onChange={(e) => {
                    if (/^#[0-9A-F]{6}$/i.test(e.target.value)) {
                      onBackgroundColorChange(e.target.value);
                    }
                  }}
                  className="bg-gray-950 border border-gray-700 rounded px-3 py-2 text-sm text-gray-200 uppercase font-mono w-full"
                  placeholder="#000000"
                />
              </div>
            </div>
          </div>

          {/* 預設調色板 */}
          <div>
            <label className="block text-sm font-semibold text-gray-300 uppercase mb-3">預設調色板</label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { name: '紫色', primary: '#7c3aed', secondary: '#ff6b6b' },
                { name: '藍綠色', primary: '#0891b2', secondary: '#06b6d4' },
                { name: '綠色', primary: '#10b981', secondary: '#34d399' },
                { name: '暖色', primary: '#f59e0b', secondary: '#fbbf24' },
                { name: '紅色', primary: '#ef4444', secondary: '#fca5a5' },
                { name: '靛藍', primary: '#4f46e5', secondary: '#818cf8' },
                { name: '粉紅', primary: '#ec4899', secondary: '#f472b6' },
                { name: '灰色', primary: '#6b7280', secondary: '#d1d5db' },
              ].map(palette => (
                <button
                  key={palette.name}
                  onClick={() => {
                    onPrimaryColorChange(palette.primary);
                    onSecondaryColorChange(palette.secondary);
                  }}
                  className="aspect-square rounded border-2 border-gray-700 hover:border-purple-500 transition-all group relative overflow-hidden"
                  title={palette.name}
                >
                  <div className="flex h-full">
                    <div
                      className="flex-1"
                      style={{ backgroundColor: palette.primary }}
                    />
                    <div
                      className="flex-1"
                      style={{ backgroundColor: palette.secondary }}
                    />
                  </div>
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-700 p-4 bg-gray-950 flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded font-medium transition-colors"
          >
            確認
          </button>
        </div>
      </div>
    </div>
  );
};

export default ColorControlPanel;
