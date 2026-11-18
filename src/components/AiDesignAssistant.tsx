import React, { useState } from 'react';
import { MockupType, PatternConfig } from '../types/pattern';
import { AiDesignSuggestion } from '../types/ai';
import { requestAiDesign, AiServiceError } from '../services/aiService';
import { PatternCanvas } from './PatternCanvas';
import { COLOR_PALETTES, DEFAULT_PATTERN_CONFIG, MOTIF_STUDIES } from '../data/patternPresets';
import {
  Wand2,
  Send,
  RefreshCw,
  Check,
  RotateCcw,
  Sliders,
  AlertCircle,
  Loader2,
  Sparkles,
  Eye,
  ArrowRight,
  Info,
} from 'lucide-react';

interface AiDesignAssistantProps {
  currentConfig: PatternConfig;
  onApplyConfig: (newConfig: PatternConfig, intendedProduct?: MockupType) => void;
  onSwitchToManualStudio: () => void;
  onJumpToProductPreview?: (product: MockupType) => void;
}

interface ConversationTurn {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  suggestion?: AiDesignSuggestion;
  error?: string;
}

const EXAMPLE_PROMPTS = [
  'I want a subtle geometric design in deep indigo and rust red for a laptop sleeve.',
  'Create an intricate 8-petal floral medallion inspired by classic Phool geometry on warm ivory cotton.',
  'Bold high-contrast stepped diamond pattern rotated 45 degrees for a woven shawl.',
  'Minimalist ochre and charcoal trellis with wide spacing for an exhibition poster.',
];

const PRODUCT_LABELS: Record<MockupType, string> = {
  flat: 'Flat Textile Swatch',
  notebook: 'Artisan Hardcover Book',
  poster: 'Exhibition Gallery Poster',
  shawl: 'Textile Shawl / Stole',
  sleeve: 'Protective Laptop Sleeve',
  tile: 'Architectural Tile Study',
};

