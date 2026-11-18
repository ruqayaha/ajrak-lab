import React from 'react';

/**
 * Reusable Geometric Primitives for Ajrak Pattern Generation
 * All primitives are constructed to align on a consistent 100 x 100 coordinate grid.
 */

// 1. Parametric 8-Pointed Star (Octagram)
interface OctagramProps {
  cx?: number;
  cy?: number;
  outerR?: number;
  innerR?: number;
  fill: string;
  stroke: string;
  strokeWidth: number;
  rotation?: number;
}

export const Octagram: React.FC<OctagramProps> = ({
  cx = 50,
  cy = 50,
  outerR = 25,
  innerR = 14,
  fill,
  stroke,
  strokeWidth,
  rotation = 0,
}) => {
  const points: string[] = [];
  for (let i = 0; i < 16; i++) {
    const angle = (i * Math.PI) / 8 - Math.PI / 2 + (rotation * Math.PI) / 180;
    const r = i % 2 === 0 ? outerR : innerR;
    const x = cx + r * Math.cos(angle);
    const y = cy + r * Math.sin(angle);
    points.push(`${x.toFixed(2)},${y.toFixed(2)}`);
  }

  return (
    <polygon
      points={points.join(' ')}
      fill={fill}
      stroke={stroke}
      strokeWidth={strokeWidth}
      strokeLinejoin="round"
    />
  );
};

// 2. Parametric Stepped Diamond / Crenellated Polygon
interface SteppedPolygonProps {
  cx?: number;
  cy?: number;
  scale?: number;
  fill: string;
  stroke: string;
  strokeWidth: number;
}

export const SteppedDiamondShape: React.FC<SteppedPolygonProps> = ({
  cx = 50,
  cy = 50,
  scale = 1,
  fill,
  stroke,
  strokeWidth,
}) => {
  // Symmetrical 4-quadrant stepped contour
  const basePoints = [
    { x: 50, y: 6 },
    { x: 56, y: 12 }, { x: 56, y: 18 }, { x: 64, y: 18 }, { x: 64, y: 26 },
    { x: 74, y: 26 }, { x: 74, y: 36 }, { x: 82, y: 36 }, { x: 82, y: 44 }, { x: 94, y: 50 },
    { x: 82, y: 56 }, { x: 82, y: 64 }, { x: 74, y: 64 }, { x: 74, y: 74 },
    { x: 64, y: 74 }, { x: 64, y: 82 }, { x: 56, y: 82 }, { x: 56, y: 88 }, { x: 50, y: 94 },
    { x: 44, y: 88 }, { x: 44, y: 82 }, { x: 36, y: 82 }, { x: 36, y: 74 },
    { x: 26, y: 74 }, { x: 26, y: 64 }, { x: 18, y: 64 }, { x: 18, y: 56 }, { x: 6, y: 50 },
    { x: 18, y: 44 }, { x: 18, y: 36 }, { x: 26, y: 36 }, { x: 26, y: 26 },
    { x: 36, y: 26 }, { x: 36, y: 18 }, { x: 44, y: 18 }, { x: 44, y: 12 },
  ];

  const transformedPoints = basePoints.map((p) => {
    const nx = cx + (p.x - 50) * scale;
    const ny = cy + (p.y - 50) * scale;
    return `${nx.toFixed(2)},${ny.toFixed(2)}`;
  }).join(' ');

  return (
    <polygon
      points={transformedPoints}
      fill={fill}
      stroke={stroke}
      strokeWidth={strokeWidth}
      strokeLinejoin="round"
    />
  );
};

// 3. Reusable Almond / Phool Floral Petal
interface AlmondPetalProps {
  cx?: number;
  cy?: number;
  angle: number;
  length?: number;
  width?: number;
  fill: string;
  stroke: string;
  strokeWidth: number;
  showVein?: boolean;
  veinColor?: string;
}

