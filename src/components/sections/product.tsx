import {
  ScanSearch,
  SlidersHorizontal,
  Layers3,
  Fingerprint,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { SectionHeading } from "@/components/section-heading";
import { ScrollReveal } from "@/components/react-bits/scroll-reveal";
import { ShieldAura } from "@/components/react-bits/shield-aura";

const CAPABILITIES = [
  {
    icon: ScanSearch,
    title: "Detects language and intent",
    body: "Reads beyond vocabulary to model intent, tone, and targeting — separating critique and reclaimed speech from hostility aimed at women and girls.",
  },
  {
    icon: SlidersHorizontal,
    title: "Measures severity and confidence",
    body: "Every assessment returns a calibrated severity score paired with a confidence value, so teams know how much weight to place on each signal.",
  },
  {
    icon: Layers3,
    title: "Rates configurable dimensions",
    body: "Risk is decomposed across distinct, policy-aligned categories you can weight and threshold to match your platform's standards.",
  },
  {
    icon: Fingerprint,
    title: "Surfaces coded and contextual patterns",
    body: "Identifies euphemism, dog whistles, and escalation that span messages — the subtle structure keyword systems are blind to.",
  },
];

export function Product() {
  return (
    <section id="product" className="relative px-4 py-20 sm:px-6 lg:py-28">
      <div className="mx-auto max-w-6xl">
        <div className="grid items-start gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-14">
          <div className="lg:sticky lg:top-28">
            <SectionHeading
              eyebrow="The model"
              title="A language model built for one mandate: gendered harm."
              description="Black Swan is not a generic classifier with a misogyny label bolted on. It is purpose-trained to reason about gendered hostility with the nuance the problem demands."
            />
            <ScrollReveal
              delay={160}
              className="mt-10 flex items-center gap-5 rounded-2xl border border-border/60 bg-card/60 p-5"
            >
              <ShieldAura className="size-20 shrink-0" />
              <div>
                <p className="font-display text-sm font-medium text-foreground">
                  Operates at the data layer
                </p>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  Black Swan evaluates content before it reaches users, models, or
                  downstream systems — intercepting risk upstream, not after harm
                  has already landed.
                </p>
              </div>
            </ScrollReveal>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {CAPABILITIES.map((cap, i) => (
              <ScrollReveal
                key={cap.title}
                delay={i * 90}
                className={cn(
                  "group rounded-2xl border border-border/60 bg-card/60 p-6 transition-all duration-300 hover:border-violet/40 hover:bg-card/90",
                  i === 0 && "sm:translate-y-6"
                )}
              >
                <span className="grid size-11 place-items-center rounded-xl bg-gradient-to-br from-mulberry/25 to-violet/20 text-blush">
                  <cap.icon className="size-5" />
                </span>
                <h3 className="mt-4 font-display text-lg font-medium text-foreground">
                  {cap.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {cap.body}
                </p>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
