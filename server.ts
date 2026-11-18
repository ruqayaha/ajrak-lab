import 'dotenv/config';
import express, { type Request, type Response } from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer as createViteServer } from 'vite';
import { Type, ThinkingLevel } from '@google/genai';
import { GEMINI_MODEL, getGeminiClient, mapGeminiError, withRetry } from './server/geminiClient.ts';
import { AJRAK_KNOWLEDGE_BASE, ALLOWED_MOTIF_INFO } from './server/knowledgeBase.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ALLOWED_MOTIFS = new Set(['star-trellis', 'eightfold-rosette', 'stepped-diamond']);
const ALLOWED_PALETTES = new Set([
  'classic-traditional',
  'madder-field',
  'syahi-charcoal',
  'kora-light',
  'kasimi-gold',
  'custom',
]);
const ALLOWED_LAYOUTS = new Set(['square', 'half-drop', 'diamond']);
const ALLOWED_PRODUCTS = new Set(['flat', 'notebook', 'poster', 'shawl', 'sleeve']);

const PALETTE_PRESET_COLORS: Record<
  string,
  { ground: string; primary: string; secondary: string; accent: string; outline: string }
> = {
  'classic-traditional': {
    ground: '#0c2033',
    primary: '#8c2527',
    secondary: '#183856',
    accent: '#f5eedd',
    outline: '#15171a',
  },
  'madder-field': {
    ground: '#731e20',
    primary: '#0e2235',
    secondary: '#942f32',
    accent: '#f8f3e5',
    outline: '#19191c',
  },
  'syahi-charcoal': {
    ground: '#141619',
    primary: '#122a42',
    secondary: '#782325',
    accent: '#ede5d4',
    outline: '#090a0c',
  },
  'kora-light': {
    ground: '#f4eee0',
    primary: '#0e2235',
    secondary: '#8a2628',
    accent: '#c98e3b',
    outline: '#202226',
  },
  'kasimi-gold': {
    ground: '#0f2438',
    primary: '#c48734',
    secondary: '#852224',
    accent: '#f7f2e4',
    outline: '#151619',
  },
};

function clamp(val: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, val));
}

function isValidHex(color: unknown): color is string {
  return typeof color === 'string' && /^#[0-9a-fA-F]{6}$/.test(color.trim());
}

function stripJsonFences(text: string): string {
  const trimmed = text.trim();
  if (trimmed.startsWith('```')) {
    return trimmed.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim();
  }
  return trimmed;
}

