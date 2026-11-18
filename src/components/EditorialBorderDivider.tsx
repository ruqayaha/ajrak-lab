import React from 'react';

interface EditorialBorderDividerProps {
  className?: string;
  variant?: 'full' | 'subtle';
}

/**
 * Editorial Geometric Border Divider
 * Renders an authentic Sindhi Ajrak running border motif (Kangri dentils,
 * diamond chain, and ivory pinstripes) to separate exhibition sections.
 */
export const EditorialBorderDivider: React.FC<EditorialBorderDividerProps> = ({
  className = '',
  variant = 'full',
}) => {
  return (
    <div
      className={`w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-10 overflow-hidden select-none pointer-events-none ${className}`}
      aria-hidden="true"
    >
      <div className="relative py-3 flex items-center justify-center">
        {/* Subtle background hairline rule */}
        <div className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-[#f4eedd]/20 to-transparent"></div>

        {/* Geometric Motif Runner in Center */}
        <div className="relative bg-[#091724] px-6 flex items-center gap-3">
          {/* Left ornamental geometric star */}
          <svg width="18" height="18" viewBox="0 0 20 20" className="fill-[#8b2628] stroke-[#f4eedd] stroke-[0.8]">
            <polygon points="10,1 12.5,7.5 19,10 12.5,12.5 10,19 7.5,12.5 1,10 7.5,7.5" />
            <circle cx="10" cy="10" r="2" fill="#f4eedd" />
          </svg>

          {/* Running Kangri / Diamond Bar */}
          <div className="flex items-center gap-1.5 opacity-80">
            {[-2, -1, 0, 1, 2].map((idx) => (
              <span key={idx} className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rotate-45 border border-[#f4eedd]/40 bg-[#8b2628]"></span>
                <span className="w-1 h-1 rounded-full bg-[#c98e3b]/80"></span>
              </span>
            ))}
          </div>

          {/* Center Monograph Seal Text */}
          <span className="font-mono text-[10px] uppercase tracking-widest text-[#f4eedd]/60 px-2">
            SINDH JO AJRAK • ARCHIVAL STUDY
          </span>

          {/* Running Kangri / Diamond Bar */}
          <div className="flex items-center gap-1.5 opacity-80">
            {[-2, -1, 0, 1, 2].map((idx) => (
              <span key={idx} className="flex items-center gap-1">
                <span className="w-1 h-1 rounded-full bg-[#c98e3b]/80"></span>
                <span className="w-1.5 h-1.5 rotate-45 border border-[#f4eedd]/40 bg-[#8b2628]"></span>
              </span>
            ))}
          </div>

          {/* Right ornamental geometric star */}
          <svg width="18" height="18" viewBox="0 0 20 20" className="fill-[#8b2628] stroke-[#f4eedd] stroke-[0.8]">
            <polygon points="10,1 12.5,7.5 19,10 12.5,12.5 10,19 7.5,12.5 1,10 7.5,7.5" />
            <circle cx="10" cy="10" r="2" fill="#f4eedd" />
          </svg>
        </div>
      </div>
    </div>
  );
};
