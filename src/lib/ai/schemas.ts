import { z } from "zod";

/**
 * Structured output schema for the Black Swan analysis pipeline.
 *
 * The `transformation` block is always produced (the core Transformation
 * Engine). Every other block is a feature module that the model populates only
 * when requested — otherwise it returns `null`. We use `.nullable()` rather than
 * `.optional()` so the schema stays compatible with OpenAI strict JSON output.
 */

export const RISK_BANDS = ["Low", "Elevated", "Severe", "Critical"] as const;
export type RiskBand = (typeof RISK_BANDS)[number];

export const ESCALATION_TRENDS = [
  "de-escalating",
  "stable",
  "escalating",
  "volatile",
] as const;

export const FEATURE_IDS = [
  "narrative",
  "coach",
  "personalLens",
  "misogynoir",
  "conversation",
] as const;
export type FeatureId = (typeof FEATURE_IDS)[number];

const riskCategory = z.object({
  name: z.string().describe("Policy-aligned risk dimension name"),
  score: z.number().describe("Severity for this dimension, 0-100"),
  rationale: z.string().describe("One-sentence justification for the score"),
});

// 1. Transformation Engine — the core differentiator. Always present.
export const transformationSchema = z.object({
  riskScore: z.number().describe("Overall misogyny risk, 0-100"),
  band: z.enum(RISK_BANDS),
  confidence: z.number().describe("Model confidence in the assessment, 0-1"),
  summary: z.string().describe("Two-to-three sentence plain-language verdict"),
  categories: z
    .array(riskCategory)
    .describe("Risk decomposed across distinct dimensions"),
  signals: z
    .array(z.string())
    .describe("Concrete textual/visual signals that drove the score"),
  reclaimedOrCritique: z
    .boolean()
    .describe(
      "True when language is reclaimed speech or critique OF misogyny rather than hostility toward women"
    ),
});

// 3. Narrative Explanation Engine — educational, actionable breakdown.
export const narrativeSchema = z.object({
  explanation: z
    .string()
    .describe("Clear, educational explanation of why this scored as it did"),
  keyTerms: z
    .array(z.object({ term: z.string(), definition: z.string() }))
    .describe("Concepts a non-expert should understand"),
  whyItMatters: z.string(),
});

// 4. Response Coach — practical next steps.
export const coachSchema = z.object({
  readback: z.string().describe("Empathetic summary of the user's situation"),
  options: z
    .array(
      z.object({
        label: z.string(),
        approach: z
          .string()
          .describe("e.g. reply, set boundary, report, document, disengage"),
        script: z.string().describe("A concrete example the user could use"),
        rationale: z.string(),
      })
    )
    .describe("2-4 practical paths forward"),
  safetyNote: z.string(),
  whenToEscalate: z.string(),
});

// 2. Personal Lens — tailors the reading to the individual user context.
export const personalLensSchema = z.object({
  tailoredReading: z.string(),
  likelyImpact: z.string(),
  validation: z.string(),
  suggestedFocus: z.array(z.string()),
});

// 5. Misogynoir Lens — intersectional analysis (misogyny + anti-Black racism).
export const misogynoirLensSchema = z.object({
  present: z.boolean(),
  analysis: z.string(),
  intersectionalSignals: z.array(z.string()),
  notes: z.string(),
});

// 6. Conversation Analyzer — multi-turn dynamics.
export const conversationSchema = z.object({
  escalationTrend: z.enum(ESCALATION_TRENDS),
  targeting: z.string().describe("Who is being targeted and how"),
  dynamics: z.string().describe("Power, coordination, and escalation dynamics"),
  turns: z.array(
    z.object({
      index: z.number(),
      speaker: z.string(),
      excerpt: z.string(),
      riskScore: z.number(),
      note: z.string(),
    })
  ),
});

export const analysisSchema = z.object({
  transformation: transformationSchema,
  narrative: narrativeSchema.nullable(),
  coach: coachSchema.nullable(),
  personalLens: personalLensSchema.nullable(),
  misogynoirLens: misogynoirLensSchema.nullable(),
  conversation: conversationSchema.nullable(),
});

export type Analysis = z.infer<typeof analysisSchema>;
export type Transformation = z.infer<typeof transformationSchema>;
export type Narrative = z.infer<typeof narrativeSchema>;
export type Coach = z.infer<typeof coachSchema>;
export type PersonalLens = z.infer<typeof personalLensSchema>;
export type MisogynoirLens = z.infer<typeof misogynoirLensSchema>;
export type ConversationAnalysis = z.infer<typeof conversationSchema>;
