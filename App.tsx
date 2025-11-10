import React, { useState, useCallback, useRef } from 'react';
import TopBar from './components/TopBar';
import BottomBar from './components/BottomBar';
import Canvas from './components/Canvas';
import AiSidebar from './components/AiSidebar';
import TextureControlPanel from './components/TextureControlPanel';
import TextureToolbar from './components/TextureToolbar';
import { ToolType, GlyphProperties, VectorNode, VectorShape, ShapeType, TextureParameters, TextureGenerationResult } from './types';
import { generateTexture, defaultTextureParameters } from './services/textureGeneratorService';
import { exportTexture } from './services/textureExportService';

const App: React.FC = () => {
  const [activeTool, setActiveTool] = useState<ToolType>('selection');
  const [zoomLevel, setZoomLevel] = useState(100);
  const [currentGlyph, setCurrentGlyph] = useState<string>('A');
  // This now acts as "Active defaults" or "Selected Item Properties"
  const [glyphProperties, setGlyphProperties] = useState<GlyphProperties>({
    x: 0, y: 0, w: 0, h: 0,
    strokeWidth: 2, fillColor: '#000000', strokeColor: '#5847eb', fontWeight: 400
  });
  const [isAiSidebarOpen, setIsAiSidebarOpen] = useState(false);
  const [showGrid, setShowGrid] = useState(true);
  const [activeImage, setActiveImage] = useState<string | null>(null);

  // Vector State
  const [nodes, setNodes] = useState<VectorNode[]>([]);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [shapes, setShapes] = useState<VectorShape[]>([]);
  const [activeShapeType, setActiveShapeType] = useState<ShapeType>('rect');

  // 紋理相關狀態
  const [textureMode, setTextureMode] = useState(false);
  const [textureParameters, setTextureParameters] = useState<TextureParameters>(defaultTextureParameters);
  const [textureResult, setTextureResult] = useState<TextureGenerationResult | null>(null);
  const [isGeneratingTexture, setIsGeneratingTexture] = useState(false);
  const [showTexturePanel, setShowTexturePanel] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const toggleAiSidebar = useCallback(() => {
    setIsAiSidebarOpen(prev => !prev);
  }, []);

  const handleImageGenerated = useCallback((imageUrl: string) => {
      setActiveImage(imageUrl);
  }, []);

  const handleUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
          const reader = new FileReader();
          reader.onload = (e) => {
              if (e.target?.result && typeof e.target.result === 'string') {
                  setActiveImage(e.target.result);
              }
          };
          reader.readAsDataURL(file);
      }
  }, []);

  const triggerUpload = useCallback(() => {
      fileInputRef.current?.click();
  }, []);

  const handleDownload = useCallback(() => {
      if (activeImage) {
          const link = document.createElement('a');
          link.href = activeImage;
          link.download = 'vectorfont-design.png';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
      } else {
          alert("Currently only supporting download of the active image canvas.");
      }
  }, [activeImage]);

  const updateGlyphProperty = useCallback((key: keyof GlyphProperties, value: string | number) => {
      setGlyphProperties(prev => ({ ...prev, [key]: value }));
  }, []);

  const updateSelectedNode = useCallback((key: 'x' | 'y', value: number) => {
      if (!selectedNodeId) return;
      setNodes(prev => prev.map(n => n.id === selectedNodeId ? { ...n, [key]: value } : n));
  }, [selectedNodeId]);

  const convertNodesToPath = useCallback(() => {
      if (nodes.length < 2) return;

      // Calculate bounding box for the new shape (simple version)
      const xs = nodes.map(n => n.x);
      const ys = nodes.map(n => n.y);
      const minX = Math.min(...xs);
      const minY = Math.min(...ys);
      const maxX = Math.max(...xs);
      const maxY = Math.max(...ys);

      const pathData = `M ${nodes[0].x} ${nodes[0].y} ` + nodes.slice(1).map(n => `L ${n.x} ${n.y}`).join(' ');

      const newShape: VectorShape = {
          id: `shape-path-${Date.now()}`,
          type: 'path',
          x: minX,
          y: minY,
          width: maxX - minX,
          height: maxY - minY,
          strokeColor: glyphProperties.strokeColor,
          strokeWidth: glyphProperties.strokeWidth,
          fillColor: 'none', // Default to no fill for open paths
          pathData: pathData
      };

      setShapes(prev => [...prev, newShape]);
      setNodes([]);
      setSelectedNodeId(null);
      setActiveTool('selection'); // Switch back to selection after completing path
  }, [nodes, glyphProperties]);

  // 紋理生成方法
  const handleGenerateTexture = useCallback(async () => {
    setIsGeneratingTexture(true);
    try {
      const result = generateTexture(textureParameters);
      setTextureResult(result);
      setTextureMode(true);
      // 轉換 SVG 為 data URL 以便顯示
      const svgBlob = new Blob([result.svgData], { type: 'image/svg+xml' });
      const svgUrl = URL.createObjectURL(svgBlob);
      setActiveImage(svgUrl);
    } catch (error) {
      console.error('紋理生成失敗:', error);
      alert('紋理生成失敗，請檢查參數設置');
    } finally {
      setIsGeneratingTexture(false);
    }
  }, [textureParameters]);

  const handleExportTexture = useCallback(async (format: 'svg' | 'png' | 'css' = 'svg') => {
    if (!textureResult) {
      alert('請先生成紋理');
      return;
    }

    try {
      await exportTexture(textureResult, format);
    } catch (error) {
      console.error('匯出失敗:', error);
      alert('紋理匯出失敗，請重試');
    }
  }, [textureResult]);

  const toggleTexturePanel = useCallback(() => {
    setShowTexturePanel(prev => !prev);
  }, []);

  return (
    <div className="flex flex-col h-screen w-screen bg-gray-950 text-gray-100 overflow-hidden">
      {/* Hidden File Input */}
      <input
          type="file"
          ref={fileInputRef}
          onChange={handleUpload}
          accept="image/png, image/jpeg, image/webp, image/svg+xml"
          className="hidden"
      />

      <TopBar
        toggleAiSidebar={toggleAiSidebar}
        isAiSidebarOpen={isAiSidebarOpen}
        onImport={triggerUpload}
        onExport={handleDownload}
        showGrid={showGrid}
        setShowGrid={setShowGrid}
        toggleTexturePanel={toggleTexturePanel}
        showTexturePanel={showTexturePanel}
      />

      <div className="flex-1 flex relative overflow-hidden">
        <Canvas
            showGrid={showGrid}
            activeImage={activeImage}
            currentGlyph={currentGlyph}
            setCurrentGlyph={setCurrentGlyph}
            activeTool={activeTool}
            nodes={nodes}
            setNodes={setNodes}
            selectedNodeId={selectedNodeId}
            setSelectedNodeId={setSelectedNodeId}
            shapes={shapes}
            setShapes={setShapes}
            activeShapeType={activeShapeType}
            currentProperties={glyphProperties}
        />
        <AiSidebar
            isOpen={isAiSidebarOpen}
            closeSidebar={() => setIsAiSidebarOpen(false)}
            onImageGenerated={handleImageGenerated}
            currentCanvasImage={activeImage}
        />
        {showTexturePanel && (
          <TextureControlPanel
            parameters={textureParameters}
            onParametersChange={setTextureParameters}
            onGenerate={handleGenerateTexture}
            isGenerating={isGeneratingTexture}
          />
        )}
      </div>

      <BottomBar
        activeTool={activeTool}
        setActiveTool={setActiveTool}
        zoomLevel={zoomLevel}
        currentGlyph={currentGlyph}
        glyphProperties={glyphProperties}
        updateProperty={updateGlyphProperty}
        activeShapeType={activeShapeType}
        setActiveShapeType={setActiveShapeType}
        nodes={nodes}
        selectedNodeId={selectedNodeId}
        updateSelectedNode={updateSelectedNode}
        convertNodesToPath={convertNodesToPath}
      />

      {/* Texture Toolbar */}
      <TextureToolbar
        textureResult={textureResult}
        isVisible={textureMode}
        onExport={handleExportTexture}
        isExporting={isGeneratingTexture}
      />
    </div>
  );
};

export default App;