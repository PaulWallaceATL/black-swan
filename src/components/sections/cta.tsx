"use client";

import * as React from "react";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { SectionHeading } from "@/components/section-heading";
import { ScrollReveal } from "@/components/react-bits/scroll-reveal";
import { GridOverlay } from "@/components/react-bits/grid-overlay";
import { SceneMount } from "@/components/react-bits/scene-mount";
import SilkWaves from "@/components/react-bits/silk-waves";

const SILK_COLORS = [
  "#120d18",
  "#1c1426",
  "#2a1a3e",
  "#4a2c6e",
  "#6d28d9",
  "#8b5cf6",
  "#a06bff",
  "#c9a9ff",
];

export function CtaSection() {
  const [submitted, setSubmitted] = React.useState(false);

  // No backend yet — capture intent locally and surface a success state.
  // Ready to be wired to a Server Action or API route later.
  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
  }

  return (
    <section
      id="access"
      className="relative overflow-hidden px-4 py-20 sm:px-6 lg:py-28"
    >
      <SceneMount className="pointer-events-none absolute inset-0 -z-10 opacity-30">
        <SilkWaves colors={SILK_COLORS} speed={0.5} scale={2} opacity={0.85} />
      </SceneMount>
      <GridOverlay className="opacity-60" />
      <div className="mx-auto max-w-6xl">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <SectionHeading
              eyebrow="Request access"
              title="Build safer systems with misogyny risk intelligence."
              description="Tell us where gendered harm shows up in your stack. We'll show you how Aegis scores it — and how to act before it scales."
            />
            <ScrollReveal
              delay={140}
              className="mt-8 flex flex-col gap-3 sm:flex-row"
            >
              <a
                href="#access"
                className={cn(buttonVariants({ size: "lg" }), "h-11 px-5")}
              >
                Request Access
              </a>
              <a
                href="mailto:team@aegis.ai"
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                  "h-11 px-5"
                )}
              >
                Talk to the Team
              </a>
            </ScrollReveal>
          </div>

          <ScrollReveal direction="left" delay={120}>
            <Card className="glass-panel border-border/60 p-6 sm:p-8">
              {submitted ? (
                <div
                  className="flex min-h-[22rem] flex-col items-center justify-center gap-4 text-center"
                  role="status"
                  aria-live="polite"
                >
                  <span className="grid size-14 place-items-center rounded-full bg-violet/15 text-violet">
                    <CheckCircle2 className="size-7" />
                  </span>
                  <h3 className="font-display text-xl font-medium text-foreground">
                    Request received
                  </h3>
                  <p className="max-w-sm text-sm text-muted-foreground">
                    Thank you. Our team will reach out to scope an Aegis
                    evaluation for your organization.
                  </p>
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => setSubmitted(false)}
                  >
                    Submit another request
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="cta-name">Full name</Label>
                      <Input
                        id="cta-name"
                        name="name"
                        autoComplete="name"
                        placeholder="Jordan Avery"
                        required
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="cta-email">Work email</Label>
                      <Input
                        id="cta-email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        placeholder="jordan@company.com"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="cta-company">Company</Label>
                      <Input
                        id="cta-company"
                        name="company"
                        autoComplete="organization"
                        placeholder="Organization"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="cta-team">Team</Label>
                      <Input
                        id="cta-team"
                        name="team"
                        placeholder="Trust & Safety, AI, Legal…"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <Label htmlFor="cta-context">
                      Where does misogyny risk show up for you?
                    </Label>
                    <Textarea
                      id="cta-context"
                      name="context"
                      rows={4}
                      placeholder="Briefly describe the content, datasets, or model outputs you need to evaluate."
                    />
                  </div>

                  <Button type="submit" size="lg" className="group mt-1 h-11">
                    Request Access
                    <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                  </Button>
                  <p className="text-center text-xs text-muted-foreground">
                    We use your details only to respond. No spam, ever.
                  </p>
                </form>
              )}
            </Card>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
