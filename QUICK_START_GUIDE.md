# 快速啟動指南

**環境確認**: ✅ Node.js v22.21.1 已安裝，npm 10.9.4 就緒

---

## 🚀 3 分鐘快速運行

### 方式 A: 直接在本項目目錄運行

```bash
# 1. 安裝依賴 (一次性，約 5-10 分鐘)
npm install

# 2. 啟動開發服務器 (會自動打開瀏覽器)
npm run dev

# 3. 應用會在 http://localhost:5173 打開
# 自動重新加載，開始開發！
```

### 方式 B: 克隆到新位置運行

```bash
# 1. 克隆倉庫
git clone http://127.0.0.1:47384/git/chr1st1anw0w/Font-2.git my-texture-app
cd my-texture-app

# 2. 切換到正確的分支
git checkout claude/ai-texture-generation-tool-011CUydTxN7bGnxnVcAR84GT

# 3. 安裝依賴
npm install

# 4. 運行開發服務器
npm run dev
```

---

## 📚 先查看文檔？

如果想先查看文檔再運行應用，可以：

```bash
# 打開文檔索引 (推薦首先查看)
open CONTROL_PANELS_MASTER_INDEX.md

# 查看完整的 UI 框架說明
open CONTROL_PANELS_FRAMEWORK.md

# 查看交互流程圖
open PANELS_INTERACTION_DIAGRAM.md

# 查看測試計劃
open TEST_PLAN_AND_VERIFICATION.md
```

或者用 VS Code 查看整個項目：

```bash
code .
```

---

## 🎯 運行後會看到什麼？

應用啟動後，您會看到：

```
┌─────────────────────────────────────┐
│         Font-2 應用界面              │
│                                     │
│  ┌─────────────┬──────────────────┐ │
│  │ TopBar      │                  │ │
│  ├─────────────┤                  │ │
│  │  Canvas     │ TextureControl   │ │
│  │             │ Panel (右側)     │ │
│  │  800×800    │  ├─ 快速訪問區   │ │
│  │  SVG實時    │  ├─ 旋轉與尺度   │ │
│  │  渲染       │  ├─ 視覺屬性     │ │
│  │             │  ├─ 色彩設定     │ │
│  │             │  └─ 演算法       │ │
│  │             │  [✨ 生成]      │ │
│  │             │  [🎨 色彩]      │ │
│  │             │  [🔢 數量]      │ │
│  └─────────────┴──────────────────┘ │
│                                     │
│  TextureToolbar    NavigationBar    │
│  (左下)            (右下，縮放控制) │
└─────────────────────────────────────┘
```

---

## 🧪 然後做什麼？

### 1️⃣ 測試核心功能 (5 分鐘)

```
- [ ] 點擊 TopBar 的 [Texture] 按鈕打開面板
- [ ] 在快速訪問區選擇不同形狀
- [ ] 拖動數量滑桿
- [ ] 點擊 [🎨 色彩] 打開色彩模態
- [ ] 點擊 [🔢 數量] 打開數量模態
- [ ] 點擊 [✨ 生成紋理] 生成紋理
- [ ] 在右下角 NavigationBar 縮放預覽
```

### 2️⃣ 對照文檔理解 (10 分鐘)

```
- 打開 CONTROL_PANELS_MASTER_INDEX.md
- 按照學習路徑進行
- 對照實際應用理解框架
- 查看 PANELS_INTERACTION_DIAGRAM.md 理解狀態流轉
```

### 3️⃣ 進行完整測試 (20 分鐘)

```
- 參考 TEST_PLAN_AND_VERIFICATION.md
- 按照測試計劃逐項驗證
- 記錄任何發現的問題
```

---

## 📝 有用的命令

```bash
# 查看所有 npm 命令
npm run

# 構建生產版本
npm run build

# 預覽生產版本
npm run preview

# 停止開發服務器
Ctrl + C

# 清除 node_modules 並重新安裝
rm -rf node_modules package-lock.json
npm install
```

---

## 🐛 常見問題

### Q: npm install 卡住了？
A: 通常需要 5-10 分鐘，取決於網絡速度。可以加上 `--verbose` 查看詳細過程：
```bash
npm install --verbose
```

### Q: 打開應用後，面板不顯示？
A: 點擊 TopBar 的 [Texture] 按鈕來打開 TextureControlPanel

### Q: 生成紋理後 Canvas 是空的？
A: 確保參數已設置正確，點擊 [✨ 生成紋理] 按鈕

### Q: 顏色選擇器不工作？
A: 點擊 [🎨 色彩] 打開模態，在模態中操作色彩

### Q: 想停止服務器？
A: 在終端中按 `Ctrl + C`

---

## 📞 需要幫助？

1. 查閱 TEST_PLAN_AND_VERIFICATION.md 的故障排除部分
2. 查閱 PANELS_INTERACTION_DIAGRAM.md 的開發指南
3. 檢查瀏覽器開發者工具 (F12) 的 Console 標籤

---

**準備好了嗎？運行以下命令開始！**

```bash
npm install && npm run dev
```

