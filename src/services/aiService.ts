import { PatternConfig, MockupType } from '../types/pattern';
import {
  AiDesignSuggestion,
  AiGuideReply,
  AiProductPack,
  AiTextileAnalysis,
} from '../types/ai';

export class AiServiceError extends Error {
  code: string;
  status: number;

  constructor(message: string, code = 'UNKNOWN_ERROR', status = 500) {
    super(message);
    this.name = 'AiServiceError';
    this.code = code;
    this.status = status;
  }
}

async function postJson<T>(url: string, body: unknown, signal?: AbortSignal): Promise<T> {
  let response: Response;
  try {
    response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal,
    });
  } catch (err) {
    if (err instanceof DOMException && err.name === 'AbortError') {
      throw new AiServiceError('Request was cancelled.', 'ABORTED', 499);
    }
    throw new AiServiceError(
      'Unable to reach the Ajrak Lab AI server. All manual studio features remain available.',
      'NETWORK_ERROR',
      0
    );
  }

  let data: unknown;
  try {
    data = await response.json();
  } catch {
    throw new AiServiceError(
      'Received an unreadable response from the server. Please try again.',
      'PARSE_ERROR',
      response.status
    );
  }

  if (!response.ok) {
    const errObj = data as { message?: string; code?: string };
    throw new AiServiceError(
      errObj?.message || 'The AI assistant encountered an error. Please try again.',
      errObj?.code || 'API_ERROR',
      response.status
    );
  }

  return data as T;
}

export async function requestAiDesign(params: {
  prompt: string;
  variationMode?: boolean;
  currentConfig?: PatternConfig;
  signal?: AbortSignal;
}): Promise<AiDesignSuggestion> {
  const result = await postJson<{ suggestion: AiDesignSuggestion }>(
    '/api/ai/design',
    {
      prompt: params.prompt,
      variationMode: Boolean(params.variationMode),
      currentConfig: params.currentConfig,
    },
    params.signal
  );
  return result.suggestion;
}

export async function requestAiGuide(params: {
  question: string;
  history?: { role: 'user' | 'assistant'; content: string }[];
  signal?: AbortSignal;
}): Promise<AiGuideReply> {
  const result = await postJson<{ reply: AiGuideReply }>(
    '/api/ai/guide',
    {
      question: params.question,
      history: params.history,
    },
    params.signal
  );
  return result.reply;
}

export async function requestAiTextileAnalysis(params: {
  imageBase64: string;
  mimeType: string;
  note?: string;
  signal?: AbortSignal;
}): Promise<AiTextileAnalysis> {
  const result = await postJson<{ analysis: AiTextileAnalysis }>(
    '/api/ai/analyze-textile',
    {
      imageBase64: params.imageBase64,
      mimeType: params.mimeType,
      note: params.note,
    },
    params.signal
  );
  return result.analysis;
}

export async function requestAiProductPack(params: {
  config: PatternConfig;
  activeMockup: MockupType;
  audienceGoal?: string;
  signal?: AbortSignal;
}): Promise<AiProductPack> {
  const result = await postJson<{ pack: AiProductPack }>(
    '/api/ai/product',
    {
      config: params.config,
      activeMockup: params.activeMockup,
      audienceGoal: params.audienceGoal,
    },
    params.signal
  );
  return result.pack;
}
