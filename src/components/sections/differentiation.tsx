import { Check, Minus, X } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { Logo } from "@/components/brand";
import { SectionHeading } from "@/components/section-heading";
import { ScrollReveal } from "@/components/react-bits/scroll-reveal";

type Level = "yes" | "partial" | "no";

const ROWS: {
  capability: string;
  keyword: Level;
  generic: Level;
  blackSwan: Level;
}[] = [
  { capability: "Context-aware", keyword: "no", generic: "partial", blackSwan: "yes" },
  { capability: "Severity-aware", keyword: "no", generic: "partial", blackSwan: "yes" },
  { capability: "Pattern-aware (cross-message)", keyword: "no", generic: "no", blackSwan: "yes" },
  { capability: "Dataset & bias auditing", keyword: "no", generic: "no", blackSwan: "yes" },
  { capability: "Coded / euphemistic detection", keyword: "no", generic: "partial", blackSwan: "yes" },
  { capability: "Governance-ready audit trail", keyword: "partial", generic: "no", blackSwan: "yes" },
  { capability: "Built for gendered harm", keyword: "no", generic: "no", blackSwan: "yes" },
];

function Mark({ level }: { level: Level }) {
  if (level === "yes")
    return (
      <span className="mx-auto grid size-6 place-items-center rounded-full bg-violet/15 text-violet">
        <Check className="size-3.5" />
        <span className="sr-only">Yes</span>
      </span>
    );
  if (level === "partial")
    return (
      <span className="mx-auto grid size-6 place-items-center rounded-full bg-muted text-muted-foreground">
        <Minus className="size-3.5" />
        <span className="sr-only">Partial</span>
      </span>
    );
  return (
    <span className="mx-auto grid size-6 place-items-center rounded-full bg-muted/50 text-muted-foreground/60">
      <X className="size-3.5" />
      <span className="sr-only">No</span>
    </span>
  );
}

export function Differentiation() {
  return (
    <section className="relative px-4 py-20 sm:px-6 lg:py-28">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="Why Black Swan"
          title="Built for what blunt filters and generic moderation miss."
          description="Keyword lists catch slurs. General-purpose moderation catches the obvious. Black Swan is engineered for the contextual, escalating, high-stakes reality of gendered harm."
        />

        <ScrollReveal delay={120}>
          <Card className="mt-12 bg-card/70 p-0">
            <Table>
              <TableHeader>
                <TableRow className="border-border/60 hover:bg-transparent">
                  <TableHead className="w-[40%] py-4 pl-5 text-foreground">
                    Capability
                  </TableHead>
                  <TableHead className="py-4 text-center font-normal text-muted-foreground">
                    Keyword filters
                  </TableHead>
                  <TableHead className="py-4 text-center font-normal text-muted-foreground">
                    Generic moderation
                  </TableHead>
                  <TableHead className="py-4 text-center">
                    <span className="inline-flex items-center justify-center gap-1.5 rounded-full bg-violet/10 px-3 py-1">
                      <Logo withWordmark={false} className="[&_svg]:size-4" />
                      <span className="font-medium text-foreground">Black Swan</span>
                    </span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ROWS.map((row, i) => (
                  <TableRow
                    key={row.capability}
                    className={cn(
                      "border-border/40",
                      i === ROWS.length - 1 && "border-b-0"
                    )}
                  >
                    <TableCell className="py-3.5 pl-5 font-medium text-foreground/90">
                      {row.capability}
                    </TableCell>
                    <TableCell className="py-3.5 text-center">
                      <Mark level={row.keyword} />
                    </TableCell>
                    <TableCell className="py-3.5 text-center">
                      <Mark level={row.generic} />
                    </TableCell>
                    <TableCell className="bg-violet/[0.04] py-3.5 text-center">
                      <Mark level={row.blackSwan} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </ScrollReveal>
      </div>
    </section>
  );
}
