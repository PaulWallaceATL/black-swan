import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Logo } from "@/components/brand";
import { Console } from "@/components/console/console";
import { Noise } from "@/components/react-bits/noise";

export const metadata: Metadata = {
  title: "Console — Analyze content for misogyny risk",
  description:
    "Run text, links, images, audio, video, and conversations through the Black Swan engine: risk scoring, narrative explanation, response coaching, personal and misogynoir lenses, conversation analysis, and longitudinal pattern tracking.",
};

export default function ConsolePage() {
  return (
    <>
      <Noise />
      <header className="sticky top-0 z-50 border-b border-border/60 bg-background/70 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <Link
            href="/"
            aria-label="Black Swan home"
            className="rounded-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
          >
            <Logo />
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            Back to site
          </Link>
        </div>
      </header>

      <main className="relative flex-1">
        <div className="mx-auto max-w-6xl px-4 pt-8 sm:px-6">
          <p className="font-mono text-[0.65rem] uppercase tracking-[0.22em] text-violet">
            Live engine
          </p>
          <h1 className="mt-2 font-display text-2xl font-medium text-foreground sm:text-3xl">
            Misogyny risk console
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            Submit any content — text, a link, an image, audio, video, or a full
            conversation — and run it through the Transformation Engine plus the
            modules you choose. Results and trends are tracked locally on this
            device.
          </p>
        </div>
        <Console />
      </main>
    </>
  );
}
