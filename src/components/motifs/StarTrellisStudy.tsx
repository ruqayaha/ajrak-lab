import React from 'react';
import {
  Octagram,
  CornerQuadrants,
  EdgeConnectors,
  RotationalGroup,
  ResistPinpoint,
} from '../geometry/GeometricPrimitives';

interface MotifProps {
  size?: number;
  colors: {
    ground: string;
    primary: string;
    secondary: string;
    accent: string;
    outline: string;
  };
  strokeWidth?: number;
  rotation?: number;
  showGuides?: boolean;
}

/**
 * Study 01: Star-Trellis Geometry (Taveez-inspired polygon study)
 * Constructed from reusable geometric primitives:
 * - CornerQuadrants (triangular corner fragments that join 4 tiles into full lozenges)
 * - EdgeConnectors (half-diamonds fusing across horizontal and vertical seams)
 * - Octagram (8-pointed central star core)
 * - Concentric halo circle and inner diamond core
 * - RotationalGroup of 8 satellite resist pinpoints
 */
export const StarTrellisStudy: React.FC<MotifProps> = ({
  size = 100,
  colors,
  strokeWidth = 2,
  rotation = 0,
  showGuides = false,
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className="overflow-visible select-none"
      style={{ transform: `rotate(${rotation}deg)` }}
    >
      {/* 1. Base tile ground */}
      <rect width="100" height="100" fill={colors.ground} />

      {/* 2. Construction Guides (when enabled) */}
      {showGuides && (
        <g stroke={colors.accent} strokeWidth="0.5" strokeDasharray="2 2" opacity="0.4">
          <line x1="0" y1="0" x2="100" y2="100" />
          <line x1="100" y1="0" x2="0" y2="100" />
          <line x1="50" y1="0" x2="50" y2="100" />
          <line x1="0" y1="50" x2="100" y2="50" />
          <circle cx="50" cy="50" r="35" fill="none" />
        </g>
      )}

      {/* 3. Reusable Corner Quadrants (fusing into complete secondary diamonds at tile vertices) */}
      <CornerQuadrants
        fill={colors.secondary}
        stroke={colors.outline}
        accent={colors.accent}
        strokeWidth={strokeWidth}
        variant="triangular"
      />

      {/* 4. Reusable Edge Connectors (half-diamonds fusing across tile boundaries) */}
      <EdgeConnectors
        fill={colors.primary}
        stroke={colors.outline}
        accent={colors.accent}
        strokeWidth={strokeWidth}
        size={12}
      />

      {/* 5. Diagonal Interconnecting Trellis Bands */}
      <g stroke={colors.outline} strokeWidth={strokeWidth} fill="none">
        <line x1="20" y1="0" x2="38" y2="12" />
        <line x1="80" y1="0" x2="62" y2="12" />
        <line x1="100" y1="20" x2="88" y2="38" />
        <line x1="100" y1="80" x2="88" y2="62" />
        <line x1="80" y1="100" x2="62" y2="88" />
        <line x1="20" y1="100" x2="38" y2="88" />
        <line x1="0" y1="80" x2="12" y2="62" />
        <line x1="0" y1="20" x2="12" y2="38" />
      </g>

      {/* 6. Central Concentric Star Halo */}
      <circle cx="50" cy="50" r="29" stroke={colors.accent} strokeWidth={strokeWidth * 1.2} fill="none" />

      {/* 7. Reusable Octagram (8-pointed central star core) */}
      <Octagram
        cx={50}
        cy={50}
        outerR={25}
        innerR={14}
        fill={colors.primary}
        stroke={colors.outline}
        strokeWidth={strokeWidth}
      />

      {/* 8. Inner Concentric Octagon / Circle Core */}
      <circle
        cx="50"
        cy="50"
        r="12"
        fill={colors.secondary}
        stroke={colors.accent}
        strokeWidth={strokeWidth * 0.8}
      />

      {/* 9. Central Diamond Seed */}
      <polygon
        points="50,42 58,50 50,58 42,50"
        fill={colors.accent}
        stroke={colors.outline}
        strokeWidth={strokeWidth * 0.6}
      />
      <circle cx="50" cy="50" r="1.8" fill={colors.outline} />

      {/* 10. Reusable 8-Fold Rotational Array of Datta Resist Pinpoints */}
      <RotationalGroup folds={8} cx={50} cy={50}>
        <ResistPinpoint
          cx={50}
          cy={30}
          r={1.8}
          fill={colors.accent}
          stroke={colors.outline}
          strokeWidth={strokeWidth * 0.4}
        />
      </RotationalGroup>
    </svg>
  );
};
