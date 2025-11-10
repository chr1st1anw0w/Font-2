import { TextureParameters, TextureGenerationResult, GeometricShape } from '../types';

// ==================== Perlin 噪聲實現 ====================
// 簡化的 Perlin 噪聲實現（用於演示）
class PerlinNoise {
  private permutation: number[] = [];
  private p: number[] = [];

  constructor(seed: number = 0) {
    // 初始化排列表
    this.permutation = Array.from({ length: 256 }, (_, i) => i);
    this.shuffleArray(this.permutation, seed);
    this.p = [...this.permutation, ...this.permutation];
  }

  private shuffleArray(arr: number[], seed: number) {
    // Fisher-Yates 洗牌，使用 seed 確保可重複
    let random = this.seededRandom(seed);
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }

  private seededRandom(seed: number) {
    return () => {
      seed = (seed * 9301 + 49297) % 233280;
      return seed / 233280;
    };
  }

  private fade(t: number): number {
    return t * t * t * (t * (t * 6 - 15) + 10);
  }

  private lerp(a: number, b: number, t: number): number {
    return a + t * (b - a);
  }

  private grad(hash: number, x: number, y: number): number {
    const h = hash & 15;
    const u = h < 8 ? x : y;
    const v = h < 8 ? y : x;
    return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v);
  }

  noise(x: number, y: number): number {
    const xi = Math.floor(x) & 255;
    const yi = Math.floor(y) & 255;

    const xf = x - Math.floor(x);
    const yf = y - Math.floor(y);

    const u = this.fade(xf);
    const v = this.fade(yf);

    const aa = this.p[this.p[xi] + yi];
    const ab = this.p[this.p[xi] + yi + 1];
    const ba = this.p[this.p[xi + 1] + yi];
    const bb = this.p[this.p[xi + 1] + yi + 1];

    const x1 = this.lerp(this.grad(aa, xf, yf), this.grad(ba, xf - 1, yf), u);
    const x2 = this.lerp(this.grad(ab, xf, yf - 1), this.grad(bb, xf - 1, yf - 1), u);
    return this.lerp(x1, x2, v);
  }
}

// ==================== 形狀生成函數 ====================

function createCircle(cx: number, cy: number, r: number): string {
  return `<circle cx="${cx}" cy="${cy}" r="${r}" />`;
}

function createSquare(x: number, y: number, size: number): string {
  return `<rect x="${x}" y="${y}" width="${size}" height="${size}" />`;
}

function createTriangle(cx: number, cy: number, size: number, rotation: number): string {
  const points = generatePolygonPoints(3, cx, cy, size, rotation);
  return `<polygon points="${points}" />`;
}

function createHexagon(cx: number, cy: number, size: number, rotation: number): string {
  const points = generatePolygonPoints(6, cx, cy, size, rotation);
  return `<polygon points="${points}" />`;
}

function createPentagon(cx: number, cy: number, size: number, rotation: number): string {
  const points = generatePolygonPoints(5, cx, cy, size, rotation);
  return `<polygon points="${points}" />`;
}

function createStar(cx: number, cy: number, size: number, rotation: number): string {
  const outerRadius = size;
  const innerRadius = size * 0.4;
  const points: [number, number][] = [];

  for (let i = 0; i < 10; i++) {
    const angle = (i * Math.PI) / 5 + (rotation * Math.PI) / 180;
    const radius = i % 2 === 0 ? outerRadius : innerRadius;
    const x = cx + radius * Math.cos(angle);
    const y = cy + radius * Math.sin(angle);
    points.push([x, y]);
  }

  const pointsStr = points.map(p => `${p[0]},${p[1]}`).join(' ');
  return `<polygon points="${pointsStr}" />`;
}

function generatePolygonPoints(sides: number, cx: number, cy: number, size: number, rotation: number): string {
  const points: [number, number][] = [];
  const angleStep = (2 * Math.PI) / sides;
  const rotationRad = (rotation * Math.PI) / 180;

  for (let i = 0; i < sides; i++) {
    const angle = i * angleStep + rotationRad;
    const x = cx + size * Math.cos(angle);
    const y = cy + size * Math.sin(angle);
    points.push([x, y]);
  }

  return points.map(p => `${p[0]},${p[1]}`).join(' ');
}

function createWave(x: number, y: number, width: number, height: number, amplitude: number): string {
  const points = [];
  const steps = 50;

  for (let i = 0; i <= steps; i++) {
    const px = x + (i / steps) * width;
    const py = y + height / 2 + Math.sin((i / steps) * Math.PI * 2) * amplitude;
    points.push(`${px},${py}`);
  }

  return `<polyline points="${points.join(' ')}" fill="none" />`;
}

