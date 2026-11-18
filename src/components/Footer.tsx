import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#060e17] border-t border-[#f4eedd]/15 pt-16 pb-12 px-4 sm:px-6 lg:px-8 text-[#f4eedd]/70 text-xs font-sans">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Top Monograph Colophon */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-12 border-b border-[#f4eedd]/10">
          {/* Brand Col */}
          <div className="md:col-span-5 space-y-3">
            <a
              href="/"
              className="font-serif font-bold text-xl text-[#f4eedd] tracking-wider block hover:text-[#c98e3b] transition-colors"
            >
              AJRAK LAB
            </a>
            <p className="font-serif italic text-base text-[#f4eedd]/90 max-w-sm">
              "Technology helps people explore and understand a living craft. It does not replace the people who preserve it."
            </p>
            <p className="text-xs text-[#f4eedd]/60 leading-relaxed font-sans max-w-md pt-1">
              A contemporary digital exhibition dedicated to celebrating the profound geometry,
              natural materials, and human hands behind the living resist-dyeing traditions of Sindh.
            </p>
          </div>

          {/* Artisan Acknowledgements */}
          <div className="md:col-span-4 space-y-2.5">
            <h4 className="text-xs font-mono uppercase tracking-widest text-[#c98e3b] font-semibold">
              Artisan Custodian Acknowledgements
            </h4>
            <p className="text-xs text-[#f4eedd]/70 leading-relaxed font-sans">
              With profound gratitude to the master Khatri artisans, Acacia block carvers (<em>Poregars</em>),
              and dye-masters of Matiari, Bhit Shah, Hala, Thatta, and Sukkur who sustain
              multi-stage natural resist dyeing and woodblock printing across generations.
            </p>
            <p className="text-[11px] text-[#f4eedd]/50 italic font-sans pt-1">
              Digital patterns produced by Ajrak Lab are computational tributes and do not replace authentic
              hand-stamped textiles.
            </p>
          </div>

          {/* Project & Research Credits */}
          <div className="md:col-span-3 space-y-2.5">
            <h4 className="text-xs font-mono uppercase tracking-widest text-[#c98e3b] font-semibold">
              Field Literature & Citations
            </h4>
            <ul className="space-y-1.5 text-xs text-[#f4eedd]/70 font-mono">
              <li>Noorjehan Bilgrami (Sindh Jo Ajrak)</li>
              <li>Nasreen Askari & Liz Arthur (V&A)</li>
              <li>Department of Culture, Sindh</li>
              <li>National Craft Inventory Initiatives</li>
            </ul>
          </div>
        </div>

        {/* Bottom Colophon Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] font-mono text-[#f4eedd]/50">
          <div>
            © {new Date().getFullYear()} AJRAK LAB · Independent Cultural-Tech Initiative
          </div>
          <div className="flex items-center gap-3">
            <span>Browser-Native Vector Logic</span>
            <span aria-hidden="true">·</span>
            <span>Zero AI-Generated Traditional Claims</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