export const AiDesignAssistant: React.FC<AiDesignAssistantProps> = ({
  currentConfig,
  onApplyConfig,
  onSwitchToManualStudio,
  onJumpToProductPreview,
}) => {
  const [promptInput, setPromptInput] = useState<string>('');
  const [lastPromptUsed, setLastPromptUsed] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [activeSuggestion, setActiveSuggestion] = useState<AiDesignSuggestion | null>(null);
  const [previousSnapshot, setPreviousSnapshot] = useState<PatternConfig | null>(null);
  const [appliedMessage, setAppliedMessage] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [history, setHistory] = useState<ConversationTurn[]>([]);

  const submitDesignRequest = async (promptText: string, variationMode = false) => {
    const cleaned = promptText.trim();
    if (!cleaned || isLoading) return;

    setErrorMsg(null);
    setAppliedMessage(null);
    setIsLoading(true);
    setLastPromptUsed(cleaned);

    const userTurnId = `u-${Date.now()}`;
    setHistory((prev) => [
      ...prev,
      {
        id: userTurnId,
        role: 'user',
        text: variationMode ? `Generate another variation for: "${cleaned}"` : cleaned,
      },
    ]);

    try {
      const suggestion = await requestAiDesign({
        prompt: cleaned,
        variationMode,
        currentConfig: activeSuggestion ? activeSuggestion.config : currentConfig,
      });

      setActiveSuggestion(suggestion);
      setHistory((prev) => [
        ...prev,
        {
          id: `a-${Date.now()}`,
          role: 'assistant',
          text: suggestion.rationale,
          suggestion,
        },
      ]);
      if (!variationMode) {
        setPromptInput('');
      }
    } catch (err) {
      const msg =
        err instanceof AiServiceError
          ? err.message
          : 'Unable to generate a design suggestion right now. All manual controls remain ready to use.';
      setErrorMsg(msg);
      setHistory((prev) => [
        ...prev,
        {
          id: `e-${Date.now()}`,
          role: 'assistant',
          text: msg,
          error: msg,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitDesignRequest(promptInput, false);
  };

  const handleApplySuggestion = () => {
    if (!activeSuggestion) return;
    setPreviousSnapshot({ ...currentConfig });
    onApplyConfig(activeSuggestion.config, activeSuggestion.intendedProduct);
    setAppliedMessage(
      `Applied "${activeSuggestion.designTitle}" to your Pattern Studio. You can now refine any parameter manually or preview it in context.`
    );
  };

  const handleRestorePrevious = () => {
    if (previousSnapshot) {
      onApplyConfig(previousSnapshot);
      setPreviousSnapshot(null);
      setAppliedMessage('Restored your previous studio pattern before the AI suggestion was applied.');
    } else {
      onApplyConfig({ ...DEFAULT_PATTERN_CONFIG });
      setAppliedMessage('Reset studio pattern to the classic Ajrak baseline.');
    }
  };

  const handleClearPreview = () => {
    setActiveSuggestion(null);
    setAppliedMessage(null);
    setErrorMsg(null);
  };

  const motifLabel = (id: string) =>
    MOTIF_STUDIES.find((m) => m.id === id)?.title || id;

  const paletteLabel = (id: string) =>
    COLOR_PALETTES.find((p) => p.id === id)?.name || 'Custom Harmonized Palette';

  return (
    <div className="bg-[#0a1827] rounded-xl p-6 sm:p-8 border border-[#f4eedd]/20 shadow-2xl space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#f4eedd]/15">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#c98e3b] mb-1">
            <Wand2 className="w-4 h-4" />
            <span>Design with AI</span>
            <span aria-hidden="true">·</span>
            <span>Parametric Intent Interpreter</span>
          </div>
          <h3 className="font-serif text-2xl sm:text-3xl text-[#f4eedd]">
            Conversational Pattern Studio Assistant
          </h3>
          <p className="text-xs sm:text-sm text-[#f4eedd]/70 mt-1 max-w-2xl font-sans leading-relaxed">
            Describe a visual mood, color story, symmetry, or physical product. Gemini translates your intent into
            verified parametric settings for Ajrak Lab&apos;s vector engine—always previewed first, never overwriting
            your work without consent.
          </p>
        </div>

        <button
          onClick={handleRestorePrevious}
          className="px-3.5 py-2 rounded-lg border border-[#f4eedd]/20 bg-[#07131e] hover:bg-[#0c1f33] text-[#f4eedd]/80 hover:text-[#f4eedd] text-xs font-mono flex items-center gap-2 self-start md:self-auto shrink-0"
          title="Restore previous design or reset to baseline"
        >
          <RotateCcw className="w-3.5 h-3.5 text-[#c98e3b]" />
          <span>{previousSnapshot ? 'Undo Last Apply' : 'Reset Canvas'}</span>
        </button>
      </div>

      {/* Main Two-Column Conversational Studio + Live Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Conversational Prompt & Dialogue */}
        <div className="lg:col-span-6 space-y-5">
          {/* Example Prompts */}
          <div className="space-y-2">
            <span className="text-[11px] font-mono uppercase tracking-wider text-[#c98e3b] block">
              Try a Starting Prompt
            </span>
            <div className="flex flex-wrap gap-2">
              {EXAMPLE_PROMPTS.map((sample, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setPromptInput(sample)}
                  className="text-left text-[11px] font-sans px-3 py-1.5 rounded-lg bg-[#07131e] border border-[#f4eedd]/15 text-[#f4eedd]/75 hover:text-[#f4eedd] hover:border-[#c98e3b]/60 transition-colors"
                >
                  &ldquo;{sample}&rdquo;
                </button>
              ))}
            </div>
          </div>

          {/* Conversation History */}
          <div className="bg-[#07131e] rounded-xl border border-[#f4eedd]/15 p-4 space-y-3 min-h-[220px] max-h-[340px] overflow-y-auto">
            {history.length === 0 ? (
              <div className="h-full min-h-[180px] flex flex-col items-center justify-center text-center px-4 space-y-2 text-[#f4eedd]/50">
                <Sparkles className="w-6 h-6 text-[#c98e3b]/70" />
                <p className="font-serif text-base text-[#f4eedd]/80">
                  Describe your pattern idea below
                </p>
                <p className="text-xs font-sans max-w-sm leading-relaxed">
                  Mention motif feel (star trellis, floral rosette, stepped diamond), colors (deep indigo, rust red, warm
                  ivory), density, or intended product (laptop sleeve, shawl, notebook).
                </p>
              </div>
            ) : (
              history.map((turn) => (
                <div
                  key={turn.id}
                  className={`p-3 rounded-lg text-xs font-sans leading-relaxed ${
                    turn.role === 'user'
                      ? 'bg-[#8b2628]/25 border border-[#8b2628]/40 text-[#f4eedd] ml-6'
                      : turn.error
                      ? 'bg-red-950/40 border border-red-500/40 text-red-200 mr-6'
                      : 'bg-[#0a1827] border border-[#f4eedd]/15 text-[#f4eedd]/85 mr-6 space-y-1.5'
                  }`}
                >
                  <div className="text-[10px] font-mono uppercase tracking-wider text-[#c98e3b]">
                    {turn.role === 'user'
                      ? 'Your Design Brief'
                      : turn.error
                      ? 'Assistant Notice'
                      : turn.suggestion?.designTitle || 'Studio Proposal'}
                  </div>
                  <p>{turn.text}</p>
                  {turn.suggestion?.culturalNote && (
                    <p className="text-[11px] text-[#f4eedd]/60 italic border-t border-[#f4eedd]/10 pt-1.5">
                      {turn.suggestion.culturalNote}
                    </p>
                  )}
                </div>
              ))
            )}

            {isLoading && (
              <div className="p-3 rounded-lg bg-[#0a1827] border border-[#c98e3b]/30 text-xs font-mono text-[#c98e3b] flex items-center gap-2.5 mr-6">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Interpreting geometric parameters & pigment harmony...</span>
              </div>
            )}
          </div>

          {/* Prompt Input Form */}
          <form onSubmit={handleFormSubmit} className="space-y-3">
            <label htmlFor="ai-design-prompt" className="sr-only">
              Describe your geometric pattern
            </label>
            <textarea
              id="ai-design-prompt"
              rows={3}
              maxLength={600}
              value={promptInput}
              onChange={(e) => setPromptInput(e.target.value)}
              placeholder="e.g., I want a subtle geometric design in deep indigo and rust red for a laptop sleeve..."
              className="w-full rounded-xl bg-[#07131e] border border-[#f4eedd]/25 focus:border-[#c98e3b] focus:outline-none p-3.5 text-sm text-[#f4eedd] placeholder:text-[#f4eedd]/35 font-sans resize-none"
            />
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-[10px] font-mono text-[#f4eedd]/45">
                {promptInput.length}/600 chars · Output mapped to verified SVG primitives
              </span>
              <div className="flex items-center gap-2">
                {lastPromptUsed && (
                  <button
                    type="button"
                    disabled={isLoading}
                    onClick={() => submitDesignRequest(lastPromptUsed, true)}
                    className="px-3.5 py-2 rounded-lg border border-[#c98e3b]/60 bg-[#07131e] hover:bg-[#0c1f33] text-[#c98e3b] text-xs font-mono flex items-center gap-1.5 disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
                    <span>Ask for Variation</span>
                  </button>
                )}
                <button
                  type="submit"
                  disabled={isLoading || promptInput.trim().length < 3}
                  className="px-4 py-2 rounded-lg bg-[#8b2628] hover:bg-[#a32f31] text-[#f4eedd] text-xs font-mono font-semibold flex items-center gap-2 disabled:opacity-50 border border-[#f4eedd]/20 shadow-md"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Composing...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Generate Preview</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>

          {errorMsg && (
            <div className="p-3.5 rounded-lg bg-red-950/40 border border-red-500/40 text-xs text-red-200 flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {appliedMessage && (
            <div className="p-3.5 rounded-lg bg-emerald-950/40 border border-emerald-500/40 text-xs text-emerald-200 flex items-start justify-between gap-3">
              <div className="flex items-start gap-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>{appliedMessage}</span>
              </div>
              <button
                onClick={onSwitchToManualStudio}
                className="text-[11px] font-mono text-emerald-300 underline whitespace-nowrap shrink-0"
              >
                Edit Manually →
              </button>
            </div>
          )}
        </div>

        {/* Right: Non-Destructive Side-by-Side Preview & Apply Controls */}
        <div className="lg:col-span-6 bg-[#07131e] rounded-xl border border-[#f4eedd]/15 p-5 sm:p-6 space-y-5">
          <div className="flex items-center justify-between border-b border-[#f4eedd]/10 pb-3">
            <div className="flex items-center gap-2 text-xs font-mono text-[#c98e3b] uppercase tracking-wider">
              <Eye className="w-4 h-4" />
              <span>{activeSuggestion ? 'Suggested Design Preview' : 'Current Active Canvas'}</span>
            </div>
            {activeSuggestion && (
              <span className="px-2 py-0.5 rounded bg-[#8b2628]/30 border border-[#8b2628]/50 text-[10px] font-mono text-[#f4eedd]">
                Preview Only · Not Applied Yet
              </span>
            )}
          </div>

          {/* Live SVG Engine Preview */}
          <div className="w-full aspect-square max-w-[360px] mx-auto rounded-lg overflow-hidden border border-[#f4eedd]/20 shadow-inner bg-[#0a1827] p-2">
            <PatternCanvas
              id="ai-preview-pattern-svg"
              config={activeSuggestion ? activeSuggestion.config : currentConfig}
            />
          </div>

          {/* Structured Parameter Readout */}
          {activeSuggestion ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-[11px] font-mono">
                <div className="p-2.5 rounded bg-[#0a1827] border border-[#f4eedd]/10">
                  <span className="text-[#c98e3b] block text-[9px] uppercase">Motif Study</span>
                  <span className="text-[#f4eedd] truncate block">
                    {motifLabel(activeSuggestion.config.motifId).replace(/^Study \d+: /, '')}
                  </span>
                </div>
                <div className="p-2.5 rounded bg-[#0a1827] border border-[#f4eedd]/10">
                  <span className="text-[#c98e3b] block text-[9px] uppercase">Palette</span>
                  <span className="text-[#f4eedd] truncate block">
                    {paletteLabel(activeSuggestion.config.paletteId)}
                  </span>
                </div>
                <div className="p-2.5 rounded bg-[#0a1827] border border-[#f4eedd]/10">
                  <span className="text-[#c98e3b] block text-[9px] uppercase">Intended Product</span>
                  <span className="text-[#f4eedd] truncate block">
                    {PRODUCT_LABELS[activeSuggestion.intendedProduct]}
                  </span>
                </div>
                <div className="p-2.5 rounded bg-[#0a1827] border border-[#f4eedd]/10">
                  <span className="text-[#c98e3b] block text-[9px] uppercase">Repeat Grid</span>
                  <span className="text-[#f4eedd]">
                    {activeSuggestion.config.gridLayout} · {activeSuggestion.config.gridDensity}×
                    {activeSuggestion.config.gridDensity}
                  </span>
                </div>
                <div className="p-2.5 rounded bg-[#0a1827] border border-[#f4eedd]/10">
                  <span className="text-[#c98e3b] block text-[9px] uppercase">Scale & Rotation</span>
                  <span className="text-[#f4eedd]">
                    {activeSuggestion.config.motifScale.toFixed(2)}x · {activeSuggestion.config.rotation}°
                  </span>
                </div>
                <div className="p-2.5 rounded bg-[#0a1827] border border-[#f4eedd]/10">
                  <span className="text-[#c98e3b] block text-[9px] uppercase">Spacing & Border</span>
                  <span className="text-[#f4eedd]">
                    {activeSuggestion.config.spacing}px ·{' '}
                    {activeSuggestion.config.showBorder
                      ? `${activeSuggestion.config.borderWidth}px frame`
                      : 'Borderless'}
                  </span>
                </div>
              </div>

              {/* Color Swatches */}
              <div className="flex items-center justify-between px-3 py-2 rounded bg-[#0a1827] border border-[#f4eedd]/10 text-[11px] font-mono">
                <span className="text-[#f4eedd]/70">Suggested Pigments</span>
                <div className="flex items-center gap-1.5">
                  {Object.entries(activeSuggestion.config.customColors).map(([role, hex]) => (
                    <span
                      key={role}
                      title={`${role}: ${hex}`}
                      className="w-5 h-5 rounded-full border border-[#f4eedd]/30"
                      style={{ backgroundColor: hex }}
                    />
                  ))}
                </div>
              </div>

              {/* Action Buttons: Apply, Variation, Edit Manually, Product Preview, Discard */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <button
                  onClick={handleApplySuggestion}
                  className="flex-1 min-w-[150px] px-4 py-2.5 rounded-lg bg-[#8b2628] hover:bg-[#a32f31] text-[#f4eedd] text-xs font-mono font-semibold flex items-center justify-center gap-2 border border-[#f4eedd]/20 shadow-md"
                >
                  <Check className="w-4 h-4 text-[#c98e3b]" />
                  <span>Apply to Studio</span>
                </button>

                <button
                  onClick={() => submitDesignRequest(lastPromptUsed || promptInput, true)}
                  disabled={isLoading || !lastPromptUsed}
                  className="px-3.5 py-2.5 rounded-lg border border-[#c98e3b]/60 bg-[#0a1827] hover:bg-[#0c1f33] text-[#c98e3b] text-xs font-mono flex items-center gap-1.5 disabled:opacity-50"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Variation</span>
                </button>

                <button
                  onClick={() => {
                    handleApplySuggestion();
                    onSwitchToManualStudio();
                  }}
                  className="px-3.5 py-2.5 rounded-lg border border-[#f4eedd]/20 bg-[#0a1827] hover:bg-[#0c1f33] text-[#f4eedd] text-xs font-mono flex items-center gap-1.5"
                >
                  <Sliders className="w-3.5 h-3.5 text-[#c98e3b]" />
                  <span>Apply & Edit Manually</span>
                </button>

                {onJumpToProductPreview && (
                  <button
                    onClick={() => {
                      handleApplySuggestion();
                      onJumpToProductPreview(activeSuggestion.intendedProduct);
                    }}
                    className="px-3.5 py-2.5 rounded-lg border border-[#f4eedd]/20 bg-[#0a1827] hover:bg-[#0c1f33] text-[#f4eedd]/85 text-xs font-mono flex items-center gap-1.5"
                  >
                    <span>Preview on {activeSuggestion.intendedProduct}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#c98e3b]" />
                  </button>
                )}

                <button
                  onClick={handleClearPreview}
                  className="px-3 py-2.5 rounded-lg text-[#f4eedd]/50 hover:text-[#f4eedd] text-xs font-mono"
                >
                  Discard
                </button>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-lg bg-[#0a1827] border border-[#f4eedd]/10 text-xs text-[#f4eedd]/70 flex items-start gap-2.5 font-sans">
              <Info className="w-4 h-4 text-[#c98e3b] shrink-0 mt-0.5" />
              <span>
                Your current studio pattern remains untouched until you generate a proposal and explicitly choose{' '}
                <strong>Apply to Studio</strong>.
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
