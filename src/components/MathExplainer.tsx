import React, { useState } from 'react';
import { BookOpen, Compass, ChevronDown, ChevronUp, Layers, RotateCw, Move, Grid } from 'lucide-react';

interface TransformationPrinciple {
  id: string;
  title: string;
  mathFormula: string;
  plainConcept: string;
  artisanEquivalent: string;
  howItWorks: string;
}

const PRINCIPLES: TransformationPrinciple[] = [
  {
    id: 'translation',
    title: '1. Planar Translation (Repeat Vectors)',
    mathFormula: 'f(x, y) = f(x + n·w, y + m·h)',
    plainConcept: 'Moving an identical motif across horizontal and vertical distances without rotating or resizing it.',
    artisanEquivalent: 'Hand-stamping the Acacia woodblock in uniform rows along the stretched river calico.',
    howItWorks: 'A single square unit cell is shifted repeatedly by vector step (w, h). Because the edges of the cell are mathematically calibrated, each block seamlessly abuts the next without leaving gaps or overlaps.',
  },
  {
    id: 'half-drop',
    title: '2. Half-Drop Phase Shift (Brick Stagger)',
    mathFormula: 'x ↦ x + (r mod 2) · (w / 2)',
    plainConcept: 'Shifting every second row horizontally by half the width of a tile.',
    artisanEquivalent: 'Staggering print blocks in a brickwork formation to prevent rigid vertical seams.',
    howItWorks: 'By offsetting alternate rows by 50%, vertical grid lines are broken. This forces the eye to follow diagonal zig-zags rather than strict vertical columns, introducing organic rhythm and dynamic movement to the textile.',
  },
  {
    id: 'rotation',
    title: '3. Rotational Point Symmetry (C₄ & D₄)',
    mathFormula: 'R_90° · [x, y]ᵀ = [-y, x]ᵀ',
    plainConcept: 'Turning a single quadrant around the central hub four times by 90° increments.',
    artisanEquivalent: 'Rotating the Por block four times around a registration pin to form a circular medallion.',
    howItWorks: 'An artisan only needs to design one quarter (a 90° wedge) of a medallion. Rotating this wedge around the center point (50, 50) at 0°, 90°, 180°, and 270° guarantees radial balance and four-fold rotational invariance.',
  },
  {
    id: 'reflection',
    title: '4. Bilateral Axial Reflection (Mirror Invariance)',
    mathFormula: 'M_x · [x, y]ᵀ = [-x, y]ᵀ',
    plainConcept: 'Mirroring the design across a central line of symmetry so left and right are identical.',
    artisanEquivalent: 'Symmetrical gouging of the woodblock face along a central compass centerline.',
    howItWorks: 'Every point (x, y) on the left wing has a corresponding twin at (-x, y) on the right wing. This creates mirror symmetry, which the human eye instinctively recognizes as natural, balanced, and stable.',
  },
  {
    id: 'boundary-fusion',
    title: '5. Boundary Fusion & Emergent Geometry',
    mathFormula: '4 × 90° = 360° at Grid Vertex (x₀, y₀)',
    plainConcept: 'Corner fragments on individual tiles meet together to form brand new shapes across the seams.',
    artisanEquivalent: 'Carving "incomplete" shapes on the block perimeter so that printing adjacent rows completes them.',
    howItWorks: 'Each tile has a 90° quarter-diamond in its corners. When four tiles are stamped next to each other, their four corners meet at the intersection point. Together, four 90° corners add up to 360°, producing a complete full diamond that does not exist on any single block alone!',
  },
];

export const MathExplainer: React.FC = () => {
  const [expandedId, setExpandedId] = useState<string>('boundary-fusion');

  return (
    <div className="bg-[#0a1827] rounded-xl p-6 border border-[#f4eedd]/20 shadow-xl space-y-5">
      <div className="flex items-center justify-between pb-3 border-b border-[#f4eedd]/15">
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-[#c98e3b]" />
          <h3 className="font-serif text-lg sm:text-xl text-[#f4eedd] font-semibold">
            Mathematical Transformations in Ajrak
          </h3>
        </div>
        <span className="text-[11px] font-mono text-[#c98e3b] uppercase tracking-wider">
          5 Core Geometric Laws
        </span>
      </div>

      <p className="text-xs text-[#f4eedd]/75 font-sans leading-relaxed">
        Ajrak patterns are not drawn as single chaotic canvases; they are computed through five
        fundamental Euclidean transformations. Master woodcarvers and artisans applied these principles
        centuries before digital vector graphics existed.
      </p>

      {/* Accordion / List of Principles */}
      <div className="space-y-2.5">
        {PRINCIPLES.map((item) => {
          const isExpanded = expandedId === item.id;
          return (
            <div
              key={item.id}
              className={`rounded-lg border transition-all overflow-hidden ${
                isExpanded
                  ? 'border-[#8b2628] bg-[#07131e]'
                  : 'border-[#f4eedd]/10 bg-[#07131e]/50 hover:border-[#f4eedd]/20'
              }`}
            >
              <button
                onClick={() => setExpandedId(isExpanded ? '' : item.id)}
                className="w-full p-3.5 text-left flex items-center justify-between gap-3"
              >
                <div>
                  <span className="font-mono text-xs font-semibold text-[#f4eedd] block">
                    {item.title}
                  </span>
                  <span className="text-[11px] font-mono text-[#c98e3b] opacity-90">
                    {item.mathFormula}
                  </span>
                </div>
                <div className="text-[#f4eedd]/60 shrink-0">
                  {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </div>
              </button>

              {isExpanded && (
                <div className="px-3.5 pb-3.5 pt-1 text-xs space-y-3 border-t border-[#f4eedd]/10 font-sans">
                  <div className="text-[#f4eedd]/80 leading-relaxed">
                    <strong className="text-[#f4eedd]">In Simple Terms: </strong>
                    {item.plainConcept}
                  </div>

                  <div className="p-2.5 rounded bg-[#0a1827] border border-[#f4eedd]/10 text-[#f4eedd]/70 leading-relaxed">
                    <strong className="text-[#c98e3b] font-mono block text-[10px] uppercase mb-0.5">
                      Artisan Wooden Block Practice
                    </strong>
                    {item.artisanEquivalent}
                  </div>

                  <div className="text-[11px] text-[#f4eedd]/60 leading-relaxed">
                    <strong>Geometric Mechanics: </strong>
                    {item.howItWorks}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
