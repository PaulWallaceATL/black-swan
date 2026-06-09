import { experimental_transcribe as transcribe } from "ai";
import { transcriptionModel } from "./model";
import type { ContentInput } from "./types";

export interface Ingested {
  sourceLabel: string;
  /** Plain text the model should reason over (transcript, page text, etc.). */
  extractedText: string;
  /** A data URL passed to the vision model when the source is an image. */
  imageDataUrl?: string;
  notes: string[];
}

const MAX_PAGE_CHARS = 16_000;

/** Normalizes any supported input into text (+ optional image) for analysis. */
export async function ingest(content: ContentInput): Promise<Ingested> {
  switch (content.type) {
    case "text":
      return {
        sourceLabel: "Pasted text",
        extractedText: content.text,
        notes: [`${content.text.length} characters`],
      };

    case "url":
      return ingestUrl(content.url);

    case "image":
      return {
        sourceLabel: content.name ?? "Image",
        extractedText: "",
        imageDataUrl: content.dataUrl,
        notes: ["Analyzed with vision model"],
      };

    case "audio":
    case "video":
      return ingestMedia(content);

    case "conversation": {
      const rendered = content.messages
        .map((m, i) => `[${i + 1}] ${m.speaker}: ${m.text}`)
        .join("\n");
      return {
        sourceLabel: `Conversation (${content.messages.length} messages)`,
        extractedText: rendered,
        notes: [`${content.messages.length} messages`],
      };
    }
  }
}

async function ingestUrl(url: string): Promise<Ingested> {
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    throw new Error(`Invalid URL: ${url}`);
  }
  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    throw new Error("Only http(s) URLs are supported.");
  }

  const res = await fetch(parsed, {
    headers: { "user-agent": "BlackSwanBot/1.0 (+misogyny-risk-analysis)" },
    signal: AbortSignal.timeout(15_000),
  });
  if (!res.ok) {
    throw new Error(`Failed to fetch URL (${res.status}).`);
  }

  const html = await res.text();
  const text = htmlToText(html);
  const truncated = text.slice(0, MAX_PAGE_CHARS);
  const notes = [`Fetched ${parsed.hostname}`, `${truncated.length} characters extracted`];
  if (text.length > MAX_PAGE_CHARS) notes.push("Content truncated");

  return {
    sourceLabel: parsed.hostname + parsed.pathname,
    extractedText: truncated,
    notes,
  };
}

async function ingestMedia(
  content: Extract<ContentInput, { type: "audio" | "video" }>
): Promise<Ingested> {
  const { data } = dataUrlToBuffer(content.dataUrl);
  const transcript = await transcribe({
    model: transcriptionModel,
    audio: data,
  });

  const notes = [
    content.type === "video"
      ? "Audio track transcribed (frames not analyzed)"
      : "Audio transcribed",
  ];
  if (transcript.durationInSeconds) {
    notes.push(`${Math.round(transcript.durationInSeconds)}s`);
  }

  return {
    sourceLabel: content.name ?? (content.type === "video" ? "Video" : "Audio"),
    extractedText: transcript.text,
    notes,
  };
}

function dataUrlToBuffer(dataUrl: string): { data: Buffer; mediaType?: string } {
  const match = /^data:([^;]+);base64,([\s\S]*)$/.exec(dataUrl);
  if (!match) {
    // Assume it is already raw base64.
    return { data: Buffer.from(dataUrl, "base64") };
  }
  return { data: Buffer.from(match[2], "base64"), mediaType: match[1] };
}

/** Minimal, dependency-free HTML → text extraction. */
function htmlToText(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, " ")
    .replace(/<!--[\s\S]*?-->/g, " ")
    .replace(/<\/(p|div|li|h[1-6]|br|tr)>/gi, "\n")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}
