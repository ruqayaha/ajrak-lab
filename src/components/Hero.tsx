import React from 'react';
import { ArrowDown, Compass, Sparkles } from 'lucide-react';
import { PatternConfig } from '../types/pattern';
import { PatternCanvas } from './PatternCanvas';

interface HeroProps {
  previewConfig: PatternConfig;
  onEnterLab: () => void;
  onOpenBoothMode: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  previewConfig,
  onEnterLab,
  onOpenBoothMode,
}) => {
  return (
    <header className="relative min-h-[94vh] flex flex-col justify-between overflow-hidden px-4 sm:px-6 lg:px-8 pt-6 pb-10 border-b border-[#f4eedd]/15">
      {/* 1. Top Bar Contract: Zone 1 (Wordmark) — Zone 2 (4-5 Nav Links) — Zone 3 (Primary Actions) */}
      <nav className="max-w-7xl w-full mx-auto flex items-center justify-between gap-8 z-10 py-2 border-b border-[#f4eedd]/10">
        {/* Zone 1: Single text wordmark */}
        <a
          href="/"
          className="font-serif font-bold text-xl sm:text-2xl tracking-wider text-[#f4eedd] hover:text-[#c98e3b] transition-colors whitespace-nowrap shrink-0"
        >
          AJRAK LAB
        </a>

        {/* Zone 2: 4-5 single-line clean text nav links */}
        <div className="hidden md:flex items-center gap-8 text-xs font-mono text-[#f4eedd]/75">
          <a
            href="#pattern-studio"
            className="hover:text-[#f4eedd] transition-colors whitespace-nowrap shrink-0 hover:underline underline-offset-4"
          >
            Pattern Studio
          </a>
          <a
            href="#geometry-explorer"
            className="hover:text-[#f4eedd] transition-colors whitespace-nowrap shrink-0 hover:underline underline-offset-4"
          >
            Geometry Explorer
          </a>
          <a
            href="#cultural-context"
            className="hover:text-[#f4eedd] transition-colors whitespace-nowrap shrink-0 hover:underline underline-offset-4"
          >
            Craft Heritage
          </a>
          <a
            href="#ask-ajrak-lab"
            className="hover:text-[#f4eedd] transition-colors whitespace-nowrap shrink-0 hover:underline underline-offset-4 text-[#c98e3b]"
          >
            Ask Ajrak Lab
          </a>
          <a
            href="#design-preview"
            className="hover:text-[#f4eedd] transition-colors whitespace-nowrap shrink-0 hover:underline underline-offset-4"
          >
            Applications
          </a>
        </div>

        {/* Zone 3: Primary Actions (Exhibition Booth Mode + Enter Studio) */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={onOpenBoothMode}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#c98e3b]/60 bg-[#07131e] hover:bg-[#0c1f33] text-[#c98e3b] font-mono text-xs whitespace-nowrap transition-colors"
            title="Launch full-screen university booth mode with large touch controls"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Booth Mode</span>
          </button>

          <button
            onClick={onEnterLab}
            className="px-4 py-2 rounded-lg bg-[#8b2628] hover:bg-[#a32f31] text-[#f4eedd] font-mono font-medium text-xs tracking-wider transition-all shadow-md whitespace-nowrap shrink-0 border border-[#f4eedd]/20"
          >
            Enter Studio
          </button>
        </div>
      </nav>

      {/* 2. Main Editorial Exhibition Core */}
      <div className="max-w-7xl w-full mx-auto my-auto py-10 lg:py-16 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center z-10">
        {/* Left Column: Monograph Kicker, Title, Subtitle, Copy, Action */}
        <div className="lg:col-span-7 space-y-6">
          {/* Clean Unboxed Metadata Kicker (Anti-slop zero-pill rule) */}
          <div className="flex flex-wrap items-center gap-2 text-xs font-mono tracking-widest uppercase text-[#c98e3b]">
            <span>Exhibition Study No. 01</span>
            <span aria-hidden="true">·</span>
            <span>Sindhi Textile Geometry</span>
            <span aria-hidden="true">·</span>
            <span>Living Craft Archive</span>
          </div>

          <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-normal tracking-tight text-[#f4eedd] leading-[0.98] text-balance">
            AJRAK LAB
          </h1>

          <p className="font-serif text-2xl sm:text-3xl text-[#f4eedd]/90 font-light leading-snug max-w-2xl text-balance">
            Explore the geometry. Respect the craft. Create something new.
          </p>

          <p className="text-base sm:text-lg text-[#f4eedd]/75 max-w-xl font-sans leading-relaxed">
            An interactive studio exploring the patterns, structures and possibilities of Sindhi Ajrak.
            Discover the mathematics of repeating tessellations, experiment with living woodblock symmetries,
            and preview digital textile studies in physical context.
          </p>

          {/* Action Row */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-3">
            <button
              onClick={onEnterLab}
              className="px-6 py-3.5 rounded-lg bg-[#8b2628] hover:bg-[#a32f31] text-[#f4eedd] font-mono text-xs uppercase tracking-wider font-semibold transition-all shadow-xl flex items-center justify-center gap-2.5 border border-[#f4eedd]/20 group"
            >
              <span>Enter the Pattern Lab</span>
              <ArrowDown className="w-3.5 h-3.5 text-[#c98e3b] group-hover:translate-y-0.5 transition-transform" />
            </button>

            <button
              onClick={onOpenBoothMode}
              className="px-5 py-3.5 rounded-lg border-2 border-[#c98e3b]/70 bg-[#07131e]/90 hover:bg-[#07131e] text-[#f4eedd] font-mono text-xs uppercase tracking-wider font-semibold transition-all shadow-lg flex items-center justify-center gap-2"
              title="Launch large touch-friendly university booth kiosk mode"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#c98e3b]" />
              <span>Launch Booth Kiosk</span>
            </button>

            <a
              href="#cultural-context"
              className="px-5 py-3.5 rounded-lg border border-[#f4eedd]/20 bg-[#0c1e30]/60 hover:bg-[#0c1e30] text-[#f4eedd]/80 hover:text-[#f4eedd] font-mono text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2"
            >
              <Compass className="w-3.5 h-3.5 text-[#c98e3b]" />
              <span>Beyond Pattern</span>
            </a>
          </div>

          {/* Curatorial Attribution Note */}
          <div className="pt-4 border-t border-[#f4eedd]/10 text-xs text-[#f4eedd]/60 font-sans flex items-start gap-2">
            <span className="text-[#c98e3b] font-mono text-sm leading-none mt-0.5">§</span>
            <p className="leading-relaxed">
              Culturally grounded exploration: Respecting living artisans in Sindh and distinguishing
              computational geometric studies from authentic hand-printed textiles.
            </p>
          </div>
        </div>

        {/* Right Column: Museum Archival Mount for the Specimen */}
        <div className="lg:col-span-5 flex justify-center">
          <div className="relative w-full max-w-md bg-[#0a1827] rounded-xl border border-[#f4eedd]/25 p-5 shadow-2xl relative">
            {/* Museum Conservation Frame: Double Hairline Border */}
            <div className="absolute inset-2 border border-[#f4eedd]/15 pointer-events-none rounded-lg"></div>

            {/* Corner Precision Crosshairs */}
            <span className="absolute top-3 left-3 text-[10px] font-mono text-[#c98e3b]/80">+</span>
            <span className="absolute top-3 right-3 text-[10px] font-mono text-[#c98e3b]/80">+</span>
            <span className="absolute bottom-3 left-3 text-[10px] font-mono text-[#c98e3b]/80">+</span>
            <span className="absolute bottom-3 right-3 text-[10px] font-mono text-[#c98e3b]/80">+</span>

            {/* Live Interactive Specimen Canvas */}
            <div className="w-full aspect-square rounded-lg overflow-hidden relative shadow-inner bg-[#07131e]">
              <PatternCanvas
                config={{
                  ...previewConfig,
                  gridDensity: 3,
                  spacing: 0,
                  showBorder: true,
                  borderWidth: 26,
                }}
              />
            </div>

            {/* Museum Accession Plaque */}
            <div className="mt-4 pt-3 border-t border-[#f4eedd]/15 flex items-center justify-between text-xs font-mono">
              <div>
                <span className="text-[10px] uppercase text-[#c98e3b] block tracking-wider">
                  Simulation Study AJR-2026.01
                </span>
                <span className="font-serif text-sm text-[#f4eedd]">
                  Taveez Star-Trellis Study
                </span>
              </div>
              <div className="text-right text-[10px] text-[#f4eedd]/60">
                Isometry: p4m<br />
                Natural Dye Study Palette
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Hero Bottom Operational Utility Ribbon */}
      <div className="max-w-7xl w-full mx-auto pt-4 flex flex-col sm:flex-row items-center justify-between text-xs font-mono text-[#f4eedd]/50 gap-3 z-10 border-t border-[#f4eedd]/10">
        <div className="flex items-center gap-3">
          <span>INDUS BASIN TEXTILE STUDY</span>
          <span aria-hidden="true">·</span>
          <span>HISTORICAL LOWER INDUS STUDY</span>
          <span aria-hidden="true">·</span>
          <span>BROWSER-NATIVE PARAMETRIC MATH</span>
        </div>
        <div className="flex items-center gap-2 text-[#c98e3b]">
          <span>EXHIBITION ACTIVE</span>
          <ArrowDown className="w-3 h-3 animate-bounce" />
        </div>
      </div>

      {/* Tactile Textile Grain Background */}
      <div className="absolute inset-0 opacity-15 pointer-events-none cloth-texture"></div>
    </header>
  );
};
