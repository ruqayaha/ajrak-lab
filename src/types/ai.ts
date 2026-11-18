import { MockupType, MotifId, PatternConfig } from './pattern';

export interface AiDesignSuggestion {
  config: PatternConfig;
  intendedProduct: MockupType;
  designTitle: string;
  rationale: string;
  culturalNote: string;
}

export interface AiGuideReply {
  answer: string;
  epistemicStatus:
    | 'Documented Historical & Craft Fact'
    | 'Includes Archaeological Visual Comparison'
    | 'Partially Documented / Artisan Confirmation Needed'
    | 'Outside Documented Archive';
  documentedVsInterpretation: string;
  citations: string[];
}

export interface AiGuideMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  epistemicStatus?: AiGuideReply['epistemicStatus'];
  documentedVsInterpretation?: string;
  citations?: string[];
  error?: boolean;
}

export interface AiTextileAnalysis {
  isTextileImage: boolean;
  colorsObserved: string[];
  geometricShapes: string[];
  borderStructure: string;
  repeatArrangement: string;
  printingCharacteristics: string;
  geometricExplanation: string;
  requiresExternalVerification: string[];
  suggestedStudioMotif: MotifId;
}

export interface AiProductColorVariation {
  name: string;
  rationale: string;
  colors: PatternConfig['customColors'];
}

export interface AiProductConcept {
  title: string;
  format: string;
  materialNote: string;
}

export interface AiProductPack {
  productNames: string[];
  productConcepts: AiProductConcept[];
  designDescription: string;
  packagingConcept: string;
  socialMediaCaption: string;
  colorVariations: AiProductColorVariation[];
}
