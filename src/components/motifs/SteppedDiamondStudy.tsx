import React from 'react';
import {
  SteppedDiamondShape,
  CornerQuadrants,
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
 * Study 03: Stepped Diamond & Knot (Chokri-inspired orthogonal study)
 * Constructed from reusable geometric primitives:
 * - CornerQuadrants with stepped crenellations (interlocking latch-hooks)
 * - Concentric outer and inner SteppedDiamondShape primitives
 * - Central Chokri cross with cardinal and diagonal resist pinpoints
 */
export const SteppedDiamondStudy: React.FC<MotifProps> = ({
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
          <rect x="25" y="25" width="50" height="50" fill="none" transform="rotate(45 50 50)" />
          <line x1="50" y1="0" x2="50" y2="100" />
          <line x1="0" y1="50" x2="100" y2="50" />
        </g>
      )}

      {/* 3. Reusable Corner Quadrants with stepped latch-triangle profile */}
      <CornerQuadrants
        fill={colors.secondary}
        stroke={colors.outline}
        accent={colors.accent}
        strokeWidth={strokeWidth}
        variant="stepped"
      />

      {/* 4. Reusable Outer Stepped Diamond Shape (Madder Primary) */}
      <SteppedDiamondShape
        cx={50}
        cy={50}
        scale={1.0}
        fill={colors.primary}
        stroke={colors.outline}
        strokeWidth={strokeWidth}
      />

      {/* 5. Reusable Inner Stepped Diamond Shape (Secondary Indigo) */}
      <SteppedDiamondShape
        cx={50}
        cy={50}
        scale={0.68}
        fill={colors.secondary}
        stroke={colors.accent}
        strokeWidth={strokeWidth * 0.8}
      />

      {/* 6. Central Chokri Cross (Ivory resist core) */}
      <polygon
        points="45,38 55,38 55,45 62,45 62,55 55,55 55,62 45,62 45,55 38,55 38,45 45,45"
        fill={colors.accent}
        stroke={colors.outline}
        strokeWidth={strokeWidth * 0.7}
      />

      {/* 7. Central Diamond Core Seed */}
      <polygon
        points="50,44 56,50 50,56 44,50"
        fill={colors.primary}
        stroke={colors.outline}
        strokeWidth={strokeWidth * 0.5}
      />
      <circle cx="50" cy="50" r="1.8" fill={colors.accent} />

      {/* 8. Reusable RotationalGroup for Cardinal and Diagonal Datta Pinpoints */}
      <RotationalGroup folds={4} cx={50} cy={50}>
        {/* Cardinal arm dots */}
        <ResistPinpoint
          cx={50}
          cy={16}
          r={2}
          fill={colors.accent}
          stroke={colors.outline}
          strokeWidth={strokeWidth * 0.4}
        />
        {/* Diagonal corner dots */}
        <ResistPinpoint
          cx={32}
          cy={32}
          r={1.8}
          fill={colors.accent}
          stroke={colors.outline}
          strokeWidth={strokeWidth * 0.4}
        />
      </RotationalGroup>
    </svg>
  );
};
