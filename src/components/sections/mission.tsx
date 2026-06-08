import { ScrollReveal } from "@/components/react-bits/scroll-reveal";
import { Eyebrow } from "@/components/brand";
import { SceneMount } from "@/components/react-bits/scene-mount";
import AuroraBlur from "@/components/react-bits/aurora-blur";
import { BlurHighlight } from "@/components/react-bits/blur-highlight";

const PILLARS = [
  {
    title: "Protection",
    body: "Intercept harm upstream, at the data layer, before it reaches the people it targets.",
  },
  {
    title: "Dignity",
    body: "Treat gendered hostility as the serious signal it is — measured, not minimized.",
  },
  {
    title: "Accountability",
    body: "Make risk legible and auditable, so platforms can answer for what they allow.",
  },
];

const AURORA_LAYERS = [
  { color: "#8b5cf6", speed: 0.3, intensity: 0.5 },
  { color: "#b567e0", speed: 0.15, intensity: 0.38 },
  { color: "#e6a6c7", speed: 0.2, intensity: 0.16 },
  { color: "#6d28d9", speed: 0.08, intensity: 0.22 },
];

const SKY_LAYERS = [
  { color: "#1c1426", blend: 0.5 },
  { color: "#120d18", blend: 0.5 },
];

export function Mission() {
  return (
    <section
      id="mission"
      className="relative overflow-hidden px-4 py-24 sm:px-6 lg:py-36"
    >
      <SceneMount className="absolute inset-0 -z-10">
        <AuroraBlur
          speed={1.1}
          noiseScale={3}
          brightness={0.95}
          opacity={0.65}
          layers={AURORA_LAYERS}
          skyLayers={SKY_LAYERS}
        />
      </SceneMount>
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-gradient-to-b from-background/55 via-background/25 to-background/70"
      />

      <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
        <ScrollReveal direction="none">
          <Eyebrow>Why we build this</Eyebrow>
        </ScrollReveal>

        <ScrollReveal delay={100} className="mt-8">
          <BlurHighlight
            highlightedBits={["protect women", "next layer of intelligence"]}
            highlightColor="rgba(160, 107, 255, 0.30)"
            highlightClassName="rounded-sm text-foreground"
            inactiveOpacity={0.55}
            viewportOptions={{ once: true, amount: 0.25 }}
            className="font-display text-3xl font-medium leading-[1.18] tracking-tight text-foreground sm:text-4xl lg:text-[2.9rem]"
          >
            The internet was not built to protect women. The next layer of
            intelligence can be.
          </BlurHighlight>
        </ScrollReveal>

        <ScrollReveal delay={200}>
          <p className="mt-7 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            Aegis exists to give that layer measurable form — turning gendered
            harm from something noticed too late into something that can be seen,
            scored, and stopped while there is still time to act.
          </p>
        </ScrollReveal>

        <div className="mt-14 grid w-full gap-4 sm:grid-cols-3">
          {PILLARS.map((p, i) => (
            <ScrollReveal
              key={p.title}
              delay={i * 110}
              className="rounded-2xl border border-border/60 bg-card/50 p-6 text-left backdrop-blur"
            >
              <h3 className="font-display text-lg font-medium text-blush">
                {p.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {p.body}
              </p>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
