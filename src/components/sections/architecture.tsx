import {
  FileText,
  Database,
  MessagesSquare,
  Bot,
  Plug,
  LayoutDashboard,
  ListChecks,
  ScrollText,
  Cpu,
} from "lucide-react";
import { SectionHeading } from "@/components/section-heading";
import { ScrollReveal } from "@/components/react-bits/scroll-reveal";
import { SignalFlow } from "@/components/react-bits/signal-flow";

const INPUTS = [
  { icon: FileText, label: "Content" },
  { icon: Database, label: "Dataset" },
  { icon: MessagesSquare, label: "Conversation" },
  { icon: Bot, label: "Model output" },
];

const OUTPUTS = [
  "Misogyny risk score",
  "Category labels",
  "Severity & confidence",
];

const DESTINATIONS = [
  { icon: Plug, label: "API" },
  { icon: LayoutDashboard, label: "Dashboard" },
  { icon: ListChecks, label: "Moderation queue" },
  { icon: ScrollText, label: "Audit log" },
];

const CALLOUTS = [
  "API-first",
  "Secure by design",
  "Fully auditable",
  "Configurable thresholds",
  "Human review workflows",
];

function NodeChip({
  icon: Icon,
  label,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
}) {
  return (
    <div className="flex items-center gap-2.5 rounded-xl border border-border/60 bg-card/70 px-3.5 py-2.5 text-sm text-foreground/90 backdrop-blur">
      <Icon className="size-4 shrink-0 text-blush" />
      {label}
    </div>
  );
}

export function Architecture() {
  return (
    <section id="architecture" className="relative px-4 py-20 sm:px-6 lg:py-28">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="Architecture"
          title="A risk engine that sits in your pipeline, not on the sidelines."
          description="Point any text surface at Aegis and receive structured, explainable risk — ready to route into the systems your teams already run."
        />

        <ScrollReveal delay={120}>
          <div className="mt-12 overflow-hidden rounded-2xl border border-border/60 bg-card/40 p-6 sm:p-8">
            <div className="grid items-center gap-6 lg:grid-cols-[1fr_auto_1.1fr_auto_1fr]">
              {/* Inputs */}
              <div className="flex flex-col gap-3">
                <p className="font-mono text-[0.65rem] uppercase tracking-[0.2em] text-muted-foreground">
                  Inputs
                </p>
                {INPUTS.map((n) => (
                  <NodeChip key={n.label} icon={n.icon} label={n.label} />
                ))}
              </div>

              <div className="flex justify-center lg:block">
                <SignalFlow className="hidden lg:block" />
                <SignalFlow vertical className="lg:hidden" />
              </div>

              {/* Engine */}
              <div className="relative grid place-items-center rounded-2xl border border-violet/30 bg-gradient-to-br from-violet/15 via-mulberry/10 to-transparent p-6 text-center">
                <div
                  aria-hidden="true"
                  className="absolute inset-0 -z-10 animate-pulse-glow rounded-2xl bg-violet/10 blur-xl"
                />
                <span className="grid size-12 place-items-center rounded-xl bg-violet/20 text-violet">
                  <Cpu className="size-6" />
                </span>
                <p className="mt-3 font-display text-lg font-semibold text-foreground">
                  Aegis Risk Engine
                </p>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                  Context-aware analysis across 8 dimensions
                </p>
                <div className="mt-4 flex w-full flex-col gap-2">
                  {OUTPUTS.map((o) => (
                    <span
                      key={o}
                      className="rounded-lg border border-border/60 bg-background/40 px-2.5 py-1.5 text-xs text-foreground/85"
                    >
                      {o}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex justify-center lg:block">
                <SignalFlow className="hidden lg:block" />
                <SignalFlow vertical className="lg:hidden" />
              </div>

              {/* Destinations */}
              <div className="flex flex-col gap-3">
                <p className="font-mono text-[0.65rem] uppercase tracking-[0.2em] text-muted-foreground">
                  Destinations
                </p>
                {DESTINATIONS.map((n) => (
                  <NodeChip key={n.label} icon={n.icon} label={n.label} />
                ))}
              </div>
            </div>

            <div className="mt-8 flex flex-wrap gap-2 border-t border-border/60 pt-6">
              {CALLOUTS.map((c) => (
                <span
                  key={c}
                  className="rounded-full border border-border/60 bg-background/40 px-3 py-1.5 text-xs text-muted-foreground"
                >
                  {c}
                </span>
              ))}
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
