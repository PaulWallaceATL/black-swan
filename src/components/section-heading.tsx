import { cn } from "@/lib/utils";
import { Eyebrow } from "@/components/brand";
import { ScrollReveal } from "@/components/react-bits/scroll-reveal";

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  className,
}: {
  eyebrow: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <ScrollReveal
      className={cn(
        "flex flex-col gap-4",
        align === "center" && "items-center text-center",
        className
      )}
    >
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2 className="max-w-2xl font-display text-3xl font-semibold leading-tight tracking-tight text-foreground sm:text-4xl">
        {title}
      </h2>
      {description && (
        <p
          className={cn(
            "max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg",
            align === "center" && "mx-auto"
          )}
        >
          {description}
        </p>
      )}
    </ScrollReveal>
  );
}
