import React, { useRef, useState } from 'react';
import { MotifId } from '../types/pattern';
import { AiTextileAnalysis } from '../types/ai';
import { requestAiTextileAnalysis, AiServiceError } from '../services/aiService';
import {
  Camera,
  Upload,
  Loader2,
  AlertCircle,
  ShieldAlert,
  Eye,
  Shapes,
  Grid,
  Compass,
  ArrowRight,
  X,
} from 'lucide-react';

interface AiTextileExplorerProps {
  onExploreComparableMotif?: (motifId: MotifId) => void;
}

const MAX_FILE_BYTES = 5 * 1024 * 1024;
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export const AiTextileExplorer: React.FC<AiTextileExplorerProps> = ({
  onExploreComparableMotif,
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState<string>('');
  const [fileName, setFileName] = useState<string>('');
  const [userNote, setUserNote] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [analysis, setAnalysis] = useState<AiTextileAnalysis | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleFileSelected = (file: File | undefined) => {
    if (!file) return;
    setErrorMsg(null);
    setAnalysis(null);

    if (!ALLOWED_TYPES.includes(file.type)) {
      setErrorMsg('Please select a JPEG, PNG, or WebP photograph.');
      return;
    }

    if (file.size > MAX_FILE_BYTES) {
      setErrorMsg('Image exceeds 5 MB. Please upload a smaller photograph.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = typeof reader.result === 'string' ? reader.result : '';
      const commaIdx = dataUrl.indexOf(',');
      if (commaIdx === -1) {
        setErrorMsg('Could not read the selected image file.');
        return;
      }
      setPreviewUrl(dataUrl);
      setImageBase64(dataUrl.slice(commaIdx + 1));
      setMimeType(file.type);
      setFileName(file.name);
    };
    reader.onerror = () => {
      setErrorMsg('Failed to read image file from your device.');
    };
    reader.readAsDataURL(file);
  };

  const handleAnalyze = async () => {
    if (!imageBase64 || !mimeType || isLoading) return;
    setErrorMsg(null);
    setIsLoading(true);

    try {
      const result = await requestAiTextileAnalysis({
        imageBase64,
        mimeType,
        note: userNote,
      });
      setAnalysis(result);
    } catch (err) {
      const msg =
        err instanceof AiServiceError
          ? err.message
          : 'Unable to analyze this textile photograph right now.';
      setErrorMsg(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setPreviewUrl(null);
    setImageBase64(null);
    setMimeType('');
    setFileName('');
    setUserNote('');
    setAnalysis(null);
    setErrorMsg(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div
      id="textile-explorer"
      className="bg-[#0a1827] rounded-xl p-6 sm:p-8 border border-[#f4eedd]/20 shadow-2xl space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-[#f4eedd]/15">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#c98e3b] mb-1">
            <Camera className="w-4 h-4" />
            <span>AI Textile Explorer</span>
            <span aria-hidden="true">·</span>
            <span>Visual Geometry Observation</span>
          </div>
          <h3 className="font-serif text-2xl sm:text-3xl text-[#f4eedd]">
            Analyze Visible Pattern & Repeat Structure
          </h3>
          <p className="text-xs sm:text-sm text-[#f4eedd]/70 mt-1 max-w-2xl font-sans leading-relaxed">
            Upload a photograph of a textile sample to inspect observable colors, geometric shapes, border structure,
            and repeating symmetry—explicitly separated from provenance or authentication claims.
          </p>
        </div>

        {previewUrl && (
          <button
            onClick={handleClear}
            className="px-3 py-1.5 rounded-lg border border-[#f4eedd]/20 bg-[#07131e] hover:bg-[#0c1f33] text-[#f4eedd]/75 text-xs font-mono flex items-center gap-1.5 self-start md:self-auto shrink-0"
          >
            <X className="w-3.5 h-3.5 text-[#c98e3b]" />
            <span>Clear Sample</span>
          </button>
        )}
      </div>

      {/* Epistemic Disclaimer Banner */}
      <div className="p-3.5 rounded-lg bg-amber-950/25 border border-amber-600/30 text-xs font-sans text-amber-100/90 flex items-start gap-2.5">
        <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
        <span>
          <strong>Visual Observation Only:</strong> Photographic analysis describes visible geometry and surface traits.
          It <strong>cannot</strong> authenticate whether a cloth is genuine traditional Ajrak, determine its age or
          maker, or verify natural vs. synthetic dye chemistry from an image alone.
        </span>
      </div>

      {/* Main Two-Column Upload + Observation Plate */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Upload Zone & Controls */}
        <div className="lg:col-span-5 space-y-4">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={(e) => handleFileSelected(e.target.files?.[0])}
            className="hidden"
            id="textile-sample-upload"
          />

          {!previewUrl ? (
            <label
              htmlFor="textile-sample-upload"
              className="w-full aspect-[4/3] rounded-xl border-2 border-dashed border-[#f4eedd]/25 hover:border-[#c98e3b] bg-[#07131e] flex flex-col items-center justify-center p-6 text-center cursor-pointer transition-colors space-y-3"
            >
              <div className="w-12 h-12 rounded-full bg-[#0a1827] border border-[#c98e3b]/40 flex items-center justify-center">
                <Upload className="w-5 h-5 text-[#c98e3b]" />
              </div>
              <div className="space-y-1">
                <span className="font-serif text-lg text-[#f4eedd] block">
                  Upload Textile Sample Photo
                </span>
                <span className="text-xs font-mono text-[#f4eedd]/55 block">
                  JPEG, PNG, or WebP · Max 5 MB
                </span>
              </div>
            </label>
          ) : (
            <div className="space-y-3">
              <div className="w-full aspect-[4/3] rounded-xl overflow-hidden border border-[#f4eedd]/20 bg-[#07131e] relative flex items-center justify-center">
                <img
                  src={previewUrl}
                  alt="Uploaded textile sample preview"
                  className="w-full h-full object-contain"
                />
                <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-[#07131e]/90 border border-[#f4eedd]/15 text-[10px] font-mono text-[#f4eedd]/80 max-w-[90%] truncate">
                  {fileName}
                </span>
              </div>

              <label
                htmlFor="textile-sample-upload"
                className="inline-flex items-center gap-1.5 text-xs font-mono text-[#c98e3b] hover:underline cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Choose a different photograph</span>
              </label>
            </div>
          )}

          {/* Optional Note + Analyze Trigger */}
          <div className="space-y-3">
            <input
              type="text"
              maxLength={300}
              value={userNote}
              onChange={(e) => setUserNote(e.target.value)}
              placeholder="Optional note (e.g., focus on the border geometry)..."
              className="w-full rounded-lg bg-[#07131e] border border-[#f4eedd]/20 focus:border-[#c98e3b] focus:outline-none px-3.5 py-2 text-xs text-[#f4eedd] placeholder:text-[#f4eedd]/35 font-sans"
            />

            <button
              type="button"
              disabled={!imageBase64 || isLoading}
              onClick={handleAnalyze}
              className="w-full px-4 py-2.5 rounded-lg bg-[#8b2628] hover:bg-[#a32f31] text-[#f4eedd] text-xs font-mono font-semibold flex items-center justify-center gap-2 disabled:opacity-50 border border-[#f4eedd]/20 shadow-md"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Inspecting Visual Geometry...</span>
                </>
              ) : (
                <>
                  <Eye className="w-4 h-4 text-[#c98e3b]" />
                  <span>Observe Visual Features</span>
                </>
              )}
            </button>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-lg bg-red-950/40 border border-red-500/40 text-xs text-red-200 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}
        </div>

        {/* Right: Structured Visual Observations vs Verification Caveats */}
        <div className="lg:col-span-7 bg-[#07131e] rounded-xl border border-[#f4eedd]/15 p-5 sm:p-6 min-h-[340px]">
          {!analysis ? (
            <div className="h-full min-h-[290px] flex flex-col items-center justify-center text-center px-6 space-y-3 text-[#f4eedd]/55">
              <Shapes className="w-7 h-7 text-[#c98e3b]/60" />
              <div className="font-serif text-lg text-[#f4eedd]/80">
                Visual Geometry Report Appears Here
              </div>
              <p className="text-xs font-sans max-w-md leading-relaxed">
                Upload a textile photograph and click <strong>Observe Visual Features</strong>. Gemini will separate
                directly observable colors, shapes, borders, and mathematical tiling from attributes that require
                physical verification.
              </p>
            </div>
          ) : (
            <div className="space-y-5">
              {!analysis.isTextileImage && (
                <div className="p-3 rounded-lg bg-amber-950/35 border border-amber-500/40 text-xs text-amber-200 font-sans">
                  Note: The uploaded image may not clearly depict a textile or patterned cloth. Observations below
                  reflect general visible shapes in the frame.
                </div>
              )}

              {/* Section 1: Observable Visual Descriptions */}
              <div className="space-y-3">
                <div className="text-xs font-mono uppercase tracking-wider text-emerald-300 flex items-center gap-2">
                  <Eye className="w-3.5 h-3.5" />
                  <span>Observable Visual Features (From Photograph)</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded bg-[#0a1827] border border-[#f4eedd]/10 space-y-1.5">
                    <span className="font-mono text-[10px] uppercase text-[#c98e3b] block">Visible Colors</span>
                    <div className="flex flex-wrap gap-1.5">
                      {analysis.colorsObserved.map((c, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded bg-[#07131e] border border-[#f4eedd]/15 text-[11px] text-[#f4eedd]/85"
                        >
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="p-3 rounded bg-[#0a1827] border border-[#f4eedd]/10 space-y-1.5">
                    <span className="font-mono text-[10px] uppercase text-[#c98e3b] block">Geometric Shapes</span>
                    <div className="flex flex-wrap gap-1.5">
                      {analysis.geometricShapes.map((s, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded bg-[#07131e] border border-[#f4eedd]/15 text-[11px] text-[#f4eedd]/85"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-sans">
                  <div className="p-3 rounded bg-[#0a1827] border border-[#f4eedd]/10 space-y-1">
                    <span className="font-mono text-[10px] uppercase text-[#c98e3b] block">Borders</span>
                    <p className="text-[#f4eedd]/80 leading-relaxed">{analysis.borderStructure}</p>
                  </div>
                  <div className="p-3 rounded bg-[#0a1827] border border-[#f4eedd]/10 space-y-1">
                    <span className="font-mono text-[10px] uppercase text-[#c98e3b] block">
                      Repeat Arrangement
                    </span>
                    <p className="text-[#f4eedd]/80 leading-relaxed">{analysis.repeatArrangement}</p>
                  </div>
                </div>

                <div className="p-3 rounded bg-[#0a1827] border border-[#f4eedd]/10 text-xs font-sans space-y-1">
                  <span className="font-mono text-[10px] uppercase text-[#c98e3b] block">
                    Visible Surface & Printing Characteristics
                  </span>
                  <p className="text-[#f4eedd]/80 leading-relaxed">{analysis.printingCharacteristics}</p>
                </div>
              </div>

              {/* Section 2: Observable Geometry Explanation */}
              <div className="p-4 rounded-lg bg-[#0a1827] border border-[#c98e3b]/30 text-xs font-sans space-y-1.5">
                <div className="font-mono text-[10px] uppercase text-[#c98e3b] flex items-center gap-1.5 font-semibold">
                  <Compass className="w-3.5 h-3.5" />
                  <span>Observable Geometry Explanation</span>
                </div>
                <p className="text-[#f4eedd]/85 leading-relaxed">{analysis.geometricExplanation}</p>
              </div>

              {/* Section 3: Requires External Verification */}
              <div className="p-4 rounded-lg bg-amber-950/25 border border-amber-600/35 text-xs font-sans space-y-2">
                <div className="font-mono text-[10px] uppercase text-amber-300 flex items-center gap-1.5 font-semibold">
                  <ShieldAlert className="w-3.5 h-3.5" />
                  <span>Requires External Physical / Provenance Verification</span>
                </div>
                <ul className="list-disc list-inside space-y-1 text-amber-100/80 text-[11px]">
                  {analysis.requiresExternalVerification.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>

              {/* Optional Studio Comparison Link */}
              {onExploreComparableMotif && (
                <div className="pt-2 border-t border-[#f4eedd]/10 flex flex-wrap items-center justify-between gap-3">
                  <span className="text-[11px] font-mono text-[#f4eedd]/65 flex items-center gap-1.5">
                    <Grid className="w-3.5 h-3.5 text-[#c98e3b]" />
                    <span>Closest mathematical study in Ajrak Lab: {analysis.suggestedStudioMotif}</span>
                  </span>
                  <button
                    onClick={() => onExploreComparableMotif(analysis.suggestedStudioMotif)}
                    className="px-3.5 py-1.5 rounded-lg border border-[#c98e3b]/60 bg-[#0a1827] hover:bg-[#0c1f33] text-[#c98e3b] text-xs font-mono flex items-center gap-1.5"
                  >
                    <span>Explore Geometry in Studio</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
