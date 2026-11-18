import React from 'react';

interface HasheeyaBorderProps {
  width: number;
  height: number;
  borderWidth: number;
  colors: {
    ground: string;
    primary: string;
    secondary: string;
    accent: string;
    outline: string;
  };
  strokeWidth: number;
}

/**
 * Traditional Sindhi Ajrak Hasheeya (Border Frame)
 * Features multi-band construction:
 * - Outer solid mordant band with fine ivory pinstripes
 * - Running Kangri (sawtooth dentils with white resist centers pointing inward)
 * - Central running diamond/bead string (Badami chain)
 * - Corner Chaukhat medallion blocks with 8-pointed star rosettes
 */
export const HasheeyaBorder: React.FC<HasheeyaBorderProps> = ({
  width,
  height,
  borderWidth,
  colors,
  strokeWidth,
}) => {
  const bw = borderWidth;
  const halfBw = bw / 2;

  // Inward-pointing Kangri (sawtooth) dentil calculation
  const dentilSize = Math.max(9, Math.min(16, bw * 0.38));
  const innerLeft = bw;
  const innerRight = width - bw;
  const innerTop = bw;
  const innerBottom = height - bw;

  const topDentils: string[] = [];
  const bottomDentils: string[] = [];
  const leftDentils: string[] = [];
  const rightDentils: string[] = [];
  const topDots: { cx: number; cy: number }[] = [];
  const bottomDots: { cx: number; cy: number }[] = [];
  const leftDots: { cx: number; cy: number }[] = [];
  const rightDots: { cx: number; cy: number }[] = [];

  // Top and bottom dentils
  const numDentilsH = Math.max(3, Math.floor((innerRight - innerLeft) / dentilSize));
  const actualStepH = (innerRight - innerLeft) / numDentilsH;
  for (let i = 0; i < numDentilsH; i++) {
    const x0 = innerLeft + i * actualStepH;
    const xMid = x0 + actualStepH / 2;
    const x1 = x0 + actualStepH;
    const depth = dentilSize * 0.65;
    topDentils.push(`M ${x0},${innerTop} L ${xMid},${innerTop + depth} L ${x1},${innerTop}`);
    bottomDentils.push(`M ${x0},${innerBottom} L ${xMid},${innerBottom - depth} L ${x1},${innerBottom}`);
    topDots.push({ cx: xMid, cy: innerTop + depth * 0.45 });
    bottomDots.push({ cx: xMid, cy: innerBottom - depth * 0.45 });
  }

  // Left and right dentils
  const numDentilsV = Math.max(3, Math.floor((innerBottom - innerTop) / dentilSize));
  const actualStepV = (innerBottom - innerTop) / numDentilsV;
  for (let i = 0; i < numDentilsV; i++) {
    const y0 = innerTop + i * actualStepV;
    const yMid = y0 + actualStepV / 2;
    const y1 = y0 + actualStepV;
    const depth = dentilSize * 0.65;
    leftDentils.push(`M ${innerLeft},${y0} L ${innerLeft + depth},${yMid} L ${innerLeft},${y1}`);
    rightDentils.push(`M ${innerRight},${y0} L ${innerRight - depth},${yMid} L ${innerRight},${y1}`);
    leftDots.push({ cx: innerLeft + depth * 0.45, cy: yMid });
    rightDots.push({ cx: innerRight - depth * 0.45, cy: yMid });
  }

  // Running diamond chain (Badami beads) in the center of the outer border band
  const chainStep = Math.max(12, Math.min(22, bw * 0.5));
  const diamondsH: { cx: number; cy: number }[] = [];
  const diamondsV: { cx: number; cy: number }[] = [];

  const countDiamondsH = Math.max(2, Math.floor((width - bw * 2) / chainStep));
  const diamondStepH = (width - bw * 2) / countDiamondsH;
  for (let i = 0; i < countDiamondsH; i++) {
    const cx = bw + (i + 0.5) * diamondStepH;
    diamondsH.push({ cx, cy: halfBw });
    diamondsH.push({ cx, cy: height - halfBw });
  }

  const countDiamondsV = Math.max(2, Math.floor((height - bw * 2) / chainStep));
  const diamondStepV = (height - bw * 2) / countDiamondsV;
  for (let i = 0; i < countDiamondsV; i++) {
    const cy = bw + (i + 0.5) * diamondStepV;
    diamondsV.push({ cx: halfBw, cy });
    diamondsV.push({ cx: width - halfBw, cy });
  }

  return (
    <g className="hasheeya-border select-none pointer-events-none">
      {/* 1. Base outer border band rectangles */}
      <rect x={0} y={0} width={width} height={bw} fill={colors.secondary} stroke={colors.outline} strokeWidth={strokeWidth} />
      <rect x={0} y={height - bw} width={width} height={bw} fill={colors.secondary} stroke={colors.outline} strokeWidth={strokeWidth} />
      <rect x={0} y={bw} width={bw} height={height - bw * 2} fill={colors.secondary} stroke={colors.outline} strokeWidth={strokeWidth} />
      <rect x={width - bw} y={bw} width={bw} height={height - bw * 2} fill={colors.secondary} stroke={colors.outline} strokeWidth={strokeWidth} />

      {/* 2. Running diamond chain (Badami string) along center of border */}
      <g fill={colors.primary} stroke={colors.accent} strokeWidth={strokeWidth * 0.5}>
        {[...diamondsH, ...diamondsV].map((d, idx) => {
          const r = Math.max(3, bw * 0.16);
          return (
            <polygon
              key={`dia-${idx}`}
              points={`
                ${d.cx},${d.cy - r}
                ${d.cx + r},${d.cy}
                ${d.cx},${d.cy + r}
                ${d.cx - r},${d.cy}
              `}
            />
          );
        })}
      </g>

      {/* Center dots inside each border diamond */}
      <g fill={colors.accent} stroke={colors.outline} strokeWidth={strokeWidth * 0.3}>
        {[...diamondsH, ...diamondsV].map((d, idx) => (
          <circle key={`dot-${idx}`} cx={d.cx} cy={d.cy} r={Math.max(1.2, bw * 0.05)} />
        ))}
      </g>

      {/* 3. Double ivory pinstripes framing the central bead row */}
      <g stroke={colors.accent} strokeWidth={strokeWidth * 0.6} fill="none" opacity="0.85">
        {/* Top band pinstripes */}
        <line x1={bw} y1={halfBw - 4} x2={width - bw} y2={halfBw - 4} />
        <line x1={bw} y1={halfBw + 4} x2={width - bw} y2={halfBw + 4} />
        {/* Bottom band pinstripes */}
        <line x1={bw} y1={height - halfBw - 4} x2={width - bw} y2={height - halfBw - 4} />
        <line x1={bw} y1={height - halfBw + 4} x2={width - bw} y2={height - halfBw + 4} />
        {/* Left band pinstripes */}
        <line x1={halfBw - 4} y1={bw} x2={halfBw - 4} y2={height - bw} />
        <line x1={halfBw + 4} y1={bw} x2={halfBw + 4} y2={height - bw} />
        {/* Right band pinstripes */}
        <line x1={width - halfBw - 4} y1={bw} x2={width - halfBw - 4} y2={height - bw} />
        <line x1={width - halfBw + 4} y1={bw} x2={width - halfBw + 4} y2={height - bw} />
      </g>

      {/* 4. Kangri (Inward Sawtooth Teeth) */}
      <path
        d={`${topDentils.join(' ')} ${bottomDentils.join(' ')} ${leftDentils.join(' ')} ${rightDentils.join(' ')}`}
        fill={colors.primary}
        stroke={colors.outline}
        strokeWidth={strokeWidth * 0.75}
      />

      {/* Tiny white resist dots inside each Kangri tooth */}
      <g fill={colors.accent} stroke={colors.outline} strokeWidth={strokeWidth * 0.3}>
        {[...topDots, ...bottomDots, ...leftDots, ...rightDots].map((pt, idx) => (
          <circle key={`kdot-${idx}`} cx={pt.cx} cy={pt.cy} r={Math.max(1.2, bw * 0.055)} />
        ))}
      </g>

      {/* 5. Inner framing line along the field perimeter */}
      <rect
        x={bw}
        y={bw}
        width={width - bw * 2}
        height={height - bw * 2}
        fill="none"
        stroke={colors.outline}
        strokeWidth={strokeWidth}
      />

      {/* 6. Corner Chaukhat Blocks (8-pointed rosette medallion in each corner) */}
      {[
        { x: 0, y: 0 },
        { x: width - bw, y: 0 },
        { x: 0, y: height - bw },
        { x: width - bw, y: height - bw },
      ].map((corner, idx) => {
        const cx = corner.x + bw / 2;
        const cy = corner.y + bw / 2;
        const starR = bw * 0.38;
        const innerStarR = bw * 0.18;

        // Generate 8-pointed star points
        const starPoints: string[] = [];
        for (let i = 0; i < 16; i++) {
          const ang = (i * Math.PI) / 8 - Math.PI / 2;
          const r = i % 2 === 0 ? starR : innerStarR;
          starPoints.push(`${(cx + r * Math.cos(ang)).toFixed(1)},${(cy + r * Math.sin(ang)).toFixed(1)}`);
        }

        return (
          <g key={idx}>
            {/* Corner square base */}
            <rect
              x={corner.x}
              y={corner.y}
              width={bw}
              height={bw}
              fill={colors.primary}
              stroke={colors.outline}
              strokeWidth={strokeWidth}
            />

            {/* Concentric diamond frame inside corner */}
            <polygon
              points={`
                ${cx},${corner.y + 3}
                ${corner.x + bw - 3},${cy}
                ${cx},${corner.y + bw - 3}
                ${corner.x + 3},${cy}
              `}
              fill={colors.secondary}
              stroke={colors.accent}
              strokeWidth={strokeWidth * 0.6}
            />

            {/* 8-pointed star rosette medallion */}
            <polygon
              points={starPoints.join(' ')}
              fill={colors.accent}
              stroke={colors.outline}
              strokeWidth={strokeWidth * 0.5}
            />

            {/* Center core point */}
            <circle
              cx={cx}
              cy={cy}
              r={Math.max(1.5, bw * 0.08)}
              fill={colors.primary}
              stroke={colors.outline}
              strokeWidth={strokeWidth * 0.4}
            />
          </g>
        );
      })}
    </g>
  );
};
