"use client";

import * as React from "react";
import { Lock, FileSearch, ShieldCheck } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { SectionHeading } from "@/components/section-heading";
import { ScrollReveal } from "@/components/react-bits/scroll-reveal";

const DIMENSIONS = [
  "Dehumanization",
  "Sexualized hostility",
  "Gendered contempt",
  "Threat escalation",
  "Coercive framing",
  "Targeted harassment",
  "Coded or euphemistic misogyny",
  "Bias embedded in datasets",
] as const;

type Scenario = {
  id: string;
  label: string;
  summary: string;
  scores: number[];
};

const SCENARIOS: Scenario[] = [
  {
    id: "reply",
    label: "Reply thread",
    summary:
      "A pile-on forming under a woman's public post — individually deniable, collectively hostile.",
    scores: [38, 52, 71, 64, 44, 86, 58, 9],
  },
  {
    id: "caption",
    label: "Image caption",
    summary:
      "Euphemistic, in-group phrasing that reads as humor but encodes contempt.",
    scores: [22, 31, 49, 12, 28, 24, 78, 14],
  },
  {
    id: "dataset",
    label: "Training dataset",
    summary:
      "A scraped corpus carrying systemic gendered bias into a downstream model.",
    scores: [44, 33, 57, 8, 19, 17, 61, 91],
  },
  {
    id: "model",
    label: "Model output",
    summary:
      "A generated completion that subtly diminishes and stereotypes women.",
    scores: [29, 41, 66, 21, 53, 18, 72, 47],
  },
];

const BANDS = [
  {
    name: "Low",
    range: "0 – 24",
    color: "var(--rose-gold)",
    note: "Monitor only",
  },
  {
    name: "Elevated",
    range: "25 – 59",
    color: "var(--blush)",
    note: "Route for review",
  },
  {
    name: "Severe",
    range: "60 – 84",
    color: "var(--mulberry)",
    note: "Restrict & escalate",
  },
  {
    name: "Critical",
    range: "85 – 100",
    color: "var(--violet)",
    note: "Block & report",
  },
];

function bandFor(score: number) {
  if (score >= 85) return BANDS[3];
  if (score >= 60) return BANDS[2];
  if (score >= 25) return BANDS[1];
  return BANDS[0];
}

