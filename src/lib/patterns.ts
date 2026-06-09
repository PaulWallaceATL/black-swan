"use client";

import type { RiskBand } from "@/lib/ai/schemas";
import type { AnalyzeResponse, ContentKind, FeatureId } from "@/lib/ai/types";

/**
 * Pattern Tracker storage.
 *
 * Longitudinal history is persisted in localStorage so the engine can surface
 * trends across analyses without requiring an account. Swap this module for a
 * database-backed implementation (keyed by user id) to enable cross-device,
 * multi-user pattern tracking.
 */

const STORAGE_KEY = "black-swan:pattern-history:v1";
const MAX_RECORDS = 200;

export interface PatternRecord {
  id: string;
  createdAt: string;
  sourceLabel: string;
  sourceKind: ContentKind;
  riskScore: number;
  band: RiskBand;
  confidence: number;
  summary: string;
  topCategories: { name: string; score: number }[];
  features: FeatureId[];
}

export interface PatternStats {
  total: number;
  averageRisk: number;
  bandCounts: Record<RiskBand, number>;
  /** Direction of the last 5 vs the previous 5 analyses. */
  trend: "rising" | "falling" | "steady" | "insufficient";
  trendDelta: number;
  topCategories: { name: string; count: number; averageScore: number }[];
  series: { createdAt: string; riskScore: number }[];
}

/**
 * External store wiring so React components can subscribe via
 * `useSyncExternalStore` (correct for SSR + avoids cascading-render effects).
 */
let cache: PatternRecord[] | null = null;
const listeners = new Set<() => void>();
const SERVER_SNAPSHOT: PatternRecord[] = [];

function load(): PatternRecord[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as PatternRecord[]) : [];
  } catch {
    return [];
  }
}

function write(records: PatternRecord[]): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(records.slice(0, MAX_RECORDS))
    );
  } catch {
    // Storage full or unavailable — fail silently.
  }
}

function emit(): void {
  for (const listener of listeners) listener();
}

export function subscribePatterns(listener: () => void): () => void {
  listeners.add(listener);
  const onStorage = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY) {
      cache = load();
      emit();
    }
  };
  if (typeof window !== "undefined") {
    window.addEventListener("storage", onStorage);
  }
  return () => {
    listeners.delete(listener);
    if (typeof window !== "undefined") {
      window.removeEventListener("storage", onStorage);
    }
  };
}

export function getPatternsSnapshot(): PatternRecord[] {
  if (cache === null) cache = load();
  return cache;
}

export function getPatternsServerSnapshot(): PatternRecord[] {
  return SERVER_SNAPSHOT;
}

export function getHistory(): PatternRecord[] {
  return getPatternsSnapshot();
}

export function recordAnalysis(
  response: AnalyzeResponse,
  features: FeatureId[]
): PatternRecord {
  const { analysis, meta } = response;
  const t = analysis.transformation;
  const record: PatternRecord = {
    id:
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(36).slice(2)}`,
    createdAt: meta.createdAt,
    sourceLabel: meta.sourceLabel,
    sourceKind: meta.sourceKind,
    riskScore: t.riskScore,
    band: t.band,
    confidence: t.confidence,
    summary: t.summary,
    topCategories: [...t.categories]
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .map((c) => ({ name: c.name, score: c.score })),
    features,
  };

  const next = [record, ...getPatternsSnapshot()];
  write(next);
  cache = next.slice(0, MAX_RECORDS);
  emit();
  return record;
}

export function clearHistory(): void {
  if (typeof window !== "undefined") {
    window.localStorage.removeItem(STORAGE_KEY);
  }
  cache = [];
  emit();
}

const EMPTY_BANDS: Record<RiskBand, number> = {
  Low: 0,
  Elevated: 0,
  Severe: 0,
  Critical: 0,
};

export function computeStats(records: PatternRecord[]): PatternStats {
  if (records.length === 0) {
    return {
      total: 0,
      averageRisk: 0,
      bandCounts: { ...EMPTY_BANDS },
      trend: "insufficient",
      trendDelta: 0,
      topCategories: [],
      series: [],
    };
  }

  // Records are newest-first; chronological for the series.
  const chronological = [...records].reverse();

  const bandCounts = { ...EMPTY_BANDS };
  for (const r of records) bandCounts[r.band] += 1;

  const averageRisk =
    records.reduce((sum, r) => sum + r.riskScore, 0) / records.length;

  const categoryMap = new Map<string, { count: number; total: number }>();
  for (const r of records) {
    for (const c of r.topCategories) {
      const entry = categoryMap.get(c.name) ?? { count: 0, total: 0 };
      entry.count += 1;
      entry.total += c.score;
      categoryMap.set(c.name, entry);
    }
  }
  const topCategories = [...categoryMap.entries()]
    .map(([name, { count, total }]) => ({
      name,
      count,
      averageScore: Math.round(total / count),
    }))
    .sort((a, b) => b.count - a.count || b.averageScore - a.averageScore)
    .slice(0, 5);

  let trend: PatternStats["trend"] = "insufficient";
  let trendDelta = 0;
  if (records.length >= 4) {
    const half = Math.min(5, Math.floor(records.length / 2));
    const recent = records.slice(0, half);
    const prior = records.slice(half, half * 2);
    const avg = (arr: PatternRecord[]) =>
      arr.reduce((s, r) => s + r.riskScore, 0) / arr.length;
    trendDelta = Math.round(avg(recent) - avg(prior));
    trend = trendDelta > 4 ? "rising" : trendDelta < -4 ? "falling" : "steady";
  }

  return {
    total: records.length,
    averageRisk: Math.round(averageRisk),
    bandCounts,
    trend,
    trendDelta,
    topCategories,
    series: chronological.map((r) => ({
      createdAt: r.createdAt,
      riskScore: r.riskScore,
    })),
  };
}
