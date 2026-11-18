import React, { useEffect, useRef, useState } from 'react';
import { AiGuideMessage } from '../types/ai';
import { requestAiGuide, AiServiceError } from '../services/aiService';
import {
  BookOpen,
  Send,
  Loader2,
  AlertCircle,
  ShieldCheck,
  HelpCircle,
  Quote,
  Trash2,
  Info,
  RotateCcw,
} from 'lucide-react';

const SUGGESTED_QUESTIONS = [
  'What is Sindhi Ajrak and why is it culturally significant in Sindh?',
  'How do textile patterns, geometric repetition, and symmetry work in Ajrak?',
  'What are Hasheeya borders, Kangri dentils, and the traditional colours of Ajrak?',
  'How can technology help document and explore traditional crafts without replacing artisans?',
];

export const AiAjrakGuide: React.FC = () => {
  const [messages, setMessages] = useState<AiGuideMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content:
        'Welcome to Ask Ajrak Lab. Ask about Sindhi Ajrak’s cultural significance, geometric repetition and symmetry, colours and borders, or how technology can help document living crafts. All answers come from Gemini grounded in verified archive records—never inventing dates, makers, or production methods—and original digital experiments are always framed as Ajrak-inspired studies rather than authentic traditional Ajrak.',
      epistemicStatus: 'Documented Historical & Craft Fact',
      documentedVsInterpretation:
        'Grounded in Ajrak Lab’s verified cultural archive (Bilgrami 1990; Askari & Arthur 1997; Mackay 1938 / Possehl 2002).',
      citations: ['Ajrak Lab Verified Cultural Archive'],
    },
  ]);
  const [input, setInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [geminiConfigured, setGeminiConfigured] = useState<boolean | null>(null);

  const inputRef = useRef<HTMLInputElement | null>(null);
  const scrollBoxRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let active = true;
    fetch('/api/health')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (active && data && typeof data.geminiConfigured === 'boolean') {
          setGeminiConfigured(data.geminiConfigured);
        }
      })
      .catch(() => {
        // Ignore transient health errors; interactive error handler covers runtime requests
      });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (scrollBoxRef.current && messages.length > 1) {
      scrollBoxRef.current.scrollTop = scrollBoxRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const askQuestion = async (questionText: string) => {
    const cleaned = questionText.trim();
    if (!cleaned || isLoading) return;

    setErrorMsg(null);
    const userMsg: AiGuideMessage = {
      id: `u-${Date.now()}`,
      role: 'user',
      content: cleaned,
    };

    const historyPayload = messages
      .filter((m) => m.id !== 'welcome' && !m.error)
      .slice(-6)
      .map((m) => ({ role: m.role, content: m.content }));

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const reply = await requestAiGuide({
        question: cleaned,
        history: historyPayload,
      });

      setGeminiConfigured(true);
      setMessages((prev) => [
        ...prev,
        {
          id: `a-${Date.now()}`,
          role: 'assistant',
          content: reply.answer,
          epistemicStatus: reply.epistemicStatus,
          documentedVsInterpretation: reply.documentedVsInterpretation,
          citations: reply.citations,
        },
      ]);
    } catch (err) {
      const msg =
        err instanceof AiServiceError
          ? err.message
          : 'Unable to reach Ask Ajrak Lab right now. All manual pattern and archive tools remain available.';
      if (err instanceof AiServiceError && err.code === 'MISSING_API_KEY') {
        setGeminiConfigured(false);
      }
      setErrorMsg(msg);
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          role: 'assistant',
          content: msg,
          error: true,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    askQuestion(input);
  };

  const handleResetChat = () => {
    setMessages((prev) => prev.slice(0, 1));
    setErrorMsg(null);
    inputRef.current?.focus();
  };

  const handleFocusNewQuestion = () => {
    inputRef.current?.focus();
  };

  const statusBadgeStyle = (status?: AiGuideMessage['epistemicStatus']) => {
    switch (status) {
      case 'Documented Historical & Craft Fact':
        return 'bg-emerald-950/70 border-emerald-500/40 text-emerald-300';
      case 'Includes Archaeological Visual Comparison':
        return 'bg-blue-950/70 border-blue-500/40 text-blue-300';
      case 'Partially Documented / Artisan Confirmation Needed':
        return 'bg-amber-950/70 border-amber-500/40 text-amber-300';
      case 'Outside Documented Archive':
        return 'bg-red-950/70 border-red-500/40 text-red-300';
      default:
        return 'bg-[#0a1827] border-[#f4eedd]/20 text-[#c98e3b]';
    }
  };

  return (
    <div
      id="ask-ajrak-lab"
      className="bg-[#0a1827] rounded-xl p-6 sm:p-10 border border-[#c98e3b]/35 shadow-2xl space-y-6 scroll-mt-10"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-[#f4eedd]/15">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#c98e3b] mb-1">
            <BookOpen className="w-4 h-4" />
            <span>Ask Ajrak Lab</span>
            <span aria-hidden="true">·</span>
            <span>AI Cultural Guide</span>
          </div>
          <h3 className="font-serif text-2xl sm:text-3xl text-[#f4eedd]">
            Ask Ajrak Lab: Heritage, Geometry & Living Craft
          </h3>
          <p className="text-xs sm:text-sm text-[#f4eedd]/70 mt-1 max-w-2xl font-sans leading-relaxed">
            Ask concise questions about Sindhi Ajrak’s cultural significance, geometric repetition, colours and borders,
            or how technology helps document traditional crafts. Digital designs remain Ajrak-inspired explorations,
            never automatic substitutes for hand-printed textiles.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto shrink-0">
          {messages.length > 1 && (
            <button
              type="button"
              onClick={handleFocusNewQuestion}
              className="px-3 py-1.5 rounded-lg border border-[#c98e3b]/40 bg-[#07131e] hover:bg-[#0c1f33] text-[#c98e3b] text-xs font-mono flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Ask Another</span>
            </button>
          )}
          <button
            type="button"
            onClick={handleResetChat}
            className="px-3 py-1.5 rounded-lg border border-[#f4eedd]/20 bg-[#07131e] hover:bg-[#0c1f33] text-[#f4eedd]/70 hover:text-[#f4eedd] text-xs font-mono flex items-center gap-1.5"
            title="Reset conversation"
          >
            <Trash2 className="w-3.5 h-3.5 text-[#c98e3b]" />
            <span>Clear Thread</span>
          </button>
        </div>
      </div>

      {/* Helpful Server Configuration Message if GEMINI_API_KEY is missing */}
      {geminiConfigured === false && (
        <div
          role="status"
          className="p-4 rounded-lg bg-amber-950/35 border border-amber-500/40 text-xs text-amber-100/90 flex items-start gap-3 font-sans"
        >
          <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <div className="font-mono text-[11px] uppercase tracking-wider text-amber-300 font-semibold">
              Server API Key Configuration Needed
            </div>
            <p className="leading-relaxed">
              The server-side <code className="font-mono text-amber-200">GEMINI_API_KEY</code> environment variable is
              not configured yet. Add your Gemini API key in the AI Studio <strong>Settings &gt; Secrets</strong> panel
              on the server to enable Ask Ajrak Lab. All interactive Pattern Studio, Geometry Explorer, and product
              preview features continue to work normally without it.
            </p>
          </div>
        </div>
      )}

      {/* Suggested Curatorial Questions */}
      <div className="space-y-2">
        <span className="text-[11px] font-mono uppercase tracking-wider text-[#c98e3b] block">
          Explore by Topic
        </span>
        <div className="flex flex-wrap gap-2">
          {SUGGESTED_QUESTIONS.map((q, idx) => (
            <button
              key={idx}
              type="button"
              disabled={isLoading}
              onClick={() => askQuestion(q)}
              className="text-left text-[11px] font-sans px-3 py-1.5 rounded-lg bg-[#07131e] border border-[#f4eedd]/15 text-[#f4eedd]/75 hover:text-[#f4eedd] hover:border-[#c98e3b]/60 transition-colors disabled:opacity-50"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Dialogue Stream */}
      <div
        ref={scrollBoxRef}
        className="bg-[#07131e] rounded-xl border border-[#f4eedd]/15 p-4 sm:p-5 space-y-4 max-h-[440px] overflow-y-auto"
      >
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`rounded-lg p-4 space-y-2.5 ${
              msg.role === 'user'
                ? 'bg-[#8b2628]/25 border border-[#8b2628]/40 ml-4 sm:ml-12'
                : msg.error
                ? 'bg-red-950/40 border border-red-500/40 mr-4 sm:mr-12'
                : 'bg-[#0a1827] border border-[#f4eedd]/15 mr-4 sm:mr-12'
            }`}
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#c98e3b] font-semibold">
                {msg.role === 'user' ? 'Visitor Question' : msg.error ? 'Guide Notice' : 'Ask Ajrak Lab'}
              </span>
              {msg.epistemicStatus && (
                <span
                  className={`px-2 py-0.5 rounded border text-[10px] font-mono ${statusBadgeStyle(
                    msg.epistemicStatus
                  )}`}
                >
                  {msg.epistemicStatus}
                </span>
              )}
            </div>

            <p className="text-xs sm:text-sm text-[#f4eedd]/90 leading-relaxed font-sans whitespace-pre-line">
              {msg.content}
            </p>

            {msg.documentedVsInterpretation && (
              <div className="p-2.5 rounded bg-[#07131e] border border-[#f4eedd]/10 text-[11px] text-[#f4eedd]/75 font-sans flex items-start gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-[#c98e3b] shrink-0 mt-0.5" />
                <span>
                  <strong className="font-mono text-[10px] uppercase text-[#c98e3b] mr-1.5">
                    Evidence vs. Interpretation:
                  </strong>
                  {msg.documentedVsInterpretation}
                </span>
              </div>
            )}

            {msg.citations && msg.citations.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5 pt-1 border-t border-[#f4eedd]/10">
                <span className="text-[10px] font-mono uppercase text-[#c98e3b] mr-1 flex items-center gap-1">
                  <Quote className="w-3 h-3" /> Sources:
                </span>
                {msg.citations.map((cite, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 rounded bg-[#07131e] border border-[#f4eedd]/15 text-[10px] font-mono text-[#f4eedd]/75"
                  >
                    {cite}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="rounded-lg p-4 bg-[#0a1827] border border-[#c98e3b]/30 text-xs font-mono text-[#c98e3b] flex items-center gap-2.5 mr-4 sm:mr-12">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Consulting verified archive &amp; Gemini Flash...</span>
          </div>
        )}
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
        <label htmlFor="ai-guide-input" className="sr-only">
          Ask Ajrak Lab a question
        </label>
        <input
          ref={inputRef}
          id="ai-guide-input"
          type="text"
          maxLength={800}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about Sindhi Ajrak culture, patterns, symmetry, borders, or craft technology..."
          className="flex-1 rounded-lg bg-[#07131e] border border-[#f4eedd]/25 focus:border-[#c98e3b] focus:outline-none px-4 py-2.5 text-sm text-[#f4eedd] placeholder:text-[#f4eedd]/35 font-sans"
        />
        <button
          type="submit"
          disabled={isLoading || input.trim().length < 2}
          className="px-5 py-2.5 rounded-lg bg-[#8b2628] hover:bg-[#a32f31] text-[#f4eedd] text-xs font-mono font-semibold flex items-center justify-center gap-2 disabled:opacity-50 border border-[#f4eedd]/20 shrink-0"
        >
          {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          <span>{isLoading ? 'Asking...' : 'Ask Ajrak Lab'}</span>
        </button>
      </form>

      {errorMsg && (
        <div className="p-3 rounded-lg bg-red-950/40 border border-red-500/40 text-xs text-red-200 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
          <button
            type="button"
            onClick={() => setErrorMsg(null)}
            className="text-[11px] font-mono text-red-200/80 hover:text-red-100 underline shrink-0"
          >
            Dismiss
          </button>
        </div>
      )}

      <div className="text-[11px] font-mono text-[#f4eedd]/50 flex items-center gap-2">
        <HelpCircle className="w-3.5 h-3.5 text-[#c98e3b] shrink-0" />
        <span>
          Curatorial integrity: Unrecorded dates, makers, or workshop recipes are flagged as needing verification. Digital
          patterns remain Ajrak-inspired explorations.
        </span>
      </div>
    </div>
  );
};
