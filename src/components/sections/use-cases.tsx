import {
  ShieldAlert,
  Bot,
  DatabaseZap,
  Building2,
  Radio,
  Scale,
  MessagesSquare,
  FlaskConical,
} from "lucide-react";
import { SectionHeading } from "@/components/section-heading";
import { ScrollReveal } from "@/components/react-bits/scroll-reveal";

const USE_CASES = [
  {
    icon: ShieldAlert,
    title: "Trust & Safety",
    body: "Prioritize queues by genuine severity and catch coordinated, escalating campaigns earlier.",
  },
  {
    icon: Bot,
    title: "AI model evaluation",
    body: "Red-team and benchmark model outputs for gendered harm before and after release.",
  },
  {
    icon: DatabaseZap,
    title: "Dataset auditing",
    body: "Quantify embedded bias in training corpora before it propagates into your models.",
  },
  {
    icon: Building2,
    title: "Brand safety",
    body: "Keep advertising and adjacencies clear of misogynistic content and contexts.",
  },
  {
    icon: Radio,
    title: "Social listening",
    body: "Measure gendered-hostility risk across narratives, communities, and emerging trends.",
  },
  {
    icon: Scale,
    title: "Compliance & governance",
    body: "Evidence due diligence under online-safety regimes with auditable risk records.",
  },
  {
    icon: MessagesSquare,
    title: "Content moderation",
    body: "Augment human reviewers with severity-aware, explainable risk signals at scale.",
  },
  {
    icon: FlaskConical,
    title: "Research intelligence",
    body: "Study the structure and spread of online misogyny with consistent, labeled metrics.",
  },
];

export function UseCases() {
  return (
    <section id="use-cases" className="relative px-4 py-20 sm:px-6 lg:py-28">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="Where Aegis works"
          title="One risk layer, deployed across the safety stack."
          description="From inbound moderation to model governance, Aegis gives every team a shared, defensible measure of misogyny risk."
        />

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {USE_CASES.map((uc, i) => (
            <ScrollReveal key={uc.title} delay={(i % 4) * 80}>
              <article className="group relative h-full overflow-hidden rounded-2xl border border-border/60 bg-card/60 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-mulberry/40">
                <div
                  aria-hidden="true"
                  className="absolute -right-8 -top-8 size-20 rounded-full bg-violet/0 blur-2xl transition-all duration-300 group-hover:bg-violet/20"
                />
                <span className="grid size-10 place-items-center rounded-lg border border-border/60 bg-background/40 text-blush transition-colors group-hover:text-violet">
                  <uc.icon className="size-5" />
                </span>
                <h3 className="mt-4 font-display text-base font-medium text-foreground">
                  {uc.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {uc.body}
                </p>
              </article>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
