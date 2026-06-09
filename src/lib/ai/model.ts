import { createOpenAI } from "@ai-sdk/openai";

/**
 * Black Swan routes all model calls through the OpenAI provider using the
 * user-supplied `OPENAI_API_KEY`. Model IDs are env-overridable so the engine
 * can be moved onto newer models (e.g. `gpt-5.5`) without code changes.
 */
const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Vision-capable model used for the core analysis (text + image reasoning).
export const ANALYSIS_MODEL_ID = process.env.OPENAI_ANALYSIS_MODEL ?? "gpt-4o";

// Transcription model for audio + video tracks.
export const TRANSCRIPTION_MODEL_ID =
  process.env.OPENAI_TRANSCRIPTION_MODEL ?? "whisper-1";

export const analysisModel = openai(ANALYSIS_MODEL_ID);
export const transcriptionModel = openai.transcription(TRANSCRIPTION_MODEL_ID);

export function hasOpenAiKey(): boolean {
  return Boolean(process.env.OPENAI_API_KEY);
}
