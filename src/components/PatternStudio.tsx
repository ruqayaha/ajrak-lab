import React, { useRef, useState } from 'react';
import { PatternConfig, MotifId, GridLayout, MockupType } from '../types/pattern';
import { COLOR_PALETTES, MOTIF_STUDIES, DEFAULT_PATTERN_CONFIG } from '../data/patternPresets';
import { PatternCanvas } from './PatternCanvas';
import { TilingInspector } from './TilingInspector';
import { MathExplainer } from './MathExplainer';
import { AiDesignAssistant } from './AiDesignAssistant';
import { exportSvgAsPng, exportSvgDirect } from '../utils/exportUtils';
import {
  RotateCcw,
  Shuffle,
  Download,
  FileCode,
  Sliders,
  Palette,
  Grid,
  Sparkles,
  Info,
  Check,
  Layers,
  BookOpen,
  Wand2,
} from 'lucide-react';

interface PatternStudioProps {
  config: PatternConfig;
  onChangeConfig: (config: PatternConfig) => void;
  onOpenBoothMode?: () => void;
  onJumpToProductPreview?: (product: MockupType) => void;
}

export const PatternStudio: React.FC<PatternStudioProps> = ({
  config,
  onChangeConfig,
  onOpenBoothMode,
  onJumpToProductPreview,
}) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [exportSuccessMessage, setExportSuccessMessage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'motifs' | 'grid' | 'colors' | 'details'>('motifs');
  const [studioMode, setStudioMode] = useState<'pattern' | 'ai-design' | 'tiling' | 'math'>('pattern');

  // Find active motif study info
  const activeMotifInfo = MOTIF_STUDIES.find((m) => m.id === config.motifId) || MOTIF_STUDIES[0];

  // Handlers for individual controls
  const updateConfig = (partial: Partial<PatternConfig>) => {
    onChangeConfig({ ...config, ...partial });
  };

  const handlePaletteSelect = (paletteId: string) => {
    const palette = COLOR_PALETTES.find((p) => p.id === paletteId);
    if (!palette) return;

    onChangeConfig({
      ...config,
      paletteId,
      customColors: {
        ground: palette.ground,
        primary: palette.primary,
        secondary: palette.secondary,
        accent: palette.accent,
        outline: palette.outline,
      },
    });
  };

  const handleCustomColorChange = (key: keyof PatternConfig['customColors'], value: string) => {
    onChangeConfig({
      ...config,
      customColors: {
        ...config.customColors,
        [key]: value,
      },
    });
  };

  // Reset to default
  const handleReset = () => {
    onChangeConfig({ ...DEFAULT_PATTERN_CONFIG });
    showNotification('Parameters reset to classic Ajrak baseline');
  };

  // Randomise curated combinations
  const handleRandomise = () => {
    const motifKeys: MotifId[] = ['star-trellis', 'eightfold-rosette', 'stepped-diamond'];
    const randomMotif = motifKeys[Math.floor(Math.random() * motifKeys.length)];

    const randomPalette = COLOR_PALETTES[Math.floor(Math.random() * COLOR_PALETTES.length)];
    const randomDensity = [2, 3, 4, 5][Math.floor(Math.random() * 4)];
    const randomLayouts: GridLayout[] = ['square', 'half-drop', 'diamond'];
    const randomLayout = randomLayouts[Math.floor(Math.random() * randomLayouts.length)];
    const randomRotations = [0, 45, 90, 180];
    const randomRot = randomRotations[Math.floor(Math.random() * randomRotations.length)];
    const randomScale = Number((0.85 + Math.random() * 0.35).toFixed(2));
    const randomSpacing = Math.floor(Math.random() * 3) * 6; // 0, 6, 12

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
      rotation: randomRot,
      motifScale: randomScale,
      spacing: randomSpacing,
      showBorder: Math.random() > 0.2,
    });

    showNotification('Curated experimental study generated');
  };

  const showNotification = (msg: string) => {
    setExportSuccessMessage(msg);
    setTimeout(() => {
      setExportSuccessMessage(null);
    }, 3200);
  };

  // PNG Export
  const handleDownloadPng = async () => {
    if (!svgRef.current) return;
    setIsExporting(true);
    const filename = `ajrak-lab-${config.motifId}-${config.gridLayout}-${Date.now()}.png`;
    const success = await exportSvgAsPng(svgRef.current, filename, 3);
    setIsExporting(false);
    if (success) {
      showNotification('High-resolution 300 DPI pattern plate exported (PNG)');
    }
  };

  // SVG Export
  const handleDownloadSvg = () => {
    if (!svgRef.current) return;
    const filename = `ajrak-lab-${config.motifId}-${Date.now()}.svg`;
    const success = exportSvgDirect(svgRef.current, filename);
    if (success) {
      showNotification('Pure vector drawing exported (SVG)');
    }
  };

  return (
    <section id="pattern-studio" className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* Studio Section Masthead */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[#f4eedd]/15">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono tracking-widest uppercase text-[#c98e3b] mb-3">
            <span>Atelier 01</span>
            <span aria-hidden="true">·</span>
            <span>Parametric Pattern Studio</span>
            <span aria-hidden="true">·</span>
            <span>Real-Time Geometric Canvas</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-[#f4eedd] font-normal tracking-tight text-balance">
            Interactive Pattern Studio
          </h2>
          <p className="text-[#f4eedd]/70 text-sm sm:text-base mt-2 max-w-2xl font-sans leading-relaxed">
            Experiment with geometric tessellations, repeating symmetries, scale, and traditional natural pigment palettes.
            Every motif is constructed from modular geometric primitives on a consistent coordinate grid.
          </p>
        </div>

        {/* Global Action Toolbar */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            onClick={() => setStudioMode(studioMode === 'ai-design' ? 'pattern' : 'ai-design')}
            className={`px-3.5 py-2 rounded-lg border text-xs font-mono font-bold transition-all flex items-center gap-1.5 whitespace-nowrap shrink-0 shadow-sm ${
              studioMode === 'ai-design'
                ? 'border-[#c98e3b] bg-[#8b2628] text-[#f4eedd]'
                : 'border-[#c98e3b]/80 bg-[#07131e] hover:bg-[#0c1f33] text-[#c98e3b]'
            }`}
            title="Describe a pattern in natural language with Gemini"
          >
            <Wand2 className="w-3.5 h-3.5" />
            <span>Design with AI</span>
          </button>
          {onOpenBoothMode && (
            <button
              onClick={onOpenBoothMode}
              className="px-3.5 py-2 rounded-lg border-2 border-[#c98e3b]/80 bg-[#07131e] hover:bg-[#0c1f33] text-[#c98e3b] text-xs font-mono font-bold transition-all flex items-center gap-1.5 whitespace-nowrap shrink-0 shadow-sm"
              title="Launch large touch-friendly university booth exhibition mode"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Booth Mode</span>
            </button>
          )}
          <button
            onClick={handleReset}
            className="px-3.5 py-2 rounded-lg border border-[#f4eedd]/20 bg-[#0a1827]/70 hover:bg-[#0a1827] text-[#f4eedd] text-xs font-mono transition-colors flex items-center gap-2 whitespace-nowrap shrink-0"
            title="Reset to default pattern"
          >
            <RotateCcw className="w-3.5 h-3.5 text-[#c98e3b]" />
            <span>Reset</span>
          </button>
          <button
            onClick={handleRandomise}
            className="px-3.5 py-2 rounded-lg border border-[#f4eedd]/20 bg-[#0a1827]/70 hover:bg-[#0a1827] text-[#f4eedd] text-xs font-mono transition-colors flex items-center gap-2 whitespace-nowrap shrink-0"
            title="Generate a harmonious random combination"
          >
            <Shuffle className="w-3.5 h-3.5 text-[#c98e3b]" />
            <span>Randomise</span>
          </button>
          <button
            onClick={handleDownloadSvg}
            className="px-3.5 py-2 rounded-lg border border-[#f4eedd]/20 bg-[#0a1827]/70 hover:bg-[#0a1827] text-[#f4eedd] text-xs font-mono transition-colors flex items-center gap-2 whitespace-nowrap shrink-0"
            title="Download pure vector SVG"
          >
            <FileCode className="w-3.5 h-3.5 text-[#c98e3b]" />
            <span>Export SVG</span>
          </button>
          <button
            onClick={handleDownloadPng}
            disabled={isExporting}
            className="px-4 py-2 rounded-lg bg-[#8b2628] hover:bg-[#a32f31] text-[#f4eedd] text-xs font-mono font-medium transition-all shadow-md flex items-center gap-2 disabled:opacity-50 whitespace-nowrap shrink-0 border border-[#f4eedd]/20"
            title="Download high-resolution print plate (PNG)"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{isExporting ? 'Exporting...' : 'Download PNG'}</span>
          </button>
        </div>
      </div>

      {/* Success Notification Bar */}
      {exportSuccessMessage && (
        <div className="p-3.5 rounded-lg bg-[#8b2628]/95 border border-[#f4eedd]/30 text-xs font-mono text-[#f4eedd] flex items-center justify-between shadow-xl">
          <span className="flex items-center gap-2">
            <Check className="w-4 h-4 text-[#c98e3b]" />
            {exportSuccessMessage}
          </span>
          <button
            onClick={() => setExportSuccessMessage(null)}
            className="text-[#f4eedd]/60 hover:text-[#f4eedd] ml-4 text-sm"
          >
            ✕
          </button>
        </div>
      )}

      {/* Primary Studio Mode Switcher: Full Pattern vs. Repeat Unit Tiling vs. Math Explainer */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-2 rounded-xl bg-[#0a1827] border border-[#f4eedd]/20">
        <div className="flex items-center gap-2 text-xs font-mono text-[#f4eedd]/70">
          <span className="text-[#c98e3b]">VIEW MODE:</span>
          <span className="hidden sm:inline">Select pattern studio perspective</span>
        </div>

        <div className="flex flex-wrap items-center gap-1.5 text-xs font-mono">
          <button
            onClick={() => setStudioMode('pattern')}
            className={`px-3.5 py-1.5 rounded-lg border transition-all flex items-center gap-2 ${
              studioMode === 'pattern'
                ? 'border-[#8b2628] bg-[#8b2628] text-[#f4eedd] shadow-sm font-semibold'
                : 'border-[#f4eedd]/15 bg-[#07131e] text-[#f4eedd]/70 hover:text-[#f4eedd]'
            }`}
          >
            <Grid className="w-3.5 h-3.5 text-[#c98e3b]" />
            <span>Full Pattern Studio</span>
          </button>

          <button
            onClick={() => setStudioMode('ai-design')}
            className={`px-3.5 py-1.5 rounded-lg border transition-all flex items-center gap-2 ${
              studioMode === 'ai-design'
                ? 'border-[#c98e3b] bg-[#8b2628] text-[#f4eedd] shadow-sm font-semibold'
                : 'border-[#c98e3b]/40 bg-[#07131e] text-[#c98e3b] hover:text-[#f4eedd]'
            }`}
          >
            <Wand2 className="w-3.5 h-3.5 text-[#c98e3b]" />
            <span>Design with AI</span>
          </button>

          <button
            onClick={() => setStudioMode('tiling')}
            className={`px-3.5 py-1.5 rounded-lg border transition-all flex items-center gap-2 ${
              studioMode === 'tiling'
                ? 'border-[#8b2628] bg-[#8b2628] text-[#f4eedd] shadow-sm font-semibold'
                : 'border-[#f4eedd]/15 bg-[#07131e] text-[#f4eedd]/70 hover:text-[#f4eedd]'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-[#c98e3b]" />
            <span>Repeat Unit & Tiling Preview</span>
          </button>

          <button
            onClick={() => setStudioMode('math')}
            className={`px-3.5 py-1.5 rounded-lg border transition-all flex items-center gap-2 ${
              studioMode === 'math'
                ? 'border-[#8b2628] bg-[#8b2628] text-[#f4eedd] shadow-sm font-semibold'
                : 'border-[#f4eedd]/15 bg-[#07131e] text-[#f4eedd]/70 hover:text-[#f4eedd]'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-[#c98e3b]" />
            <span>Transformation Math</span>
          </button>
        </div>
      </div>

      {/* MODE 1: FULL PATTERN STUDIO (Canvas + Controls Sidebar) */}
      {studioMode === 'pattern' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          {/* Left Column: Exhibition Matting Canvas Viewer */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-4">
            <div className="bg-[#0a1827] rounded-xl p-5 sm:p-8 border border-[#f4eedd]/20 shadow-2xl relative">
              {/* Museum Conservation Frame: Double Rules */}
              <div className="absolute inset-2.5 border border-[#f4eedd]/10 rounded-lg pointer-events-none"></div>

              {/* Corner Architectural Crosshairs */}
              <span className="absolute top-4 left-4 text-[10px] font-mono text-[#c98e3b]/70 select-none">+</span>
              <span className="absolute top-4 right-4 text-[10px] font-mono text-[#c98e3b]/70 select-none">+</span>
              <span className="absolute bottom-4 left-4 text-[10px] font-mono text-[#c98e3b]/70 select-none">+</span>
              <span className="absolute bottom-4 right-4 text-[10px] font-mono text-[#c98e3b]/70 select-none">+</span>

              {/* The Live Interactive Canvas */}
              <div className="w-full aspect-square max-w-[620px] mx-auto rounded-lg overflow-hidden shadow-inner flex items-center justify-center p-2 sm:p-4 bg-[#07131e] border border-[#f4eedd]/15">
                <PatternCanvas ref={svgRef} config={config} />
              </div>

              {/* Archival Specimen Data Strip */}
              <div className="mt-5 pt-3.5 border-t border-[#f4eedd]/15 flex flex-wrap items-center justify-between text-xs font-mono text-[#f4eedd]/70 gap-2">
                <div className="flex items-center gap-3 tabular-nums">
                  <span>Layout: <strong className="text-[#f4eedd] font-normal uppercase">{config.gridLayout}</strong></span>
                  <span aria-hidden="true">·</span>
                  <span>Density: <strong className="text-[#f4eedd] font-normal">{config.gridDensity}×{config.gridDensity}</strong></span>
                  <span aria-hidden="true">·</span>
                  <span>Scale: <strong className="text-[#f4eedd] font-normal">{config.motifScale.toFixed(2)}x</strong></span>
                  <span aria-hidden="true">·</span>
                  <span>Rot: <strong className="text-[#f4eedd] font-normal">{config.rotation}°</strong></span>
                </div>
                <div className="text-[11px] text-[#c98e3b] font-medium tracking-wide">
                  ISOMETRY: {activeMotifInfo.symmetryGroup}
                </div>
              </div>
            </div>

            {/* Active Motif Cultural Note */}
            <div className="bg-[#07131e]/90 rounded-lg p-4 border border-[#f4eedd]/15 text-xs text-[#f4eedd]/80 font-sans flex items-start gap-3">
              <Info className="w-4 h-4 text-[#c98e3b] shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-[#f4eedd] font-serif text-sm block mb-0.5">
                  {activeMotifInfo.title}
                </span>
                <p className="text-xs text-[#f4eedd]/75 leading-relaxed">
                  {activeMotifInfo.description}{' '}
                  <span className="text-[#f4eedd]/50 italic">({activeMotifInfo.traditionalInspiration}).</span>
                </p>
              </div>
            </div>

            {/* Quick Teaser Card for Repeat Unit & Tiling Inspector */}
            <div className="p-4 rounded-xl bg-[#0a1827] border border-[#f4eedd]/15 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs font-mono">
              <div className="flex items-center gap-2.5">
                <Layers className="w-4 h-4 text-[#c98e3b] shrink-0" />
                <span className="text-[#f4eedd]/80">
                  Curious how one repeat block joins together? Inspect the 2×2 seam assembly.
                </span>
              </div>
              <button
                onClick={() => setStudioMode('tiling')}
                className="px-3 py-1.5 rounded bg-[#07131e] border border-[#c98e3b]/50 text-[#c98e3b] hover:bg-[#07131e]/80 whitespace-nowrap"
              >
                Open Tiling Inspector →
              </button>
            </div>
          </div>

          {/* Right Column: Atelier Control Desk */}
          <div className="lg:col-span-5 xl:col-span-4 bg-[#0a1827] rounded-xl p-5 sm:p-6 border border-[#f4eedd]/20 shadow-2xl space-y-6">
            {/* Segmented Control Tabs */}
            <div className="grid grid-cols-4 gap-1 p-1 rounded-lg bg-[#07131e] border border-[#f4eedd]/15 text-xs font-mono">
              {[
                { id: 'motifs', label: 'Motifs', icon: Sparkles },
                { id: 'grid', label: 'Tessellate', icon: Grid },
                { id: 'colors', label: 'Pigments', icon: Palette },
                { id: 'details', label: 'Finish', icon: Sliders },
              ].map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id as any)}
                  className={`py-2 px-1 rounded transition-all flex flex-col sm:flex-row items-center justify-center gap-1.5 whitespace-nowrap shrink-0 ${
                    activeTab === id
                      ? 'bg-[#8b2628] text-[#f4eedd] font-medium shadow-sm'
                      : 'text-[#f4eedd]/60 hover:text-[#f4eedd]'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span className="text-[11px]">{label}</span>
                </button>
              ))}
            </div>

            {/* TAB 1: MOTIFS SELECTION */}
            {activeTab === 'motifs' && (
              <div className="space-y-4">
                <div className="text-xs font-mono uppercase text-[#c98e3b] tracking-wider">
                  Select Geometric Study
                </div>

                <div className="space-y-3">
                  {MOTIF_STUDIES.map((study) => {
                    const isSelected = config.motifId === study.id;
                    return (
                      <button
                        key={study.id}
                        onClick={() => updateConfig({ motifId: study.id })}
                        className={`w-full p-4 rounded-lg border text-left transition-all ${
                          isSelected
                            ? 'border-[#8b2628] bg-[#8b2628]/20 ring-1 ring-[#8b2628] shadow-md'
                            : 'border-[#f4eedd]/10 bg-[#07131e]/60 hover:border-[#f4eedd]/25 hover:bg-[#07131e]'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="font-serif text-base text-[#f4eedd] font-bold">
                            {study.title}
                          </span>
                          {isSelected && (
                            <span className="text-[10px] font-mono text-[#c98e3b] uppercase tracking-wider">
                              Active
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-[#f4eedd]/70 mb-2.5 font-sans leading-relaxed">
                          {study.subtitle}
                        </p>
                        <div className="flex flex-wrap items-center gap-2 text-[10px] font-mono text-[#c98e3b]">
                          <span className="bg-[#07131e] px-2 py-0.5 rounded border border-[#f4eedd]/10">
                            {study.geometryType}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>

                <p className="pt-2 text-[11px] text-[#f4eedd]/50 italic leading-relaxed">
                  * All starting forms are constructed from reusable geometric primitives on a shared 100×100 grid.
                </p>
              </div>
            )}

            {/* TAB 2: GRID & TESSELLATION */}
            {activeTab === 'grid' && (
              <div className="space-y-5">
                {/* Grid Layout Mode */}
                <div>
                  <label className="block text-xs font-mono uppercase text-[#c98e3b] tracking-wider mb-2">
                    Tessellation Structure
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'square', label: 'Square' },
                      { id: 'half-drop', label: 'Half-Drop' },
                      { id: 'diamond', label: 'Diamond' },
                    ].map(({ id, label }) => (
                      <button
                        key={id}
                        onClick={() => updateConfig({ gridLayout: id as GridLayout })}
                        className={`py-2 px-2 text-xs rounded-lg border transition-all font-mono whitespace-nowrap shrink-0 ${
                          config.gridLayout === id
                            ? 'border-[#8b2628] bg-[#8b2628] text-[#f4eedd]'
                            : 'border-[#f4eedd]/15 bg-[#07131e]/60 text-[#f4eedd]/70 hover:text-[#f4eedd]'
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Grid Density / Repetition */}
                <div>
                  <div className="flex justify-between items-center text-xs font-mono mb-2">
                    <span className="text-[#f4eedd]/80">Grid Repetitions</span>
                    <span className="text-[#c98e3b] font-bold tabular-nums">
                      {config.gridDensity} × {config.gridDensity}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {[2, 3, 4, 5, 6].map((density) => (
                      <button
                        key={density}
                        onClick={() => updateConfig({ gridDensity: density })}
                        className={`flex-1 py-1.5 rounded-lg border text-xs font-mono transition-colors tabular-nums ${
                          config.gridDensity === density
                            ? 'border-[#8b2628] bg-[#8b2628] text-[#f4eedd]'
                            : 'border-[#f4eedd]/15 bg-[#07131e]/60 text-[#f4eedd]/60 hover:text-[#f4eedd]'
                        }`}
                      >
                        {density}×{density}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Motif Scale Slider */}
                <div>
                  <div className="flex justify-between items-center text-xs font-mono mb-2">
                    <span className="text-[#f4eedd]/80">Motif Scale</span>
                    <span className="text-[#c98e3b] tabular-nums">{config.motifScale.toFixed(2)}x</span>
                  </div>
                  <input
                    type="range"
                    min="0.65"
                    max="1.35"
                    step="0.05"
                    value={config.motifScale}
                    onChange={(e) => updateConfig({ motifScale: parseFloat(e.target.value) })}
                    aria-label="Motif scale"
                    className="w-full accent-[#8b2628] cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-[#f4eedd]/40 font-mono mt-1">
                    <span>Isolated (0.65x)</span>
                    <span>Interlocking (1.0x)</span>
                    <span>Dense (1.35x)</span>
                  </div>
                </div>

                {/* Motif Rotation */}
                <div>
                  <div className="flex justify-between items-center text-xs font-mono mb-2">
                    <span className="text-[#f4eedd]/80">Motif Rotation</span>
                    <span className="text-[#c98e3b] tabular-nums">{config.rotation}°</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="360"
                    step="5"
                    value={config.rotation}
                    onChange={(e) => updateConfig({ rotation: parseInt(e.target.value) })}
                    aria-label="Motif rotation"
                    className="w-full accent-[#8b2628] cursor-pointer"
                  />
                  <div className="flex gap-1.5 mt-2">
                    {[0, 45, 90, 180].map((deg) => (
                      <button
                        key={deg}
                        onClick={() => updateConfig({ rotation: deg })}
                        className={`flex-1 py-1 rounded text-[11px] font-mono border tabular-nums ${
                          config.rotation === deg
                            ? 'border-[#8b2628] bg-[#8b2628]/40 text-[#f4eedd]'
                            : 'border-[#f4eedd]/10 bg-[#07131e]/40 text-[#f4eedd]/60'
                        }`}
                      >
                        {deg}°
                      </button>
                    ))}
                  </div>
                </div>

                {/* Spacing / Cell Gap */}
                <div>
                  <div className="flex justify-between items-center text-xs font-mono mb-2">
                    <span className="text-[#f4eedd]/80">Inter-motif Spacing</span>
                    <span className="text-[#c98e3b] tabular-nums">{config.spacing} px</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="32"
                    step="2"
                    value={config.spacing}
                    onChange={(e) => updateConfig({ spacing: parseInt(e.target.value) })}
                    aria-label="Inter-motif spacing"
                    className="w-full accent-[#8b2628] cursor-pointer"
                  />
                </div>
              </div>
            )}

            {/* TAB 3: PIGMENTS & COLOR ROLES */}
            {activeTab === 'colors' && (
              <div className="space-y-5">
                <div>
                  <label className="block text-xs font-mono uppercase text-[#c98e3b] tracking-wider mb-2">
                    Curated Traditional Palettes
                  </label>
                  <div className="space-y-2">
                    {COLOR_PALETTES.map((palette) => {
                      const isSelected = config.paletteId === palette.id;
                      return (
                        <button
                          key={palette.id}
                          onClick={() => handlePaletteSelect(palette.id)}
                          className={`w-full p-2.5 rounded-lg border text-left transition-all flex items-center justify-between ${
                            isSelected
                              ? 'border-[#8b2628] bg-[#8b2628]/20 ring-1 ring-[#8b2628]'
                              : 'border-[#f4eedd]/10 bg-[#07131e]/50 hover:bg-[#07131e]'
                          }`}
                        >
                          <div>
                            <div className="font-serif text-xs font-semibold text-[#f4eedd]">
                              {palette.name}
                            </div>
                            <div className="text-[10px] text-[#f4eedd]/50 font-sans truncate max-w-[190px]">
                              {palette.description}
                            </div>
                          </div>

                          {/* Pigment chips */}
                          <div className="flex items-center -space-x-1.5 shrink-0 ml-2">
                            {[palette.ground, palette.primary, palette.secondary, palette.accent, palette.outline].map(
                              (c, idx) => (
                                <div
                                  key={idx}
                                  className="w-5 h-5 rounded-full border border-black/50 shadow-sm"
                                  style={{ backgroundColor: c }}
                                />
                              )
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Fine-Tune Individual Pigment Roles */}
                <div className="pt-3 border-t border-[#f4eedd]/10 space-y-3">
                  <label className="block text-xs font-mono uppercase text-[#c98e3b] tracking-wider">
                    Fine-Tune Pigment Roles
                  </label>

                  {[
                    { key: 'ground', label: 'Ground (Base Calico)' },
                    { key: 'primary', label: 'Primary (Madder/Indigo)' },
                    { key: 'secondary', label: 'Secondary Tone' },
                    { key: 'accent', label: 'Accent (Ivory Resist)' },
                    { key: 'outline', label: 'Outline (Syahi Iron)' },
                  ].map(({ key, label }) => (
                    <div key={key} className="flex items-center justify-between text-xs font-mono">
                      <span className="text-[#f4eedd]/80">{label}</span>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={config.customColors[key as keyof PatternConfig['customColors']]}
                          onChange={(e) =>
                            handleCustomColorChange(key as keyof PatternConfig['customColors'], e.target.value)
                          }
                          className="w-7 h-7 rounded border border-[#f4eedd]/20 cursor-pointer bg-transparent"
                        />
                        <span className="text-[11px] text-[#f4eedd]/50 uppercase tabular-nums">
                          {config.customColors[key as keyof PatternConfig['customColors']]}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 4: FINISH & TACTILE DETAILS */}
            {activeTab === 'details' && (
              <div className="space-y-5">
                {/* Traditional Hasheeya Border Frame */}
                <div className="p-3.5 rounded-lg bg-[#07131e]/60 border border-[#f4eedd]/10 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-mono font-medium text-[#f4eedd] block">
                        Hasheeya Border Frame
                      </span>
                      <span className="text-[11px] text-[#f4eedd]/60">
                        Multi-band Kangri & Badami border frame
                      </span>
                    </div>
                    <input
                      type="checkbox"
                      checked={config.showBorder}
                      onChange={(e) => updateConfig({ showBorder: e.target.checked })}
                      aria-label="Toggle Hasheeya border frame"
                      className="w-4 h-4 accent-[#8b2628] rounded cursor-pointer"
                    />
                  </div>

                  {config.showBorder && (
                    <div>
                      <div className="flex justify-between items-center text-xs font-mono mb-1">
                        <span className="text-[#f4eedd]/70">Border Thickness</span>
                        <span className="text-[#c98e3b] tabular-nums">{config.borderWidth}px</span>
                      </div>
                      <input
                        type="range"
                        min="20"
                        max="48"
                        step="2"
                        value={config.borderWidth}
                        onChange={(e) => updateConfig({ borderWidth: parseInt(e.target.value) })}
                        aria-label="Border thickness"
                        className="w-full accent-[#8b2628] cursor-pointer"
                      />
                    </div>
                  )}
                </div>

                {/* Woodblock Texture Effect */}
                <div className="p-3.5 rounded-lg bg-[#07131e]/60 border border-[#f4eedd]/10 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-mono font-medium text-[#f4eedd] block">
                      Woodblock Relief Grain
                    </span>
                    <span className="text-[11px] text-[#f4eedd]/60">
                      Tactile hand-pressed wood relief texture
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={config.textureEffect}
                    onChange={(e) => updateConfig({ textureEffect: e.target.checked })}
                    aria-label="Toggle woodblock texture effect"
                    className="w-4 h-4 accent-[#8b2628] rounded cursor-pointer"
                  />
                </div>

                {/* Stroke Width / Block Weight */}
                <div>
                  <div className="flex justify-between items-center text-xs font-mono mb-2">
                    <span className="text-[#f4eedd]/80">Carving Line Weight</span>
                    <span className="text-[#c98e3b] tabular-nums">{config.strokeWidth} px</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="3.5"
                    step="0.5"
                    value={config.strokeWidth}
                    onChange={(e) => updateConfig({ strokeWidth: parseFloat(e.target.value) })}
                    aria-label="Line weight"
                    className="w-full accent-[#8b2628] cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-[#f4eedd]/40 font-mono mt-1">
                    <span>Fine Needle</span>
                    <span>Standard Chisel</span>
                    <span>Heavy Por</span>
                  </div>
                </div>

                {/* Construction Guides */}
                <div className="p-3.5 rounded-lg bg-[#07131e]/60 border border-[#f4eedd]/10 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-mono font-medium text-[#f4eedd] block">
                      Construction Guides
                    </span>
                    <span className="text-[11px] text-[#f4eedd]/60">
                      Display radial and diagonal grid lines
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={config.showGridGuides}
                    onChange={(e) => updateConfig({ showGridGuides: e.target.checked })}
                    aria-label="Toggle geometric construction guides"
                    className="w-4 h-4 accent-[#8b2628] rounded cursor-pointer"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODE 1B: DESIGN WITH AI */}
      {studioMode === 'ai-design' && (
        <AiDesignAssistant
          currentConfig={config}
          onApplyConfig={(newConfig) => {
            onChangeConfig(newConfig);
            showNotification('AI parameter suggestion applied to studio');
          }}
          onSwitchToManualStudio={() => setStudioMode('pattern')}
          onJumpToProductPreview={onJumpToProductPreview}
        />
      )}

      {/* MODE 2: REPEAT UNIT & TILING SEAM INSPECTOR */}
      {studioMode === 'tiling' && (
        <div className="space-y-6">
          <TilingInspector config={config} />
        </div>
      )}

      {/* MODE 3: MATHEMATICAL TRANSFORMATIONS GUIDE */}
      {studioMode === 'math' && (
        <div className="space-y-6">
          <MathExplainer />
        </div>
      )}
    </section>
  );
};
