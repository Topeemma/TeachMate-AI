import dotenv from 'dotenv';

dotenv.config();

export interface ProviderConfig {
  apiKey?: string;
  enabled: boolean;
  maxDurationSeconds?: number;
  notes?: string;
}

export interface ServerConfig {
  port: number;
  environment: string;
  gemini: {
    apiKey?: string;
    model: string;
    temperature: number;
    enabled: boolean;
  };
  providers: {
    pixverse: ProviderConfig;
    padi: ProviderConfig; // Reserved optional provider for extended clip generation
  };
}

export function loadServerConfig(): ServerConfig {
  const geminiKey = process.env.GEMINI_API_KEY;
  const pixverseKey = process.env.PIXVERSE_API_KEY;
  const padiKey = process.env.PADI_API_KEY;

  const isGeminiValid = Boolean(geminiKey && geminiKey !== 'MY_GEMINI_API_KEY' && geminiKey.trim().length > 0);
  const isPixverseValid = Boolean(pixverseKey && pixverseKey.trim().length > 0);
  const isPadiValid = Boolean(padiKey && padiKey.trim().length > 0);

  // Non-crashing warning logger for missing optional secret keys
  if (!isGeminiValid) {
    console.warn('⚠️ [TeachMate AI Config] GEMINI_API_KEY is missing or unconfigured. AI generation endpoints will use fallback mock pipeline.');
  }

  if (!isPixverseValid) {
    console.warn('ℹ️ [TeachMate AI Config] PIXVERSE_API_KEY is not configured. Topic video generator will render animated 15s canvas video streams.');
  }

  if (!isPadiValid) {
    console.warn('ℹ️ [TeachMate AI Config] PADI_API_KEY is not configured (reserved provider for extended video clips). PADI video provider is disabled.');
  }

  return {
    port: 3000,
    environment: process.env.NODE_ENV || 'development',
    gemini: {
      apiKey: geminiKey,
      model: 'gemini-3.6-flash',
      temperature: 0.3,
      enabled: isGeminiValid,
    },
    providers: {
      pixverse: {
        apiKey: pixverseKey,
        maxDurationSeconds: 15,
        enabled: isPixverseValid,
        notes: 'Pixverse v2 API integration for 15s topic animation clips.',
      },
      padi: {
        apiKey: padiKey,
        maxDurationSeconds: 60,
        enabled: isPadiValid,
        notes: 'Reserved video extension provider for multi-minute lesson video synthesis.',
      },
    },
  };
}

export const serverConfig = loadServerConfig();

export function isPixverseEnabled(): boolean {
  return serverConfig.providers.pixverse.enabled;
}

export function isPadiEnabled(): boolean {
  return serverConfig.providers.padi.enabled;
}

export function isGeminiEnabled(): boolean {
  return serverConfig.gemini.enabled;
}
