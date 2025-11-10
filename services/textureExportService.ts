import { TextureGenerationResult, ExportFormat } from '../types';

/**
 * 將 SVG 轉換為 Canvas 以便匯出為 PNG
 */
export async function svgToCanvas(svgString: string): Promise<HTMLCanvasElement> {
  return new Promise((resolve, reject) => {
    // 從 SVG 字符串中解析尺寸
    const parser = new DOMParser();
    const svgDoc = parser.parseFromString(svgString, 'image/svg+xml');

    if (svgDoc.documentElement.tagName === 'parsererror') {
      reject(new Error('無效的 SVG 字符串'));
      return;
    }

    const svgElement = svgDoc.documentElement as SVGSVGElement;
    const width = parseInt(svgElement.getAttribute('width') || '800');
    const height = parseInt(svgElement.getAttribute('height') || '800');

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      reject(new Error('無法獲取 Canvas 上下文'));
      return;
    }

    const img = new Image();
    const svgBlob = new Blob([svgString], { type: 'image/svg+xml' });
    const svgUrl = URL.createObjectURL(svgBlob);

    img.onload = () => {
      ctx.drawImage(img, 0, 0);
      URL.revokeObjectURL(svgUrl);
      resolve(canvas);
    };

    img.onerror = () => {
      URL.revokeObjectURL(svgUrl);
      reject(new Error('無法加載 SVG 圖像'));
    };

    img.src = svgUrl;
  });
}

/**
 * 匯出為 SVG 檔案
 */
export function exportAsSVG(result: TextureGenerationResult, filename?: string): void {
  const link = document.createElement('a');
  const svgBlob = new Blob([result.svgData], { type: 'image/svg+xml;charset=utf-8' });
  const svgUrl = URL.createObjectURL(svgBlob);

  link.href = svgUrl;
  link.download = filename || `texture-${result.id}.svg`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(svgUrl);
}

/**
 * 匯出為 PNG 檔案
 */
export async function exportAsPNG(
  result: TextureGenerationResult,
  options?: {
    dpi?: number;
    filename?: string;
  }
): Promise<void> {
  try {
    const dpi = options?.dpi || 72;
    const filename = options?.filename || `texture-${result.id}.png`;

    const canvas = await svgToCanvas(result.svgData);
    const link = document.createElement('a');
    link.href = canvas.toDataURL('image/png');
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error('PNG 匯出失敗:', error);
    throw error;
  }
}

/**
 * 匯出為高解析度 PNG (300 DPI)
 */
export async function exportAsHighResPNG(
  result: TextureGenerationResult,
  filename?: string
): Promise<void> {
  return exportAsPNG(result, {
    dpi: 300,
    filename: filename || `texture-${result.id}-hires.png`,
  });
}

/**
 * 生成 CSS Grid 程式碼
 */
export function generateCSSGrid(result: TextureGenerationResult): string {
  const { parameters } = result;
  const { quantity, canvasWidth, canvasHeight, primaryColor, secondaryColor } = parameters;

  const cols = Math.ceil(Math.sqrt(quantity));

  return `
/* 自動生成的 CSS Grid 紋理 */
.texture-grid {
  display: grid;
  grid-template-columns: repeat(${cols}, 1fr);
  grid-template-rows: repeat(auto-fit, minmax(${canvasHeight / cols}px, 1fr));
  width: ${canvasWidth}px;
  height: ${canvasHeight}px;
  gap: 0;
  background-color: ${parameters.backgroundColor};
}

.texture-item {
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor || '#FFFFFF'} 100%);
  opacity: ${parameters.opacity / 100};
  border: ${parameters.strokeWidth}px solid ${primaryColor};
  border-radius: ${parameters.shapeType === 'circle' ? '50%' : '0'};
}

/* 響應式設計 */
@media (max-width: 768px) {
  .texture-grid {
    width: 100%;
    height: auto;
    aspect-ratio: 1 / 1;
  }
}
`.trim();
}

/**
 * 匯出為 CSS 檔案
 */
export function exportAsCSS(result: TextureGenerationResult, filename?: string): void {
  const css = generateCSSGrid(result);
  const link = document.createElement('a');
  const blob = new Blob([css], { type: 'text/css;charset=utf-8' });
  const url = URL.createObjectURL(blob);

  link.href = url;
  link.download = filename || `texture-${result.id}.css`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * 生成 HTML 預覽
 */
export function generateHTMLPreview(result: TextureGenerationResult): string {
  const css = generateCSSGrid(result);
  const { parameters } = result;
  const { canvasWidth, canvasHeight } = parameters;

  const html = `<!DOCTYPE html>
<html lang="zh-Hans">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>紋理預覽 - ${result.id}</title>
  <style>
    ${css}
    body {
      margin: 0;
      padding: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      background-color: #f5f5f5;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }
    .preview-container {
      background: white;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    .preview-title {
      text-align: center;
      margin-bottom: 20px;
      color: #333;
      font-size: 18px;
      font-weight: 600;
    }
  </style>
</head>
<body>
  <div class="preview-container">
    <div class="preview-title">紋理預覽</div>
    <div class="texture-grid">
      ${Array.from({ length: parameters.quantity })
        .map(() => '<div class="texture-item"></div>')
        .join('\n      ')}
    </div>
  </div>
</body>
</html>`;

  return html;
}

/**
 * 匯出為 HTML 預覽檔案
 */
export function exportAsHTML(result: TextureGenerationResult, filename?: string): void {
  const html = generateHTMLPreview(result);
  const link = document.createElement('a');
  const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);

  link.href = url;
  link.download = filename || `texture-${result.id}-preview.html`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * 匯出為 JSON (參數存檔)
 */
export function exportAsJSON(result: TextureGenerationResult, filename?: string): void {
  const json = JSON.stringify(result, null, 2);
  const link = document.createElement('a');
  const blob = new Blob([json], { type: 'application/json;charset=utf-8' });
  const url = URL.createObjectURL(blob);

  link.href = url;
  link.download = filename || `texture-${result.id}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * 主匯出函數
 */
export async function exportTexture(
  result: TextureGenerationResult,
  format: ExportFormat,
  filename?: string
): Promise<void> {
  switch (format) {
    case 'svg':
      exportAsSVG(result, filename);
      break;
    case 'png':
      await exportAsPNG(result, { filename });
      break;
    case 'css':
      exportAsCSS(result, filename);
      break;
    default:
      throw new Error(`不支援的匯出格式: ${format}`);
  }
}
