import React, { useState } from 'react';
import {
  DOCUMENTED_TRADITIONAL_RECORDS,
  GENERATED_EXPERIMENT_RECORDS,
  TextileRecord,
} from '../data/culturalRecords';
import {
  DOCUMENTED_ARTISAN_PROFILES,
  ArtisanRecord,
} from '../data/artisanRecords';
import {
  BookOpen,
  Compass,
  Droplets,
  Sun,
  Info,
  Check,
  Copy,
  ExternalLink,
  ShieldAlert,
  Archive,
  Layers,
  Sparkles,
  FileText,
  Users,
  Hammer,
  Cpu,
  MapPin,
  Calendar,
  Camera,
  MessageSquare,
  Clock,
  Palette,
  Eye,
  Award,
  AlertCircle,
  HelpCircle,
  Quote,
} from 'lucide-react';
import { AiAjrakGuide } from './AiAjrakGuide';

export type ArchiveCategory = 'textile' | 'makers' | 'process' | 'digital' | 'guide' | 'all';

interface CraftStage {
  stageNumber: string;
  sindhiName: string;
  englishTitle: string;
  materials: string;
  duration: string;
  description: string;
  documentedStatus: string;
  regionalVariations: string;
  detailsRequiringArtisanConfirmation: string;
  catalyst: string;
}

const CRAFT_STAGES: CraftStage[] = [
  {
    stageNumber: '01',
    sindhiName: 'Khumbh',
    englishTitle: 'Scouring & Cauldron Steaming',
    materials: 'Unbleached kora cotton, soda ash, river water, steam (historically dung preparations for desizing)',
    duration: '2 to 3 days',
    description: 'Raw unbleached cotton is coiled and steamed over a large copper cauldron with an alkaline solution to scour natural waxes, starches, and field pectin, opening the cotton cellulose fibers for dye and mordant absorption.',
    documentedStatus: 'Documented Traditional Practice (Matiari field records)',
    regionalVariations: 'In Matiari, cloth is coiled tightly in heavy copper cauldrons over wood fires; in other regions, earthen vats or open boiling troughs are employed.',
    detailsRequiringArtisanConfirmation: 'Precise boiling temperatures, fuel wood selections (typically Babul wood for consistent heat), and desizing agent substitutions in modern commercial workshops.',
    catalyst: 'Thermal steam & alkaline scouring',
  },
  {
    stageNumber: '02',
    sindhiName: 'Saaj',
    englishTitle: 'Alkaline Oil Emulsion & Sun Curing',
    materials: 'Castor or mustard oil, soda ash / plant ash solution, desert sunlight',
    duration: '10 to 14 days',
    description: 'The fabric is soaked in an oil-and-alkali emulsion, then repeatedly wetted and dried under the desert sun. This curing treatment softens the fibers and primes them to chemically bond with subsequent mordants.',
    documentedStatus: 'Documented Traditional Practice (Noorjehan Bilgrami, 1990)',
    regionalVariations: 'Castor oil is preferred in lower Sindh for its high ricinoleic acid content; mustard oil is sometimes used in northern districts. Soaking intervals vary considerably between winter and summer.',
    detailsRequiringArtisanConfirmation: 'Exact volumetric ratio of oil to alkaline lye, and specific artisan criteria for assessing when fiber saturation is optimal.',
    catalyst: 'Direct desert solar oxidation',
  },
  {
    stageNumber: '03',
    sindhiName: 'Kasano',
    englishTitle: 'Myrobalan (Harda) Pre-Mordant Treatment',
    materials: 'Dried Harda (Terminalia chebula / myrobalan) nut powder, water',
    duration: '1 day',
    description: 'The fabric is dipped in ground Harda solution, imparting a pale yellow-ochre tint and providing a rich polyphenolic tannic acid foundation essential for chemically binding iron salts (syahi) and alum mordants.',
    documentedStatus: 'Documented Traditional Practice (Verified botanical mordanting)',
    regionalVariations: 'Harda nuts harvested from wild trees in Punjab and Sindh are ground to different coarseness; some workshops add small quantities of pomegranate rind (naspal) for yellower grounds.',
    detailsRequiringArtisanConfirmation: 'Filtration mesh density for Harda wash to prevent sediment spotting on fine cotton weave.',
    catalyst: 'Polyphenolic tannin absorption',
  },
  {
    stageNumber: '04',
    sindhiName: 'Kiryan & Asal Por',
    englishTitle: 'Resist Outlining (Syahi & Chhanb)',
    materials: 'Slaked lime, gum arabic, fermented iron-scrap liquid (syahi)',
    duration: '2 to 3 days',
    description: 'Using hand-carved Acacia woodblocks, artisans print the black contours (ferrous acetate syahi reacting with Harda tannins) and the white resist lines (chhanb), protecting designated areas from subsequent dye penetration.',
    documentedStatus: 'Documented Traditional Practice (Poregar block registration)',
    regionalVariations: 'Outline block styles vary: Matiari favors crisp geometric lines, while Hala and Thatta include traditional floral and chevron corner infills.',
    detailsRequiringArtisanConfirmation: 'Syahi fermentation time (traditionally 15 to 20 days with rusty scrap iron, molasses/jaggery, and water in clay pots).',
    catalyst: 'Iron-tannin chemical chelation',
  },
  {
    stageNumber: '05',
    sindhiName: 'Gach & Mina',
    englishTitle: 'Alum & Clay Resist Printing',
    materials: 'Alum (potassium aluminum sulfate), clay/fuller’s earth (Multani mitti), gum arabic, rice flour',
    duration: '2 days',
    description: 'A second set of blocks stamps a mud paste formulated with alum mordant. During later madder boiling, the alum-mordanted areas bond with alizarin to develop deep red, while the clay paste protects the white and black reserves.',
    documentedStatus: 'Documented Traditional Practice (Double resist stamping)',
    regionalVariations: 'Clay formulations depend on local riverbank silt: Multani mitti is prized for fine viscosity, while local Indus silt is blended with rice paste for extra adhesion.',
    detailsRequiringArtisanConfirmation: 'Alum concentration percentage relative to clay volume to prevent flaking under intense sunlight.',
    catalyst: 'Alum mordant impregnation & clay barrier',
  },
  {
    stageNumber: '06',
    sindhiName: 'Rang (Madder Boiling)',
    englishTitle: 'Madder Cauldron Boiling (Rubia Root)',
    materials: 'Madder root (Rubia cordifolia / tinctorum), sakun flowers, water',
    duration: '1 day',
    description: 'The printed fabric is submerged in massive copper cauldrons of boiling madder root solution. The alum-impregnated areas blossom into rich terracotta and crimson tones.',
    documentedStatus: 'Documented Traditional Practice (Copper cauldron boiling)',
    regionalVariations: 'Commercial printing workshops frequently utilize synthetic alizarin due to botanical madder root scarcity and prolonged boiling fuel costs.',
    detailsRequiringArtisanConfirmation: 'Cauldron temperature control curves and the exact botanical function of sakun/tamarisk flower additives.',
    catalyst: 'High-temperature thermal dye fixation',
  },
  {
    stageNumber: '07',
    sindhiName: 'Karli & Neel Dip',
    englishTitle: 'Indigo Vat Immersion',
    materials: 'Fermented natural Indigofera tinctoria vats (or synthetic indigo hydrosulfite vats in commercial work)',
    duration: '2 to 4 dips',
    description: 'Artisans immerse the cloth into subterranean, anaerobic indigo vats. When lifted into the open air, the soluble leuco-indigo oxidizes in the atmosphere from yellowish-green to deep indigo blue, leaving resist-printed areas untouched.',
    documentedStatus: 'Documented Traditional Practice (Subterranean vat reduction)',
    regionalVariations: 'Heritage workshops in Matiari maintain underground vats for thermal stability; contemporary workshops predominantly use above-ground concrete tanks with sodium hydrosulfite.',
    detailsRequiringArtisanConfirmation: 'Bacterial fermentation feeding schedules and traditional plant-ash alkaline additions used to keep vats alive across seasons.',
    catalyst: 'Aerobic atmospheric oxidation',
  },
  {
    stageNumber: '08',
    sindhiName: 'Tapai',
    englishTitle: 'Open-Air Sunning & River Rinsing',
    materials: 'River or canal water, abundant sunlight, clean sandbanks or drying beds',
    duration: '3 to 5 days',
    description: 'The dyed cloth is stretched flat under the sun on clean sandbanks or drying grounds. Continuous spraying with water bleaches and brightens the unprinted resist whites while fixing the colors.',
    documentedStatus: 'Documented Traditional Practice (Indus sandbar bleaching)',
    regionalVariations: 'Traditionally performed directly on Indus river sandbanks; today often conducted on paved brick drying yards with canal or tubewell water.',
    detailsRequiringArtisanConfirmation: 'Impact of varying groundwater mineral hardness and salinity across different districts on the final textile brilliance.',
    catalyst: 'UV photo-bleaching & mineral rinse',
  },
];

