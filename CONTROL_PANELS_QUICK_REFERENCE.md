# 控制面板參數快速參考表

## 📋 目錄
1. [TextureControlPanel 參數](#1-texturecontrolpanel-參數)
2. [ColorControlPanel 參數](#2-colorcontrolpanel-參數)
3. [QuantityControlPanel 參數](#3-quantitycontrolpanel-參數)
4. [NavigationBar 參數](#4-navigationbar-參數)
5. [狀態流轉圖](#5-狀態流轉圖)

---

## 1. TextureControlPanel 參數

### Props 接口

```typescript
interface TextureControlPanelProps {
  parameters: TextureParameters;           // 完整紋理參數
  onParametersChange: (params: TextureParameters) => void;  // 參數變更回調
  onGenerate: () => void;                  // 生成紋理回調
  isGenerating?: boolean;                  // 是否正在生成
}
```

### 本地狀態

| 狀態名 | 類型 | 初始值 | 用途 |
|--------|------|--------|------|
| `expandedSections` | `Set<string>` | `Set(['basic'])` | 追蹤展開/折疊的區域 |
| `showColorPanel` | `boolean` | `false` | 色彩模態開關 |
| `showQuantityPanel` | `boolean` | `false` | 數量模態開關 |

### 可控制的參數類型

| 分類 | 參數名 | 類型 | 範圍 | 預設值 |
|------|--------|------|------|--------|
| **級別 1: 快速訪問** |
| 形狀 | `shapeType` | `GeometricShape` | circle, square, triangle, hexagon, pentagon, star, wave, spiral, radial, grid | circle |
| 數量 | `quantity` | `number` | 1 ~ 100 | 45 |
| 排列 | `arrangement` | `ArrangementType` | grid, spiral, radial, random, linear | grid |
| **級別 2a: 旋轉與尺度** |
| 旋轉類型 | `rotationType` | `RotationType` | fixed, incremental, random | fixed |
| 旋轉角度 | `rotation` | `number` | 0 ~ 360° | 30° |
| 尺度 | `scale` | `number` | 0.1 ~ 5.0 | 1.5 |
| **級別 2b: 視覺屬性** |
| 筆畫寬度 | `strokeWidth` | `number` | 1 ~ 50px | 2 |
| 密度 | `density` | `number` | 0 ~ 100% | 65 |
| 透明度 | `opacity` | `number` | 0 ~ 100% | 100 |
| **級別 2c: 色彩設定** |
| 色彩模式 | `colorMode` | `ColorMode` | single, gradient, palette, random | gradient |
| 主色彩 | `primaryColor` | `string` (HEX) | #000000 ~ #FFFFFF | #7c3aed |
| 副色彩 | `secondaryColor` | `string` (HEX) | #000000 ~ #FFFFFF | #5847eb |
| 背景色 | `backgroundColor` | `string` (HEX) | #000000 ~ #FFFFFF | #0d1117 |
| **級別 2d: 演算法** |
| 演算法類型 | `algorithm` | `AlgorithmType` | perlin, simplex, voronoi, fibonacci, none | perlin |
| 頻率 | `algorithmParams.frequency` | `number` | 0.1 ~ 2.0 | 0.5 |
| 振幅 | `algorithmParams.amplitude` | `number` | 0 ~ 1.0 | 0.3 |

### 可展開的區域列表

```typescript
expandedSections 可能包含的值:
- 'basic'       // 快速訪問區 (默認展開)
- 'transform'   // 旋轉與尺度
- 'visual'      // 視覺屬性
- 'color'       // 色彩設定
- 'algorithm'   // 演算法設定
```

---

## 2. ColorControlPanel 參數

### Props 接口

```typescript
interface ColorControlPanelProps {
  primaryColor: string;                   // 主色彩 (HEX)
  secondaryColor: string;                 // 副色彩 (HEX)
  backgroundColor: string;                // 背景色 (HEX)
  onPrimaryColorChange: (color: string) => void;
  onSecondaryColorChange: (color: string) => void;
  onBackgroundColorChange: (color: string) => void;
  isOpen: boolean;                        // 模態是否打開
  onClose: () => void;                    // 關閉回調
}
```

### 本地狀態

| 狀態名 | 類型 | 初始值 | 用途 |
|--------|------|--------|------|
| `colorMode` | `'gradient' \| 'single' \| 'random'` | `'gradient'` | 色彩模式選擇 |

### 色彩模式說明

| 模式 | 說明 | 使用場景 |
|------|------|---------|
| `'gradient'` | 漸層模式：主色 → 副色 線性變化 | 默認模式，展現色彩過渡 |
| `'single'` | 單色模式：全部使用主色彩 | 單調配色 |
| `'random'` | 隨機模式：每個元素隨機色彩 | 彩色混亂紋理 |

### 預設調色板

```typescript
預設調色板 = [
  { name: '紫色系', primary: '#7c3aed', secondary: '#5847eb' },
  { name: '藍青系', primary: '#0891b2', secondary: '#06b6d4' },
  { name: '綠色系', primary: '#059669', secondary: '#10b981' },
  { name: '暖色系', primary: '#ea580c', secondary: '#f97316' },
  { name: '紅色系', primary: '#dc2626', secondary: '#ef4444' },
  { name: '靛藍系', primary: '#4f46e5', secondary: '#6366f1' },
  { name: '粉紅系', primary: '#ec4899', secondary: '#f43f5e' },
  { name: '灰階系', primary: '#6b7280', secondary: '#d1d5db' },
]
```

### 色彩輸入方式

| 方式 | 類型 | 示例 | 驗證 |
|------|------|------|------|
| 色盤選擇 | `<input type="color">` | 視覺化選擇 | 自動轉換為 HEX |
| HEX 直接輸入 | `<input type="text">` | `#7c3aed` | 需驗證格式 |

---

## 3. QuantityControlPanel 參數

### Props 接口

```typescript
interface QuantityControlPanelProps {
  quantity: number;                       // 元素數量 (1-100)
  arrangement: string;                    // 排列方式
  onQuantityChange: (quantity: number) => void;
  onArrangementChange: (arrangement: string) => void;
  isOpen: boolean;                        // 模態是否打開
  onClose: () => void;                    // 關閉回調
}
```

### 本地狀態

| 狀態名 | 類型 | 初始值 | 用途 |
|--------|------|--------|------|
| `tempQuantity` | `number` | `quantity` | 臨時數量值（調整中） |

### 數量參數

| 項目 | 類型 | 範圍 | 初始值 |
|------|------|------|--------|
| `quantity` | `number` | 1 ~ 100 | 45 |

### 排列方式列表

| 排列方式 | 值 | 圖標 | 說明 |
|---------|-----|------|------|
| 網格排列 | `'grid'` | 🔲 | 規則的行列式排列 |
| 螺旋排列 | `'spiral'` | 🌀 | 從中心向外螺旋展開 |
| 徑向排列 | `'radial'` | ⭕ | 放射狀從中心向外 |
| 隨機排列 | `'random'` | 🎲 | 完全隨機位置 |
| 線性排列 | `'linear'` | ➖ | 單行線性排列 |

### 網格預設

| 預設名 | 列×行 | 總元素數 | 說明 |
|--------|------|---------|------|
| 3×3 | 3 × 3 | 9 | 小規模 |
| 4×4 | 4 × 4 | 16 | 中小規模 |
| 5×5 | 5 × 5 | 25 | 中規模 |
| 6×6 | 6 × 6 | 36 | 中大規模 |
| 8×8 | 8 × 8 | 64 | 大規模 |

### 計算公式

```javascript
// 根據 quantity 計算網格尺寸
cols = Math.ceil(Math.sqrt(quantity))
rows = Math.ceil(quantity / cols)
total = cols * rows

// 密度百分比
densityPercent = Math.round((quantity / 100) * 100)

// 示例：quantity = 45
cols = Math.ceil(Math.sqrt(45)) = 7
rows = Math.ceil(45 / 7) = 7
total = 7 × 7 = 49
densityPercent = 45%
```

---

## 4. NavigationBar 參數

### Props 接口

```typescript
interface NavigationBarProps {
  canvasWidth: number;                    // Canvas 寬度 (px)
  canvasHeight: number;                   // Canvas 高度 (px)
  zoomLevel: number;                      // 當前縮放百分比 (%)
  onZoomChange: (zoom: number) => void;   // 縮放變更回調
  onResetZoom: () => void;                // 重置縮放回調
  onFitToScreen: () => void;              // 適應屏幕回調
}
```

### 本地狀態

| 狀態名 | 類型 | 初始值 | 用途 |
|--------|------|--------|------|
| `showZoomMenu` | `boolean` | `false` | 預設縮放菜單開關 |

### 縮放控制參數

| 項目 | 最小值 | 最大值 | 初始值 | 步長 |
|------|--------|--------|--------|------|
| `zoomLevel` | 25% | 200% | 100% | 10% |

### 預設縮放級別

```typescript
presetZooms = [25, 50, 75, 100, 125, 150, 200]
```

### 快捷縮放操作

| 操作 | 快捷鍵 | 效果 |
|------|--------|------|
| 放大 | Ctrl + 滾輪向上 | zoomLevel + 10% (最大 200%) |
| 縮小 | Ctrl + 滾輪向下 | zoomLevel - 10% (最小 25%) |
| 重置 | [1:1] 按鈕 | zoomLevel = 100% |
| 適應 | [⊡] 按鈕 | zoomLevel = 75% (自動適應) |

---

## 5. 狀態流轉圖

### 面板狀態流轉

```
App.tsx (全局狀態)
├─ textureParameters (TextureParameters)
│  └─ 用途: 存儲所有紋理參數
│
├─ showTexturePanel (boolean)
│  └─ 控制: TextureControlPanel 顯示/隱藏
│
├─ isGeneratingTexture (boolean)
│  └─ 控制: 按鈕禁用/啟用狀態
│
├─ textureResult (TextureGenerationResult | null)
│  └─ 用途: 存儲生成結果 (SVG 數據)
│
└─ zoomLevel (number)
   └─ 控制: NavigationBar 和 Canvas 縮放


TextureControlPanel (邊欄狀態)
├─ expandedSections (Set<string>)
│  └─ ['basic', 'transform', 'visual', 'color', 'algorithm']
│
├─ showColorPanel (boolean)
│  ├─ true  → 顯示 ColorControlPanel 模態
│  └─ false → 隱藏 ColorControlPanel 模態
│
└─ showQuantityPanel (boolean)
   ├─ true  → 顯示 QuantityControlPanel 模態
   └─ false → 隱藏 QuantityControlPanel 模態


ColorControlPanel (模態狀態)
├─ colorMode ('gradient' | 'single' | 'random')
│  └─ 用途: 決定色彩應用方式
│
├─ isOpen (boolean)
│  ├─ true  → 模態顯示
│  └─ false → 模態隱藏
│
└─ Props 通過回調更新父級:
   ├─ primaryColor
   ├─ secondaryColor
   └─ backgroundColor


QuantityControlPanel (模態狀態)
├─ tempQuantity (number)
│  └─ 用途: 編輯期間的臨時值
│
├─ isOpen (boolean)
│  ├─ true  → 模態顯示
│  └─ false → 模態隱藏
│
└─ Props 通過回調更新父級:
   ├─ quantity
   └─ arrangement


NavigationBar (工具欄狀態)
├─ showZoomMenu (boolean)
│  ├─ true  → 預設菜單打開
│  └─ false → 預設菜單關閉
│
└─ Props 通過回調更新父級:
   └─ zoomLevel
```

### 參數更新流程

```
用戶操作
  ↓
對應組件本地狀態變更 (setXxx)
  ↓
觸發回調函數 (onXxxChange)
  ↓
父組件狀態更新 (setTextureParameters / setZoomLevel)
  ↓
Props 重新傳遞
  ↓
子組件重新渲染
  ↓
視覺更新
```

---

## 📊 參數相互依賴關係

### 影響紋理生成的關鍵參數組

```
形狀 (shapeType)
  ↓ 決定
  └─→ 紋理外觀

數量 (quantity) + 排列 (arrangement)
  ↓ 決定
  └─→ 元素佈局密度

旋轉 (rotation) + 尺度 (scale)
  ↓ 決定
  └─→ 元素變換

色彩 (colorMode + primaryColor + secondaryColor)
  ↓ 決定
  └─→ 紋理配色

演算法 (algorithm + frequency + amplitude)
  ↓ 決定
  └─→ 複雜度和隨機性

筆寬 (strokeWidth) + 密度 (density) + 透明度 (opacity)
  ↓ 決定
  └─→ 視覺表現
```

### 獨立參數

```
緩存相關:
- id          (唯讀)
- name        (紋理名稱，可編輯)
- canvasWidth / canvasHeight (固定 800×800)
- backgroundColor (可單獨調整)

迭代相關:
- rotationType (fixed/incremental/random)
- blendMode (normal/multiply/screen/...)
```

---

## 🔄 操作範例

### 例 1: 用戶調整色彩

```
1. 用戶點擊 [🎨 色彩] 按鈕
   TextureControlPanel:
   setShowColorPanel(true)

2. ColorControlPanel 打開
   props.isOpen = true

3. 用戶在色盤選擇新色彩
   ColorControlPanel:
   const newColor = '#ff0000'
   onPrimaryColorChange(newColor)

4. 父組件接收回調
   TextureControlPanel:
   updateParam('primaryColor', '#ff0000')

5. 觸發父層回調
   onParametersChange({
     ...parameters,
     primaryColor: '#ff0000'
   })

6. 爺爺層 (App.tsx) 接收
   setTextureParameters(newParams)

7. Props 傳遞給所有子組件
   <ColorControlPanel primaryColor="#ff0000" />

8. ColorControlPanel 重新渲染，顯示新色彩
```

### 例 2: 用戶調整數量

```
1. 用戶點擊 [🔢 數量] 按鈕
   TextureControlPanel:
   setShowQuantityPanel(true)

2. QuantityControlPanel 打開
   props.isOpen = true

3. 用戶拖動數量滑桿
   QuantityControlPanel:
   setTempQuantity(60)  (本地更新)

4. 用戶釋放滑桿
   onQuantityChange(60)

5. TextureControlPanel 接收
   updateParam('quantity', 60)
   onParametersChange({
     ...parameters,
     quantity: 60
   })

6. App.tsx 接收
   setTextureParameters(newParams)

7. QuantityControlPanel 接收新 Props
   quantity = 60
   重新計算 gridInfo:
   cols = Math.ceil(Math.sqrt(60)) = 8
   rows = Math.ceil(60 / 8) = 8
   total = 64
   densityPercent = 60%

8. 組件重新渲染，預覽更新
```

---

## 📝 注意事項

### 色彩參數

- ✅ 必須是有效的 HEX 格式 (#RRGGBB 或 #RGB)
- ✅ 支持 6 位和 3 位 HEX 代碼
- ❌ 不支持 HSL、RGB 或命名顏色（需轉換）

### 數量參數

- ✅ 必須是整數
- ✅ 範圍 1-100 自動驗證
- ✅ 網格計算自動進行

### 縮放參數

- ✅ 25%-200% 範圍
- ✅ 10% 為標準步長
- ✅ 支持鼠標滾輪實時縮放

### 展開狀態

- ✅ 默認只展開快速訪問區
- ✅ 詳細區域獨立展開/折疊
- ✅ 狀態不會持久化（刷新重置）

---

**快速參考版本**: 1.0
**最後更新**: 2025-11-10
**用途**: 開發人員快速查閱參數配置

