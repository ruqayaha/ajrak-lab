import React, { useState } from 'react';
import { PatternConfig } from '../types/pattern';
import { StarTrellisStudy } from './motifs/StarTrellisStudy';
import { EightfoldRosetteStudy } from './motifs/EightfoldRosetteStudy';
import { SteppedDiamondStudy } from './motifs/SteppedDiamondStudy';
import { Eye, Layers, Move, Grid, Sparkles, Check, Info } from 'lucide-react';

interface TilingInspectorProps {
  config: PatternConfig;
}

export const TilingInspector: React.FC<TilingInspectorProps> = ({ config }) => {
  const [viewMode, setViewMode] = useState<'unit' | 'assembly' | 'lattice'>('assembly');
  const [separation, setSeparation] = useState<number>(14); // Gap in 2x2 assembly
  const [highlightSeams, setHighlightSeams] = useState<boolean>(true);
  const [highlightEmergent, setHighlightEmergent] = useState<boolean>(true);
  const [showAnatomyLabels, setShowAnatomyLabels] = useState<boolean>(true);

  const cellSize = 100;

  // Render active motif unit
  const renderSingleMotif = (size: number = 100) => {
    const commonProps = {
      size,
      colors: config.customColors,
      strokeWidth: config.strokeWidth,
      rotation: config.rotation,
      showGuides: config.showGridGuides,
    };

    switch (config.motifId) {
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

  return (
    <div className="bg-[#0a1827] rounded-xl p-5 sm:p-7 border border-[#f4eedd]/20 shadow-2xl space-y-6">
      {/* Header and Mode Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#f4eedd]/15">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#c98e3b] mb-1">
            <Layers className="w-3.5 h-3.5" />
            <span>Repeat Unit & Tiling Anatomy</span>
          </div>
          <h3 className="font-serif text-xl sm:text-2xl text-[#f4eedd]">
            How One Repeat Unit Tiles the Plane
          </h3>
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center gap-1 p-1 bg-[#07131e] rounded-lg border border-[#f4eedd]/10 text-xs font-mono shrink-0">
          {[
            { id: 'unit', label: '1×1 Unit Cell' },
            { id: 'assembly', label: '2×2 Assembly' },
            { id: 'lattice', label: '3×3 Lattice' },
          ].map(({ id, label }) => (
            <button
              key={id}
              onClick={() => setViewMode(id as any)}
              className={`px-3 py-1.5 rounded transition-all whitespace-nowrap shrink-0 ${
                viewMode === id
                  ? 'bg-[#8b2628] text-[#f4eedd] font-semibold shadow-sm'
                  : 'text-[#f4eedd]/60 hover:text-[#f4eedd]'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Interactive Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Canvas Display Viewport */}
        <div className="lg:col-span-7 bg-[#07131e] rounded-lg border border-[#f4eedd]/15 p-4 sm:p-6 flex items-center justify-center min-h-[380px] relative shadow-inner">
          {/* MODE 1: SINGLE 1x1 UNIT CELL WITH ANATOMY */}
          {viewMode === 'unit' && (
            <div className="relative w-full max-w-[320px] aspect-square">
              {/* Unit Cell SVG */}
              <div className="w-full h-full rounded shadow-md overflow-visible relative border-2 border-dashed border-[#c98e3b]/80">
                {renderSingleMotif(320)}

                {/* Stamping Boundary Outline */}
                {highlightSeams && (
                  <div className="absolute inset-0 border-2 border-dashed border-[#c98e3b] pointer-events-none">
                    <span className="absolute -top-5 left-1 text-[10px] font-mono text-[#c98e3b] bg-[#07131e] px-1">
                      Tile Boundary (100×100)
                    </span>
                  </div>
                )}
              </div>

              {/* Anatomy Annotations Overlay */}
              {showAnatomyLabels && (
                <div className="absolute inset-0 pointer-events-none">
                  {/* Center core marker */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#091724]/90 text-[10px] font-mono text-[#f4eedd] px-2 py-0.5 rounded border border-[#f4eedd]/20 shadow-md">
                    Central Core (50, 50)
                  </div>
                  {/* Corner fragment marker */}
                  <div className="absolute top-1 left-1 bg-[#8b2628]/90 text-[9px] font-mono text-[#f4eedd] px-1.5 py-0.5 rounded shadow">
                    90° Quadrant Corner
                  </div>
                  {/* Edge connector marker */}
                  <div className="absolute top-1/2 left-0 -translate-y-1/2 bg-[#0e2235]/90 text-[9px] font-mono text-[#c98e3b] px-1.5 py-0.5 rounded shadow">
                    Edge Lozenge
                  </div>
                </div>
              )}
            </div>
          )}

          {/* MODE 2: 2x2 INTERACTIVE ASSEMBLY SLIDER */}
          {viewMode === 'assembly' && (
            <div className="relative w-full max-w-[360px] aspect-square flex items-center justify-center">
              {/* 2x2 Grid of Unit Cells with dynamic separation */}
              <div
                className="grid grid-cols-2 transition-all duration-150"
                style={{
                  gap: `${separation}px`,
                }}
              >
                {[0, 1, 2, 3].map((idx) => (
                  <div
                    key={idx}
                    className={`relative w-36 h-36 sm:w-40 sm:h-40 rounded shadow-md overflow-hidden bg-[#0a1827] ${
                      highlightSeams ? 'ring-1 ring-dashed ring-[#c98e3b]/80' : ''
                    }`}
                  >
                    {renderSingleMotif(160)}
                    {/* Tile Index Badge */}
                    <span className="absolute top-1 left-1 font-mono text-[9px] bg-[#091724]/90 text-[#f4eedd]/70 px-1 rounded">
                      Unit {idx + 1}
                    </span>
                  </div>
                ))}
              </div>

              {/* Central Emergent Fusion Highlight */}
              {highlightEmergent && (
                <div
                  className="absolute pointer-events-none transition-all duration-200"
                  style={{
                    width: `${separation <= 4 ? 64 : 44}px`,
                    height: `${separation <= 4 ? 64 : 44}px`,
                  }}
                >
                  <div className="w-full h-full rounded-full border-2 border-dashed border-[#c98e3b] animate-pulse flex items-center justify-center">
                    <span className="text-[9px] font-mono text-[#c98e3b] bg-[#091724]/95 px-1 py-0.5 rounded whitespace-nowrap shadow-md">
                      {separation <= 4 ? 'Fused 360° Medallion' : 'Corner Convergence'}
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* MODE 3: 3x3 LATTICE FIELD */}
          {viewMode === 'lattice' && (
            <div className="relative w-full max-w-[360px] aspect-square">
              <div className="grid grid-cols-3 gap-0 w-full h-full rounded overflow-hidden shadow-md">
                {[...Array(9)].map((_, idx) => (
                  <div
                    key={idx}
                    className={`relative aspect-square overflow-hidden bg-[#0a1827] ${
                      highlightSeams ? 'border border-[#f4eedd]/15' : ''
                    }`}
                  >
                    {renderSingleMotif(120)}
                  </div>
                ))}
              </div>

              {/* Vector Translation Arrows */}
              <div className="absolute -bottom-6 inset-x-0 flex justify-between text-[10px] font-mono text-[#c98e3b]">
                <span>← Vector Tx: (100, 0) →</span>
                <span>Vector Ty: (0, 100)</span>
              </div>
            </div>
          )}
        </div>

        {/* Right: Controls & Educational Walkthrough */}
        <div className="lg:col-span-5 space-y-4">
          <div className="space-y-3">
            <h4 className="font-serif text-lg text-[#f4eedd]">
              {viewMode === 'unit' && 'The Unit Cell: Anatomy of a Repeat Block'}
              {viewMode === 'assembly' && 'Seam Assembly: 4 Tiles Fusing at Seams'}
              {viewMode === 'lattice' && 'Planar Lattice: Infinite Periodic Tessellation'}
            </h4>
            <p className="text-xs text-[#f4eedd]/75 font-sans leading-relaxed">
              {viewMode === 'unit' &&
                'In Ajrak block-printing, the Por woodblock contains both complete central motifs and deliberate partial shapes along its four edges and corners. These partial shapes are calculated so that adjacent blocks complete each other.'}
              {viewMode === 'assembly' &&
                'Drag the Assembly Gap slider below to watch how separate blocks glide together. Notice how the four 90° corner shapes meet at the central cross-seam to synthesize a complete 360° secondary star or medallion!'}
              {viewMode === 'lattice' &&
                'By translating the unit cell along standard Cartesian vectors Tx and Ty, the pattern forms a continuous wallpaper lattice. The seam lines disappear completely into an unbroken textile field.'}
            </p>
          </div>

          {/* 2x2 Mode Interactive Slider */}
          {viewMode === 'assembly' && (
            <div className="p-3.5 rounded-lg bg-[#07131e] border border-[#f4eedd]/15 space-y-2">
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-[#f4eedd]/80 flex items-center gap-1.5">
                  <Move className="w-3.5 h-3.5 text-[#c98e3b]" />
                  <span>Assembly Gap (Seam Distance)</span>
                </span>
                <span className="text-[#c98e3b] font-bold tabular-nums">
                  {separation === 0 ? '0px (Locked Seam)' : `${separation}px (Exploded)`}
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="24"
                step="2"
                value={separation}
                onChange={(e) => setSeparation(Number(e.target.value))}
                aria-label="Assembly gap slider"
                className="w-full accent-[#8b2628] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-[#f4eedd]/50 font-mono">
                <span>0px (Fused Tiles)</span>
                <span>12px</span>
                <span>24px (Separated Blocks)</span>
              </div>
            </div>
          )}

          {/* Visual Toggles */}
          <div className="space-y-2 pt-2 border-t border-[#f4eedd]/10 text-xs font-mono">
            <label className="flex items-center justify-between p-2 rounded bg-[#07131e]/50 cursor-pointer hover:bg-[#07131e]">
              <span className="text-[#f4eedd]/80">Highlight Stamping Seams</span>
              <input
                type="checkbox"
                checked={highlightSeams}
                onChange={(e) => setHighlightSeams(e.target.checked)}
                className="w-4 h-4 accent-[#8b2628] rounded cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between p-2 rounded bg-[#07131e]/50 cursor-pointer hover:bg-[#07131e]">
              <span className="text-[#f4eedd]/80">Highlight Emergent Corner Fusion</span>
              <input
                type="checkbox"
                checked={highlightEmergent}
                onChange={(e) => setHighlightEmergent(e.target.checked)}
                className="w-4 h-4 accent-[#8b2628] rounded cursor-pointer"
              />
            </label>

            {viewMode === 'unit' && (
              <label className="flex items-center justify-between p-2 rounded bg-[#07131e]/50 cursor-pointer hover:bg-[#07131e]">
                <span className="text-[#f4eedd]/80">Show Anatomy Zone Tags</span>
                <input
                  type="checkbox"
                  checked={showAnatomyLabels}
                  onChange={(e) => setShowAnatomyLabels(e.target.checked)}
                  className="w-4 h-4 accent-[#8b2628] rounded cursor-pointer"
                />
              </label>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
