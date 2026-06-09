import { generateText, Output } from "ai";
import { analysisModel, ANALYSIS_MODEL_ID } from "./model";
import { analysisSchema, type FeatureId } from "./schemas";
import { buildDirective, SYSTEM_PROMPT } from "./prompts";
import { ingest } from "./ingest";
import type { AnalyzeRequest, AnalyzeResponse } from "./types";

type TextPart = { type: "text"; text: string };
type ImagePart = { type: "image"; image: string };

export async function runAnalysis(
  request: AnalyzeRequest
): Promise<AnalyzeResponse> {
  const features: FeatureId[] = request.features ?? [];
  const ingested = await ingest(request.content);

  const directive = buildDirective({
    kind: request.content.type,
    features,
    profile: request.profile,
    extractedText: ingested.extractedText,
    hasImage: Boolean(ingested.imageDataUrl),
    ingestionNotes: ingested.notes,
  });

  const parts: Array<TextPart | ImagePart> = [{ type: "text", text: directive }];
  if (ingested.imageDataUrl) {
    parts.push({ type: "image", image: ingested.imageDataUrl });
  }

  const { output } = await generateText({
    model: analysisModel,
    system: SYSTEM_PROMPT,
    messages: [{ role: "user", content: parts }],
    output: Output.object({ schema: analysisSchema }),
  });

  return {
    analysis: output,
    meta: {
      sourceLabel: ingested.sourceLabel,
      sourceKind: request.content.type,
      notes: ingested.notes,
      model: ANALYSIS_MODEL_ID,
      createdAt: new Date().toISOString(),
    },
  };
}
