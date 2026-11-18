import React, { useState } from 'react';
import { Eye, RotateCw, FlipHorizontal, Grid, Sparkles, BookOpen } from 'lucide-react';
import { MotifId } from '../types/pattern';
import { AiTextileExplorer } from './AiTextileExplorer';

interface GeometryExplorerProps {
  onExploreComparableMotif?: (motifId: MotifId) => void;
}

export const GeometryExplorer: React.FC<GeometryExplorerProps> = ({
  onExploreComparableMotif,
}) => {
  const [activeStep, setActiveStep] = useState<number>(3); // 1: Seed, 2: Reflection, 3: 4-Fold Rotation, 4: Plane Tiling
  const [rotationAngle, setRotationAngle] = useState<number>(0);
  const [showAxes, setShowAxes] = useState<boolean>(true);

  // Curated exhibition palette
  const colors = {
    indigo: '#0f2537',
    madder: '#8b2628',
    ivory: '#f4eedd',
    charcoal: '#17181c',
    highlight: '#c98e3b',
  };

  return (
    <section id="geometry-explorer" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="max-w-3xl mx-auto mb-16 text-center">
        {/* Unboxed Metadata Kicker */}
        <div className="flex items-center justify-center gap-2 text-xs font-mono uppercase tracking-widest text-[#c98e3b] mb-3">
          <span>Section II</span>
          <span aria-hidden="true">·</span>
          <span>Euclidean Isometries</span>
          <span aria-hidden="true">·</span>
          <span>Wallpaper Group p4m</span>
        </div>
        <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal tracking-tight text-[#f4eedd] mb-4 text-balance">
          The Geometry of Repetition
        </h2>
        <p className="text-[#f4eedd]/75 text-base sm:text-lg leading-relaxed font-sans text-balance">
          How fundamental transformations—reflection, rotation, and translation—combine with
          centuries-old Acacia woodblock carving to generate unbroken planar textile fields.
        </p>
      </div>

      {/* Main Interactive Stage Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
        {/* Left: Interactive Visual Transformation Plate */}
        <div className="lg:col-span-7 bg-[#0a1827] rounded-xl p-6 sm:p-8 border border-[#f4eedd]/20 shadow-2xl relative overflow-hidden">
          {/* Subtle grid pattern background */}
          <div className="absolute inset-0 opacity-10 pointer-events-none cloth-texture"></div>

          {/* Interactive Stage Controls Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-[#f4eedd]/15">
            <span className="text-xs font-mono tracking-wider text-[#c98e3b] uppercase">
              Transformation Visualizer Plate
            </span>
            <button
              onClick={() => setShowAxes(!showAxes)}
              className={`text-xs px-3 py-1.5 rounded-lg border font-mono transition-colors flex items-center gap-2 whitespace-nowrap shrink-0 ${
                showAxes
                  ? 'border-[#c98e3b] text-[#c98e3b] bg-[#c98e3b]/10'
                  : 'border-[#f4eedd]/20 text-[#f4eedd]/60 hover:text-[#f4eedd]'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>{showAxes ? 'Hide Symmetry Planes' : 'Show Symmetry Planes'}</span>
            </button>
          </div>

          {/* Center Graphic Preview Area */}
          <div className="w-full aspect-square max-w-[460px] mx-auto bg-[#07131e] rounded-lg border border-[#f4eedd]/15 flex items-center justify-center p-6 relative shadow-inner">
            <svg
              viewBox="-110 -110 220 220"
              className="w-full h-full max-w-full max-h-full overflow-visible select-none"
            >
              {/* Coordinate Grid / Axes */}
              {showAxes && (
                <g stroke="#f4eedd" strokeOpacity="0.25" strokeWidth="0.8" strokeDasharray="3 3">
                  <line x1="-105" y1="0" x2="105" y2="0" />
                  <line x1="0" y1="-105" x2="0" y2="105" />
                  {/* Diagonal reflection planes */}
                  <line x1="-80" y1="-80" x2="80" y2="80" strokeOpacity="0.15" />
                  <line x1="-80" y1="80" x2="80" y2="-80" strokeOpacity="0.15" />
                  {/* Concentric reference circles */}
                  <circle cx="0" cy="0" r="45" fill="none" strokeOpacity="0.15" />
                  <circle cx="0" cy="0" r="85" fill="none" strokeOpacity="0.15" />
                </g>
              )}

              {/* Step 1: Single Seed Unit (Quadrant I) */}
              {activeStep === 1 && (
                <g transform={`rotate(${rotationAngle})`}>
                  {/* Shaded quadrant guide */}
                  <rect x="0" y="-85" width="85" height="85" fill={colors.madder} fillOpacity="0.1" />
                  {/* Seed polygon */}
                  <path
                    d="M 0,0 L 25,-12 L 55,-25 L 35,-60 L 0,-85 L 0,0"
                    fill={colors.madder}
                    stroke={colors.ivory}
                    strokeWidth="2.5"
                    strokeLinejoin="round"
                  />
                  <polygon
                    points="15,-18 35,-26 25,-45 8,-35"
                    fill={colors.indigo}
                    stroke={colors.ivory}
                    strokeWidth="1.5"
                  />
                  <circle cx="20" cy="-30" r="3" fill={colors.highlight} />
                  <circle cx="0" cy="0" r="4" fill={colors.highlight} />
                </g>
              )}

              {/* Step 2: Bilateral Reflection (Mirroring across Vertical axis) */}
              {activeStep === 2 && (
                <g transform={`rotate(${rotationAngle})`}>
                  {/* Original Right Wing */}
                  <g>
                    <path
                      d="M 0,0 L 25,-12 L 55,-25 L 35,-60 L 0,-85 L 0,0"
                      fill={colors.madder}
                      stroke={colors.ivory}
                      strokeWidth="2"
                    />
                    <polygon
                      points="15,-18 35,-26 25,-45 8,-35"
                      fill={colors.indigo}
                      stroke={colors.ivory}
                      strokeWidth="1.5"
                    />
                    <circle cx="20" cy="-30" r="3" fill={colors.highlight} />
                  </g>
                  {/* Mirrored Left Wing (x -> -x) */}
                  <g transform="scale(-1, 1)">
                    <path
                      d="M 0,0 L 25,-12 L 55,-25 L 35,-60 L 0,-85 L 0,0"
                      fill={colors.madder}
                      stroke={colors.ivory}
                      strokeWidth="2"
                    />
                    <polygon
                      points="15,-18 35,-26 25,-45 8,-35"
                      fill={colors.indigo}
                      stroke={colors.ivory}
                      strokeWidth="1.5"
                    />
                    <circle cx="20" cy="-30" r="3" fill={colors.highlight} />
                  </g>
                  {/* Central axis indicator */}
                  <line x1="0" y1="-95" x2="0" y2="95" stroke={colors.highlight} strokeWidth="1.5" />
                  <circle cx="0" cy="0" r="4" fill={colors.highlight} />
                </g>
              )}

              {/* Step 3: 4-Fold Rotation (C4 / D4 symmetry creating a complete block tile) */}
              {activeStep === 3 && (
                <g transform={`rotate(${rotationAngle})`}>
                  {[0, 90, 180, 270].map((deg) => (
                    <g key={deg} transform={`rotate(${deg})`}>
                      <path
                        d="M 0,0 L 20,-10 L 45,-20 L 28,-48 L 0,-68 L -28,-48 L -45,-20 L -20,-10 Z"
                        fill={colors.madder}
                        stroke={colors.ivory}
                        strokeWidth="1.8"
                        strokeLinejoin="round"
                      />
                      <polygon
                        points="0,-15 15,-28 0,-42 -15,-28"
                        fill={colors.indigo}
                        stroke={colors.ivory}
                        strokeWidth="1.2"
                      />
                      <circle cx="0" cy="-28" r="3" fill={colors.highlight} />
                    </g>
                  ))}
                  {/* Central rosette hub */}
                  <circle cx="0" cy="0" r="14" fill={colors.indigo} stroke={colors.ivory} strokeWidth="2" />
                  <polygon points="0,-8 8,0 0,8 -8,0" fill={colors.highlight} />
                </g>
              )}

              {/* Step 4: Plane Tiling (Tessellation across 2D Euclidean Grid) */}
              {activeStep === 4 && (
                <g transform={`scale(0.55) rotate(${rotationAngle})`}>
                  {[-100, 0, 100].map((tx) =>
                    [-100, 0, 100].map((ty) => (
                      <g key={`${tx}-${ty}`} transform={`translate(${tx}, ${ty})`}>
                        <rect
                          x="-50"
                          y="-50"
                          width="100"
                          height="100"
                          fill="none"
                          stroke={colors.ivory}
                          strokeWidth="0.8"
                          strokeDasharray="2 2"
                          strokeOpacity="0.4"
                        />
                        {[0, 90, 180, 270].map((deg) => (
                          <g key={deg} transform={`rotate(${deg})`}>
                            <path
                              d="M 0,0 L 12,-6 L 28,-14 L 18,-30 L 0,-42 L -18,-30 L -28,-14 L -12,-6 Z"
                              fill={tx === 0 && ty === 0 ? colors.madder : colors.indigo}
                              stroke={colors.ivory}
                              strokeWidth="1.2"
                            />
                            <circle cx="0" cy="-18" r="2" fill={colors.highlight} />
                          </g>
                        ))}
                        <circle cx="0" cy="0" r="7" fill={colors.highlight} />
                      </g>
                    ))
                  )}
                </g>
              )}
            </svg>

            {/* Step Label Overlay */}
            <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-xs font-mono text-[#f4eedd]/80 bg-[#07131e]/90 px-3.5 py-2 rounded border border-[#f4eedd]/15">
              <span>
                {activeStep === 1 && 'Step 01: Fundamental Seed Domain'}
                {activeStep === 2 && 'Step 02: Bilateral Reflection (x ↦ -x)'}
                {activeStep === 3 && 'Step 03: 4-Fold Rotation (C₄ / D₄)'}
                {activeStep === 4 && 'Step 04: Planar Wallpaper Tessellation'}
              </span>
              <span className="text-[#c98e3b] font-medium">
                {activeStep === 1 && 'D₁ Invariance'}
                {activeStep === 2 && 'Mirror Symmetry'}
                {activeStep === 3 && '90° Cyclic Symmetry'}
                {activeStep === 4 && 'Group p4m'}
              </span>
            </div>
          </div>

          {/* Figure Caption */}
          <div className="mt-3 text-[11px] font-mono text-[#f4eedd]/50 italic text-center">
            Fig. 2.1 — Isometric transformation sequence from single carved quadrant to infinite planar repeat
          </div>

          {/* Interactive Steps Selector */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-6">
            {[
              { step: 1, title: '01. Seed Unit', desc: 'Quadrant core' },
              { step: 2, title: '02. Reflection', desc: 'Bilateral mirror' },
              { step: 3, title: '03. 4-Fold Rotation', desc: 'Radial hub (D₄)' },
              { step: 4, title: '04. Plane Tiling', desc: 'Group p4m' },
            ].map(({ step, title, desc }) => (
              <button
                key={step}
                onClick={() => setActiveStep(step)}
                className={`p-3 rounded-lg border text-left transition-all ${
                  activeStep === step
                    ? 'border-[#8b2628] bg-[#8b2628]/25 text-[#f4eedd] shadow-sm ring-1 ring-[#8b2628]'
                    : 'border-[#f4eedd]/10 bg-[#07131e]/60 text-[#f4eedd]/70 hover:border-[#f4eedd]/25 hover:bg-[#07131e]'
                }`}
              >
                <div className="font-mono text-xs font-semibold mb-0.5">{title}</div>
                <div className="text-[11px] text-[#f4eedd]/50 font-sans">{desc}</div>
              </button>
            ))}
          </div>

          {/* Live Free Rotation Slider */}
          <div className="mt-5 pt-4 border-t border-[#f4eedd]/10 flex flex-col sm:flex-row items-center justify-between gap-3">
            <label className="text-xs font-mono text-[#f4eedd]/75 flex items-center gap-2">
              <RotateCw className="w-3.5 h-3.5 text-[#c98e3b]" />
              <span className="tabular-nums">Interactive Rotation: {rotationAngle}°</span>
            </label>
            <input
              type="range"
              min="0"
              max="360"
              step="5"
              value={rotationAngle}
              onChange={(e) => setRotationAngle(Number(e.target.value))}
              aria-label="Rotate geometry angle slider"
              className="w-full sm:w-48 accent-[#8b2628] cursor-pointer"
            />
          </div>
        </div>

        {/* Right: Curatorial Monograph Breakdown */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-[#0a1827] rounded-xl p-6 sm:p-7 border border-[#f4eedd]/20 shadow-2xl">
            <div className="flex items-center gap-2 text-xs font-mono text-[#c98e3b] uppercase tracking-wider mb-2">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Curatorial Monograph Notes</span>
            </div>

            <h3 className="font-serif text-2xl text-[#f4eedd] mb-3">
              {activeStep === 1 && 'The Carved Seed: Fundamental Domain'}
              {activeStep === 2 && 'Reflection: Bilateral Plane Symmetry'}
              {activeStep === 3 && 'Rotational Symmetry: Radial Balance'}
              {activeStep === 4 && 'Translational Tiling: The Wallpaper Group'}
            </h3>

            <p className="text-sm text-[#f4eedd]/80 leading-relaxed font-sans mb-4">
              {activeStep === 1 && (
                <>
                  In geometric crystallography and textile mathematics, this is the <em>fundamental domain</em>—the
                  smallest non-repeating sub-shape from which the entire pattern can be generated. In Ajrak woodcarving,
                  the master block-maker (<em>poregar</em>) measures this quadrant using traditional compasses and calipers.
                </>
              )}
              {activeStep === 2 && (
                <>
                  Reflecting the fundamental seed across an axis of symmetry inverts the coordinate space ($x \mapsto -x$).
                  This mirrors left and right halves, establishing the first tier of organic architectural balance.
                </>
              )}
              {activeStep === 3 && (
                <>
                  Rotating the quadrant by $90^\circ$ increments produces four-fold cyclic symmetry ($C_4$).
                  Combined with reflection, it forms dihedral symmetry ($D_4$), turning the angular seed into a closed,
                  self-contained medallion (<em>Phool</em> or <em>Taveez</em>).
                </>
              )}
              {activeStep === 4 && (
                <>
                  Translating the finished block across two orthogonal coordinate vectors creates an unbroken planar tiling
                  (isometry group $p4m$). When adjacent blocks touch, their perimeter lines fuse seamlessly to form
                  secondary emergent stars and diamonds that did not exist on the individual block alone.
                </>
              )}
            </p>

            {/* Comparative Mathematical vs Artisan Table */}
            <div className="grid grid-cols-2 gap-3 pt-4 border-t border-[#f4eedd]/15 text-xs">
              <div className="bg-[#07131e] p-3 rounded border border-[#f4eedd]/10">
                <span className="block font-mono text-[10px] text-[#c98e3b] uppercase mb-1">Mathematical Law</span>
                <span className="text-[#f4eedd]/90 font-medium">
                  {activeStep === 1 && 'Sub-group Seed'}
                  {activeStep === 2 && 'Axial Mirror Invariance'}
                  {activeStep === 3 && 'C₄ Cyclic Group'}
                  {activeStep === 4 && 'Wallpaper Group p4m'}
                </span>
              </div>
              <div className="bg-[#07131e] p-3 rounded border border-[#f4eedd]/10">
                <span className="block font-mono text-[10px] text-[#c98e3b] uppercase mb-1">Traditional Craft Equivalent</span>
                <span className="text-[#f4eedd]/90 font-medium">
                  {activeStep === 1 && 'Babul Wood Gouge'}
                  {activeStep === 2 && 'Chaukhat Half-block'}
                  {activeStep === 3 && 'Por Stamping Turn'}
                  {activeStep === 4 && 'Mina Alignment Pins'}
                </span>
              </div>
            </div>
          </div>

          {/* Universal Geometry Academic Note */}
          <div className="bg-[#0c1e30] rounded-xl p-6 border border-[#f4eedd]/15">
            <h4 className="text-xs font-mono uppercase tracking-widest text-[#c98e3b] mb-2 flex items-center gap-2">
              Note on Universal Geometry
            </h4>
            <p className="text-xs text-[#f4eedd]/70 leading-relaxed font-sans">
              Symmetrical transformations like four-fold rotation, reflection, and wallpaper groups are universal
              mathematical principles observed across global decorative traditions—including Islamic tilework, Celtic knots,
              and Andean weaving. In Sindhi Ajrak, these mathematical theorems are realized not through digital matrices,
              but through tangible hand-carved Acacia blocks (<em>Por</em>), natural resist pastes, and generational muscle memory.
            </p>
          </div>
        </div>
      </div>

      {/* AI Textile Explorer: Upload & Analyze Visual Pattern Geometry */}
      <div className="mt-14">
        <AiTextileExplorer onExploreComparableMotif={onExploreComparableMotif} />
      </div>
    </section>
  );
};
