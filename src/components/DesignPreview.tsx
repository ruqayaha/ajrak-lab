import React, { useState } from 'react';
import { PatternConfig, MockupType } from '../types/pattern';
import { PatternCanvas } from './PatternCanvas';
import { AiProductAssistant } from './AiProductAssistant';
import { Book, Frame, Sparkles, Layers, Laptop } from 'lucide-react';

interface DesignPreviewProps {
  config: PatternConfig;
  activeMockup?: MockupType;
  onChangeMockup?: (mockup: MockupType) => void;
  onApplyColorVariation?: (colors: PatternConfig['customColors']) => void;
}

export const DesignPreview: React.FC<DesignPreviewProps> = ({
  config,
  activeMockup: controlledMockup,
  onChangeMockup,
  onApplyColorVariation,
}) => {
  const [internalMockup, setInternalMockup] = useState<MockupType>('notebook');
  const activeMockup = controlledMockup ?? internalMockup;
  const setActiveMockup = (next: MockupType) => {
    setInternalMockup(next);
    onChangeMockup?.(next);
  };

  return (
    <section id="design-preview" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="max-w-3xl mx-auto mb-12 text-center">
        {/* Unboxed Metadata Kicker */}
        <div className="flex items-center justify-center gap-2 text-xs font-mono uppercase tracking-widest text-[#c98e3b] mb-3">
          <span>Exhibition Vitrine</span>
          <span aria-hidden="true">·</span>
          <span>Applied Product Studies</span>
          <span aria-hidden="true">·</span>
          <span>Material Translation</span>
        </div>
        <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal tracking-tight text-[#f4eedd] mb-4 text-balance">
          Design in Context
        </h2>
        <p className="text-[#f4eedd]/75 text-base sm:text-lg leading-relaxed font-sans text-balance">
          Visualize how your custom geometric pattern translates from a computational canvas into
          tangible physical products—from artisan book covers to exhibition screenprints and textiles.
        </p>
      </div>

      {/* Mockup Switcher Segmented Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-12">
        {[
          { id: 'flat', label: 'Flat Textile Swatch', icon: Layers },
          { id: 'notebook', label: 'Artisan Hardcover Book', icon: Book },
          { id: 'sleeve', label: 'Protective Laptop Sleeve', icon: Laptop },
          { id: 'poster', label: 'Exhibition Gallery Poster', icon: Frame },
          { id: 'shawl', label: 'Textile Shawl / Stole', icon: Sparkles },
        ].map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveMockup(id as MockupType)}
            className={`px-4 py-2.5 rounded-lg border text-xs sm:text-sm font-mono transition-all flex items-center gap-2 whitespace-nowrap shrink-0 ${
              activeMockup === id
                ? 'border-[#8b2628] bg-[#8b2628] text-[#f4eedd] shadow-md ring-1 ring-[#8b2628]'
                : 'border-[#f4eedd]/15 bg-[#0a1827] text-[#f4eedd]/70 hover:text-[#f4eedd] hover:bg-[#0c1f33]'
            }`}
          >
            <Icon className="w-3.5 h-3.5 text-[#c98e3b]" />
            <span>{label}</span>
          </button>
        ))}
      </div>

      {/* Mockup Showcase Stage */}
      <div className="bg-[#0a1827] rounded-xl p-6 sm:p-12 border border-[#f4eedd]/20 shadow-2xl flex items-center justify-center min-h-[540px] relative overflow-hidden">
        {/* Subtle radial spotlight */}
        <div className="absolute inset-0 bg-radial from-[#163350]/30 via-transparent to-transparent pointer-events-none"></div>

        {/* 1. FLAT PATTERN SPECIMEN */}
        {activeMockup === 'flat' && (
          <div className="w-full max-w-xl aspect-square rounded-lg overflow-hidden shadow-2xl border-2 border-[#f4eedd]/20 relative bg-[#07131e]">
            <PatternCanvas config={config} />
            <div className="absolute bottom-3 right-3 bg-[#07131e]/90 px-3 py-1.5 rounded text-[11px] font-mono text-[#f4eedd]/80 border border-[#f4eedd]/15 backdrop-blur-sm">
              100% Scalable Vector Repeat
            </div>
          </div>
        )}

        {/* 2. ARTISAN HARDCOVER BOOK */}
        {activeMockup === 'notebook' && (
          <div className="relative w-full max-w-md aspect-[3/4] transition-all transform hover:scale-[1.01] duration-300">
            {/* Book Drop Shadow */}
            <div className="absolute -inset-4 bg-black/70 blur-2xl rounded-2xl -z-10 translate-y-6"></div>

            {/* Notebook Case */}
            <div className="w-full h-full rounded-r-xl rounded-l-sm overflow-hidden relative shadow-2xl border border-[#f4eedd]/20 flex">
              {/* Spine Cloth with Gilded Deboss */}
              <div className="w-8 h-full bg-gradient-to-r from-[#07101a] via-[#102436] to-[#08121d] border-r border-black/70 shrink-0 relative z-10 flex flex-col justify-between py-6 items-center">
                <div className="w-1.5 h-16 bg-[#c98e3b]/80 rounded-full"></div>
                <span className="font-serif text-[10px] uppercase tracking-widest text-[#f4eedd]/60 rotate-90 whitespace-nowrap">
                  AJRAK LAB • VOL. I
                </span>
                <div className="w-1.5 h-16 bg-[#c98e3b]/80 rounded-full"></div>
              </div>

              {/* Cover Face with Applied Pattern */}
              <div className="flex-1 h-full relative overflow-hidden bg-[#07131e]">
                <div className="w-full h-full scale-105">
                  <PatternCanvas config={{ ...config, showBorder: false }} />
                </div>

                {/* Lighting and Sheen */}
                <div className="absolute inset-0 bg-gradient-to-tr from-black/40 via-transparent to-white/10 pointer-events-none"></div>

                {/* Debossed Bookplate Title */}
                <div className="absolute inset-x-8 top-16 bg-[#091724]/95 border border-[#c98e3b]/70 p-4 rounded text-center backdrop-blur-md shadow-2xl">
                  <div className="text-[10px] font-mono tracking-widest text-[#c98e3b] uppercase mb-1">
                    Sindh Cultural Archive
                  </div>
                  <h3 className="font-serif text-lg text-[#f4eedd] font-bold tracking-wider">
                    AJRAK NOTEBOOK
                  </h3>
                  <div className="text-[10px] text-[#f4eedd]/60 font-sans mt-0.5">
                    Geometric Pattern Exploration Series
                  </div>
                </div>

                {/* Crimson Silk Bookmark Ribbon */}
                <div className="absolute -bottom-8 right-12 w-5 h-16 bg-[#8b2628] shadow-lg rounded-b-sm border border-[#f4eedd]/20">
                  <div className="w-full h-full bg-gradient-to-b from-transparent to-black/35"></div>
                </div>
              </div>

              {/* Gilded Book Page Edges */}
              <div className="w-2.5 h-full bg-gradient-to-r from-[#dcd1be] to-[#ede3d1] border-l border-black/30 shrink-0"></div>
            </div>
          </div>
        )}

        {/* 3. EXHIBITION GALLERY POSTER */}
        {activeMockup === 'poster' && (
          <div className="relative w-full max-w-md aspect-[3/4] bg-[#f8f4ea] text-[#141517] p-6 sm:p-8 rounded shadow-2xl border-8 border-[#07131e] ring-1 ring-[#f4eedd]/20 flex flex-col justify-between">
            {/* Gallery Poster Header */}
            <div className="border-b border-[#141517]/20 pb-3">
              <div className="flex justify-between items-baseline">
                <span className="font-serif text-base font-bold tracking-widest uppercase text-[#8b2628]">
                  AJRAK LAB
                </span>
                <span className="font-mono text-[10px] text-[#141517]/60">
                  REF. INDUS-{config.motifId.toUpperCase()}
                </span>
              </div>
              <div className="font-serif text-xs italic text-[#141517]/70 mt-0.5">
                A Parametric Study in Traditional Sindhi Geometry & Isometry
              </div>
            </div>

            {/* Pattern Centerpiece */}
            <div className="w-full aspect-square my-4 rounded border border-[#141517]/15 overflow-hidden shadow-inner">
              <PatternCanvas config={config} />
            </div>

            {/* Poster Metadata & Curatorial Specs */}
            <div className="border-t border-[#141517]/20 pt-3 text-[11px] font-sans">
              <div className="flex justify-between items-end">
                <div>
                  <div className="font-bold uppercase tracking-wider text-[10px] text-[#8b2628] font-mono">
                    Symmetry Monograph
                  </div>
                  <div className="font-serif text-xs text-[#141517]">
                    Tessellation: {config.gridLayout.toUpperCase()} · Grid Density: {config.gridDensity}×{config.gridDensity}
                  </div>
                </div>
                <div className="text-right font-mono text-[9px] text-[#141517]/60">
                  INDUS VALLEY ARCHIVE<br />2026 EDITION
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 4. TEXTILE SHAWL / STOLE */}
        {activeMockup === 'shawl' && (
          <div className="relative w-full max-w-xl aspect-[16/10] overflow-hidden rounded-lg shadow-2xl border border-[#f4eedd]/20 bg-[#07131e]">
            {/* Shawl Fabric with realistic fold shadows */}
            <div className="w-full h-full relative">
              <PatternCanvas config={{ ...config, showBorder: true }} />

              {/* Realistic Fabric Fold Highlights and Shadows */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/45 via-transparent via-black/25 via-transparent to-black/45 pointer-events-none mix-blend-multiply"></div>
              <div
                className="absolute inset-0 pointer-events-none opacity-20"
                style={{
                  backgroundImage:
                    'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.08) 10px, rgba(255,255,255,0.08) 20px)',
                }}
              ></div>

              {/* Ivory & Madder Fringe Tassels on Left and Right Ends */}
              <div className="absolute inset-y-0 left-0 w-3 bg-repeating-linear-gradient(to bottom, #f4eedd, #f4eedd 2px, transparent 2px, transparent 5px) opacity-70"></div>
              <div className="absolute inset-y-0 right-0 w-3 bg-repeating-linear-gradient(to bottom, #f4eedd, #f4eedd 2px, transparent 2px, transparent 5px) opacity-70"></div>
            </div>

            <div className="absolute bottom-3 left-3 bg-[#07131e]/90 px-3 py-1.5 rounded border border-[#f4eedd]/15 text-xs font-mono text-[#f4eedd] backdrop-blur-sm">
              Traditional Sindhi Chaddar (Shawl) Simulation
            </div>
          </div>
        )}

        {/* 5. PROTECTIVE LAPTOP SLEEVE */}
        {activeMockup === 'sleeve' && (
          <div className="relative w-full max-w-xl aspect-[16/11] transition-all duration-300">
            <div className="absolute -inset-4 bg-black/70 blur-2xl rounded-2xl -z-10 translate-y-5"></div>
            <div className="w-full h-full rounded-2xl overflow-hidden relative shadow-2xl border-4 border-[#15171a] bg-[#07131e] flex flex-col">
              {/* Top zipper seam */}
              <div className="h-3 bg-gradient-to-b from-[#23262c] to-[#111317] border-b border-[#c98e3b]/40 flex items-center justify-end px-6">
                <div className="w-8 h-1.5 rounded-full bg-[#c98e3b]"></div>
              </div>
              {/* Patterned quilted textile surface */}
              <div className="flex-1 relative overflow-hidden">
                <PatternCanvas config={config} />
                <div className="absolute inset-0 bg-gradient-to-tr from-black/35 via-transparent to-white/10 pointer-events-none"></div>
                {/* Woven corner label */}
                <div className="absolute bottom-4 right-4 px-3 py-1.5 rounded bg-[#091724]/95 border border-[#c98e3b]/70 text-[10px] font-mono text-[#f4eedd] tracking-wider shadow-lg">
                  AJRAK LAB · STUDIO SLEEVE STUDY
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Connected AI Product Assistant */}
      <AiProductAssistant
        config={config}
        activeMockup={activeMockup}
        onApplyColorVariation={onApplyColorVariation}
      />
    </section>
  );
};
