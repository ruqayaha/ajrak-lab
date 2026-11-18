import React, { useState, useRef, useEffect } from 'react';
import { PatternConfig, MotifId, GridLayout, MockupType } from '../types/pattern';
import { COLOR_PALETTES, MOTIF_STUDIES, DEFAULT_PATTERN_CONFIG } from '../data/patternPresets';
import { PatternCanvas } from './PatternCanvas';
import { exportSvgAsPng } from '../utils/exportUtils';
import {
  RotateCcw,
  Shuffle,
  Download,
  Maximize2,
  Minimize2,
  X,
  Book,
  Frame,
  Sparkles,
  Layers,
  Check,
  ZoomIn,
  Move,
  Sliders,
  Palette,
  Grid,
} from 'lucide-react';

interface ExhibitionBoothModeProps {
  config: PatternConfig;
  onChangeConfig: (config: PatternConfig) => void;
  onExit: () => void;
}

export const ExhibitionBoothMode: React.FC<ExhibitionBoothModeProps> = ({
  config,
  onChangeConfig,
  onExit,
}) => {
  const canvasRef = useRef<SVGSVGElement | null>(null);
  const [activeDisplay, setActiveDisplay] = useState<'canvas' | 'mockup'>('canvas');
  const [activeMockup, setActiveMockup] = useState<MockupType>('notebook');
  const [isImmersiveFull, setIsImmersiveFull] = useState<boolean>(false);
  const [visitorResetNotification, setVisitorResetNotification] = useState<boolean>(false);
  const [isExporting, setIsExporting] = useState<boolean>(false);

  // Keyboard shortcut: Esc to exit immersive or booth mode
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isImmersiveFull) {
          setIsImmersiveFull(false);
        } else {
          onExit();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isImmersiveFull, onExit]);

  // Reset specifically calibrated for the next booth visitor
  const handleResetForVisitor = () => {
    onChangeConfig({
      ...DEFAULT_PATTERN_CONFIG,
      gridDensity: 3,
      motifScale: 1.0,
      spacing: 0,
      rotation: 0,
      showBorder: true,
      borderWidth: 28,
    });
    setVisitorResetNotification(true);
    setTimeout(() => {
      setVisitorResetNotification(false);
    }, 2800);
  };

  // Quick randomise for instant booth delight
  const handleQuickRandomise = () => {
    const motifs: MotifId[] = ['star-trellis', 'eightfold-rosette', 'stepped-diamond'];
    const randomMotif = motifs[Math.floor(Math.random() * motifs.length)];
    const randomPalette = COLOR_PALETTES[Math.floor(Math.random() * COLOR_PALETTES.length)];
    const randomDensity = [2, 3, 4][Math.floor(Math.random() * 3)];
    const randomLayouts: GridLayout[] = ['square', 'half-drop', 'diamond'];
    const randomLayout = randomLayouts[Math.floor(Math.random() * randomLayouts.length)];
    const randomRotation = [0, 45, 90, 180][Math.floor(Math.random() * 4)];

    onChangeConfig({
      ...config,
      motifId: randomMotif,
      paletteId: randomPalette.id,
      customColors: {
        ground: randomPalette.ground,
        primary: randomPalette.primary,
        secondary: randomPalette.secondary,
        accent: randomPalette.accent,
        outline: randomPalette.outline,
      },
      gridDensity: randomDensity,
      gridLayout: randomLayout,
      rotation: randomRotation,
      motifScale: 1.0,
      spacing: 0,
      showBorder: true,
    });
  };

  // Download high-res PNG for student/visitor to keep
  const handleDownloadVisitorDesign = async () => {
    if (!canvasRef.current) return;
    setIsExporting(true);
    const filename = `ajrak-booth-design-${Date.now()}.png`;
    await exportSvgAsPng(canvasRef.current, filename, 3);
    setIsExporting(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#07131e] text-[#f4eedd] flex flex-col overflow-hidden select-none">
      {/* 1. Kiosk Top Bar: High-contrast, touch-optimized */}
      <header className="h-16 sm:h-20 bg-[#0a1827] border-b border-[#f4eedd]/20 px-4 sm:px-8 flex items-center justify-between gap-4 shrink-0 shadow-lg">
        {/* Left: Booth Identity */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-[#8b2628] border border-[#f4eedd]/30 flex items-center justify-center font-serif font-bold text-sm text-[#f4eedd]">
            AL
          </div>
          <div>
            <div className="font-serif font-bold text-base sm:text-lg text-[#f4eedd] tracking-wide flex items-center gap-2">
              <span>AJRAK LAB</span>
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#c98e3b] hidden sm:inline-block">
                · University Booth Kiosk
              </span>
            </div>
            <div className="text-[11px] text-[#f4eedd]/60 font-sans hidden sm:block">
              Interactive Sindhi Textile Geometry Station
            </div>
          </div>
        </div>

        {/* Center: Quick Display Switcher (Touch Buttons) */}
        <div className="flex items-center gap-1.5 p-1 bg-[#07131e] rounded-lg border border-[#f4eedd]/15">
          <button
            onClick={() => {
              setActiveDisplay('canvas');
              setIsImmersiveFull(false);
            }}
            className={`px-3.5 py-2 rounded-md font-mono text-xs transition-all flex items-center gap-2 ${
              activeDisplay === 'canvas'
                ? 'bg-[#8b2628] text-[#f4eedd] font-semibold shadow-sm'
                : 'text-[#f4eedd]/70 hover:text-[#f4eedd]'
            }`}
          >
            <Grid className="w-4 h-4 text-[#c98e3b]" />
            <span>Pattern Canvas</span>
          </button>

          <button
            onClick={() => setActiveDisplay('mockup')}
            className={`px-3.5 py-2 rounded-md font-mono text-xs transition-all flex items-center gap-2 ${
              activeDisplay === 'mockup'
                ? 'bg-[#8b2628] text-[#f4eedd] font-semibold shadow-sm'
                : 'text-[#f4eedd]/70 hover:text-[#f4eedd]'
            }`}
          >
            <Book className="w-4 h-4 text-[#c98e3b]" />
            <span>Product Mockup</span>
          </button>
        </div>

        {/* Right: Reset For Next Visitor + Fullscreen + Exit */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Prominent Reset Button for Next Visitor */}
          <button
            onClick={handleResetForVisitor}
            className="px-4 sm:px-5 py-2 sm:py-2.5 rounded-lg bg-[#0e2235] hover:bg-[#122e47] border-2 border-[#c98e3b] text-[#f4eedd] font-mono text-xs font-bold tracking-wider transition-all shadow-md flex items-center gap-2 active:scale-95"
            title="Reset settings to clean baseline for the next visitor"
          >
            <RotateCcw className="w-4 h-4 text-[#c98e3b]" />
            <span className="hidden md:inline">Reset for</span> Next Visitor
          </button>

          {/* Toggle Full-Screen Canvas */}
          <button
            onClick={() => setIsImmersiveFull(!isImmersiveFull)}
            className="p-2 sm:p-2.5 rounded-lg border border-[#f4eedd]/20 bg-[#07131e] text-[#f4eedd]/80 hover:text-[#f4eedd] transition-colors"
            title={isImmersiveFull ? 'Exit full screen preview' : 'View full screen pattern'}
          >
            {isImmersiveFull ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          {/* Exit Booth Mode Button */}
          <button
            onClick={onExit}
            className="p-2 sm:px-3 sm:py-2 rounded-lg bg-[#8b2628] hover:bg-[#a32f31] text-[#f4eedd] font-mono text-xs transition-colors flex items-center gap-1.5"
            title="Exit exhibition booth mode"
          >
            <X className="w-4 h-4" />
            <span className="hidden sm:inline">Exit</span>
          </button>
        </div>
      </header>

      {/* Visitor Reset Confirmation Toast */}
      {visitorResetNotification && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-lg bg-[#8b2628] text-[#f4eedd] border border-[#f4eedd]/30 font-mono text-xs flex items-center gap-2.5 shadow-2xl animate-fade-in">
          <Check className="w-4 h-4 text-[#c98e3b]" />
          <span>Pattern reset to clean baseline. Welcome, next visitor!</span>
        </div>
      )}

      {/* 2. Main Booth Workspace */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* VIEW A: PATTERN CANVAS STAGE (Full-Screen or Split-Screen) */}
        {activeDisplay === 'canvas' && (
          <div
            className={`flex-1 flex flex-col items-center justify-center p-4 sm:p-8 bg-[#050d14] relative transition-all overflow-hidden ${
              isImmersiveFull ? 'w-full' : ''
            }`}
          >
            {/* Background Textile Texture */}
            <div className="absolute inset-0 opacity-15 pointer-events-none cloth-texture"></div>

            {/* Prominent Large Canvas Frame */}
            <div className="relative w-full h-full max-w-[800px] max-h-[80vh] aspect-square rounded-xl overflow-hidden shadow-2xl border-2 border-[#f4eedd]/25 bg-[#07131e] flex items-center justify-center p-2 sm:p-4">
              <PatternCanvas ref={canvasRef} config={config} />

              {/* Stamping spec overlay badge */}
              <div className="absolute bottom-3 left-3 bg-[#07131e]/90 backdrop-blur-md px-3 py-1.5 rounded border border-[#f4eedd]/15 text-[11px] font-mono text-[#f4eedd]/80 flex items-center gap-2">
                <span className="text-[#c98e3b] font-bold">{config.gridDensity}×{config.gridDensity}</span>
                <span>·</span>
                <span className="uppercase">{config.gridLayout}</span>
                <span>·</span>
                <span>Scale: {config.motifScale.toFixed(2)}x</span>
              </div>

              {/* Floating Fullscreen button inside canvas */}
              {!isImmersiveFull && (
                <button
                  onClick={() => setIsImmersiveFull(true)}
                  className="absolute top-3 right-3 p-2 rounded bg-[#07131e]/90 text-[#f4eedd]/80 hover:text-[#f4eedd] border border-[#f4eedd]/20 backdrop-blur-md shadow"
                  title="Expand to immersive full screen"
                >
                  <Maximize2 className="w-4 h-4 text-[#c98e3b]" />
                </button>
              )}
            </div>

            {/* Quick Touch Bar Under Canvas (Motifs + Colors) */}
            {!isImmersiveFull && (
              <div className="w-full max-w-[800px] mt-4 flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-[#0a1827]/90 border border-[#f4eedd]/15 backdrop-blur-md">
                {/* 3 Quick Motif Tap Buttons */}
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-mono text-[#c98e3b] uppercase mr-1">Study:</span>
                  {[
                    { id: 'star-trellis', label: '01. Star' },
                    { id: 'eightfold-rosette', label: '02. Rosette' },
                    { id: 'stepped-diamond', label: '03. Diamond' },
                  ].map(({ id, label }) => (
                    <button
                      key={id}
                      onClick={() => onChangeConfig({ ...config, motifId: id as MotifId })}
                      className={`px-3 py-1.5 rounded font-mono text-xs transition-all ${
                        config.motifId === id
                          ? 'bg-[#8b2628] text-[#f4eedd] font-bold shadow-sm ring-1 ring-[#f4eedd]/30'
                          : 'bg-[#07131e] text-[#f4eedd]/70 hover:text-[#f4eedd] border border-[#f4eedd]/10'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>

                {/* 5 Quick Palette Tap Discs */}
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono text-[#c98e3b] uppercase mr-1">Palette:</span>
                  {COLOR_PALETTES.map((pal) => (
                    <button
                      key={pal.id}
                      onClick={() =>
                        onChangeConfig({
                          ...config,
                          paletteId: pal.id,
                          customColors: {
                            ground: pal.ground,
                            primary: pal.primary,
                            secondary: pal.secondary,
                            accent: pal.accent,
                            outline: pal.outline,
                          },
                        })
                      }
                      className={`w-7 h-7 rounded-full border-2 transition-transform ${
                        config.paletteId === pal.id
                          ? 'border-[#f4eedd] scale-110 shadow-lg ring-2 ring-[#8b2628]'
                          : 'border-black/60 opacity-80 hover:opacity-100 hover:scale-105'
                      }`}
                      style={{ backgroundColor: pal.primary }}
                      title={pal.name}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* VIEW B: PRODUCT MOCKUP STAGE */}
        {activeDisplay === 'mockup' && (
          <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-10 bg-[#050d14] relative overflow-y-auto">
            {/* Mockup Sub-Type Selector */}
            <div className="flex items-center gap-2 mb-6 p-1 bg-[#0a1827] rounded-lg border border-[#f4eedd]/15">
              {[
                { id: 'notebook', label: 'Artisan Hardcover Book', icon: Book },
                { id: 'poster', label: 'Exhibition Gallery Poster', icon: Frame },
                { id: 'shawl', label: 'Textile Shawl / Stole', icon: Sparkles },
                { id: 'flat', label: 'Flat Pattern Swatch', icon: Layers },
              ].map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveMockup(id as MockupType)}
                  className={`px-3.5 py-2 rounded-md font-mono text-xs transition-all flex items-center gap-2 ${
                    activeMockup === id
                      ? 'bg-[#8b2628] text-[#f4eedd] font-bold shadow'
                      : 'text-[#f4eedd]/70 hover:text-[#f4eedd]'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 text-[#c98e3b]" />
                  <span>{label}</span>
                </button>
              ))}
            </div>

            {/* Mockup Display Box */}
            <div className="w-full max-w-lg aspect-[3/4] flex items-center justify-center">
              {/* Notebook Mockup */}
              {activeMockup === 'notebook' && (
                <div className="w-full h-full max-h-[500px] rounded-r-xl rounded-l-sm overflow-hidden relative shadow-2xl border border-[#f4eedd]/20 flex">
                  {/* Spine */}
                  <div className="w-8 h-full bg-[#08121d] border-r border-black/70 shrink-0 flex flex-col justify-between py-6 items-center">
                    <div className="w-1.5 h-16 bg-[#c98e3b] rounded-full"></div>
                    <span className="font-serif text-[10px] text-[#f4eedd]/60 rotate-90 whitespace-nowrap">
                      AJRAK LAB • BOOTH EDITION
                    </span>
                    <div className="w-1.5 h-16 bg-[#c98e3b] rounded-full"></div>
                  </div>
                  {/* Cover */}
                  <div className="flex-1 h-full relative overflow-hidden bg-[#07131e]">
                    <PatternCanvas config={{ ...config, showBorder: false }} />
                    <div className="absolute inset-0 bg-gradient-to-tr from-black/40 via-transparent to-white/10 pointer-events-none"></div>
                    <div className="absolute inset-x-8 top-16 bg-[#091724]/95 border border-[#c98e3b]/80 p-4 rounded text-center backdrop-blur-md shadow-2xl">
                      <div className="text-[10px] font-mono tracking-widest text-[#c98e3b] uppercase">
                        University Exhibition Edition
                      </div>
                      <h3 className="font-serif text-lg text-[#f4eedd] font-bold">
                        AJRAK NOTEBOOK
                      </h3>
                    </div>
                  </div>
                </div>
              )}

              {/* Poster Mockup */}
              {activeMockup === 'poster' && (
                <div className="w-full h-full max-h-[500px] bg-[#f8f4ea] text-[#141517] p-6 rounded shadow-2xl border-8 border-[#07131e] flex flex-col justify-between">
                  <div className="border-b border-[#141517]/20 pb-2 flex justify-between items-baseline">
                    <span className="font-serif text-base font-bold text-[#8b2628]">AJRAK LAB</span>
                    <span className="font-mono text-[10px] text-[#141517]/60">CAMPUS EXHIBITION</span>
                  </div>
                  <div className="w-full aspect-square my-auto rounded overflow-hidden shadow-inner border border-[#141517]/15">
                    <PatternCanvas config={config} />
                  </div>
                  <div className="border-t border-[#141517]/20 pt-2 text-[10px] font-mono text-center text-[#141517]/70">
                    SINDHI GEOMETRIC TESSELLATION STUDY • UNIVERSITY BOOTH
                  </div>
                </div>
              )}

              {/* Shawl Mockup */}
              {activeMockup === 'shawl' && (
                <div className="w-full aspect-[16/10] rounded-lg overflow-hidden shadow-2xl border border-[#f4eedd]/20 relative bg-[#07131e]">
                  <PatternCanvas config={{ ...config, showBorder: true }} />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/45 via-transparent via-black/25 via-transparent to-black/45 pointer-events-none mix-blend-multiply"></div>
                  <div className="absolute bottom-3 left-3 bg-[#07131e]/90 px-3 py-1 rounded text-xs font-mono text-[#f4eedd]">
                    Ceremonial Chaddar (Shawl)
                  </div>
                </div>
              )}

              {/* Flat Swatch */}
              {activeMockup === 'flat' && (
                <div className="w-full aspect-square rounded-lg overflow-hidden shadow-2xl border-2 border-[#f4eedd]/20 bg-[#07131e]">
                  <PatternCanvas config={config} />
                </div>
              )}
            </div>
          </div>
        )}

        {/* 3. Right Column: Large Touch-Friendly Kiosk Controls Desk (Hidden in immersive full-screen) */}
        {!isImmersiveFull && (
          <aside className="w-80 sm:w-96 bg-[#0a1827] border-l border-[#f4eedd]/20 p-5 sm:p-6 overflow-y-auto space-y-6 shrink-0 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#f4eedd]/15">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#c98e3b] flex items-center gap-1.5">
                <Sliders className="w-4 h-4" />
                <span>Touch Controls Desk</span>
              </span>
              <span className="text-[11px] font-mono text-[#f4eedd]/50">Tap to adjust</span>
            </div>

            {/* A. Grid Density (Big Tap Buttons) */}
            <div className="space-y-2">
              <label className="text-xs font-mono text-[#f4eedd]/80 uppercase block">
                Pattern Repetitions (Grid)
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[2, 3, 4, 5].map((d) => (
                  <button
                    key={d}
                    onClick={() => onChangeConfig({ ...config, gridDensity: d })}
                    className={`min-h-[46px] rounded-lg border font-mono text-sm font-bold transition-all ${
                      config.gridDensity === d
                        ? 'border-[#8b2628] bg-[#8b2628] text-[#f4eedd] shadow-md ring-2 ring-[#f4eedd]/30'
                        : 'border-[#f4eedd]/15 bg-[#07131e] text-[#f4eedd]/70 hover:bg-[#07131e]/80'
                    }`}
                  >
                    {d}×{d}
                  </button>
                ))}
              </div>
            </div>

            {/* B. Layout Tessellation Structure (Big Cards) */}
            <div className="space-y-2">
              <label className="text-xs font-mono text-[#f4eedd]/80 uppercase block">
                Grid Geometry
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'square', label: 'Square' },
                  { id: 'half-drop', label: 'Brick' },
                  { id: 'diamond', label: 'Diamond' },
                ].map(({ id, label }) => (
                  <button
                    key={id}
                    onClick={() => onChangeConfig({ ...config, gridLayout: id as GridLayout })}
                    className={`min-h-[46px] rounded-lg border font-mono text-xs font-bold transition-all ${
                      config.gridLayout === id
                        ? 'border-[#8b2628] bg-[#8b2628] text-[#f4eedd] shadow-md'
                        : 'border-[#f4eedd]/15 bg-[#07131e] text-[#f4eedd]/70 hover:bg-[#07131e]/80'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* C. Motif Scale Slider & Quick Buttons */}
            <div className="space-y-2.5">
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-[#f4eedd]/80 uppercase">Scale (Tightness)</span>
                <span className="text-[#c98e3b] font-bold tabular-nums">
                  {config.motifScale.toFixed(2)}x
                </span>
              </div>
              <input
                type="range"
                min="0.75"
                max="1.30"
                step="0.05"
                value={config.motifScale}
                onChange={(e) =>
                  onChangeConfig({ ...config, motifScale: parseFloat(e.target.value) })
                }
                aria-label="Motif scale slider"
                className="w-full accent-[#8b2628] h-3 bg-[#07131e] rounded cursor-pointer"
              />
              <div className="grid grid-cols-3 gap-2">
                {[
                  { label: 'Separated', val: 0.8 },
                  { label: 'Standard', val: 1.0 },
                  { label: 'Interlocked', val: 1.25 },
                ].map(({ label, val }) => (
                  <button
                    key={val}
                    onClick={() => onChangeConfig({ ...config, motifScale: val })}
                    className={`py-2 px-1 rounded border text-[11px] font-mono transition-colors ${
                      Math.abs(config.motifScale - val) < 0.05
                        ? 'border-[#c98e3b] bg-[#c98e3b]/20 text-[#f4eedd]'
                        : 'border-[#f4eedd]/10 bg-[#07131e] text-[#f4eedd]/60'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* D. Rotation Angle (Touch Buttons) */}
            <div className="space-y-2">
              <label className="text-xs font-mono text-[#f4eedd]/80 uppercase block">
                Motif Rotation
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[0, 45, 90, 180].map((deg) => (
                  <button
                    key={deg}
                    onClick={() => onChangeConfig({ ...config, rotation: deg })}
                    className={`min-h-[44px] rounded-lg border font-mono text-xs font-bold transition-all ${
                      config.rotation === deg
                        ? 'border-[#8b2628] bg-[#8b2628] text-[#f4eedd]'
                        : 'border-[#f4eedd]/15 bg-[#07131e] text-[#f4eedd]/70'
                    }`}
                  >
                    {deg}°
                  </button>
                ))}
              </div>
            </div>

            {/* E. Traditional Hasheeya Border (Large Touch Switch) */}
            <div className="p-3.5 rounded-lg bg-[#07131e] border border-[#f4eedd]/15 flex items-center justify-between">
              <div>
                <span className="font-mono text-xs font-bold text-[#f4eedd] block">
                  Hasheeya Border
                </span>
                <span className="text-[11px] text-[#f4eedd]/60">Traditional framed edge</span>
              </div>
              <button
                onClick={() => onChangeConfig({ ...config, showBorder: !config.showBorder })}
                className={`min-h-[40px] px-4 rounded-md font-mono text-xs font-bold transition-all ${
                  config.showBorder
                    ? 'bg-[#8b2628] text-[#f4eedd]'
                    : 'bg-[#0a1827] text-[#f4eedd]/50 border border-[#f4eedd]/20'
                }`}
              >
                {config.showBorder ? 'ON' : 'OFF'}
              </button>
            </div>

            {/* F. Big Action Buttons: Quick Randomise & Download */}
            <div className="pt-2 space-y-3">
              <button
                onClick={handleQuickRandomise}
                className="w-full min-h-[50px] rounded-xl bg-[#0e2235] hover:bg-[#122e47] border border-[#c98e3b]/80 text-[#f4eedd] font-mono text-xs font-bold tracking-wider transition-all shadow flex items-center justify-center gap-2 active:scale-98"
              >
                <Shuffle className="w-4 h-4 text-[#c98e3b]" />
                <span>SURPRISE ME (RANDOMISE)</span>
              </button>

              <button
                onClick={handleDownloadVisitorDesign}
                disabled={isExporting}
                className="w-full min-h-[52px] rounded-xl bg-[#8b2628] hover:bg-[#a32f31] text-[#f4eedd] font-mono text-xs font-bold tracking-wider transition-all shadow-xl flex items-center justify-center gap-2.5 active:scale-98 border border-[#f4eedd]/30"
              >
                <Download className="w-4 h-4" />
                <span>{isExporting ? 'EXPORTING...' : 'SAVE MY DESIGN (PNG)'}</span>
              </button>
            </div>

            {/* Educational Booth Footer Note */}
            <div className="p-3 rounded-lg bg-[#07131e]/60 border border-[#f4eedd]/10 text-[11px] text-[#f4eedd]/60 font-sans leading-relaxed">
              <strong>University Booth Guide:</strong> Explore repeating geometric symmetries. When finished, hit{' '}
              <strong className="text-[#c98e3b]">"Reset for Next Visitor"</strong> so the station is fresh for the next student.
            </div>
          </aside>
        )}
      </div>
    </div>
  );
};
