export type MotifId = 'star-trellis' | 'eightfold-rosette' | 'stepped-diamond';

export type GridLayout = 'square' | 'half-drop' | 'diamond';

export interface ColorPalette {
  id: string;
  name: string;
  description: string;
  ground: string;       // Background fabric base
  primary: string;      // Dominant motif color (e.g. Madder or Indigo)
  secondary: string;    // Secondary fill (e.g. Deep Indigo or Rich Madder)
  accent: string;       // Highlight tone (e.g. Ivory or Kasimi Ochre)
  outline: string;      // Line resist / Syahi charcoal outline
}

export interface PatternConfig {
  motifId: MotifId;
  paletteId: string;
  customColors: {
    ground: string;
    primary: string;
    secondary: string;
    accent: string;
    outline: string;
  };
  gridDensity: number;      // e.g., 2, 3, 4, 5, 6
  motifScale: number;       // 0.6 to 1.4
  spacing: number;          // 0 to 40 px
  rotation: number;         // 0 to 360 degrees
  gridLayout: GridLayout;
  strokeWidth: number;      // 1 to 4
  showBorder: boolean;      // Traditional Hasheeya border
  borderWidth: number;      // Border thickness
  textureEffect: boolean;   // Subtle hand-pressed relief look
  showGridGuides: boolean;  // Display underlying geometric construction lines
}

export interface MotifStudyInfo {
  id: MotifId;
  title: string;
  subtitle: string;
  traditionalInspiration: string;
  description: string;
  geometryType: string;
  symmetryGroup: string;
  carvingDifficulty: string;
}

export type MockupType = 'flat' | 'notebook' | 'shawl' | 'poster' | 'tile' | 'sleeve';