function createSpiral(cx: number, cy: number, maxRadius: number, turns: number, rotation: number): string {
  const points = [];
  const steps = 200;
  const rotationRad = (rotation * Math.PI) / 180;

  for (let i = 0; i <= steps; i++) {
    const angle = (i / steps) * turns * 2 * Math.PI + rotationRad;
    const radius = (i / steps) * maxRadius;
    const x = cx + radius * Math.cos(angle);
    const y = cy + radius * Math.sin(angle);
    points.push(`${x},${y}`);
  }

  return `<polyline points="${points.join(' ')}" fill="none" />`;
}

function createRadialLines(cx: number, cy: number, radius: number, lines: number): string {
  let svg = '';
  for (let i = 0; i < lines; i++) {
    const angle = (i / lines) * Math.PI * 2;
    const x2 = cx + radius * Math.cos(angle);
    const y2 = cy + radius * Math.sin(angle);
    svg += `<line x1="${cx}" y1="${cy}" x2="${x2}" y2="${y2}" />`;
  }
  return svg;
}

function createGrid(x: number, y: number, width: number, height: number, cellSize: number): string {
  let svg = '';
  const cols = Math.ceil(width / cellSize);
  const rows = Math.ceil(height / cellSize);

  for (let i = 0; i <= cols; i++) {
    svg += `<line x1="${x + i * cellSize}" y1="${y}" x2="${x + i * cellSize}" y2="${y + height}" />`;
  }
  for (let i = 0; i <= rows; i++) {
    svg += `<line x1="${x}" y1="${y + i * cellSize}" x2="${x + width}" y2="${y + i * cellSize}" />`;
  }

  return svg;
}

// ==================== 位置與旋轉計算 ====================

interface Position {
  x: number;
  y: number;
}

function calculateGridPositions(quantity: number, width: number, height: number): Position[] {
  const positions: Position[] = [];
  const cols = Math.ceil(Math.sqrt(quantity));
  const rows = Math.ceil(quantity / cols);
  const cellWidth = width / cols;
  const cellHeight = height / rows;

  for (let i = 0; i < quantity; i++) {
    const col = i % cols;
    const row = Math.floor(i / cols);
    positions.push({
      x: cellWidth * col + cellWidth / 2,
      y: cellHeight * row + cellHeight / 2,
    });
  }

  return positions;
}

function calculateSpiralPositions(quantity: number, centerX: number, centerY: number, maxRadius: number): Position[] {
  const positions: Position[] = [];

  for (let i = 0; i < quantity; i++) {
    const angle = (i / quantity) * Math.PI * 2;
    const radius = (i / quantity) * maxRadius;
    positions.push({
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle),
    });
  }

  return positions;
}

function calculateRadialPositions(quantity: number, centerX: number, centerY: number, radius: number): Position[] {
  const positions: Position[] = [];

  for (let i = 0; i < quantity; i++) {
    const angle = (i / quantity) * Math.PI * 2;
    positions.push({
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle),
    });
  }

  return positions;
}

function calculateRandomPositions(quantity: number, width: number, height: number, seed: number): Position[] {
  const positions: Position[] = [];
  let random = createSeededRandom(seed);

  for (let i = 0; i < quantity; i++) {
    positions.push({
      x: random() * width,
      y: random() * height,
    });
  }

  return positions;
}

// ==================== 色彩計算 ====================

function interpolateColor(color1: string, color2: string, t: number): string {
  const c1 = hexToRgb(color1);
  const c2 = hexToRgb(color2);

  const r = Math.round(c1.r + (c2.r - c1.r) * t);
  const g = Math.round(c1.g + (c2.g - c1.g) * t);
  const b = Math.round(c1.b + (c2.b - c1.b) * t);

  return rgbToHex(r, g, b);
}

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16),
  } : { r: 0, g: 0, b: 0 };
}

function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('');
}

// ==================== Fibonacci 數列 ====================

function getFibonacciSequence(count: number): number[] {
  const seq = [1, 1];
  while (seq.length < count) {
    seq.push(seq[seq.length - 1] + seq[seq.length - 2]);
  }
  return seq.slice(0, count);
}

// ==================== 輔助函數 ====================

function createSeededRandom(seed: number) {
  return () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
}

// ==================== 主要紋理生成函數 ====================

