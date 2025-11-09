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