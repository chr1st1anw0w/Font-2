import React, { useState, useEffect } from 'react';

interface QuantityControlPanelProps {
  quantity: number;
  arrangement: string;
  onQuantityChange: (quantity: number) => void;
  onArrangementChange: (arrangement: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

const QuantityControlPanel: React.FC<QuantityControlPanelProps> = ({
  quantity,
  arrangement,
  onQuantityChange,
  onArrangementChange,
  isOpen,
  onClose,
}) => {
  const [tempQuantity, setTempQuantity] = useState(quantity);

  useEffect(() => {
    setTempQuantity(quantity);
  }, [quantity]);

  const gridPresets = [
    { label: '3×3', cols: 3, rows: 3 },
    { label: '4×4', cols: 4, rows: 4 },
    { label: '5×5', cols: 5, rows: 5 },
    { label: '6×6', cols: 6, rows: 6 },
    { label: '8×8', cols: 8, rows: 8 },
  ];

  const applyGridPreset = (cols: number, rows: number) => {
    onQuantityChange(cols * rows);
  };

  const calculateGridInfo = (qty: number) => {
    const cols = Math.ceil(Math.sqrt(qty));
    const rows = Math.ceil(qty / cols);
    return { cols, rows, total: cols * rows };
  };

  const gridInfo = calculateGridInfo(tempQuantity);
  const densityPercent = Math.round((tempQuantity / 100) * 100);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 border border-gray-700 rounded-lg shadow-2xl w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700 bg-gray-950">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            🔢 數量與排列控制
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
          {/* 數量控制 */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-semibold text-gray-300 uppercase">元素數量</label>
              <span className="text-2xl font-bold text-purple-400">{tempQuantity}</span>
            </div>

            {/* 主滑桿 */}
            <input
              type="range"
              min="1"
              max="100"
              value={tempQuantity}
              onChange={(e) => setTempQuantity(parseInt(e.target.value))}
              onMouseUp={() => onQuantityChange(tempQuantity)}
              className="w-full"
              style={{
                height: '8px',
                borderRadius: '4px',
                background: '#374151',
                outline: 'none',
                WebkitAppearance: 'none',
              }}
            />

            {/* 範圍提示 */}
            <div className="flex justify-between text-xs text-gray-500 mt-2">
              <span>1</span>
              <span>50</span>
              <span>100</span>
            </div>

            {/* 數量密度指示器 */}
            <div className="mt-3 p-3 bg-gray-800/50 rounded border border-gray-700">
              <p className="text-xs text-gray-400 mb-2">元素密度：{densityPercent}%</p>
              <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-purple-500 to-purple-600 transition-all"
                  style={{ width: `${densityPercent}%` }}
                />
              </div>
            </div>
          </div>

          {/* 排列方式 */}
          <div>
            <label className="block text-sm font-semibold text-gray-300 uppercase mb-3">排列方式</label>
            <div className="grid grid-cols-2 gap-2">
              {['grid', 'spiral', 'radial', 'random'].map(arr => (
                <button
                  key={arr}
                  onClick={() => onArrangementChange(arr)}
                  className={`py-2 rounded border transition-colors text-sm font-medium capitalize ${
                    arrangement === arr
                      ? 'bg-purple-600/40 border-purple-500 text-purple-200'
                      : 'bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-500'
                  }`}
                >
                  {arr === 'grid' && '🔲 網格'}
                  {arr === 'spiral' && '🌀 螺旋'}
                  {arr === 'radial' && '⭕ 徑向'}
                  {arr === 'random' && '🎲 隨機'}
                </button>
              ))}
            </div>
          </div>

          {/* 網格預設 */}
          <div>
            <label className="block text-sm font-semibold text-gray-300 uppercase mb-3">網格預設</label>
            <div className="grid grid-cols-3 gap-2">
              {gridPresets.map(preset => (
                <button
                  key={preset.label}
                  onClick={() => applyGridPreset(preset.cols, preset.rows)}
                  className={`py-2 rounded border transition-colors text-sm font-medium ${
                    gridInfo.cols === preset.cols && gridInfo.rows === preset.rows
                      ? 'bg-purple-600/40 border-purple-500 text-purple-200'
                      : 'bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-500'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-2">
              自訂值: {gridInfo.cols}×{gridInfo.rows} = {gridInfo.total} 元素
            </p>
          </div>

          {/* 視覺化預覽 */}
          <div>
            <label className="block text-sm font-semibold text-gray-300 uppercase mb-3">排列預覽</label>
            <div className="aspect-square bg-gray-800/50 rounded border border-gray-700 p-4">
              <div
                className="w-full h-full bg-gray-900 rounded border border-gray-700 flex flex-wrap items-center justify-center gap-1 overflow-hidden"
                style={{
                  gridTemplateColumns: `repeat(${gridInfo.cols}, 1fr)`,
                  display: 'grid',
                }}
              >
                {Array.from({ length: Math.min(gridInfo.total, 25) }).map((_, i) => (
                  <div
                    key={i}
                    className="w-full aspect-square bg-purple-600/30 border border-purple-500/50 rounded"
                  />
                ))}
              </div>
              <p className="text-xs text-gray-500 text-center mt-2">
                共 {tempQuantity} 個元素 ({gridInfo.cols}×{gridInfo.rows})
              </p>
            </div>
          </div>

          {/* 間距信息 */}
          <div className="p-3 bg-gray-800/30 rounded border border-gray-700/50">
            <p className="text-xs text-gray-400">
              <span className="font-semibold text-gray-300">💡 提示</span>：增加元素數量會使紋理更密集，減少會使其更疏散。
            </p>
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

export default QuantityControlPanel;
