import type { Analysis, FeatureId } from "./schemas";

export type { FeatureId } from "./schemas";

/** A single message inside a conversation submitted for analysis. */
export interface ConversationMessage {
  speaker: string;
  text: string;
}

/** Optional user context that powers the Personal Lens. */
export interface UserProfile {
  /** Who the user is / relevant identity context (free text). */
  context?: string;
  /** What the user wants out of this analysis. */
  goals?: string;
  /** How sensitive / what tone the user wants in the response. */
  sensitivity?: string;
}

export type ContentInput =
  | { type: "text"; text: string }
  | { type: "url"; url: string }
  | { type: "image"; dataUrl: string; mediaType: string; name?: string }
  | { type: "audio"; dataUrl: string; mediaType: string; name?: string }
  | { type: "video"; dataUrl: string; mediaType: string; name?: string }
  | { type: "conversation"; messages: ConversationMessage[] };

export type ContentKind = ContentInput["type"];

export interface AnalyzeRequest {
  content: ContentInput;
  /** Optional feature modules to run in addition to the Transformation Engine. */
  features?: FeatureId[];
  /** Drives the Personal Lens module. */
  profile?: UserProfile;
}

export interface AnalysisMeta {
  sourceLabel: string;
  sourceKind: ContentKind;
  notes: string[];
  model: string;
  createdAt: string;
}

export interface AnalyzeResponse {
  analysis: Analysis;
  meta: AnalysisMeta;
}
