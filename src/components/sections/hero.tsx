"use client";

import dynamic from "next/dynamic";
import { ArrowRight, Database, Gauge, Plug, HeartHandshake } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Eyebrow } from "@/components/brand";
import { AuroraBackground } from "@/components/react-bits/aurora-background";
import { GridOverlay } from "@/components/react-bits/grid-overlay";
import { GradientText } from "@/components/react-bits/gradient-text";
import { TextReveal } from "@/components/react-bits/text-reveal";
import { ScrollReveal } from "@/components/react-bits/scroll-reveal";

const ScanCarousel = dynamic(
  () =>
    import("@/components/react-bits/scan-carousel").then((m) => m.ScanCarousel),
  { ssr: false },
);

const TRUST_BADGES = [
  { label: "Data-layer analysis", icon: Database },
  { label: "LLM-native risk scoring", icon: Gauge },
  { label: "Enterprise API", icon: Plug },
  { label: "Human-safety aligned", icon: HeartHandshake },
];

export function Hero() {
  return (
    <section
      id="top"
      className="relative flex min-h-[100svh] flex-col overflow-hidden"
    >
      <AuroraBackground />
      <GridOverlay />

      {/* Foreground copy */}
      <div className="relative z-20 mx-auto flex w-full max-w-4xl flex-col items-center px-4 pt-28 text-center sm:px-6 sm:pt-32 lg:pt-36">
        <ScrollReveal direction="none">
          <Eyebrow>The intelligence layer for misogyny risk</Eyebrow>
        </ScrollReveal>

        <TextReveal
          as="h1"
          text="Detect misogyny risk before it becomes harm."
          className="mt-6 max-w-3xl font-display text-4xl font-semibold leading-[1.06] tracking-tight text-foreground sm:text-5xl lg:text-6xl"
        />

        <ScrollReveal delay={120} className="mt-6 max-w-2xl">
          <p className="text-base leading-relaxed text-muted-foreground sm:text-lg">
            Aegis is a proprietary language intelligence model trained to
            identify, measure, and rate{" "}
            <GradientText className="font-medium">misogyny risk</GradientText>{" "}
            across digital content, conversations, datasets, and AI outputs.
          </p>
        </ScrollReveal>

        <ScrollReveal
          delay={220}
          className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center"
        >
          <a
            href="#access"
            className={cn(buttonVariants({ size: "lg" }), "group h-11 px-5")}
          >
            Request Access
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
          </a>
          <a
            href="#framework"
            className={cn(
              buttonVariants({ variant: "outline", size: "lg" }),
              "h-11 px-5",
            )}
          >
            View Risk Framework
          </a>
        </ScrollReveal>
      </div>

      {/* Scanning carousel — fills the lower stage */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-10 translate-y-[22%] sm:translate-y-[20%]"
      >
        <ScanCarousel />
      </div>

      {/* Trust badges pinned to the base */}
      <div className="relative z-20 mt-auto w-full px-4 pb-10 sm:px-6">
        <ScrollReveal
          delay={320}
          as="ul"
          className="mx-auto flex max-w-4xl flex-wrap items-center justify-center gap-x-7 gap-y-3 rounded-2xl border border-border/50 bg-background/30 px-5 py-3.5 backdrop-blur"
        >
          {TRUST_BADGES.map(({ label, icon: Icon }) => (
            <li
              key={label}
              className="flex items-center gap-2 text-sm text-muted-foreground"
            >
              <Icon className="size-4 shrink-0 text-violet" />
              {label}
            </li>
          ))}
        </ScrollReveal>
      </div>
    </section>
  );
}