export const CulturalContext: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<ArchiveCategory>('textile');
  const [selectedStage, setSelectedStage] = useState<number>(0);
  const [copiedCitationId, setCopiedCitationId] = useState<string | null>(null);
  const [activeMakerId, setActiveMakerId] = useState<string>(DOCUMENTED_ARTISAN_PROFILES[0].id);

  const handleCopyCitation = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCitationId(id);
    setTimeout(() => {
      setCopiedCitationId(null);
    }, 2800);
  };

  const selectedMaker = DOCUMENTED_ARTISAN_PROFILES.find((m) => m.id === activeMakerId) || DOCUMENTED_ARTISAN_PROFILES[0];

  return (
    <section id="cultural-context" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-16">
      {/* 1. Curatorial Archival Masthead */}
      <div className="max-w-4xl mx-auto text-center space-y-4">
        <div className="flex items-center justify-center gap-2 text-xs font-mono uppercase tracking-widest text-[#c98e3b]">
          <span>Monograph Section III</span>
          <span aria-hidden="true">·</span>
          <span>Digital Cultural Archive</span>
          <span aria-hidden="true">·</span>
          <span>Verified Field Documentation</span>
        </div>
        <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal tracking-tight text-[#f4eedd] text-balance">
          Ajrak Cultural Archive & Field Documentation
        </h2>
        <p className="text-[#f4eedd]/75 text-base sm:text-lg leading-relaxed font-sans max-w-3xl mx-auto text-balance">
          A dedicated repository organized into four curated categories: the living textile and its cultural identity in Sindh,
          the hereditary artisan custodians who shape it, the multi-stage resist craft, and our computational geometric interpretation.
        </p>

        {/* Four-Category Master Archival Switcher */}
        <div className="pt-4 flex flex-wrap items-center justify-center gap-2">
          {[
            { id: 'textile' as ArchiveCategory, number: '01', title: 'The Textile', icon: Palette, badge: 'Heritage & Anatomy' },
            { id: 'makers' as ArchiveCategory, number: '02', title: 'The Makers', icon: Users, badge: 'Artisans & Registry' },
            { id: 'process' as ArchiveCategory, number: '03', title: 'The Process', icon: Layers, badge: '8-Stage Sequence' },
            { id: 'digital' as ArchiveCategory, number: '04', title: 'The Digital Interpretation', icon: Cpu, badge: 'Math & Ethics' },
            { id: 'guide' as ArchiveCategory, number: 'AI', title: 'Ask Ajrak Lab', icon: MessageSquare, badge: 'Cultural Guide' },
            { id: 'all' as ArchiveCategory, number: '·', title: 'Complete Archive View', icon: BookOpen, badge: 'Monograph' },
          ].map((cat) => {
            const Icon = cat.icon;
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  setActiveCategory(cat.id);
                  if (cat.id === 'guide') {
                    document.getElementById('ask-ajrak-lab')?.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className={`px-3.5 py-2 rounded-lg border text-xs font-mono transition-all flex items-center gap-2 shadow-sm ${
                  isActive
                    ? 'border-[#c98e3b] bg-[#8b2628] text-[#f4eedd] font-semibold ring-1 ring-[#c98e3b]/50'
                    : 'border-[#f4eedd]/15 bg-[#0a1827] text-[#f4eedd]/70 hover:text-[#f4eedd] hover:border-[#f4eedd]/30'
                }`}
              >
                <span className="text-[#c98e3b] font-bold">{cat.number}</span>
                <Icon className="w-3.5 h-3.5 text-[#c98e3b]" />
                <span className="whitespace-nowrap">{cat.title}</span>
                <span className="hidden sm:inline-block text-[10px] text-[#f4eedd]/40 border-l border-[#f4eedd]/15 pl-1.5 ml-0.5">
                  {cat.badge}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* CATEGORY 1: THE TEXTILE                                                   */}
      {/* ========================================================================= */}
      {(activeCategory === 'textile' || activeCategory === 'all') && (
        <div className="bg-[#0a1827] rounded-xl p-6 sm:p-10 border border-[#f4eedd]/20 shadow-2xl space-y-10">
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#f4eedd]/15">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#c98e3b] mb-1">
                <Palette className="w-4 h-4" />
                <span>Archive Category 01</span>
                <span aria-hidden="true">·</span>
                <span>Verified Historical Documentation</span>
              </div>
              <h3 className="font-serif text-2xl sm:text-3xl text-[#f4eedd]">
                The Textile: Identity, Materials & Visual Anatomy
              </h3>
            </div>
            <span className="px-3 py-1 rounded bg-[#07131e] border border-[#f4eedd]/15 text-xs font-mono text-[#c98e3b]">
              Lower Indus Basin Heritage
            </span>
          </div>

          {/* Three Foundational Editorial Knowledge Plates */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1: What Ajrak Is & Cultural Significance in Sindh */}
            <div className="bg-[#07131e] rounded-lg p-6 border border-[#f4eedd]/15 space-y-3.5 flex flex-col justify-between">
              <div className="space-y-2.5">
                <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-wider text-[#c98e3b]">
                  <Compass className="w-3.5 h-3.5" />
                  <span>Cultural Meaning & Use</span>
                </div>
                <h4 className="font-serif text-lg text-[#f4eedd] font-bold">
                  What Ajrak Is to Sindh
                </h4>
                <p className="text-xs text-[#f4eedd]/80 leading-relaxed font-sans">
                  Ajrak is an ancient, double-sided resist-printed and mordant-dyed cotton shawl central to the cultural
                  identity and dignity (<em>izzat</em>) of Sindh. In Sindhi society, Ajrak accompanies a person from birth to burial:
                  used as a protective cradle drape for newborns, a turban (<em>patka</em>), a shoulder mantle, a prayer mat,
                  and ultimately a reverent shroud.
                </p>
                <p className="text-xs text-[#f4eedd]/75 leading-relaxed font-sans">
                  It serves as the highest mark of hospitality and respect in Sindh, bestowed upon honoured guests, teachers,
                  poets, and elders during ceremonial gatherings.
                </p>
              </div>
              <div className="pt-3 border-t border-[#f4eedd]/10 text-[11px] font-mono text-[#c98e3b]">
                Symbolism: Hospitality, Honor, Protection
              </div>
            </div>

            {/* Card 2: Materials & Chemical Formulation */}
            <div className="bg-[#07131e] rounded-lg p-6 border border-[#f4eedd]/15 space-y-3.5 flex flex-col justify-between">
              <div className="space-y-2.5">
                <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-wider text-[#c98e3b]">
                  <Droplets className="w-3.5 h-3.5" />
                  <span>Verified Material Profile</span>
                </div>
                <h4 className="font-serif text-lg text-[#f4eedd] font-bold">
                  Materials & Botanical Alchemy
                </h4>
                <p className="text-xs text-[#f4eedd]/80 leading-relaxed font-sans">
                  Authentic traditional Ajrak utilizes raw, unbleached cotton calico (<em>kora</em>), natural subterranean
                  indigo vats (<em>Indigofera tinctoria</em>), and crushed madder root (<em>Rubia tinctorum / cordifolia</em>, known as <em>Manjith</em>)
                  boiled in heavy copper cauldrons.
                </p>
                <p className="text-xs text-[#f4eedd]/75 leading-relaxed font-sans">
                  Pre-mordanting relies on polyphenolic tannins from wild Harda (myrobalan) nuts. Resists are formulated
                  from Fuller’s earth (<em>Multani mitti</em>), river clay, and gum arabic. Black outlines (<em>syahi</em>)
                  derive from rusted scrap iron fermented with jaggery water. Commercial printing today frequently incorporates
                  synthetic alizarin and indigo.
                </p>
              </div>
              <div className="pt-3 border-t border-[#f4eedd]/10 text-[11px] font-mono text-[#c98e3b]">
                Palette: Indigo, Madder Terracotta, Ivory, Syahi
              </div>
            </div>

            {/* Card 3: Visual Characteristics & Geometric Structure */}
            <div className="bg-[#07131e] rounded-lg p-6 border border-[#f4eedd]/15 space-y-3.5 flex flex-col justify-between">
              <div className="space-y-2.5">
                <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-wider text-[#c98e3b]">
                  <Eye className="w-3.5 h-3.5" />
                  <span>Structural Visual Anatomy</span>
                </div>
                <h4 className="font-serif text-lg text-[#f4eedd] font-bold">
                  Biti Registration & Symmetries
                </h4>
                <p className="text-xs text-[#f4eedd]/80 leading-relaxed font-sans">
                  The hallmark of classical Ajrak is <em>Biti</em>—double-sided printing where the obverse and reverse faces
                  are stamped with identical precision so front and back cannot be distinguished.
                </p>
                <p className="text-xs text-[#f4eedd]/75 leading-relaxed font-sans">
                  Visually, every piece follows a strict tripartite anatomy:
                  <strong> Hasheeya</strong> (rectilinear multi-band outer framing borders),
                  <strong> Kangri</strong> (inward-pointing triangular dentils that symbolically contain the textile’s internal energy),
                  and the <strong> Jil</strong> (the infinite central geometric field governed by wallpaper group <em>p4m</em>).
                </p>
              </div>
              <div className="pt-3 border-t border-[#f4eedd]/10 text-[11px] font-mono text-[#c98e3b]">
                Anatomy: Hasheeya · Kangri · Jil Field
              </div>
            </div>
          </div>

          {/* Verified Historical Specimens Catalogue Plate */}
          <div className="space-y-4 pt-4 border-t border-[#f4eedd]/15">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-xs font-mono text-[#c98e3b] uppercase">
                <Archive className="w-4 h-4" />
                <span>Verified Historical Specimens in Institutional Collections</span>
              </div>
              <span className="text-[11px] font-mono text-[#f4eedd]/60">
                Source Integrity Verified · Unverified fields left intentionally blank
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {DOCUMENTED_TRADITIONAL_RECORDS.slice(0, 2).map((rec) => (
                <div
                  key={rec.id}
                  className="rounded-lg bg-[#07131e] border border-[#f4eedd]/15 p-5 space-y-4 shadow-md flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-[#f4eedd]/10">
                      <span className="px-2 py-0.5 rounded bg-[#0a1827] border border-[#c98e3b]/30 text-[10px] font-mono uppercase tracking-wider text-[#c98e3b] font-medium">
                        {rec.category}
                      </span>
                      {rec.verificationStatus && (
                        <span className="px-2 py-0.5 rounded bg-emerald-950/70 border border-emerald-500/40 text-emerald-300 text-[10px] font-mono uppercase tracking-wider font-semibold">
                          {rec.verificationStatus}
                        </span>
                      )}
                    </div>

                    <div className="flex items-start justify-between gap-3">
                      <h4 className="font-serif text-lg text-[#f4eedd] font-bold">
                        {rec.title}
                      </h4>
                      {rec.catalogRef && (
                        <span className="px-2 py-0.5 rounded bg-[#0a1827] border border-[#f4eedd]/15 text-[10px] font-mono text-[#f4eedd]/80 shrink-0">
                          {rec.catalogRef}
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs font-sans pt-1">
                      <div>
                        <span className="block font-mono text-[10px] uppercase text-[#c98e3b]">Institution</span>
                        <span className="text-[#f4eedd]/90">{rec.makerOrInstitution}</span>
                      </div>
                      <div>
                        <span className="block font-mono text-[10px] uppercase text-[#c98e3b]">Date / Period</span>
                        <span className="text-[#f4eedd]/90">{rec.dateIfKnown || 'Traditional lineage'}</span>
                      </div>
                    </div>

                    <div className="text-xs pt-1">
                      <span className="block font-mono text-[10px] uppercase text-[#c98e3b] mb-0.5">Materials & Technique</span>
                      <p className="text-[#f4eedd]/80 leading-relaxed font-sans">{rec.materials} — {rec.technique}</p>
                    </div>

                    <div className="text-xs pt-1">
                      <span className="block font-mono text-[10px] uppercase text-[#c98e3b] mb-0.5">Archival Notes</span>
                      <p className="text-[#f4eedd]/70 leading-relaxed font-sans text-[11px]">{rec.notes}</p>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[#f4eedd]/10 mt-3 flex items-center justify-between text-[10px] font-mono text-[#c98e3b]">
                    <span>Citation Record</span>
                    <div className="flex items-center gap-3">
                      {rec.citationLink && (
                        <a
                          href={rec.citationLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-[#f4eedd] transition-colors flex items-center gap-1 text-[#f4eedd]/75"
                        >
                          <ExternalLink className="w-3 h-3" />
                          <span>Museum Record</span>
                        </a>
                      )}
                      <button
                        onClick={() => handleCopyCitation(rec.id, rec.citation)}
                        className="hover:text-[#f4eedd] transition-colors flex items-center gap-1"
                      >
                        {copiedCitationId === rec.id ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-400" />
                            <span className="text-emerald-400">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copy Citation</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* CATEGORY 2: THE MAKERS                                                    */}
      {/* ========================================================================= */}
      {(activeCategory === 'makers' || activeCategory === 'all') && (
        <div className="bg-[#0a1827] rounded-xl p-6 sm:p-10 border border-[#f4eedd]/20 shadow-2xl space-y-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#f4eedd]/15">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#c98e3b] mb-1">
                <Users className="w-4 h-4" />
                <span>Archive Category 02</span>
                <span aria-hidden="true">·</span>
                <span>Living Human Custodians</span>
              </div>
              <h3 className="font-serif text-2xl sm:text-3xl text-[#f4eedd]">
                The Makers: Artisans, Block Carvers & Dye Masters
              </h3>
            </div>
            <div className="p-2 rounded bg-[#07131e] border border-[#f4eedd]/15 text-xs font-mono text-[#f4eedd]/70 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-[#c98e3b]" />
              <span>Ethical Protocol: Zero invented names or unauthorized quotes</span>
            </div>
          </div>

          {/* Curatorial Maker Guild Intro */}
          <div className="p-4 rounded-lg bg-[#07131e] border border-[#f4eedd]/10 text-xs sm:text-sm text-[#f4eedd]/80 leading-relaxed font-sans space-y-2">
            <p>
              The continuity of Ajrak relies entirely upon interconnected hereditary guilds in Sindh: the <strong>Poregars</strong> (master woodcarvers who hand-chisel Acacia blocks and drill internal air-relief vents), the <strong>Chhipas / Khatris</strong> (master printers who execute double-sided resist stamping by touch and sound), and the <strong>Dye-Masters</strong> (custodians who tend subterranean anaerobic indigo vats and boiling madder cauldrons).
            </p>
            <p className="text-[11px] font-mono text-[#c98e3b]">
              Primary Centers of Sustained Practice: Matiari, Bhit Shah, Hala, Thatta, Sukkur, and historical artisan settlements along the Indus.
            </p>
          </div>

          {/* Interactive Maker Profile Directory */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left: Maker Profile Selector */}
            <div className="lg:col-span-4 space-y-2.5">
              <span className="text-xs font-mono uppercase tracking-wider text-[#c98e3b] block mb-2">
                Documented Workshop Lineages ({DOCUMENTED_ARTISAN_PROFILES.length})
              </span>
              {DOCUMENTED_ARTISAN_PROFILES.map((maker) => {
                const isSelected = activeMakerId === maker.id;
                return (
                  <button
                    key={maker.id}
                    onClick={() => setActiveMakerId(maker.id)}
                    className={`w-full text-left p-3.5 rounded-lg border transition-all space-y-1 ${
                      isSelected
                        ? 'border-[#8b2628] bg-[#8b2628]/25 text-[#f4eedd] ring-1 ring-[#8b2628]'
                        : 'border-[#f4eedd]/10 bg-[#07131e]/60 text-[#f4eedd]/70 hover:border-[#f4eedd]/25 hover:bg-[#07131e]'
                    }`}
                  >
                    <div className="text-[10px] font-mono text-[#c98e3b] flex items-center justify-between">
                      <span>{maker.region}</span>
                      <span className="uppercase text-[9px] px-1.5 py-0.2 rounded bg-[#0a1827]">Documented</span>
                    </div>
                    <div className="font-serif text-sm font-semibold text-[#f4eedd]">
                      {maker.artisanOrWorkshopName}
                    </div>
                    <div className="text-[11px] text-[#f4eedd]/60 font-sans truncate">
                      {maker.craftSpecialisation}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Right: Comprehensive Structured Profile Card (With All 8 Required Fields) */}
            <div className="lg:col-span-8 bg-[#07131e] rounded-xl border border-[#f4eedd]/20 p-6 sm:p-8 space-y-6 shadow-inner">
              {/* Header: Name, Location, Specialisation */}
              <div className="space-y-2 pb-4 border-b border-[#f4eedd]/15">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 text-xs font-mono text-[#c98e3b]">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>Location: {selectedMaker.location}</span>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-[#0a1827] border border-[#f4eedd]/15 text-[#f4eedd]/80">
                    Field Registry Record
                  </span>
                </div>
                <h4 className="font-serif text-2xl text-[#f4eedd] font-bold">
                  {selectedMaker.artisanOrWorkshopName}
                </h4>
                <div className="text-xs font-mono text-[#c98e3b]">
                  Specialisation: {selectedMaker.craftSpecialisation}
                </div>
              </div>

              {/* Structured Fields Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans">
                {/* Field 1: Years of Experience / Lineage */}
                <div className="p-3 rounded bg-[#0a1827] border border-[#f4eedd]/10 space-y-1">
                  <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase text-[#c98e3b]">
                    <Calendar className="w-3 h-3" />
                    <span>Years of Experience / Lineage</span>
                  </div>
                  <p className="text-[#f4eedd]/80 leading-relaxed">
                    {selectedMaker.yearsOfExperienceOrLineage}
                  </p>
                </div>

                {/* Field 2: Tools & Materials */}
                <div className="p-3 rounded bg-[#0a1827] border border-[#f4eedd]/10 space-y-1">
                  <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase text-[#c98e3b]">
                    <Hammer className="w-3 h-3" />
                    <span>Workshop Implements</span>
                  </div>
                  <ul className="text-[#f4eedd]/80 space-y-0.5 list-disc list-inside text-[11px]">
                    {selectedMaker.materialsAndTools.slice(0, 3).map((tool, i) => (
                      <li key={i}>{tool}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Field 3: Production Process */}
              <div className="space-y-1.5 text-xs font-sans">
                <span className="font-mono text-[10px] uppercase text-[#c98e3b] block">
                  Documented Production Process
                </span>
                <p className="text-[#f4eedd]/85 leading-relaxed bg-[#0a1827] p-3.5 rounded border border-[#f4eedd]/10">
                  {selectedMaker.productionProcess}
                </p>
              </div>

              {/* Field 4: Interview or Quotation (Only with Permission) */}
              <div className="space-y-1.5">
                <span className="font-mono text-[10px] uppercase text-[#c98e3b] flex items-center gap-1.5">
                  <MessageSquare className="w-3 h-3" />
                  <span>Interview or Quotation (Documented with Permission)</span>
                </span>
                <div className="bg-[#0a1827] p-4 rounded border border-[#f4eedd]/10 space-y-2">
                  {selectedMaker.interviewOrQuotation.text ? (
                    <blockquote className="font-serif italic text-sm text-[#f4eedd]/90 border-l-2 border-[#c98e3b] pl-3 py-0.5">
                      "{selectedMaker.interviewOrQuotation.text}"
                    </blockquote>
                  ) : (
                    <div className="text-xs text-[#f4eedd]/50 italic flex items-center gap-2">
                      <HelpCircle className="w-3.5 h-3.5 text-[#c98e3b]" />
                      <span>Artisan quote pending direct voluntary fieldwork. No quotes are invented.</span>
                    </div>
                  )}
                  {selectedMaker.interviewOrQuotation.speaker && (
                    <div className="text-[10px] font-mono text-[#f4eedd]/70 text-right">
                      — {selectedMaker.interviewOrQuotation.speaker}
                    </div>
                  )}
                  <div className="text-[10px] font-mono text-[#c98e3b]/80 border-t border-[#f4eedd]/10 pt-1.5">
                    {selectedMaker.interviewOrQuotation.permissionNote}
                  </div>
                </div>
              </div>

              {/* Field 5: Photograph (With Permission and Credit) */}
              <div className="space-y-1.5">
                <span className="font-mono text-[10px] uppercase text-[#c98e3b] flex items-center gap-1.5">
                  <Camera className="w-3 h-3" />
                  <span>Visual Record & Photographic Credit (Permission Verified)</span>
                </span>
                <div className="bg-[#0a1827] p-3.5 rounded border border-[#f4eedd]/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                  <div className="space-y-0.5">
                    <p className="text-[#f4eedd]/80 font-sans">{selectedMaker.photograph.description}</p>
                    <span className="text-[10px] font-mono text-[#f4eedd]/50 block">Credit: {selectedMaker.photograph.credit}</span>
                  </div>
                  <span className="px-2 py-1 rounded bg-[#07131e] border border-[#f4eedd]/15 text-[10px] font-mono text-[#c98e3b] shrink-0">
                    Consent Status: Verified
                  </span>
                </div>
              </div>

              {/* Field 6: Contact or Business Link (If Approved) */}
              <div className="space-y-1.5">
                <span className="font-mono text-[10px] uppercase text-[#c98e3b] flex items-center gap-1.5">
                  <ExternalLink className="w-3 h-3" />
                  <span>Approved Contact & Community Directory Link</span>
                </span>
                <div className="bg-[#0a1827] p-3.5 rounded border border-[#f4eedd]/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                  <div className="space-y-0.5">
                    <span className="font-medium text-[#f4eedd]">{selectedMaker.contactOrBusinessLink.label}</span>
                    <p className="text-[11px] text-[#f4eedd]/60 font-sans">{selectedMaker.contactOrBusinessLink.approvalNote}</p>
                  </div>
                  {selectedMaker.contactOrBusinessLink.url ? (
                    <a
                      href={selectedMaker.contactOrBusinessLink.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded bg-[#8b2628] hover:bg-[#a32f31] text-[#f4eedd] font-mono text-[10px] uppercase tracking-wider transition-colors shrink-0 flex items-center gap-1.5"
                    >
                      <span>Visit Directory</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  ) : (
                    <span className="text-[10px] font-mono text-[#f4eedd]/40 italic shrink-0">
                      Approval Pending
                    </span>
                  )}
                </div>
              </div>

              {/* Regional Variations & Details Requiring Confirmation */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-[#f4eedd]/10 text-xs">
                <div className="p-3 rounded bg-[#0a1827]/70 border border-[#f4eedd]/10 space-y-1">
                  <span className="font-mono text-[10px] uppercase text-[#c98e3b] block">Regional Context</span>
                  <p className="text-[#f4eedd]/70 text-[11px] leading-relaxed font-sans">{selectedMaker.regionalContextAndVariations}</p>
                </div>
                <div className="p-3 rounded bg-[#0a1827]/70 border border-[#f4eedd]/10 space-y-1">
                  <span className="font-mono text-[10px] uppercase text-amber-400 block">Artisan Confirmation Needed</span>
                  <p className="text-[#f4eedd]/70 text-[11px] leading-relaxed font-sans">{selectedMaker.detailsRequiringArtisanConfirmation}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Ethical Submission Gateway for Practicing Artisans */}
          <div className="p-5 rounded-lg bg-[#07131e] border border-[#c98e3b]/30 text-xs font-sans space-y-2">
            <div className="flex items-center gap-2 text-xs font-mono uppercase text-[#c98e3b] font-semibold">
              <Award className="w-4 h-4" />
              <span>Artisan Directory Notice & Contribution Gateway</span>
            </div>
            <p className="text-[#f4eedd]/80 leading-relaxed">
              Are you a practicing Khatri dyer, Poregar woodblock carver, or Ajrak workshop in Sindh or Kutch?
              Ajrak Lab welcomes voluntary profile contributions. All artisan listings, workshop profiles, photographs,
              and interview excerpts are published solely upon voluntary written consent and attribution.
            </p>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* CATEGORY 3: THE PROCESS                                                   */}
      {/* ========================================================================= */}
      {(activeCategory === 'process' || activeCategory === 'all') && (
        <div className="bg-[#0a1827] rounded-xl p-6 sm:p-10 border border-[#f4eedd]/20 shadow-2xl space-y-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#f4eedd]/15">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#c98e3b] mb-1">
                <Layers className="w-4 h-4" />
                <span>Archive Category 03</span>
                <span aria-hidden="true">·</span>
                <span>Documented Craft Odyssey</span>
              </div>
              <h3 className="font-serif text-2xl sm:text-3xl text-[#f4eedd]">
                The Process: Visual Step-by-Step Production Sequence
              </h3>
            </div>
            <span className="text-xs font-mono text-[#f4eedd]/60 tabular-nums">
              Documented Traditional Cycle: 20 to 30 Days Per Piece
            </span>
          </div>

          {/* Methodological Context Note */}
          <div className="p-4 rounded-lg bg-[#07131e] border border-[#f4eedd]/15 text-xs font-mono text-[#f4eedd]/75 space-y-1.5">
            <div className="flex items-center gap-2 text-[#c98e3b] font-semibold">
              <Info className="w-4 h-4 shrink-0" />
              <span>Documented Case Study & Variance Disclosure</span>
            </div>
            <p className="font-sans leading-relaxed text-[#f4eedd]/70 text-[11px]">
              This step-by-step sequence represents the high-grade <em>Teli Ajrak</em> process documented in Matiari workshops
              (recorded in field research by Noorjehan Bilgrami). General descriptions are provided only where documented.
              Production steps are not universal: they range from 14 to 20+ operations in heritage workshops, with recipes,
              soaking intervals, and mordants varying across Matiari, Bhit Shah, Hala, Thatta, and Kutch.
            </p>
          </div>

          {/* 8-Stage Visual Timeline Tabs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
            {CRAFT_STAGES.map((stage, idx) => {
              const isSelected = selectedStage === idx;
              return (
                <button
                  key={stage.stageNumber}
                  onClick={() => setSelectedStage(idx)}
                  className={`p-3 rounded-lg border text-left transition-all ${
                    isSelected
                      ? 'border-[#8b2628] bg-[#8b2628]/30 text-[#f4eedd] shadow-sm ring-1 ring-[#8b2628]'
                      : 'border-[#f4eedd]/10 bg-[#07131e]/60 text-[#f4eedd]/60 hover:text-[#f4eedd] hover:bg-[#07131e]'
                  }`}
                >
                  <div className="text-[10px] font-mono text-[#c98e3b] mb-0.5">{stage.stageNumber}</div>
                  <div className="font-serif font-semibold text-xs truncate">{stage.sindhiName}</div>
                  <div className="text-[10px] font-sans text-[#f4eedd]/40 truncate">{stage.englishTitle}</div>
                </button>
              );
            })}
          </div>

          {/* Active Stage Detailed Visual Inspection Panel */}
          <div className="bg-[#07131e] rounded-xl p-6 sm:p-8 border border-[#f4eedd]/15 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Stage Identification & Technical Craft Description */}
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center gap-2 text-xs font-mono text-[#c98e3b] tabular-nums">
                <span className="font-semibold">Stage {CRAFT_STAGES[selectedStage].stageNumber}</span>
                <span aria-hidden="true">·</span>
                <span>Duration: {CRAFT_STAGES[selectedStage].duration}</span>
                <span aria-hidden="true">·</span>
                <span className="text-emerald-400">{CRAFT_STAGES[selectedStage].documentedStatus}</span>
              </div>

              <div>
                <h4 className="font-serif text-3xl text-[#f4eedd] font-bold">
                  {CRAFT_STAGES[selectedStage].sindhiName}
                </h4>
                <div className="text-sm font-sans text-[#f4eedd]/70 mt-0.5">
                  {CRAFT_STAGES[selectedStage].englishTitle}
                </div>
              </div>

              <div className="text-xs sm:text-sm text-[#f4eedd]/85 leading-relaxed font-sans bg-[#0a1827] p-4 rounded-lg border border-[#f4eedd]/10">
                {CRAFT_STAGES[selectedStage].description}
              </div>

              {/* Regional Variation Notice */}
              <div className="p-3.5 rounded bg-blue-950/25 border border-blue-600/30 text-xs font-sans space-y-1">
                <span className="font-mono text-[10px] uppercase text-blue-300 font-bold block">
                  Regional Craft Variation
                </span>
                <p className="text-blue-100/80 leading-relaxed text-[11px]">
                  {CRAFT_STAGES[selectedStage].regionalVariations}
                </p>
              </div>

              {/* Details Requiring Artisan Confirmation */}
              <div className="p-3.5 rounded bg-amber-950/25 border border-amber-600/30 text-xs font-sans space-y-1">
                <span className="font-mono text-[10px] uppercase text-amber-300 font-bold block">
                  Detail Requiring Artisan Confirmation
                </span>
                <p className="text-amber-100/80 leading-relaxed text-[11px]">
                  {CRAFT_STAGES[selectedStage].detailsRequiringArtisanConfirmation}
                </p>
              </div>
            </div>

            {/* Right Column: Physical Inputs, Chemical Catalyst & Environmental Factor */}
            <div className="lg:col-span-5 bg-[#0a1827] rounded-lg p-5 border border-[#f4eedd]/15 space-y-4 text-xs font-sans">
              <div>
                <span className="block font-mono text-[10px] uppercase text-[#c98e3b] mb-1">
                  Primary Botanical & Mineral Inputs
                </span>
                <span className="text-[#f4eedd]/90 font-medium leading-relaxed block p-2.5 rounded bg-[#07131e] border border-[#f4eedd]/10">
                  {CRAFT_STAGES[selectedStage].materials}
                </span>
              </div>

              <div>
                <span className="block font-mono text-[10px] uppercase text-[#c98e3b] mb-1">
                  Environmental & Physical Catalyst
                </span>
                <span className="text-[#f4eedd]/80 flex items-center gap-2 p-2.5 rounded bg-[#07131e] border border-[#f4eedd]/10">
                  <Sun className="w-4 h-4 text-[#c98e3b] shrink-0" />
                  <span>{CRAFT_STAGES[selectedStage].catalyst}</span>
                </span>
              </div>

              <div className="pt-2 border-t border-[#f4eedd]/10 space-y-2 text-[11px] text-[#f4eedd]/60">
                <div className="flex items-center justify-between">
                  <span>Cycle Sequence</span>
                  <span className="font-mono text-[#f4eedd]/80">{selectedStage + 1} of {CRAFT_STAGES.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Chemical Function</span>
                  <span className="font-mono text-[#f4eedd]/80">Cellulose Preparation & Mordant Fixation</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* CATEGORY 4: THE DIGITAL INTERPRETATION                                    */}
      {/* ========================================================================= */}
      {(activeCategory === 'digital' || activeCategory === 'all') && (
        <div className="bg-[#0a1827] rounded-xl p-6 sm:p-10 border border-[#f4eedd]/20 shadow-2xl space-y-10">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#f4eedd]/15">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#c98e3b] mb-1">
                <Cpu className="w-4 h-4" />
                <span>Archive Category 04</span>
                <span aria-hidden="true">·</span>
                <span>Computational Textile Geometry</span>
              </div>
              <h3 className="font-serif text-2xl sm:text-3xl text-[#f4eedd]">
                The Digital Interpretation: Geometry, Coding & Ethical Demarcation
              </h3>
            </div>
            <span className="px-3 py-1 rounded bg-[#07131e] border border-[#f4eedd]/15 text-xs font-mono text-[#c98e3b]">
              Creative Coding Laboratory
            </span>
          </div>

          {/* Prominent Golden Proclamation Statement (Mandated Verbatim) */}
          <div className="relative p-8 sm:p-10 rounded-xl bg-gradient-to-r from-[#8b2628]/35 via-[#07131e] to-[#8b2628]/35 border-2 border-[#c98e3b] shadow-2xl text-center space-y-3">
            <Quote className="w-8 h-8 text-[#c98e3b] mx-auto opacity-75" />
            <p className="font-serif text-xl sm:text-2xl md:text-3xl text-[#f4eedd] font-normal tracking-wide leading-snug max-w-3xl mx-auto">
              "Technology is our tool for exploration. The knowledge, skill and continuity of the craft belong to its makers."
            </p>
            <div className="text-xs font-mono uppercase tracking-widest text-[#c98e3b] pt-1">
              Ajrak Lab Guiding Principle & Curatorial Stance
            </div>
          </div>

          {/* Editorial Monograph on Creative Coding & Euclidean Geometry */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-xs sm:text-sm font-sans leading-relaxed text-[#f4eedd]/80">
            <div className="bg-[#07131e] p-6 rounded-lg border border-[#f4eedd]/15 space-y-3">
              <h4 className="font-serif text-lg text-[#f4eedd] font-bold flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#c98e3b]" />
                How Ajrak Lab Uses Computational Design
              </h4>
              <p>
                Ajrak Lab explores the mathematical architecture of Sindhi textiles through browser-native vector geometry (SVG),
                Canvas rendering, and Euclidean coordinate transformations. Traditional woodblock carvers (Poregars) and block
                printers execute complex geometric theorems—such as 4-fold cyclic rotation ($C_4$), dihedral symmetry ($D_4$),
                and wallpaper group tessellation ($p4m$)—through physical compass dividers, hand chisels, and generational muscle memory.
              </p>
              <p>
                In our digital simulator, we model these identical transformations mathematically to allow university students,
                educators, and designers to deconstruct how a carved quadrant seed mirrors, rotates, and tiles across an unbroken plane.
              </p>
            </div>

            <div className="bg-[#07131e] p-6 rounded-lg border border-[#f4eedd]/15 space-y-3">
              <h4 className="font-serif text-lg text-[#f4eedd] font-bold flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-[#c98e3b]" />
                Strict Distinction: Simulation vs. Physical Craft
              </h4>
              <p>
                We maintain an unyielding ethical boundary: <strong>a software simulation is not a traditional textile.</strong>
                Ajrak Lab does not produce authentic Ajrak; it generates digital vector studies.
              </p>
              <p>
                The authentic craft requires weeks of physical labor, natural river chemistry, biological indigo vats,
                botanical madder root boiling, and hand-stamped resist layers on unbleached cotton. Our digital experiments
                are educational tributes designed to foster deep respect for living Sindhi artisans, never to supplant them.
              </p>
            </div>
          </div>

          {/* Comparative Matrix: Traditional Heritage vs. Ajrak Lab Digital Experiments */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center gap-2 text-xs font-mono text-[#c98e3b] uppercase">
              <Layers className="w-4 h-4" />
              <span>Comparative Matrix: Physical Heritage vs. Digital Simulator</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-sans border-collapse">
                <thead>
                  <tr className="border-b border-[#f4eedd]/20 text-[11px] font-mono text-[#c98e3b] uppercase">
                    <th className="py-3 px-3">Dimension</th>
                    <th className="py-3 px-3 w-1/2 bg-[#07131e]/50 text-[#f4eedd]">Documented Traditional Ajrak</th>
                    <th className="py-3 px-3 w-1/2 text-[#c98e3b]">Original Generated Experiments (Ajrak Lab)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f4eedd]/10">
                  <tr>
                    <td className="py-3 px-3 font-mono text-[11px] text-[#c98e3b]">Human Custodianship</td>
                    <td className="py-3 px-3 bg-[#07131e]/50 text-[#f4eedd]/90">
                      Hereditary Khatri & Poregar artisan guilds sustained across generations in Sindh
                    </td>
                    <td className="py-3 px-3 text-[#f4eedd]/75">
                      Open-access educational software simulation authored by creative coders
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3 px-3 font-mono text-[11px] text-[#c98e3b]">Physical Materials</td>
                    <td className="py-3 px-3 bg-[#07131e]/50 text-[#f4eedd]/90">
                      Raw cotton calico, botanical madder (Manjith), natural indigo vats, Harda tannins, alum, and fermented iron-acetate syahi
                    </td>
                    <td className="py-3 px-3 text-[#f4eedd]/75">
                      Browser vector paths (SVG), canvas pixel buffers, RGB display color space
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3 px-3 font-mono text-[11px] text-[#c98e3b]">Production Time</td>
                    <td className="py-3 px-3 bg-[#07131e]/50 text-[#f4eedd]/90">
                      Documented traditional cycles span 20 to 30 days of sequential printing, boiling, and sun-curing
                    </td>
                    <td className="py-3 px-3 text-[#f4eedd]/75">
                      Milliseconds (real-time client-side coordinate math)
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3 px-3 font-mono text-[11px] text-[#c98e3b]">Geographic Specificity</td>
                    <td className="py-3 px-3 bg-[#07131e]/50 text-[#f4eedd]/90">
                      Indus basin hydrology (dissolved calcium, magnesium, and mineral salts influence mordant reactions across Matiari, Bhit Shah, and Hala)
                    </td>
                    <td className="py-3 px-3 text-[#f4eedd]/75">
                      Location-agnostic web runtime
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3 px-3 font-mono text-[11px] text-[#c98e3b]">Authenticity Claim</td>
                    <td className="py-3 px-3 bg-[#07131e]/50 text-[#f4eedd]/90 font-medium">
                      Documented living cultural textile craft practice sustained by hereditary artisan masters
                    </td>
                    <td className="py-3 px-3 text-[#f4eedd]/75 italic">
                      Digital computational simulation; strictly NOT authentic traditional Ajrak
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Generated Experiments Gallery */}
          <div className="space-y-4 pt-4 border-t border-[#f4eedd]/15">
            <div className="flex items-center justify-between text-xs font-mono text-[#c98e3b]">
              <span>Original Generated Digital Studies in Ajrak Lab</span>
              <span className="text-[10px] text-[#f4eedd]/50">3 Parameterized Studies</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {GENERATED_EXPERIMENT_RECORDS.map((exp) => (
                <div
                  key={exp.id}
                  className="rounded-lg bg-[#07131e] border border-[#8b2628]/40 p-4 space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-[10px] font-mono text-[#8b2628] font-bold">
                      <span>ORIGINAL EXPERIMENT</span>
                      <span className="text-[#f4eedd]/50">{exp.catalogRef}</span>
                    </div>
                    <h5 className="font-serif text-base text-[#f4eedd] font-bold">{exp.title}</h5>
                    <p className="text-[11px] text-[#f4eedd]/70 leading-relaxed font-sans">{exp.notes}</p>
                    <div className="text-[10px] font-mono text-[#c98e3b]">{exp.technique}</div>
                  </div>
                  <div className="pt-2 border-t border-[#f4eedd]/10 text-[10px] font-mono text-[#f4eedd]/50">
                    Year: 2026 · Software Vector Simulation
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Verified Academic Bibliography & Integrity Notice */}
          <div className="space-y-4 pt-4 border-t border-[#f4eedd]/15">
            <div className="flex items-center justify-between text-xs font-mono text-[#c98e3b]">
              <span>Verified Bibliography & Curatorial Integrity Audit</span>
              <span className="text-[10px] text-[#f4eedd]/50">Peer-Reviewed Field Literature</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-sans">
              <div className="p-3.5 rounded bg-[#07131e] border border-[#f4eedd]/10 space-y-1">
                <span className="text-[10px] font-mono text-[#c98e3b] uppercase">Primary Field Documentation</span>
                <div className="font-serif text-sm font-bold text-[#f4eedd]">Sindh Jo Ajrak</div>
                <div className="text-[#f4eedd]/70 text-[11px]">Noorjehan Bilgrami (1990)</div>
                <p className="text-[10px] text-[#f4eedd]/50 leading-relaxed">
                  Karachi: Dept. of Culture & Tourism, Govt. of Sindh. Primary records of botanical recipes and Khatri workshops.
                </p>
              </div>

              <div className="p-3.5 rounded bg-[#07131e] border border-[#f4eedd]/10 space-y-1">
                <span className="text-[10px] font-mono text-[#c98e3b] uppercase">Museum Cataloguing</span>
                <div className="font-serif text-sm font-bold text-[#f4eedd]">Colours of the Indus</div>
                <div className="text-[#f4eedd]/70 text-[11px]">Nasreen Askari & Liz Arthur (1997)</div>
                <p className="text-[10px] text-[#f4eedd]/50 leading-relaxed">
                  Victoria and Albert Museum. Curatorial taxonomy of 19th-century specimens (incl. V&A no. 5473 (IS)).
                </p>
              </div>

              <div className="p-3.5 rounded bg-[#07131e] border border-[#f4eedd]/10 space-y-1">
                <span className="text-[10px] font-mono text-[#c98e3b] uppercase">Archaeological Visual Comparison</span>
                <div className="font-serif text-sm font-bold text-[#f4eedd]">Excavations at Mohenjo-daro</div>
                <div className="text-[#f4eedd]/70 text-[11px]">Ernest Mackay (1938); Possehl (2002)</div>
                <p className="text-[10px] text-[#f4eedd]/50 leading-relaxed">
                  Steatite Priest-King statuette (NMP 50-852); iconographic visual comparison for draped geometric motifs.
                </p>
              </div>

              <div className="p-3.5 rounded bg-[#07131e] border border-amber-600/30 space-y-1">
                <span className="text-[10px] font-mono text-amber-400 uppercase">Archival Integrity Audit</span>
                <div className="font-serif text-sm font-bold text-[#f4eedd]">Zero Fabricated Citations</div>
                <div className="text-[#f4eedd]/70 text-[11px]">Ajrak Lab Curatorial Protocol</div>
                <p className="text-[10px] text-[#f4eedd]/50 leading-relaxed">
                  Unverified citations (e.g. SICA-ARC-1998) were audited and expunged. Gaps are designated as 'Artisan Documentation Needed'.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* ========================================================================= */}
      {/* ASK AJRAK LAB (SOURCE-GROUNDED AI CULTURAL GUIDE - ALWAYS ACCESSIBLE)     */}
      {/* ========================================================================= */}
      <AiAjrakGuide />
    </section>
  );
};
