import React, { forwardRef, useId } from 'react';
import { PatternConfig } from '../types/pattern';
import { StarTrellisStudy } from './motifs/StarTrellisStudy';
import { EightfoldRosetteStudy } from './motifs/EightfoldRosetteStudy';
import { SteppedDiamondStudy } from './motifs/SteppedDiamondStudy';
import { HasheeyaBorder } from './motifs/HasheeyaBorder';

interface PatternCanvasProps {
  config: PatternConfig;
  className?: string;
  id?: string;
}

export const PatternCanvas = forwardRef<SVGSVGElement, PatternCanvasProps>(
  ({ config, className = '', id = 'ajrak-pattern-svg' }, ref) => {
    const rawUid = useId();
    const uid = rawUid.replace(/:/g, '');
    const reliefFilterId = `woodblockRelief-${uid}`;
    const fieldClipId = `fieldClip-${uid}`;

    const {
      motifId,
      customColors,
      gridDensity,
      motifScale,
      spacing,
      rotation,
      gridLayout,
      strokeWidth,
      showBorder,
      borderWidth,
      textureEffect,
      showGridGuides,
    } = config;

    const cellSize = 100;
    const effectiveBorder = showBorder ? Math.max(20, borderWidth) : 0;

    // Field size calculation based on grid count and spacing
    const fieldWidth = gridDensity * cellSize + Math.max(0, gridDensity - 1) * spacing;
    const fieldHeight = gridDensity * cellSize + Math.max(0, gridDensity - 1) * spacing;

    // Total SVG dimensions with border padding
    const totalWidth = fieldWidth + effectiveBorder * 2;
    const totalHeight = fieldHeight + effectiveBorder * 2;

    // Render appropriate motif component
    const renderMotifComponent = () => {
      const commonProps = {
        size: cellSize,
        colors: customColors,
        strokeWidth,
        rotation: 0, // Rotation is handled in group transform
        showGuides: showGridGuides,
      };

      switch (motifId) {
        case 'star-trellis':
          return <StarTrellisStudy {...commonProps} />;
        case 'eightfold-rosette':
          return <EightfoldRosetteStudy {...commonProps} />;
        case 'stepped-diamond':
          return <SteppedDiamondStudy {...commonProps} />;
        default:
          return <StarTrellisStudy {...commonProps} />;
      }
    };

    // Calculate grid items based on layout
    const cells: { key: string; x: number; y: number }[] = [];

    if (gridLayout === 'square') {
      for (let r = 0; r < gridDensity; r++) {
        for (let c = 0; c < gridDensity; c++) {
          const x = effectiveBorder + c * (cellSize + spacing);
          const y = effectiveBorder + r * (cellSize + spacing);
          cells.push({ key: `sq-${r}-${c}`, x, y });
        }
      }
    } else if (gridLayout === 'half-drop') {
      // Half-drop layout: shift alternate rows by 50%
      const halfStep = (cellSize + spacing) / 2;
      for (let r = 0; r < gridDensity; r++) {
        const isShifted = r % 2 === 1;
        const cols = isShifted ? gridDensity + 1 : gridDensity;
        const startOffset = isShifted ? -halfStep : 0;

        for (let c = 0; c < cols; c++) {
          const x = effectiveBorder + startOffset + c * (cellSize + spacing);
          const y = effectiveBorder + r * (cellSize + spacing);
          // Only include if at least partially inside field area
          if (x > effectiveBorder - cellSize && x < effectiveBorder + fieldWidth + cellSize * 0.2) {
            cells.push({ key: `hd-${r}-${c}`, x, y });
          }
        }
      }
    } else if (gridLayout === 'diamond') {
      // Staggered diamond layout
      const stepX = (cellSize + spacing) / 2;
      const stepY = (cellSize + spacing) / 2;
      const rows = gridDensity * 2 - 1;

      for (let r = 0; r < rows; r++) {
        const isOdd = r % 2 === 1;
        const cols = isOdd ? gridDensity : gridDensity + 1;
        const offsetX = isOdd ? stepX : 0;

        for (let c = 0; c < cols; c++) {
          const x = effectiveBorder - stepX / 2 + offsetX + c * (cellSize + spacing);
          const y = effectiveBorder + r * stepY;
          if (
            x >= effectiveBorder - cellSize &&
            x <= effectiveBorder + fieldWidth &&
            y >= effectiveBorder - cellSize &&
            y <= effectiveBorder + fieldHeight
          ) {
            cells.push({ key: `dia-${r}-${c}`, x, y });
          }
        }
      }
    }

    return (
      <svg
        ref={ref}
        id={id}
        viewBox={`0 0 ${totalWidth} ${totalHeight}`}
        className={`w-full h-full object-contain ${className}`}
        style={{
          backgroundColor: customColors.ground,
        }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Subtle woodblock print relief & organic ink absorption filter */}
          {textureEffect && (
            <filter id={reliefFilterId} x="-5%" y="-5%" width="110%" height="110%">
              {/* Micro turbulence to simulate wood grain & hand block edge irregularity */}
              <feTurbulence
                type="fractalNoise"
                baseFrequency="0.04"
                numOctaves="3"
                result="noise"
              />
              <feDisplacementMap
                in="SourceGraphic"
                in2="noise"
                scale="1.2"
                xChannelSelector="R"
                yChannelSelector="G"
                result="displaced"
              />
              {/* Very soft warm tint / grain overlay */}
              <feBlend mode="multiply" in="displaced" in2="SourceGraphic" />
            </filter>
          )}

          {/* Clip path for inner field so motifs don't overflow the border */}
          <clipPath id={fieldClipId}>
            <rect
              x={effectiveBorder}
              y={effectiveBorder}
              width={fieldWidth}
              height={fieldHeight}
            />
          </clipPath>
        </defs>

        {/* Global canvas background */}
        <rect width={totalWidth} height={totalHeight} fill={customColors.ground} />

        {/* Grid pattern container with clipping to prevent border overrun */}
        <g
          clipPath={showBorder ? `url(#${fieldClipId})` : undefined}
          filter={textureEffect ? `url(#${reliefFilterId})` : undefined}
        >
          {cells.map(({ key, x, y }) => {
            const centerX = x + cellSize / 2;
            const centerY = y + cellSize / 2;

            return (
              <g
                key={key}
                transform={`
                  translate(${centerX}, ${centerY})
                  rotate(${rotation})
                  scale(${motifScale})
                  translate(${-cellSize / 2}, ${-cellSize / 2})
                `}
              >
                {renderMotifComponent()}
              </g>
            );
          })}
        </g>

        {/* Traditional Hasheeya border frame */}
        {showBorder && effectiveBorder > 0 && (
          <HasheeyaBorder
            width={totalWidth}
            height={totalHeight}
            borderWidth={effectiveBorder}
            colors={customColors}
            strokeWidth={strokeWidth}
          />
        )}
      </svg>
    );
  }
);

PatternCanvas.displayName = 'PatternCanvas';
