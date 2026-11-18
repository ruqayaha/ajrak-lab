import React, { useState } from 'react';
import { MockupType, PatternConfig } from '../types/pattern';
import { AiProductPack } from '../types/ai';
import { requestAiProductPack, AiServiceError } from '../services/aiService';
import {
  Sparkles,
  Loader2,
  AlertCircle,
  Copy,
  Check,
  Package,
  Share2,
  Palette,
  Tag,
  RotateCcw,
  Layers,
} from 'lucide-react';

interface AiProductAssistantProps {
  config: PatternConfig;
  activeMockup: MockupType;
  onApplyColorVariation?: (colors: PatternConfig['customColors']) => void;
}

export const AiProductAssistant: React.FC<AiProductAssistantProps> = ({
  config,
  activeMockup,
  onApplyColorVariation,
}) => {
  const [audienceGoal, setAudienceGoal] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [pack, setPack] = useState<AiProductPack | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [previousColors, setPreviousColors] = useState<PatternConfig['customColors'] | null>(null);

  const handleGenerate = async () => {
    if (isLoading) return;
    setErrorMsg(null);
    setIsLoading(true);

    try {
      const result = await requestAiProductPack({
        config,
        activeMockup,
        audienceGoal,
      });
      setPack(result);
    } catch (err) {
      const msg =
        err instanceof AiServiceError
          ? err.message
          : 'Unable to generate product ideas right now. All product mockups remain fully usable.';
      setErrorMsg(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (key: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2400);
  };

  const handlePreviewColors = (colors: PatternConfig['customColors']) => {
    if (!onApplyColorVariation) return;
    if (!previousColors) {
      setPreviousColors({ ...config.customColors });
    }
    onApplyColorVariation(colors);
  };

  const handleRestoreColors = () => {
    if (!previousColors || !onApplyColorVariation) return;
    onApplyColorVariation(previousColors);
    setPreviousColors(null);
  };

  return (
    <div className="mt-10 bg-[#0a1827] rounded-xl p-6 sm:p-8 border border-[#f4eedd]/20 shadow-2xl space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-[#f4eedd]/15">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#c98e3b] mb-1">
            <Sparkles className="w-4 h-4" />
            <span>AI Product Assistant</span>
            <span aria-hidden="true">·</span>
            <span>Applied Design &amp; Curatorial Copy</span>
          </div>
          <h3 className="font-serif text-2xl sm:text-3xl text-[#f4eedd]">
            Develop Concepts &amp; Colorways for Your Pattern
          </h3>
          <p className="text-xs sm:text-sm text-[#f4eedd]/70 mt-1 max-w-2xl font-sans leading-relaxed">
            Generate product concepts, names, editorial descriptions, sustainable packaging notes, social captions, and
            colorway variations tailored to your current geometric composition—transparently framed as contemporary
            digital studies inspired by Sindhi heritage.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          {previousColors && onApplyColorVariation && (
            <button
              onClick={handleRestoreColors}
              className="px-3.5 py-2 rounded-lg border border-[#f4eedd]/20 bg-[#07131e] hover:bg-[#0c1f33] text-[#f4eedd]/80 text-xs font-mono flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5 text-[#c98e3b]" />
              <span>Restore Original Palette</span>
            </button>
          )}
          <button
            onClick={handleGenerate}
            disabled={isLoading}
            className="px-4 py-2.5 rounded-lg bg-[#8b2628] hover:bg-[#a32f31] text-[#f4eedd] text-xs font-mono font-semibold flex items-center gap-2 disabled:opacity-50 border border-[#f4eedd]/20 shadow-md"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Drafting Product Studio Brief...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-[#c98e3b]" />
                <span>{pack ? 'Regenerate Ideas' : 'Suggest Product Ideas'}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Optional Audience / Context Focus Input */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
        <label htmlFor="product-audience-goal" className="text-xs font-mono text-[#c98e3b] shrink-0">
          Context / Focus (optional):
        </label>
        <input
          id="product-audience-goal"
          type="text"
          maxLength={200}
          value={audienceGoal}
          onChange={(e) => setAudienceGoal(e.target.value)}
          placeholder="e.g., University design exhibition merch, eco-friendly stationery line, or museum gift shop..."
          className="flex-1 rounded-lg bg-[#07131e] border border-[#f4eedd]/20 focus:border-[#c98e3b] focus:outline-none px-3.5 py-2 text-xs text-[#f4eedd] placeholder:text-[#f4eedd]/35 font-sans"
        />
      </div>

      {errorMsg && (
        <div className="p-3.5 rounded-lg bg-red-950/40 border border-red-500/40 text-xs text-red-200 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
          <span>{errorMsg}</span>
        </div>
      )}

      {!pack && !isLoading && (
        <div className="p-6 rounded-xl bg-[#07131e] border border-[#f4eedd]/15 text-center space-y-2">
          <p className="font-serif text-base text-[#f4eedd]/85">
            Ready to translate your active {config.motifId.replace('-', ' ')} pattern into product concepts.
          </p>
          <p className="text-xs text-[#f4eedd]/60 font-sans max-w-xl mx-auto">
            Click <strong>Suggest Product Ideas</strong> above to receive product names, tactile material pairings,
            packaging inserts honoring Sindhi makers, captions, and testable palette variations.
          </p>
        </div>
      )}

      {pack && (
        <div className="space-y-6">
          {/* Row 1: Product Names + Design Description */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-5 bg-[#07131e] rounded-xl p-5 border border-[#f4eedd]/15 space-y-3">
              <div className="flex items-center gap-2 text-xs font-mono uppercase text-[#c98e3b]">
                <Tag className="w-3.5 h-3.5" />
                <span>Suggested Product Names</span>
              </div>
              <ul className="space-y-2">
                {pack.productNames.map((name, idx) => (
                  <li
                    key={idx}
                    className="p-2.5 rounded bg-[#0a1827] border border-[#f4eedd]/10 font-serif text-sm text-[#f4eedd] flex items-center justify-between gap-2"
                  >
                    <span>{name}</span>
                    <button
                      onClick={() => handleCopy(`name-${idx}`, name)}
                      className="text-[#f4eedd]/50 hover:text-[#c98e3b] transition-colors shrink-0"
                      title="Copy product name"
                    >
                      {copiedKey === `name-${idx}` ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="lg:col-span-7 bg-[#07131e] rounded-xl p-5 border border-[#f4eedd]/15 space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono uppercase text-[#c98e3b]">Design Description</span>
                  <button
                    onClick={() => handleCopy('desc', pack.designDescription)}
                    className="text-[11px] font-mono text-[#f4eedd]/60 hover:text-[#f4eedd] flex items-center gap-1"
                  >
                    {copiedKey === 'desc' ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span className="text-emerald-400">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
                <p className="text-xs sm:text-sm text-[#f4eedd]/85 leading-relaxed font-sans">
                  {pack.designDescription}
                </p>
              </div>
              <div className="pt-3 border-t border-[#f4eedd]/10 text-[11px] font-mono text-[#c98e3b]">
                Concept Showcase Only · No commerce or checkout simulation
              </div>
            </div>
          </div>

          {/* Row 2: Product Concepts */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-mono uppercase text-[#c98e3b]">
              <Layers className="w-3.5 h-3.5" />
              <span>Tailored Product Concepts</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {pack.productConcepts.map((concept, idx) => (
                <div
                  key={idx}
                  className="bg-[#07131e] rounded-lg p-4 border border-[#f4eedd]/15 space-y-2 flex flex-col justify-between"
                >
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-mono uppercase text-[#c98e3b] block">
                      {concept.format}
                    </span>
                    <h4 className="font-serif text-base text-[#f4eedd] font-bold">{concept.title}</h4>
                    <p className="text-xs text-[#f4eedd]/75 leading-relaxed font-sans">{concept.materialNote}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Row 3: Packaging Concept + Social Media Caption */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[#07131e] rounded-xl p-5 border border-[#f4eedd]/15 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase text-[#c98e3b] flex items-center gap-1.5">
                  <Package className="w-3.5 h-3.5" />
                  <span>Packaging Concept</span>
                </span>
                <button
                  onClick={() => handleCopy('pkg', pack.packagingConcept)}
                  className="text-[11px] font-mono text-[#f4eedd]/60 hover:text-[#f4eedd] flex items-center gap-1"
                >
                  {copiedKey === 'pkg' ? (
                    <Check className="w-3 h-3 text-emerald-400" />
                  ) : (
                    <Copy className="w-3 h-3" />
                  )}
                </button>
              </div>
              <p className="text-xs text-[#f4eedd]/80 leading-relaxed font-sans">{pack.packagingConcept}</p>
            </div>

            <div className="bg-[#07131e] rounded-xl p-5 border border-[#f4eedd]/15 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase text-[#c98e3b] flex items-center gap-1.5">
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Social Media Caption</span>
                </span>
                <button
                  onClick={() => handleCopy('social', pack.socialMediaCaption)}
                  className="text-[11px] font-mono text-[#f4eedd]/60 hover:text-[#f4eedd] flex items-center gap-1"
                >
                  {copiedKey === 'social' ? (
                    <Check className="w-3 h-3 text-emerald-400" />
                  ) : (
                    <Copy className="w-3 h-3" />
                  )}
                </button>
              </div>
              <p className="text-xs text-[#f4eedd]/80 leading-relaxed font-sans">{pack.socialMediaCaption}</p>
            </div>
          </div>

          {/* Row 4: Color Variations with Live Mockup Preview */}
          {pack.colorVariations.length > 0 && (
            <div className="space-y-3 pt-2 border-t border-[#f4eedd]/15">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase text-[#c98e3b] flex items-center gap-1.5">
                  <Palette className="w-3.5 h-3.5" />
                  <span>Suggested Colorway Variations</span>
                </span>
                <span className="text-[11px] font-mono text-[#f4eedd]/50">
                  Preview directly on mockup above
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {pack.colorVariations.map((variant, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-lg bg-[#07131e] border border-[#f4eedd]/15 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1.5">
                      <div className="font-serif text-sm font-bold text-[#f4eedd]">{variant.name}</div>
                      <p className="text-[11px] text-[#f4eedd]/70 font-sans leading-relaxed">{variant.rationale}</p>
                      <div className="flex items-center gap-1.5 pt-1">
                        {Object.values(variant.colors).map((hex, cIdx) => (
                          <span
                            key={cIdx}
                            title={hex}
                            className="w-5 h-5 rounded-full border border-[#f4eedd]/25"
                            style={{ backgroundColor: hex }}
                          />
                        ))}
                      </div>
                    </div>
                    {onApplyColorVariation && (
                      <button
                        onClick={() => handlePreviewColors(variant.colors)}
                        className="px-3 py-1.5 rounded-lg border border-[#c98e3b]/60 bg-[#0a1827] hover:bg-[#0c1f33] text-[#c98e3b] text-xs font-mono whitespace-nowrap shrink-0"
                      >
                        Apply Palette
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
