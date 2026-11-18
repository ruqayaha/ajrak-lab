/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { MockupType, MotifId, PatternConfig } from './types/pattern';
import { DEFAULT_PATTERN_CONFIG } from './data/patternPresets';
import { Hero } from './components/Hero';
import { PatternStudio } from './components/PatternStudio';
import { GeometryExplorer } from './components/GeometryExplorer';
import { CulturalContext } from './components/CulturalContext';
import { DesignPreview } from './components/DesignPreview';
import { Footer } from './components/Footer';
import { EditorialBorderDivider } from './components/EditorialBorderDivider';
import { ExhibitionBoothMode } from './components/ExhibitionBoothMode';
import { Sparkles } from 'lucide-react';

export default function App() {
  const [patternConfig, setPatternConfig] = useState<PatternConfig>({
    ...DEFAULT_PATTERN_CONFIG,
  });
  const [activeMockup, setActiveMockup] = useState<MockupType>('notebook');

  // Dedicated Exhibition Booth / Kiosk mode state
  const [isBoothMode, setIsBoothMode] = useState<boolean>(false);

  const handleScrollToStudio = () => {
    const el = document.getElementById('pattern-studio');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleJumpToProductPreview = (product: MockupType) => {
    setActiveMockup(product);
    const el = document.getElementById('design-preview');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleExploreComparableMotif = (motifId: MotifId) => {
    setPatternConfig((prev) => ({ ...prev, motifId }));
    handleScrollToStudio();
  };

  const handleApplyColorVariation = (colors: PatternConfig['customColors']) => {
    setPatternConfig((prev) => ({
      ...prev,
      paletteId: 'custom',
      customColors: colors,
    }));
  };

  return (
    <div className="min-h-screen bg-[#07131e] text-[#f4eedd] flex flex-col font-sans selection:bg-[#8b2628] selection:text-[#f4eedd]">
      {/* 1. Exhibition Booth Mode (Kiosk) Overlay */}
      {isBoothMode && (
        <ExhibitionBoothMode
          config={patternConfig}
          onChangeConfig={setPatternConfig}
          onExit={() => setIsBoothMode(false)}
        />
      )}

      {/* 2. Hero Exhibition Masthead */}
      <Hero
        previewConfig={patternConfig}
        onEnterLab={handleScrollToStudio}
        onOpenBoothMode={() => setIsBoothMode(true)}
      />

      {/* Main Content Sections with Authentic Geometric Dividers */}
      <main className="flex-1">
        {/* 3. Interactive Pattern Studio */}
        <PatternStudio
          config={patternConfig}
          onChangeConfig={setPatternConfig}
          onOpenBoothMode={() => setIsBoothMode(true)}
          onJumpToProductPreview={handleJumpToProductPreview}
        />

        <EditorialBorderDivider />

        {/* 4. Geometry Explorer */}
        <GeometryExplorer onExploreComparableMotif={handleExploreComparableMotif} />

        <EditorialBorderDivider />

        {/* 5. Cultural Context ("Beyond the Pattern") */}
        <CulturalContext />

        <EditorialBorderDivider />

        {/* 6. Design Preview (Applied Product Studies) */}
        <DesignPreview
          config={patternConfig}
          activeMockup={activeMockup}
          onChangeMockup={setActiveMockup}
          onApplyColorVariation={handleApplyColorVariation}
        />
      </main>

      {/* 7. Cultural & Archival Colophon Footer */}
      <Footer />

      {/* 8. Floating Kiosk Launcher Button */}
      {!isBoothMode && (
        <button
          onClick={() => setIsBoothMode(true)}
          className="fixed bottom-6 right-6 z-40 px-4 py-2.5 rounded-full bg-[#0a1827] hover:bg-[#0e2235] text-[#f4eedd] border-2 border-[#c98e3b] shadow-2xl font-mono text-xs font-bold tracking-wider flex items-center gap-2 backdrop-blur-md transition-all active:scale-95"
          title="Launch touch-friendly university booth exhibition mode"
        >
          <Sparkles className="w-4 h-4 text-[#c98e3b]" />
          <span className="hidden sm:inline">Launch</span> Booth Kiosk
        </button>
      )}
    </div>
  );
}
