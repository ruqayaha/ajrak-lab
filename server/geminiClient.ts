import { GoogleGenAI } from '@google/genai';

export const GEMINI_MODEL = 'gemini-4-hydrogen';

let cachedClient: GoogleGenAI | null = null;

export function getGeminiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey) {
    const err = new Error(
      'GEMINI_API_KEY is not configured in the server environment. Please configure it in Settings > Secrets.'
    ) as Error & { statusCode?: number; code?: string };
    err.statusCode = 503;
    err.code = 'MISSING_API_KEY';
    throw err;
  }

  if (!cachedClient) {
    cachedClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }

  return cachedClient;
}

export interface FriendlyApiError {
  status: number;
  code: string;
  message: string;
}

export function mapGeminiError(error: unknown): FriendlyApiError {
  const rawMessage = error instanceof Error ? error.message : String(error);
  const statusFromError =
    typeof error === 'object' && error !== null && 'status' in error
      ? Number((error as { status?: unknown }).status)
      : typeof error === 'object' && error !== null && 'statusCode' in error
      ? Number((error as { statusCode?: unknown }).statusCode)
      : undefined;

  if (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    (error as { code?: string }).code === 'MISSING_API_KEY'
  ) {
    return {
      status: 503,
      code: 'MISSING_API_KEY',
      message:
        'AI studio features are currently unavailable because the server API key is not configured. All manual pattern tools remain fully usable.',
    };
  }

  const lower = rawMessage.toLowerCase();

  if (
    statusFromError === 401 ||
    statusFromError === 403 ||
    lower.includes('permission_denied') ||
    lower.includes('api_key_invalid') ||
    lower.includes('api key not valid')
  ) {
    return {
      status: 403,
      code: 'API_KEY_INVALID',
      message:
        'The Gemini API key could not be authenticated. Please verify your key in the Settings > Secrets panel.',
    };
  }

  if (statusFromError === 429 || lower.includes('resource_exhausted') || lower.includes('quota')) {
    return {
      status: 429,
      code: 'RATE_LIMIT_EXCEEDED',
      message:
        'The AI studio reached its request quota limit. Please wait a moment and try again, or continue using the manual Pattern Studio.',
    };
  }

  if (statusFromError === 404 || lower.includes('not_found')) {
    return {
      status: 502,
      code: 'MODEL_UNAVAILABLE',
      message: 'The configured Gemini model endpoint was unavailable. Please try again shortly.',
    };
  }

  if (lower.includes('json') || lower.includes('parse')) {
    return {
      status: 502,
      code: 'INVALID_AI_OUTPUT',
      message: 'The assistant returned an unexpected format. Please rephrase or try again.',
    };
  }

  return {
    status: statusFromError && statusFromError >= 400 ? statusFromError : 500,
    code: 'GEMINI_UPSTREAM_ERROR',
    message:
      'Unable to reach the AI assistant right now. You can continue designing manually in the Pattern Studio.',
  };
}

export async function withRetry<T>(fn: () => Promise<T>, maxRetries = 2): Promise<T> {
  let lastError: unknown;
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err;
      const msg = err instanceof Error ? err.message.toLowerCase() : '';
      const status =
        typeof err === 'object' && err !== null && 'status' in err
          ? Number((err as { status?: unknown }).status)
          : 0;

      // Do not retry auth, bad request, or missing key errors
      if (
        status === 400 ||
        status === 401 ||
        status === 403 ||
        status === 404 ||
        msg.includes('api_key') ||
        msg.includes('permission_denied')
      ) {
        throw err;
      }

      if (attempt < maxRetries) {
        const delayMs = 600 * Math.pow(2, attempt);
        await new Promise((resolve) => setTimeout(resolve, delayMs));
      }
    }
  }
  throw lastError;
}
