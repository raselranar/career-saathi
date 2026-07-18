import { google } from "@ai-sdk/google";
import { createGroq } from "@ai-sdk/groq";
import { streamText } from "ai";

const groq = createGroq({
  apiKey: process.env.GROQ_API_KEY,
});

interface ModelEntry {
  provider: string;
  id: string;
  model: () => ReturnType<typeof google>;
}

const FALLBACK_MODELS: ModelEntry[] = [
  {
    provider: "groq",
    id: "llama-3.3-70b-versatile",
    model: () => groq("llama-3.3-70b-versatile"),
  },
  {
    provider: "google",
    id: "gemini-2.0-flash",
    model: () => google("gemini-2.0-flash"),
  },
  {
    provider: "google",
    id: "gemini-1.5-flash",
    model: () => google("gemini-1.5-flash"),
  },
];

interface ApiError {
  statusCode?: number;
  status?: number;
  responseStatus?: number;
  message?: string;
}

function isQuotaError(error: unknown): boolean {
  const e = error as ApiError;
  const status = e?.statusCode ?? e?.status ?? e?.responseStatus;
  return status === 429 || /quota|rate.?limit/i.test(String(e?.message));
}

/**
 * Attempts streamText with fallback models across providers on 429 / quota errors.
 * streamText throws synchronously on 429 (before stream creation), so try/catch works.
 */
export async function streamTextWithFallback(opts: Record<string, unknown>) {
  let lastError: unknown;

  for (const entry of FALLBACK_MODELS) {
    try {
      const result = await streamText({
        ...opts,
        model: entry.model(),
        maxRetries: 0,
      } as Parameters<typeof streamText>[0]);

      return result;
    } catch (error: unknown) {
      if (isQuotaError(error)) {
        console.warn(
          `[${entry.provider}] ${entry.id} quota exceeded, trying next…`,
        );
        lastError = error;
        continue;
      }
      throw error;
    }
  }

  throw lastError ?? new Error("All fallback models exhausted");
}
