import { AuroraBackground } from "@/components/react-bits/aurora-background";
import { GradientText } from "@/components/react-bits/gradient-text";
import { ScrollReveal } from "@/components/react-bits/scroll-reveal";
import { Eyebrow } from "@/components/brand";

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

export function Mission() {
  return (
    <section
      id="mission"
      className="relative overflow-hidden px-4 py-24 sm:px-6 lg:py-36"
    >
      <AuroraBackground className="opacity-80" />

      <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
        <ScrollReveal direction="none">
          <Eyebrow>Why we build this</Eyebrow>
        </ScrollReveal>

        <ScrollReveal delay={100}>
          <p className="mt-8 font-display text-3xl font-medium leading-[1.18] tracking-tight text-foreground sm:text-4xl lg:text-[2.9rem]">
            The internet was not built to protect women.{" "}
            <GradientText>The next layer of intelligence can be.</GradientText>
          </p>
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