export const AlmondPetal: React.FC<AlmondPetalProps> = ({
  cx = 50,
  cy = 50,
  angle,
  length = 28,
  width = 6,
  fill,
  stroke,
  strokeWidth,
  showVein = true,
  veinColor,
}) => {
  const topY = cy - length;
  const midY = cy - length * 0.55;

  return (
    <g transform={`rotate(${angle} ${cx} ${cy})`}>
      <path
        d={`M ${cx},${cy} Q ${cx - width},${midY} ${cx},${topY} Q ${cx + width},${midY} ${cx},${cy}`}
        fill={fill}
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
      />
      {showVein && (
        <line
          x1={cx}
          y1={cy - 4}
          x2={cx}
          y2={topY + 4}
          stroke={veinColor || stroke}
          strokeWidth={strokeWidth * 0.6}
        />
      )}
    </g>
  );
};

// 4. Consistent Corner Quadrants
// Designed specifically so that when 4 adjacent tiles meet at (0,0), their 4 quadrants
// fuse seamlessly into a full 360-degree secondary medallion!
interface CornerQuadrantsProps {
  fill: string;
  stroke: string;
  accent: string;
  strokeWidth: number;
  variant?: 'triangular' | 'stepped' | 'rosette';
}

export const CornerQuadrants: React.FC<CornerQuadrantsProps> = ({
  fill,
  stroke,
  accent,
  strokeWidth,
  variant = 'triangular',
}) => {
  return (
    <g className="corner-quadrants">
      {/* Top-Left Corner (0, 0) */}
      <g>
        {variant === 'triangular' && (
          <polygon points="0,0 20,0 0,20" fill={fill} stroke={stroke} strokeWidth={strokeWidth} />
        )}
        {variant === 'rosette' && (
          <path d="M 0,0 L 22,0 A 22,22 0 0,1 0,22 Z" fill={fill} stroke={stroke} strokeWidth={strokeWidth} />
        )}
        {variant === 'stepped' && (
          <polygon points="0,0 20,0 20,6 14,6 14,14 6,14 6,20 0,20" fill={fill} stroke={stroke} strokeWidth={strokeWidth} />
        )}
        <circle cx="6" cy="6" r="2.2" fill={accent} stroke={stroke} strokeWidth={strokeWidth * 0.5} />
      </g>

      {/* Top-Right Corner (100, 0) */}
      <g>
        {variant === 'triangular' && (
          <polygon points="100,0 80,0 100,20" fill={fill} stroke={stroke} strokeWidth={strokeWidth} />
        )}
        {variant === 'rosette' && (
          <path d="M 100,0 L 78,0 A 22,22 0 0,0 100,22 Z" fill={fill} stroke={stroke} strokeWidth={strokeWidth} />
        )}
        {variant === 'stepped' && (
          <polygon points="100,0 80,0 80,6 86,6 86,14 94,14 94,20 100,20" fill={fill} stroke={stroke} strokeWidth={strokeWidth} />
        )}
        <circle cx="94" cy="6" r="2.2" fill={accent} stroke={stroke} strokeWidth={strokeWidth * 0.5} />
      </g>

      {/* Bottom-Right Corner (100, 100) */}
      <g>
        {variant === 'triangular' && (
          <polygon points="100,100 80,100 100,80" fill={fill} stroke={stroke} strokeWidth={strokeWidth} />
        )}
        {variant === 'rosette' && (
          <path d="M 100,100 L 78,100 A 22,22 0 0,1 100,78 Z" fill={fill} stroke={stroke} strokeWidth={strokeWidth} />
        )}
        {variant === 'stepped' && (
          <polygon points="100,100 80,100 80,94 86,94 86,86 94,86 94,80 100,80" fill={fill} stroke={stroke} strokeWidth={strokeWidth} />
        )}
        <circle cx="94" cy="94" r="2.2" fill={accent} stroke={stroke} strokeWidth={strokeWidth * 0.5} />
      </g>

      {/* Bottom-Left Corner (0, 100) */}
      <g>
        {variant === 'triangular' && (
          <polygon points="0,100 20,100 0,80" fill={fill} stroke={stroke} strokeWidth={strokeWidth} />
        )}
        {variant === 'rosette' && (
          <path d="M 0,100 L 22,100 A 22,22 0 0,0 0,78 Z" fill={fill} stroke={stroke} strokeWidth={strokeWidth} />
        )}
        {variant === 'stepped' && (
          <polygon points="0,100 20,100 20,94 14,94 14,86 6,86 6,80 0,80" fill={fill} stroke={stroke} strokeWidth={strokeWidth} />
        )}
        <circle cx="6" cy="94" r="2.2" fill={accent} stroke={stroke} strokeWidth={strokeWidth * 0.5} />
      </g>
    </g>
  );
};

