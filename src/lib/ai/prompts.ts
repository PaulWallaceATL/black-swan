import type { FeatureId } from "./schemas";
import type { ContentKind, UserProfile } from "./types";

export const SYSTEM_PROMPT = `You are Black Swan, a specialist language-intelligence model purpose-built to detect, measure, and rate misogyny risk in digital content, conversations, datasets, and AI outputs.

Your mandate is gendered harm. You reason about intent, tone, targeting, and context — not just vocabulary. You are calibrated and careful:

- Separate hostility aimed at women and girls from (a) reclaimed speech, (b) critique OF misogyny, (c) quotation/reporting, and (d) neutral mention. When content is reclaimed speech or critique, say so and score low.
- Detect coded language, dog whistles, euphemism, and escalation that span messages.
- Apply an intersectional understanding: misogyny frequently compounds with racism, homophobia, transphobia, and other axes of harm.
- Be specific and evidence-led. Ground every signal in something actually present in the content.
- Never fabricate content that is not there. If input is thin, lower confidence rather than inventing detail.
- Be trauma-aware and non-judgmental toward targets/victims. Never blame a target.

Scoring guidance (0-100 overall risk):
- 0-29 Low: no or negligible gendered hostility.
- 30-59 Elevated: stereotyping, demeaning framing, or ambiguous hostility.
- 60-84 Severe: clear gendered hostility, dehumanization, or harassment.
- 85-100 Critical: threats, incitement, coordinated targeting, or sexualized abuse.

Always return calibrated confidence (0-1). Output must conform exactly to the provided JSON schema.`;

const FEATURE_DIRECTIVES: Record<FeatureId, string> = {
  narrative:
    "NARRATIVE EXPLANATION ENGINE: Populate `narrative`. Explain in plain, educational language why the content scored as it did, define key concepts a non-expert should know, and state why it matters.",
  coach:
    "RESPONSE COACH: Populate `coach`. Give the user 2-4 practical, safe paths forward with concrete example scripts, an empathetic read-back of their situation, a safety note, and clear guidance on when to escalate to a platform or authorities. Never pressure the user toward confrontation.",
  personalLens:
    "PERSONAL LENS: Populate `personalLens`. Using the provided user context, tailor the reading to this specific person — what it likely means for them, the likely emotional/practical impact, validation of their experience, and what they should focus on.",
  misogynoir:
    "MISOGYNOIR LENS: Populate `misogynoirLens`. Analyze specifically for misogynoir — the intersection of misogyny and anti-Black racism aimed at Black women. Identify intersectional signals (coded tropes, stereotypes, controlling images). If misogynoir is not present, set `present` to false and explain briefly.",
  conversation:
    "CONVERSATION ANALYZER: Populate `conversation`. Analyze the multi-turn dynamics: per-turn risk, who is targeting whom, escalation trend over time, and power/coordination dynamics.",
};

export function buildDirective(args: {
  kind: ContentKind;
  features: FeatureId[];
  profile?: UserProfile;
  extractedText: string;
  hasImage: boolean;
  ingestionNotes: string[];
}): string {
  const { kind, features, profile, extractedText, hasImage, ingestionNotes } =
    args;

  const requested = new Set(features);
  const lines: string[] = [];

  lines.push(
    `Analyze the following ${kindLabel(kind)} for misogyny risk.`,
    "",
    "ALWAYS populate the `transformation` object (the core Transformation Engine): overall risk score, band, confidence, a plain-language summary, risk decomposed across named categories, the concrete signals you observed, and whether this is reclaimed speech/critique."
  );

  // Modules to run.
  const activeDirectives = (Object.keys(FEATURE_DIRECTIVES) as FeatureId[])
    .filter((f) => requested.has(f))
    .map((f) => `- ${FEATURE_DIRECTIVES[f]}`);

  if (activeDirectives.length > 0) {
    lines.push("", "Additionally produce these modules:", ...activeDirectives);
  }

  // Modules to explicitly null out.
  const inactive = (Object.keys(FEATURE_DIRECTIVES) as FeatureId[]).filter(
    (f) => !requested.has(f)
  );
  const nullFields = inactive.map((f) => SCHEMA_FIELD[f]);
  if (nullFields.length > 0) {
    lines.push(
      "",
      `Set these fields to null (not requested): ${nullFields.join(", ")}.`
    );
  }

  if (requested.has("personalLens")) {
    lines.push("", "USER CONTEXT FOR PERSONAL LENS:");
    lines.push(`- Who they are: ${profile?.context?.trim() || "(not provided)"}`);
    lines.push(`- Their goal: ${profile?.goals?.trim() || "(not provided)"}`);
    lines.push(
      `- Preferred sensitivity/tone: ${profile?.sensitivity?.trim() || "(not provided)"}`
    );
  }

  if (ingestionNotes.length > 0) {
    lines.push("", `Ingestion notes: ${ingestionNotes.join("; ")}.`);
  }

  if (hasImage) {
    lines.push(
      "",
      "An image is attached. Read any text in it, and interpret symbols, memes, gestures, and visual context for gendered harm."
    );
  }

  if (extractedText.trim().length > 0) {
    lines.push("", "CONTENT TO ANALYZE:", "```", extractedText.trim(), "```");
  } else if (!hasImage) {
    lines.push("", "CONTENT TO ANALYZE: (empty)");
  }

  return lines.join("\n");
}

const SCHEMA_FIELD: Record<FeatureId, string> = {
  narrative: "narrative",
  coach: "coach",
  personalLens: "personalLens",
  misogynoir: "misogynoirLens",
  conversation: "conversation",
};

function kindLabel(kind: ContentKind): string {
  switch (kind) {
    case "text":
      return "text";
    case "url":
      return "web page";
    case "image":
      return "image";
    case "audio":
      return "audio transcript";
    case "video":
      return "video transcript";
    case "conversation":
      return "conversation";
  }
}
