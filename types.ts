export type ToolType = 'selection' | 'pen' | 'node' | 'shape';

export interface Layer {
  id: string;
  name: string;
  visible: boolean;
  locked: boolean;
}

export interface GlyphProperties {
  x: number;
  y: number;
  w: number;
  h: number;
  strokeWidth: number;
  fillColor: string;
  strokeColor: string;
  fontWeight: number;
}

export type AspectRatio = '1:1' | '3:4' | '4:3' | '16:9' | '9:16';

export interface AiChatMessage {
    role: 'user' | 'model';
    text: string;
    images?: string[]; // base64
}

export interface VectorNode {
    id: string;
    x: number;
    y: number;
}

export type ShapeType = 'rect' | 'ellipse' | 'path';

export interface VectorShape {
    id: string;
    type: ShapeType;
    x: number;
    y: number;
    width: number;
    height: number;
    strokeColor: string;
    strokeWidth: number;
    fillColor: string;
    pathData?: string; // For 'path' type
}

// 紋理生成相關類型
export type GeometricShape = 'circle' | 'square' | 'triangle' | 'hexagon' | 'pentagon' | 'star' | 'wave' | 'radial' | 'grid' | 'spiral';

export type AlgorithmType = 'perlin' | 'simplex' | 'voronoi' | 'fibonacci' | 'arithmetic' | 'geometric' | 'prime' | 'mandelbrot' | 'julia' | 'koch';

export type ArrangementType = 'grid' | 'spiral' | 'radial' | 'random' | 'linear';

export type RotationType = 'fixed' | 'incremental' | 'random';

export type ColorMode = 'single' | 'gradient' | 'palette' | 'random';

export type ExportFormat = 'svg' | 'png' | 'css';

export interface ColorGradient {
    startColor: string;
    endColor: string;
    angle?: number; // For linear gradient
}

export interface TextureParameters {
    // 基本參數
    id: string;
    name: string;

    // 形狀與數量
    shapeType: GeometricShape;
    quantity: number; // 1-100

    // 排列方式
    arrangement: ArrangementType;

    // 旋轉控制
    rotationType: RotationType;
    rotation: number; // 0-360°
    rotationIncrement?: number; // 用於 incremental
    rotationRandomRange?: number; // 用於 random

    // 尺度控制
    scale: number; // 0.1-5.0
    scaleVariation?: 'uniform' | 'fibonacci' | 'arithmetic' | 'random';
    minScale?: number;
    maxScale?: number;

    // 演算法
    algorithm: AlgorithmType;
    algorithmParams: {
        frequency?: number; // Perlin/Simplex
        amplitude?: number;
        octaves?: number;
        seedPoints?: number; // Voronoi
        iterations?: number; // Fractal
        zoomLevel?: number; // Fractal
    };

    // 視覺屬性
    strokeWidth: number; // 1-50px
    density: number; // 0-100%
    spacing: {
        min: number;
        max: number;
    };

    // 色彩控制
    colorMode: ColorMode;
    primaryColor: string;
    secondaryColor?: string;
    colorGradient?: ColorGradient;
    colorPalette?: string[]; // 多色方案

    // 透明度
    opacity: number; // 0-100%

    // 混合模式
    blendMode: 'normal' | 'multiply' | 'screen' | 'overlay' | 'darken' | 'lighten';

    // 其他效果
    blur?: number; // 0-20px
    shadowEffect?: {
        offsetX: number;
        offsetY: number;
        blur: number;
        color: string;
    };

    // 輸出設置
    canvasWidth: number;
    canvasHeight: number;
    backgroundColor: string;
}

export interface TextureGenerationResult {
    id: string;
    svgData: string;
    parameters: TextureParameters;
    timestamp: number;
}