export function generateTexture(params: TextureParameters): TextureGenerationResult {
  const {
    canvasWidth,
    canvasHeight,
    shapeType,
    quantity,
    arrangement,
    rotation,
    rotationType,
    rotationIncrement,
    rotationRandomRange,
    scale,
    scaleVariation,
    algorithm,
    algorithmParams,
    strokeWidth,
    density,
    colorMode,
    primaryColor,
    secondaryColor = '#FFFFFF',
    opacity,
    backgroundColor,
  } = params;

  let positions: Position[] = [];

  // 計算位置
  switch (arrangement) {
    case 'grid':
      positions = calculateGridPositions(quantity, canvasWidth, canvasHeight);
      break;
    case 'spiral':
      positions = calculateSpiralPositions(quantity, canvasWidth / 2, canvasHeight / 2, Math.min(canvasWidth, canvasHeight) / 3);
      break;
    case 'radial':
      positions = calculateRadialPositions(quantity, canvasWidth / 2, canvasHeight / 2, Math.min(canvasWidth, canvasHeight) / 3);
      break;
    case 'random':
      positions = calculateRandomPositions(quantity, canvasWidth, canvasHeight, Math.random() * 10000);
      break;
    case 'linear':
      for (let i = 0; i < quantity; i++) {
        positions.push({
          x: (canvasWidth / quantity) * i + canvasWidth / (quantity * 2),
          y: canvasHeight / 2,
        });
      }
      break;
  }

  // 生成 SVG
  let svgContent = '';

  for (let i = 0; i < quantity && i < positions.length; i++) {
    const pos = positions[i];

    // 計算尺度
    let currentScale = scale;
    if (scaleVariation === 'fibonacci') {
      const fibSeq = getFibonacciSequence(quantity);
      currentScale = (fibSeq[i] / fibSeq[fibSeq.length - 1]) * scale;
    }

    // 計算旋轉
    let currentRotation = rotation;
    if (rotationType === 'incremental' && rotationIncrement) {
      currentRotation = rotation + i * rotationIncrement;
    } else if (rotationType === 'random' && rotationRandomRange) {
      const random = createSeededRandom(i);
      currentRotation = rotation + (random() - 0.5) * rotationRandomRange;
    }

    // 計算色彩
    let shapeColor = primaryColor;
    if (colorMode === 'gradient' && secondaryColor) {
      shapeColor = interpolateColor(primaryColor, secondaryColor, i / Math.max(quantity - 1, 1));
    }

    // 生成形狀
    let shapeElement = '';
    const radius = 10 * currentScale;

    switch (shapeType) {
      case 'circle':
        shapeElement = createCircle(pos.x, pos.y, radius);
        break;
      case 'square':
        shapeElement = createSquare(pos.x - radius, pos.y - radius, radius * 2);
        break;
      case 'triangle':
        shapeElement = createTriangle(pos.x, pos.y, radius, currentRotation);
        break;
      case 'hexagon':
        shapeElement = createHexagon(pos.x, pos.y, radius, currentRotation);
        break;
      case 'pentagon':
        shapeElement = createPentagon(pos.x, pos.y, radius, currentRotation);
        break;
      case 'star':
        shapeElement = createStar(pos.x, pos.y, radius, currentRotation);
        break;
      case 'wave':
        shapeElement = createWave(pos.x - radius * 2, pos.y - radius / 2, radius * 4, radius, radius * 0.5);
        break;
      case 'spiral':
        shapeElement = createSpiral(pos.x, pos.y, radius * 2, 3, currentRotation);
        break;
      case 'radial':
        shapeElement = createRadialLines(pos.x, pos.y, radius * 2, Math.floor(8 * currentScale));
        break;
      case 'grid':
        shapeElement = createGrid(pos.x - radius, pos.y - radius, radius * 2, radius * 2, radius * 0.4);
        break;
      default:
        shapeElement = createCircle(pos.x, pos.y, radius);
    }

    // 添加樣式屬性
    const opacityValue = (opacity / 100) * (density / 100);
    const style = `fill="${shapeColor}" stroke="${shapeColor}" stroke-width="${strokeWidth}" opacity="${opacityValue}"`;

    svgContent += shapeElement.replace('>', ` ${style} />`);
  }

  // 組裝完整 SVG
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${canvasWidth}" height="${canvasHeight}" viewBox="0 0 ${canvasWidth} ${canvasHeight}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <style>
      svg { background-color: ${backgroundColor}; }
    </style>
  </defs>
  <rect width="${canvasWidth}" height="${canvasHeight}" fill="${backgroundColor}" />
  <g id="texture">
    ${svgContent}
  </g>
</svg>`;

  return {
    id: `texture-${Date.now()}`,
    svgData: svg,
    parameters: params,
    timestamp: Date.now(),
  };
}

// 預設配置
export const defaultTextureParameters: TextureParameters = {
  id: 'default',
  name: '新紋理',
  shapeType: 'circle',
  quantity: 12,
  arrangement: 'grid',
  rotationType: 'fixed',
  rotation: 30,
  scale: 1,
  algorithm: 'perlin',
  algorithmParams: {
    frequency: 0.5,
    amplitude: 0.3,
    octaves: 4,
  },
  strokeWidth: 2,
  density: 100,
  spacing: { min: 10, max: 50 },
  colorMode: 'gradient',
  primaryColor: '#5847eb',
  secondaryColor: '#FF6B6B',
  opacity: 100,
  blendMode: 'normal',
  canvasWidth: 800,
  canvasHeight: 800,
  backgroundColor: '#FFFFFF',
};