async function createApp() {
  const app = express();
  const port = Number(process.env.PORT) || 3000;

  app.use(express.json({ limit: '10mb' }));

  // Health check
  app.get('/api/health', (_req: Request, res: Response) => {
    res.json({
      ok: true,
      geminiConfigured: Boolean(process.env.GEMINI_API_KEY?.trim()),
    });
  });

  // ---------------------------------------------------------------------------
  // FEATURE 1: AI PATTERN DESIGN ASSISTANT (/api/ai/design)
  // ---------------------------------------------------------------------------
  app.post('/api/ai/design', async (req: Request, res: Response) => {
    try {
      const prompt = typeof req.body?.prompt === 'string' ? req.body.prompt.trim() : '';
      const variationMode = Boolean(req.body?.variationMode);
      const currentConfig = req.body?.currentConfig;

      if (!prompt || prompt.length < 3) {
        return res.status(400).json({
          code: 'INVALID_INPUT',
          message: 'Please describe the pattern, mood, or product you want to explore (at least 3 characters).',
        });
      }
      if (prompt.length > 600) {
        return res.status(400).json({
          code: 'INPUT_TOO_LONG',
          message: 'Please keep your pattern description under 600 characters.',
        });
      }

      const ai = getGeminiClient();

      const systemInstruction = `You are the computational design assistant for Ajrak Lab, an educational geometric studio celebrating Sindhi Ajrak heritage.
Translate the user's natural-language design request into controlled parametric settings for Ajrak Lab's modular geometric engine.

${ALLOWED_MOTIF_INFO}

ETHICAL & CULTURAL RULES:
- Never claim that a generated computational design is an authentic traditional Sindhi Ajrak. Frame it respectfully as an original geometric study inspired by Sindhi textile structure.
- Prefer one of the 5 curated palettes when it matches the user's colors well; use "custom" only when custom hex shades specifically improve fidelity to the prompt (e.g., rust red + deep indigo + muted warm tone).
- If variationMode is true, preserve the core intent of the prompt while exploring a noticeably different structural arrangement (e.g., different gridLayout, rotation, density, or motif).`;

      const contextText = currentConfig
        ? `User's current canvas config (for reference only; do not assume overwrite): motif=${currentConfig.motifId}, palette=${currentConfig.paletteId}, layout=${currentConfig.gridLayout}, density=${currentConfig.gridDensity}, scale=${currentConfig.motifScale}, rotation=${currentConfig.rotation}.`
        : '';

      const fullPrompt = `Design request: "${prompt}"\n${variationMode ? 'Mode: Generate a fresh creative variation distinct from the current canvas.\n' : ''}${contextText}`;

      const response = await withRetry(() =>
        ai.models.generateContent({
          model: GEMINI_MODEL,
          contents: fullPrompt,
          config: {
            systemInstruction,
            thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                motifId: {
                  type: Type.STRING,
                  enum: ['star-trellis', 'eightfold-rosette', 'stepped-diamond'],
                },
                paletteId: {
                  type: Type.STRING,
                  enum: [
                    'classic-traditional',
                    'madder-field',
                    'syahi-charcoal',
                    'kora-light',
                    'kasimi-gold',
                    'custom',
                  ],
                },
                customColors: {
                  type: Type.OBJECT,
                  properties: {
                    ground: { type: Type.STRING, description: '6-digit hex color like #0c2033' },
                    primary: { type: Type.STRING, description: '6-digit hex color' },
                    secondary: { type: Type.STRING, description: '6-digit hex color' },
                    accent: { type: Type.STRING, description: '6-digit hex color' },
                    outline: { type: Type.STRING, description: '6-digit hex color' },
                  },
                  required: ['ground', 'primary', 'secondary', 'accent', 'outline'],
                },
                gridDensity: { type: Type.INTEGER, description: 'Integer from 2 to 6' },
                motifScale: { type: Type.NUMBER, description: 'Number from 0.65 to 1.35' },
                rotation: { type: Type.INTEGER, description: 'Degrees from 0 to 360 in steps of 5' },
                spacing: { type: Type.INTEGER, description: 'Even integer from 0 to 32' },
                gridLayout: { type: Type.STRING, enum: ['square', 'half-drop', 'diamond'] },
                strokeWidth: { type: Type.NUMBER, description: 'Number from 1.0 to 3.5' },
                showBorder: { type: Type.BOOLEAN },
                borderWidth: { type: Type.INTEGER, description: 'Even integer from 20 to 48' },
                intendedProduct: {
                  type: Type.STRING,
                  enum: ['flat', 'notebook', 'poster', 'shawl', 'sleeve'],
                },
                designTitle: {
                  type: Type.STRING,
                  description: 'Short editorial title for this digital study (under 8 words)',
                },
                rationale: {
                  type: Type.STRING,
                  description: '2 concise sentences explaining why these geometric & color choices match the request.',
                },
                culturalNote: {
                  type: Type.STRING,
                  description:
                    '1 concise sentence noting how this digital study draws geometric inspiration while remaining distinct from hand-printed Ajrak.',
                },
              },
              required: [
                'motifId',
                'paletteId',
                'customColors',
                'gridDensity',
                'motifScale',
                'rotation',
                'spacing',
                'gridLayout',
                'strokeWidth',
                'showBorder',
                'borderWidth',
                'intendedProduct',
                'designTitle',
                'rationale',
                'culturalNote',
              ],
            },
          },
        })
      );

      const rawText = stripJsonFences(response.text ?? '');
      const parsed = JSON.parse(rawText);

      // Strict validation & clamping against allowed bounds
      const motifId = ALLOWED_MOTIFS.has(parsed.motifId) ? parsed.motifId : 'star-trellis';
      const paletteId = ALLOWED_PALETTES.has(parsed.paletteId) ? parsed.paletteId : 'classic-traditional';
      const gridLayout = ALLOWED_LAYOUTS.has(parsed.gridLayout) ? parsed.gridLayout : 'square';
      const intendedProduct = ALLOWED_PRODUCTS.has(parsed.intendedProduct) ? parsed.intendedProduct : 'flat';

      const gridDensity = Math.round(clamp(Number(parsed.gridDensity) || 3, 2, 6));
      const motifScale = Number(clamp(Number(parsed.motifScale) || 1.0, 0.65, 1.35).toFixed(2));
      const rawRot = clamp(Number(parsed.rotation) || 0, 0, 360);
      const rotation = Math.round(rawRot / 5) * 5;
      const rawSpacing = clamp(Number(parsed.spacing) || 0, 0, 32);
      const spacing = Math.round(rawSpacing / 2) * 2;
      const rawStroke = clamp(Number(parsed.strokeWidth) || 2, 1, 3.5);
      const strokeWidth = Math.round(rawStroke * 2) / 2;
      const showBorder = Boolean(parsed.showBorder);
      const rawBorderWidth = clamp(Number(parsed.borderWidth) || 28, 20, 48);
      const borderWidth = Math.round(rawBorderWidth / 2) * 2;

      const fallbackPalette = PALETTE_PRESET_COLORS[paletteId] ?? PALETTE_PRESET_COLORS['classic-traditional'];
      const customColors =
        paletteId !== 'custom' && PALETTE_PRESET_COLORS[paletteId]
          ? PALETTE_PRESET_COLORS[paletteId]
          : {
              ground: isValidHex(parsed.customColors?.ground) ? parsed.customColors.ground : fallbackPalette.ground,
              primary: isValidHex(parsed.customColors?.primary) ? parsed.customColors.primary : fallbackPalette.primary,
              secondary: isValidHex(parsed.customColors?.secondary)
                ? parsed.customColors.secondary
                : fallbackPalette.secondary,
              accent: isValidHex(parsed.customColors?.accent) ? parsed.customColors.accent : fallbackPalette.accent,
              outline: isValidHex(parsed.customColors?.outline) ? parsed.customColors.outline : fallbackPalette.outline,
            };

      res.json({
        suggestion: {
          config: {
            motifId,
            paletteId,
            customColors,
            gridDensity,
            motifScale,
            spacing,
            rotation,
            gridLayout,
            strokeWidth,
            showBorder,
            borderWidth,
            textureEffect: true,
            showGridGuides: false,
          },
          intendedProduct,
          designTitle:
            typeof parsed.designTitle === 'string' && parsed.designTitle.trim()
              ? parsed.designTitle.trim().slice(0, 80)
              : 'Parametric Geometric Study',
          rationale:
            typeof parsed.rationale === 'string' && parsed.rationale.trim()
              ? parsed.rationale.trim()
              : 'Configured balanced tessellation and color harmony for your request.',
          culturalNote:
            typeof parsed.culturalNote === 'string' && parsed.culturalNote.trim()
              ? parsed.culturalNote.trim()
              : 'This digital parameter study explores geometric symmetry inspired by Sindhi textiles and is distinct from hand-printed Ajrak.',
        },
      });
    } catch (error) {
      const mapped = mapGeminiError(error);
      res.status(mapped.status).json(mapped);
    }
  });

  // ---------------------------------------------------------------------------
  // FEATURE 2: AI AJRAK GUIDE (/api/ai/guide)
  // ---------------------------------------------------------------------------
  app.post('/api/ai/guide', async (req: Request, res: Response) => {
    try {
      const question = typeof req.body?.question === 'string' ? req.body.question.trim() : '';
      const rawHistory: unknown[] = Array.isArray(req.body?.history) ? req.body.history.slice(-6) : [];
      const formattedHistory = rawHistory
        .filter((item): item is { role: 'user' | 'assistant'; content: string } => {
          if (typeof item !== 'object' || item === null) return false;
          const record = item as { role?: unknown; content?: unknown };
          return (
            (record.role === 'user' || record.role === 'assistant') &&
            typeof record.content === 'string'
          );
        })
        .map((item: { role: 'user' | 'assistant'; content: string }) =>
          `${item.role === 'user' ? 'Visitor' : 'Guide'}: ${item.content.slice(0, 400)}`
        )
        .join('\n');

      if (!question || question.length < 2) {
        return res.status(400).json({
          code: 'INVALID_INPUT',
          message: 'Please enter a question about Sindhi Ajrak history, geometry, materials, or artisans.',
        });
      }
      if (question.length > 800) {
        return res.status(400).json({
          code: 'INPUT_TOO_LONG',
          message: 'Please keep your question under 800 characters.',
        });
      }

      const ai = getGeminiClient();

      const systemInstruction = `You are "Ask Ajrak Lab", an educational AI cultural guide inside Ajrak Lab.
Help visitors understand:
- Sindhi Ajrak and its cultural significance
- Textile patterns and geometric repetition (including wallpaper symmetries like p4m, C4/D4, and repeating grids)
- Colours (indigo, madder, kora ivory, syahi black), borders (Hasheeya, Kangri), symmetry, and design
- How technology (such as interactive geometry tools and digital archives) can help document and explore traditional crafts while honoring living artisans

You must ground factual historical, material, and craft claims in the verified knowledge base below:

${AJRAK_KNOWLEDGE_BASE}

STRICT CULTURAL, SCHOLARLY & CLARITY RULES:
1. Ground craft, history, dye, and museum claims ONLY in the knowledge base above. Do NOT invent historical dates, artisan names, citations, origins, or production methods.
2. When historical origins, regional workshop recipes, or contemporary artisan practices are unrecorded or vary by workshop, clearly say that the information is unverified or requires direct artisan confirmation.
3. Explicitly distinguish documented evidence from interpretations or visual comparisons (such as the Mohenjo-daro Priest-King statuette).
4. Whenever digital patterns, computational design, or technology are discussed, clearly explain that Ajrak Lab's original digital experiments are Ajrak-inspired geometric studies—NOT automatically authentic traditional Ajrak—and that technology supports documentation and exploration rather than replacing artisans.
5. Cite relevant verified sources from the knowledge base in "citations" when referencing archive records (or include "Ajrak Lab Geometry & Digital Archive" for computational design questions).
6. Keep responses concise, warm, and understandable for students and exhibition visitors (2-4 crisp, clear sentences in the answer body).`;

      const prompt = formattedHistory
        ? `Previous exchange:\n${formattedHistory}\n\nNew visitor question: "${question}"`
        : `Visitor question: "${question}"`;

      const response = await withRetry(() =>
        ai.models.generateContent({
          model: GEMINI_MODEL,
          contents: prompt,
          config: {
            systemInstruction,
            thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                answer: {
                  type: Type.STRING,
                  description: 'Clear, educational, respectful answer grounded strictly in the knowledge base.',
                },
                epistemicStatus: {
                  type: Type.STRING,
                  enum: [
                    'Documented Historical & Craft Fact',
                    'Includes Archaeological Visual Comparison',
                    'Partially Documented / Artisan Confirmation Needed',
                    'Outside Documented Archive',
                  ],
                },
                documentedVsInterpretation: {
                  type: Type.STRING,
                  description:
                    '1 concise sentence separating verified facts from hypotheses or regional variations.',
                },
                citations: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: 'Verified citations from the knowledge base used to answer.',
                },
              },
              required: ['answer', 'epistemicStatus', 'documentedVsInterpretation', 'citations'],
            },
          },
        })
      );

      const parsed = JSON.parse(stripJsonFences(response.text ?? ''));

      res.json({
        reply: {
          answer:
            typeof parsed.answer === 'string' && parsed.answer.trim()
              ? parsed.answer.trim()
              : 'That specific detail is not verified in our documented archive.',
          epistemicStatus: parsed.epistemicStatus || 'Documented Historical & Craft Fact',
          documentedVsInterpretation:
            typeof parsed.documentedVsInterpretation === 'string'
              ? parsed.documentedVsInterpretation.trim()
              : '',
          citations: Array.isArray(parsed.citations)
            ? parsed.citations.filter((c: unknown): c is string => typeof c === 'string').slice(0, 5)
            : [],
        },
      });
    } catch (error) {
      const mapped = mapGeminiError(error);
      res.status(mapped.status).json(mapped);
    }
  });

  // ---------------------------------------------------------------------------
  // FEATURE 3: AI TEXTILE EXPLORER (/api/ai/analyze-textile)
  // ---------------------------------------------------------------------------
  app.post('/api/ai/analyze-textile', async (req: Request, res: Response) => {
    try {
      const imageBase64 = typeof req.body?.imageBase64 === 'string' ? req.body.imageBase64.trim() : '';
      const mimeType = typeof req.body?.mimeType === 'string' ? req.body.mimeType.trim() : '';
      const userNote = typeof req.body?.note === 'string' ? req.body.note.trim().slice(0, 300) : '';

      const ALLOWED_MIME = new Set(['image/jpeg', 'image/png', 'image/webp']);
      if (!ALLOWED_MIME.has(mimeType)) {
        return res.status(400).json({
          code: 'INVALID_IMAGE_TYPE',
          message: 'Please upload a JPEG, PNG, or WebP photograph of a textile sample.',
        });
      }

      if (!imageBase64 || imageBase64.length < 100 || imageBase64.length > 8_000_000) {
        return res.status(400).json({
          code: 'INVALID_IMAGE_SIZE',
          message: 'Please upload a valid image file under 5 MB.',
        });
      }

      const ai = getGeminiClient();

      const systemInstruction = `You are a visual textile geometry analyst for Ajrak Lab.
Analyze the uploaded photograph strictly on what is VISUALLY OBSERVABLE in the image.

CRITICAL EPISTEMIC RULES:
1. Describe ONLY visible visual features: visible colors, geometric shapes/motifs, border bands, repeating grid/symmetry structure, and visible surface printing/dyeing texture (e.g., registration overlap, ink bleed, double-sided vs single-sided clue if visible, crisp vs soft edges).
2. Explain the observable geometry clearly (e.g., rotational symmetry, bilateral reflection, diagonal lattice, stepped polygons, border framing).
3. NEVER claim to authenticate whether the textile is genuine traditional Sindhi Ajrak, hand-block printed vs screen/digital printed, natural vs synthetic dyed, or determine its age, provenance, date, or maker from a photograph alone.
4. Clearly separate "observableVisualFeatures" (what the eye sees) from "requiresExternalVerification" (questions that require physical inspection, microscopic/chemical testing, or workshop provenance).`;

      const textPrompt = userNote
        ? `Analyze the visible geometry and visual characteristics of this textile sample. Visitor note: "${userNote}"`
        : 'Analyze the visible colors, geometric shapes, border structure, repeat arrangement, and observable printing characteristics of this textile sample.';

      const response = await withRetry(() =>
        ai.models.generateContent({
          model: GEMINI_MODEL,
          contents: {
            parts: [
              {
                inlineData: {
                  mimeType,
                  data: imageBase64,
                },
              },
              { text: textPrompt },
            ],
          },
          config: {
            systemInstruction,
            thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                isTextileImage: {
                  type: Type.BOOLEAN,
                  description: 'True if the image visibly shows a fabric, pattern, or textile sample.',
                },
                colorsObserved: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: 'Visible hue descriptions (e.g., deep indigo blue, rust terracotta, warm off-white).',
                },
                geometricShapes: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: 'Visible shapes/motifs (e.g., 8-pointed stars, stepped diamonds, radial rosettes, dentils).',
                },
                borderStructure: {
                  type: Type.STRING,
                  description: 'Visual description of any framing borders, bands, or absence of visible borders.',
                },
                repeatArrangement: {
                  type: Type.STRING,
                  description: 'How motifs repeat across the visible field (e.g., square grid, half-drop, diagonal lattice).',
                },
                printingCharacteristics: {
                  type: Type.STRING,
                  description:
                    'Visible surface clues such as dye bleed, edge crispness, registration overlap, or woven texture without claiming authenticity.',
                },
                geometricExplanation: {
                  type: Type.STRING,
                  description:
                    'Accessible explanation of the observable mathematical symmetries (reflection, rotation, translation, tiling).',
                },
                requiresExternalVerification: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description:
                    'List of attributes that CANNOT be confirmed from a photograph alone (age, natural vs synthetic dye, maker, provenance, exact production method).',
                },
                suggestedStudioMotif: {
                  type: Type.STRING,
                  enum: ['star-trellis', 'eightfold-rosette', 'stepped-diamond'],
                  description: 'Closest geometric study inside Ajrak Lab for educational comparison.',
                },
              },
              required: [
                'isTextileImage',
                'colorsObserved',
                'geometricShapes',
                'borderStructure',
                'repeatArrangement',
                'printingCharacteristics',
                'geometricExplanation',
                'requiresExternalVerification',
                'suggestedStudioMotif',
              ],
            },
          },
        })
      );

      const parsed = JSON.parse(stripJsonFences(response.text ?? ''));

      res.json({
        analysis: {
          isTextileImage: Boolean(parsed.isTextileImage),
          colorsObserved: Array.isArray(parsed.colorsObserved) ? parsed.colorsObserved.slice(0, 8) : [],
          geometricShapes: Array.isArray(parsed.geometricShapes) ? parsed.geometricShapes.slice(0, 8) : [],
          borderStructure: typeof parsed.borderStructure === 'string' ? parsed.borderStructure : '',
          repeatArrangement: typeof parsed.repeatArrangement === 'string' ? parsed.repeatArrangement : '',
          printingCharacteristics:
            typeof parsed.printingCharacteristics === 'string' ? parsed.printingCharacteristics : '',
          geometricExplanation: typeof parsed.geometricExplanation === 'string' ? parsed.geometricExplanation : '',
          requiresExternalVerification: Array.isArray(parsed.requiresExternalVerification)
            ? parsed.requiresExternalVerification.slice(0, 6)
            : [
                'Physical dye chemistry (natural vs. synthetic pigments) requires laboratory testing.',
                'Age, region, and artisan attribution require verified workshop provenance.',
              ],
          suggestedStudioMotif: ALLOWED_MOTIFS.has(parsed.suggestedStudioMotif)
            ? parsed.suggestedStudioMotif
            : 'star-trellis',
        },
      });
    } catch (error) {
      const mapped = mapGeminiError(error);
      res.status(mapped.status).json(mapped);
    }
  });

  // ---------------------------------------------------------------------------
  // FEATURE 4: AI PRODUCT ASSISTANT (/api/ai/product)
  // ---------------------------------------------------------------------------
  app.post('/api/ai/product', async (req: Request, res: Response) => {
    try {
      const config = req.body?.config;
      const activeMockup = typeof req.body?.activeMockup === 'string' ? req.body.activeMockup : 'notebook';
      const audienceGoal =
        typeof req.body?.audienceGoal === 'string' ? req.body.audienceGoal.trim().slice(0, 200) : '';

      if (!config || typeof config !== 'object' || !ALLOWED_MOTIFS.has(config.motifId)) {
        return res.status(400).json({
          code: 'INVALID_CONFIG',
          message: 'Current pattern configuration is missing or invalid.',
        });
      }

      const ai = getGeminiClient();

      const systemInstruction = `You are the Cultural Product & Creative Direction Assistant for Ajrak Lab.
Given the user's current parametric pattern configuration (motif study, layout, colors, border) and active product context, help them envision thoughtful physical or educational product applications.

CRITICAL CULTURAL & ETHICAL RULES:
- Frame every product concept as a contemporary computational geometric design INSPIRED by Sindhi textile structure—NEVER market or label it as authentic hand-printed traditional Ajrak.
- Recommend practical materials (e.g., screen-printed organic cotton, recycled bookcloth, archival giclée cotton rag) and acknowledge living Sindh artisan collaborations where relevant.
- Do not include pricing, checkout links, or commercial payment claims.
- Palette suggestions must use valid 6-digit hex codes and harmonious ground/primary/secondary/accent/outline roles.`;

      const prompt = `Current Ajrak Lab Pattern Study:
- Motif Study: ${config.motifId}
- Grid Layout: ${config.gridLayout} (${config.gridDensity}x${config.gridDensity}, scale ${config.motifScale}, rotation ${config.rotation}°)
- Hasheeya Border: ${config.showBorder ? `Enabled (${config.borderWidth}px)` : 'Disabled'}
- Current Colors: ground=${config.customColors?.ground}, primary=${config.customColors?.primary}, secondary=${config.customColors?.secondary}, accent=${config.customColors?.accent}, outline=${config.customColors?.outline}
- Active Product Mockup: ${activeMockup}
${audienceGoal ? `- Creator Focus / Goal: "${audienceGoal}"` : ''}`;

      const response = await withRetry(() =>
        ai.models.generateContent({
          model: GEMINI_MODEL,
          contents: prompt,
          config: {
            systemInstruction,
            thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                productNames: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: '3 thoughtful, culturally respectful product title ideas.',
                },
                productConcepts: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      title: { type: Type.STRING },
                      format: { type: Type.STRING },
                      materialNote: { type: Type.STRING },
                    },
                    required: ['title', 'format', 'materialNote'],
                  },
                  description: '2-3 tangible product concepts tailored to this pattern geometry.',
                },
                designDescription: {
                  type: Type.STRING,
                  description:
                    'Editorial product description (3 sentences) noting the geometry and transparent digital inspiration.',
                },
                packagingConcept: {
                  type: Type.STRING,
                  description:
                    'Tactile, sustainable packaging concept referencing craft heritage card inserts and maker attribution.',
                },
                socialMediaCaption: {
                  type: Type.STRING,
                  description:
                    'Respectful, engaging social caption highlighting geometry exploration and crediting Sindhi craft custodians.',
                },
                colorVariations: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      name: { type: Type.STRING },
                      rationale: { type: Type.STRING },
                      ground: { type: Type.STRING },
                      primary: { type: Type.STRING },
                      secondary: { type: Type.STRING },
                      accent: { type: Type.STRING },
                      outline: { type: Type.STRING },
                    },
                    required: ['name', 'rationale', 'ground', 'primary', 'secondary', 'accent', 'outline'],
                  },
                  description: '2 alternative colorway suggestions with valid 6-digit hex codes.',
                },
              },
              required: [
                'productNames',
                'productConcepts',
                'designDescription',
                'packagingConcept',
                'socialMediaCaption',
                'colorVariations',
              ],
            },
          },
        })
      );

      const parsed = JSON.parse(stripJsonFences(response.text ?? ''));

      const sanitizedVariations = Array.isArray(parsed.colorVariations)
        ? parsed.colorVariations.slice(0, 3).map((v: Record<string, unknown>) => ({
            name: typeof v.name === 'string' ? v.name : 'Studio Colorway',
            rationale: typeof v.rationale === 'string' ? v.rationale : '',
            colors: {
              ground: isValidHex(v.ground) ? v.ground : '#0c2033',
              primary: isValidHex(v.primary) ? v.primary : '#8c2527',
              secondary: isValidHex(v.secondary) ? v.secondary : '#183856',
              accent: isValidHex(v.accent) ? v.accent : '#f5eedd',
              outline: isValidHex(v.outline) ? v.outline : '#15171a',
            },
          }))
        : [];

      res.json({
        pack: {
          productNames: Array.isArray(parsed.productNames) ? parsed.productNames.slice(0, 4) : [],
          productConcepts: Array.isArray(parsed.productConcepts) ? parsed.productConcepts.slice(0, 3) : [],
          designDescription: typeof parsed.designDescription === 'string' ? parsed.designDescription : '',
          packagingConcept: typeof parsed.packagingConcept === 'string' ? parsed.packagingConcept : '',
          socialMediaCaption: typeof parsed.socialMediaCaption === 'string' ? parsed.socialMediaCaption : '',
          colorVariations: sanitizedVariations,
        },
      });
    } catch (error) {
      const mapped = mapGeminiError(error);
      res.status(mapped.status).json(mapped);
    }
  });

  // Mount Vite middleware in development, static dist in production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`Ajrak Lab server listening on http://0.0.0.0:${port}`);
  });
}

createApp().catch((err) => {
  console.error('Failed to start Ajrak Lab server:', err);
  process.exit(1);
});
