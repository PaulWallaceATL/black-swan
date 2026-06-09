import { runAnalysis } from "@/lib/ai/analyze";
import { hasOpenAiKey } from "@/lib/ai/model";
import type { AnalyzeRequest, ContentInput } from "@/lib/ai/types";
import { FEATURE_IDS, type FeatureId } from "@/lib/ai/schemas";

// Analysis (vision + transcription) can take a while; allow up to 5 minutes.
export const maxDuration = 300;

export async function POST(request: Request) {
  if (!hasOpenAiKey()) {
    return Response.json(
      {
        error:
          "Missing OPENAI_API_KEY. Add it to your environment (Vercel project settings or .env.local).",
      },
      { status: 500 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const parsed = parseRequest(body);
  if ("error" in parsed) {
    return Response.json({ error: parsed.error }, { status: 400 });
  }

  try {
    const result = await runAnalysis(parsed.value);
    return Response.json(result);
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Analysis failed unexpectedly.";
    console.error("[analyze] error:", err);
    return Response.json({ error: message }, { status: 500 });
  }
}

function parseRequest(
  body: unknown
): { value: AnalyzeRequest } | { error: string } {
  if (typeof body !== "object" || body === null) {
    return { error: "Request body must be an object." };
  }
  const b = body as Record<string, unknown>;

  const content = parseContent(b.content);
  if ("error" in content) return { error: content.error };

  const features = Array.isArray(b.features)
    ? (b.features.filter((f): f is FeatureId =>
        (FEATURE_IDS as readonly string[]).includes(f as string)
      ) as FeatureId[])
    : [];

  const profile =
    typeof b.profile === "object" && b.profile !== null
      ? (b.profile as AnalyzeRequest["profile"])
      : undefined;

  return { value: { content: content.value, features, profile } };
}

function parseContent(
  content: unknown
): { value: ContentInput } | { error: string } {
  if (typeof content !== "object" || content === null) {
    return { error: "`content` is required." };
  }
  const c = content as Record<string, unknown>;

  switch (c.type) {
    case "text":
      if (typeof c.text !== "string" || c.text.trim() === "")
        return { error: "Text content is empty." };
      return { value: { type: "text", text: c.text } };

    case "url":
      if (typeof c.url !== "string" || c.url.trim() === "")
        return { error: "URL is required." };
      return { value: { type: "url", url: c.url } };

    case "image":
    case "audio":
    case "video":
      if (typeof c.dataUrl !== "string" || c.dataUrl === "")
        return { error: `${c.type} data is missing.` };
      return {
        value: {
          type: c.type,
          dataUrl: c.dataUrl,
          mediaType: typeof c.mediaType === "string" ? c.mediaType : "",
          name: typeof c.name === "string" ? c.name : undefined,
        },
      };

    case "conversation": {
      if (!Array.isArray(c.messages) || c.messages.length === 0)
        return { error: "Conversation needs at least one message." };
      const messages = c.messages
        .map((m) => m as Record<string, unknown>)
        .filter((m) => typeof m.text === "string" && m.text.trim() !== "")
        .map((m) => ({
          speaker: typeof m.speaker === "string" && m.speaker ? m.speaker : "Unknown",
          text: m.text as string,
        }));
      if (messages.length === 0)
        return { error: "Conversation messages are empty." };
      return { value: { type: "conversation", messages } };
    }

    default:
      return { error: "Unsupported content type." };
  }
}
