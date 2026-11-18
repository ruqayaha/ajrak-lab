import React from 'react';
import {
  CornerQuadrants,
  AlmondPetal,
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
 * Study 02: Eightfold Rosette (Phool-inspired radial symmetry study)
 * Constructed from reusable geometric primitives:
 * - CornerQuadrants with quarter-rosette arcs (joining 4 tiles into full rosettes at grid vertices)
 * - Outer Framing Octagon and inner rotated Octagon
 * - RotationalGroup of 8 reusable AlmondPetal components
 * - Central concentric rings with Datta resist pinpoints
 */
export const EightfoldRosetteStudy: React.FC<MotifProps> = ({
  size = 100,
  colors,
  strokeWidth = 2,
  rotation = 0,
  showGuides = false,
}) => {
  // Octagon polygon points centered at (50, 50) with radius 36
  const octPoints = [0, 45, 90, 135, 180, 225, 270, 315].map((ang) => {
    const rad = (ang * Math.PI) / 180;
    const x = 50 + 36 * Math.cos(rad);
    const y = 50 + 36 * Math.sin(rad);
    return `${x.toFixed(2)},${y.toFixed(2)}`;
  }).join(' ');

  // Stepped inner octagon with radius 26
  const innerOctPoints = [22.5, 67.5, 112.5, 157.5, 202.5, 247.5, 292.5, 337.5].map((ang) => {
    const rad = (ang * Math.PI) / 180;
    const x = 50 + 26 * Math.cos(rad);
    const y = 50 + 26 * Math.sin(rad);
    return `${x.toFixed(2)},${y.toFixed(2)}`;
  }).join(' ');

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
          <circle cx="50" cy="50" r="48" fill="none" />
          <circle cx="50" cy="50" r="36" fill="none" />
          <circle cx="50" cy="50" r="18" fill="none" />
          <line x1="0" y1="0" x2="100" y2="100" />
          <line x1="100" y1="0" x2="0" y2="100" />
          <line x1="50" y1="0" x2="50" y2="100" />
          <line x1="0" y1="50" x2="100" y2="50" />
        </g>
      )}

      {/* 3. Reusable Corner Quadrants with Quarter-Rosette profile */}
      <CornerQuadrants
        fill={colors.secondary}
        stroke={colors.outline}
        accent={colors.accent}
        strokeWidth={strokeWidth}
        variant="rosette"
      />

      {/* 4. Outer framing octagon */}
      <polygon
        points={octPoints}
        fill={colors.secondary}
        stroke={colors.outline}
        strokeWidth={strokeWidth}
      />

      {/* 5. Secondary rotated inner octagon */}
      <polygon
        points={innerOctPoints}
        fill={colors.primary}
        stroke={colors.accent}
        strokeWidth={strokeWidth * 0.8}
      />

      {/* 6. Eight Radial Rosette Petals using reusable AlmondPetal components */}
      {[0, 45, 90, 135, 180, 225, 270, 315].map((ang) => (
        <AlmondPetal
          key={ang}
          cx={50}
          cy={50}
          angle={ang}
          length={28}
          width={6}
          fill={colors.accent}
          stroke={colors.outline}
          strokeWidth={strokeWidth}
          showVein={true}
          veinColor={colors.primary}
        />
      ))}

      {/* 7. Mid concentric ring */}
      <circle
        cx="50"
        cy="50"
        r="11"
        fill={colors.primary}
        stroke={colors.outline}
        strokeWidth={strokeWidth}
      />

      {/* 8. Central ivory core */}
      <circle
        cx="50"
        cy="50"
        r="6"
        fill={colors.accent}
        stroke={colors.outline}
        strokeWidth={strokeWidth * 0.6}
      />
      <circle cx="50" cy="50" r="2" fill={colors.outline} />

      {/* 9. Perimeter floret resist pinpoints using RotationalGroup */}
      <RotationalGroup folds={8} cx={50} cy={50} startAngle={22.5}>
        <ResistPinpoint
          cx={50}
          cy={17}
          r={1.7}
          fill={colors.accent}
          stroke={colors.outline}
          strokeWidth={strokeWidth * 0.4}
        />
      </RotationalGroup>
    </svg>
  );
};