// 5. Edge Connector Lozenges
// Positioned along the mid-edges (50,0), (100,50), (50,100), (0,50) to fuse with adjacent tiles
interface EdgeConnectorsProps {
  fill: string;
  stroke: string;
  accent: string;
  strokeWidth: number;
  size?: number;
}

export const EdgeConnectors: React.FC<EdgeConnectorsProps> = ({
  fill,
  stroke,
  accent,
  strokeWidth,
  size = 12,
}) => {
  return (
    <g className="edge-connectors">
      {/* Top Edge Half-Diamond */}
      <polygon
        points={`50,0 ${50 + size},${size} 50,${size * 2} ${50 - size},${size}`}
        fill={fill}
        stroke={stroke}
        strokeWidth={strokeWidth}
      />
      <circle cx="50" cy={size} r="2.2" fill={accent} stroke={stroke} strokeWidth={strokeWidth * 0.5} />

      {/* Bottom Edge Half-Diamond */}
      <polygon
        points={`50,100 ${50 + size},${100 - size} 50,${100 - size * 2} ${50 - size},${100 - size}`}
        fill={fill}
        stroke={stroke}
        strokeWidth={strokeWidth}
      />
      <circle cx="50" cy={100 - size} r="2.2" fill={accent} stroke={stroke} strokeWidth={strokeWidth * 0.5} />

      {/* Left Edge Half-Diamond */}
      <polygon
        points={`0,50 ${size},${50 + size} ${size * 2},50 ${size},${50 - size}`}
        fill={fill}
        stroke={stroke}
        strokeWidth={strokeWidth}
      />
      <circle cx={size} cy="50" r="2.2" fill={accent} stroke={stroke} strokeWidth={strokeWidth * 0.5} />

      {/* Right Edge Half-Diamond */}
      <polygon
        points={`100,50 ${100 - size},${50 + size} ${100 - size * 2},50 ${100 - size},${50 - size}`}
        fill={fill}
        stroke={stroke}
        strokeWidth={strokeWidth}
      />
      <circle cx={100 - size} cy="50" r="2.2" fill={accent} stroke={stroke} strokeWidth={strokeWidth * 0.5} />
    </g>
  );
};

// 6. Resist Pinpoints (Datta block impressions)
interface ResistPinpointProps {
  cx: number;
  cy: number;
  r?: number;
  fill: string;
  stroke: string;
  strokeWidth: number;
}

export const ResistPinpoint: React.FC<ResistPinpointProps> = ({
  cx,
  cy,
  r = 1.8,
  fill,
  stroke,
  strokeWidth,
}) => (
  <circle cx={cx} cy={cy} r={r} fill={fill} stroke={stroke} strokeWidth={strokeWidth} />
);

// 7. Higher-Order Rotational Group
// Replicates children across N radial folds around (cx, cy)
interface RotationalGroupProps {
  folds?: 4 | 8;
  cx?: number;
  cy?: number;
  startAngle?: number;
  children: React.ReactNode;
}

export const RotationalGroup: React.FC<RotationalGroupProps> = ({
  folds = 8,
  cx = 50,
  cy = 50,
  startAngle = 0,
  children,
}) => {
  const step = 360 / folds;
  const angles: number[] = [];
  for (let i = 0; i < folds; i++) {
    angles.push(startAngle + i * step);
  }

  return (
    <g className="rotational-group">
      {angles.map((ang) => (
        <g key={ang} transform={`rotate(${ang} ${cx} ${cy})`}>
          {children}
        </g>
      ))}
    </g>
  );
};
