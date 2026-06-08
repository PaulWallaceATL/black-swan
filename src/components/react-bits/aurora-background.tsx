import { cn } from "@/lib/utils";

/**
 * Blurred, drifting aura lighting used as an ambient backdrop behind sections.
 * Pure CSS — no runtime cost beyond compositing.
 */
export function AuroraBackground({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 -z-10 overflow-hidden",
        className
      )}
    >
      <div className="absolute -left-[12%] top-[-8%] size-[42rem] rounded-full bg-violet/22 blur-[120px] animate-aurora" />
      <div className="absolute right-[-10%] top-[18%] size-[38rem] rounded-full bg-mulberry/24 blur-[130px] animate-aurora [animation-delay:-6s]" />
      <div className="absolute bottom-[-14%] left-[28%] size-[34rem] rounded-full bg-aubergine/35 blur-[120px] animate-aurora [animation-delay:-11s]" />
    </div>
  );
}
