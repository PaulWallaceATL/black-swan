import { Logo } from "@/components/brand";
import { Separator } from "@/components/ui/separator";
import { BlurHighlight } from "@/components/react-bits/blur-highlight";

const COLUMNS = [
  {
    heading: "Platform",
    links: [
      { label: "Product", href: "#product" },
      { label: "Risk Framework", href: "#framework" },
      { label: "API", href: "#architecture" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "Research", href: "#mission" },
      { label: "Use Cases", href: "#use-cases" },
      { label: "Contact", href: "#access" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="relative border-t border-border/60 px-4 py-14 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr]">
          <div className="flex flex-col gap-4">
            <Logo />
            <BlurHighlight
              highlightedBits={["misogyny risk"]}
              highlightColor="rgba(160, 107, 255, 0.28)"
              highlightClassName="text-foreground"
              blurAmount={6}
              className="max-w-xs text-sm leading-relaxed text-muted-foreground"
            >
              The intelligence layer for detecting misogyny risk before harm
              scales.
            </BlurHighlight>
          </div>

          {COLUMNS.map((col) => (
            <nav key={col.heading} aria-label={col.heading}>
              <p className="font-mono text-[0.65rem] uppercase tracking-[0.2em] text-muted-foreground">
                {col.heading}
              </p>
              <ul className="mt-4 flex flex-col gap-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-foreground/80 transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <Separator className="my-8 bg-border/60" />

        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <p className="text-xs text-muted-foreground">
            Proprietary AI for gendered harm detection, measurement, and
            governance.
          </p>
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Aegis. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
