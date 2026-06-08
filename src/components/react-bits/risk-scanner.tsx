"use client";

import * as React from "react";
import { ShieldCheck, Radar, Activity } from "lucide-react";
import { cn } from "@/lib/utils";

type Frame = {
  score: number;
  band: string;
  bandColor: string;
  signals: { label: string; value: number }[];
};

const FRAMES: Frame[] = [
  {
    score: 18,
    band: "Low",
    bandColor: "var(--rose-gold)",
    signals: [
      { label: "Dehumanization", value: 12 },
      { label: "Coded hostility", value: 22 },
      { label: "Threat escalation", value: 8 },
    ],
  },
  {
    score: 54,
    band: "Elevated",
    bandColor: "var(--blush)",
    signals: [
      { label: "Dehumanization", value: 41 },
      { label: "Coded hostility", value: 63 },
      { label: "Threat escalation", value: 38 },
    ],
  },
  {
    score: 81,
    band: "Severe",
    bandColor: "var(--mulberry)",
    signals: [
      { label: "Dehumanization", value: 74 },
      { label: "Coded hostility", value: 88 },
      { label: "Threat escalation", value: 69 },
    ],
  },
  {
    score: 94,
    band: "Critical",
    bandColor: "var(--violet)",
    signals: [
      { label: "Dehumanization", value: 91 },
      { label: "Coded hostility", value: 84 },
      { label: "Threat escalation", value: 96 },
    ],
  },
];

export function RiskScanner({ className }: { className?: string }) {
  const [index, setIndex] = React.useState(1);

  React.useEffect(() => {
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // Respect reduced-motion: hold on a single representative frame.
    if (reduce) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % FRAMES.length);
    }, 2600);
    return () => clearInterval(id);
  }, []);

  const frame = FRAMES[index];

  return (
    <div
      className={cn(
        "glass-panel relative w-full overflow-hidden rounded-2xl p-5 shadow-[0_30px_80px_-30px_oklch(0.12_0.014_305/0.9)] sm:p-6",
        className
      )}
      role="img"
      aria-label={`Black Swan live risk scan demonstration showing a ${frame.band.toLowerCase()} misogyny risk score of ${frame.score} out of 100.`}
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="grid size-8 place-items-center rounded-lg bg-violet/15 text-violet">
            <Radar className="size-4" />
          </span>
          <div className="leading-tight">
            <p className="font-mono text-[0.65rem] uppercase tracking-[0.22em] text-muted-foreground">
              Black Swan Engine
            </p>
            <p className="text-sm font-medium text-foreground">
              Live risk scan
            </p>
          </div>
        </div>
        <span className="flex items-center gap-1.5 rounded-full border border-border/70 bg-background/40 px-2.5 py-1 font-mono text-[0.65rem] text-muted-foreground">
          <span className="size-1.5 animate-pulse rounded-full bg-violet" />
          analyzing
        </span>
      </div>

      {/* Scanned content surface */}
      <div className="relative mt-5 overflow-hidden rounded-xl border border-border/60 bg-ink-deep/60 p-4">
        <div
          aria-hidden="true"
          className="absolute inset-x-0 z-10 h-16 animate-scan bg-[linear-gradient(180deg,transparent,oklch(0.64_0.23_295/0.18),transparent)]"
        >
          <div className="absolute bottom-0 h-px w-full bg-violet/80 shadow-[0_0_14px_2px_oklch(0.64_0.23_295/0.7)]" />
        </div>
        <div className="flex flex-col gap-2.5" aria-hidden="true">
          {[92, 76, 84, 58, 70, 46].map((w, i) => (
            <div key={i} className="flex items-center gap-2">
              <span
                className="h-2 rounded-full bg-pearl/12"
                style={{ width: `${w}%` }}
              />
              {i % 3 === 0 && (
                <span className="h-2 w-6 rounded-full bg-mulberry/40" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Score + signals */}
      <div className="mt-5 grid gap-4 sm:grid-cols-[auto_1fr] sm:items-center">
        <div className="flex items-center gap-3">
          <div className="relative grid size-16 place-items-center">
            <svg viewBox="0 0 36 36" className="size-16 -rotate-90">
              <circle
                cx="18"
                cy="18"
                r="15.5"
                fill="none"
                stroke="oklch(0.7 0.04 320 / 0.14)"
                strokeWidth="3"
              />
              <circle
                cx="18"
                cy="18"
                r="15.5"
                fill="none"
                stroke={frame.bandColor}
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray={`${(frame.score / 100) * 97.4} 97.4`}
                className="transition-all duration-700 ease-out"
              />
            </svg>
            <span className="absolute font-mono text-lg font-semibold tabular-nums text-foreground">
              {frame.score}
            </span>
          </div>
          <div className="leading-tight">
            <p className="font-mono text-[0.65rem] uppercase tracking-[0.2em] text-muted-foreground">
              Risk band
            </p>
            <p
              className="text-lg font-semibold transition-colors duration-500"
              style={{ color: frame.bandColor }}
            >
              {frame.band}
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-2.5">
          {frame.signals.map((s) => (
            <div key={s.label} className="flex items-center gap-3">
              <span className="w-32 shrink-0 truncate text-xs text-muted-foreground">
                {s.label}
              </span>
              <span className="relative h-1.5 flex-1 overflow-hidden rounded-full bg-pearl/10">
                <span
                  className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-mulberry to-violet transition-[width] duration-700 ease-out"
                  style={{ width: `${s.value}%` }}
                />
              </span>
              <span className="w-7 text-right font-mono text-[0.7rem] tabular-nums text-muted-foreground">
                {s.value}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Footer chips */}
      <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-border/60 pt-4 text-[0.7rem]">
        <span className="flex items-center gap-1.5 text-muted-foreground">
          <ShieldCheck className="size-3.5 text-rose-gold" />
          Confidence 0.93
        </span>
        <span className="text-border">·</span>
        <span className="flex items-center gap-1.5 text-muted-foreground">
          <Activity className="size-3.5 text-blush" />
          12 categories evaluated
        </span>
      </div>
    </div>
  );
}