export function RiskFramework() {
  return (
    <section
      id="framework"
      className="relative px-4 py-20 sm:px-6 lg:py-28"
    >
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="Risk framework"
          title="One score, decomposed into auditable dimensions."
          description="Aegis rates content across eight configurable dimensions, each scored 0–100 with confidence. Tune weights and thresholds to your policy — every output is explainable and audit-ready."
        />

        <div className="mt-12 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          <ScrollReveal>
            <Card className="bg-card/70 p-6">
              <Tabs defaultValue="reply" className="gap-6">
                <TabsList
                  variant="line"
                  className="flex-wrap gap-1.5 overflow-x-auto"
                >
                  {SCENARIOS.map((s) => (
                    <TabsTrigger
                      key={s.id}
                      value={s.id}
                      className="rounded-full border border-border/60 px-3 data-active:border-violet/50 data-active:bg-violet/10 data-active:text-foreground"
                    >
                      {s.label}
                    </TabsTrigger>
                  ))}
                </TabsList>

                {SCENARIOS.map((s) => {
                  const overall = Math.round(
                    s.scores.reduce((a, b) => a + b, 0) / s.scores.length
                  );
                  const band = bandFor(overall);
                  return (
                    <TabsContent
                      key={s.id}
                      value={s.id}
                      className="flex flex-col gap-5"
                    >
                      <div className="flex items-start justify-between gap-4 rounded-xl border border-border/60 bg-background/40 p-4">
                        <p className="max-w-md text-sm leading-relaxed text-muted-foreground">
                          {s.summary}
                        </p>
                        <div className="shrink-0 text-right">
                          <p className="font-mono text-[0.65rem] uppercase tracking-[0.18em] text-muted-foreground">
                            Composite
                          </p>
                          <p
                            className="font-display text-2xl font-semibold tabular-nums"
                            style={{ color: band.color }}
                          >
                            {overall}
                          </p>
                          <Badge
                            variant="outline"
                            className="mt-1"
                            style={{
                              borderColor: band.color,
                              color: band.color,
                            }}
                          >
                            {band.name}
                          </Badge>
                        </div>
                      </div>

                      <ul className="flex flex-col gap-3.5">
                        {DIMENSIONS.map((dim, i) => {
                          const value = s.scores[i];
                          const dimBand = bandFor(value);
                          return (
                            <li key={dim} className="flex flex-col gap-1.5">
                              <div className="flex items-center justify-between gap-3 text-sm">
                                <span className="text-foreground/90">
                                  {dim}
                                </span>
                                <span
                                  className="font-mono text-xs tabular-nums"
                                  style={{ color: dimBand.color }}
                                >
                                  {value}
                                </span>
                              </div>
                              <Progress
                                value={value}
                                aria-label={`${dim} risk score ${value} out of 100`}
                                className="[&_[data-slot=progress-indicator]]:bg-(--bar) [&_[data-slot=progress-track]]:bg-pearl/10"
                                style={
                                  {
                                    "--bar": dimBand.color,
                                  } as React.CSSProperties
                                }
                              />
                            </li>
                          );
                        })}
                      </ul>
                    </TabsContent>
                  );
                })}
              </Tabs>
            </Card>
          </ScrollReveal>

          <div className="flex flex-col gap-6">
            <ScrollReveal delay={120}>
              <Card className="bg-card/70 p-6">
                <h3 className="font-display text-lg font-medium text-foreground">
                  Risk bands
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Thresholds map scores to action. Boundaries are configurable
                  per policy.
                </p>
                <ul className="mt-5 flex flex-col gap-3">
                  {BANDS.map((b) => (
                    <li
                      key={b.name}
                      className="flex items-center gap-3 rounded-xl border border-border/60 bg-background/30 p-3"
                    >
                      <span
                        className="size-2.5 shrink-0 rounded-full"
                        style={{
                          background: b.color,
                          boxShadow: `0 0 12px ${b.color}`,
                        }}
                      />
                      <div className="flex flex-1 items-center justify-between gap-2">
                        <span className="font-medium text-foreground">
                          {b.name}
                        </span>
                        <span className="font-mono text-xs text-muted-foreground">
                          {b.range}
                        </span>
                      </div>
                      <span className="hidden text-xs text-muted-foreground sm:inline">
                        {b.note}
                      </span>
                    </li>
                  ))}
                </ul>
              </Card>
            </ScrollReveal>

            <ScrollReveal delay={200}>
              <Card className="bg-card/70 p-6">
                <h3 className="font-display text-lg font-medium text-foreground">
                  Configurable &amp; auditable
                </h3>
                <ul className="mt-4 flex flex-col gap-3 text-sm text-muted-foreground">
                  <li className="flex items-start gap-3">
                    <SlidersChip />
                    Re-weight dimensions and move band thresholds without
                    retraining.
                  </li>
                  <li className="flex items-start gap-3">
                    <FileSearch className="mt-0.5 size-4 shrink-0 text-blush" />
                    Every score ships with rationale and contributing signals.
                  </li>
                  <li className="flex items-start gap-3">
                    <ShieldCheck className="mt-0.5 size-4 shrink-0 text-rose-gold" />
                    Immutable audit log for compliance and appeals.
                  </li>
                  <li className="flex items-start gap-3">
                    <Lock className="mt-0.5 size-4 shrink-0 text-violet" />
                    No content retained beyond your configured window.
                  </li>
                </ul>
              </Card>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  );
}

function SlidersChip() {
  return (
    <span className="mt-0.5 grid size-4 shrink-0 place-items-center text-mulberry">
      <svg viewBox="0 0 16 16" className="size-4" fill="none">
        <path
          d="M2 4h7M11 4h3M2 12h3M7 12h7M9 2v4M5 10v4"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
      </svg>
    </span>
  );
}
