import type { RiskBand } from "./schemas";

export const BAND_COLOR: Record<RiskBand, string> = {
  Low: "var(--rose-gold)",
  Elevated: "var(--blush)",
  Severe: "var(--mulberry)",
  Critical: "var(--violet)",
};

export function bandForScore(score: number): RiskBand {
  if (score >= 85) return "Critical";
  if (score >= 60) return "Severe";
  if (score >= 30) return "Elevated";
  return "Low";
}

export function bandColor(band: RiskBand): string {
  return BAND_COLOR[band];
}
