import { ArrowRight, Database, Gauge, Plug, HeartHandshake } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Eyebrow } from "@/components/brand";
import { AuroraBackground } from "@/components/react-bits/aurora-background";
import { GridOverlay } from "@/components/react-bits/grid-overlay";
import { GradientText } from "@/components/react-bits/gradient-text";
import { TextReveal } from "@/components/react-bits/text-reveal";
import { ScrollReveal } from "@/components/react-bits/scroll-reveal";
import { RiskScanner } from "@/components/react-bits/risk-scanner";

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
      className="relative overflow-hidden px-4 pb-20 pt-32 sm:px-6 sm:pt-36 lg:pb-28 lg:pt-44"
    >
      <AuroraBackground />
      <GridOverlay />

      <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10">
        <div className="flex flex-col items-start">
          <ScrollReveal direction="none">
            <Eyebrow>The intelligence layer for misogyny risk</Eyebrow>
          </ScrollReveal>

          <TextReveal
            as="h1"
            text="Detect misogyny risk before it becomes harm."
            className="mt-6 font-display text-4xl font-semibold leading-[1.05] tracking-tight text-foreground sm:text-5xl lg:text-6xl"
          />

          <ScrollReveal delay={120} className="mt-6 max-w-xl">
            <p className="text-lg leading-relaxed text-muted-foreground">
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
                "h-11 px-5"
              )}
            >
              View Risk Framework
            </a>
          </ScrollReveal>

          <ScrollReveal
            delay={320}
            as="ul"
            className="mt-12 grid w-full grid-cols-2 gap-x-6 gap-y-4 border-t border-border/60 pt-6 sm:flex sm:flex-wrap sm:gap-x-7"
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

        <ScrollReveal direction="left" delay={160} className="relative">
          <div
            aria-hidden="true"
            className="absolute -inset-6 -z-10 rounded-[2rem] bg-violet/10 blur-3xl"
          />
          <RiskScanner />
        </ScrollReveal>
      </div>
    </section>
  );
}
