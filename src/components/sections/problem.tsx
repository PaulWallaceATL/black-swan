import { EyeOff, Crosshair, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SectionHeading } from "@/components/section-heading";
import { ScrollReveal } from "@/components/react-bits/scroll-reveal";
import { SceneMount } from "@/components/react-bits/scene-mount";
import SynapticShift from "@/components/react-bits/synaptic-shift";

const PROBLEMS = [
  {
    icon: EyeOff,
    title: "Coded hostility",
    body: "Misogyny rarely announces itself. It hides in irony, dog whistles, in-group slang, and plausible deniability — phrasing engineered to pass filters while the intent reads clearly to its target.",
    tag: "Evades keywords",
  },
  {
    icon: Crosshair,
    title: "Targeted degradation",
    body: "The same words carry radically different weight depending on who they are aimed at and why. Context, history, and targeting determine whether language is benign or a sustained campaign to demean.",
    tag: "Context-dependent",
  },
  {
    icon: TrendingUp,
    title: "Escalation patterns",
    body: "Harm compounds across messages, accounts, and time. Isolated moderation misses the trajectory — the slow build from contempt to dehumanization to coordinated threat.",
    tag: "Cross-message",
  },
];

export function Problem() {
  return (
    <section
      id="problem"
      className="relative overflow-hidden px-4 py-20 sm:px-6 lg:py-28"
    >
      <SceneMount className="pointer-events-none absolute inset-0 -z-10 opacity-[0.16]">
        <SynapticShift
          color="#b567e0"
          speed={0.4}
          scale={0.55}
          intensity={1.7}
          complexity={9}
        />
      </SceneMount>

      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="The detection gap"
          title="Misogyny online is contextual, coded, and built to slip through."
          description="Keyword moderation flags slurs and moves on. But the most corrosive gendered harm is contextual, escalating, and deliberately disguised — which is precisely what blunt filters cannot see."
        />

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {PROBLEMS.map((item, i) => (
            <ScrollReveal key={item.title} delay={i * 110}>
              <Card className="group h-full bg-card/70 ring-foreground/10 transition-all duration-300 hover:-translate-y-1 hover:ring-violet/40">
                <CardHeader>
                  <span className="mb-2 grid size-11 place-items-center rounded-xl border border-border/70 bg-violet/10 text-violet transition-colors group-hover:bg-violet/20">
                    <item.icon className="size-5" />
                  </span>
                  <CardTitle className="text-lg">{item.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                  <p className="leading-relaxed text-muted-foreground">
                    {item.body}
                  </p>
                  <span className="w-fit rounded-full border border-border/60 bg-background/40 px-2.5 py-1 font-mono text-[0.65rem] uppercase tracking-[0.18em] text-blush/80">
                    {item.tag}
                  </span>
                </CardContent>
              </Card>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
