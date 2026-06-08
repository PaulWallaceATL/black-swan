import { cn } from "@/lib/utils";

/**
 * Animated SVG connector with a traveling signal pulse, used to link
 * architecture stages. Renders horizontally on desktop, vertically on mobile.
 */
export function SignalFlow({
  className,
  vertical = false,
}: {
  className?: string;
  vertical?: boolean;
}) {
  if (vertical) {
    return (
      <svg
        aria-hidden="true"
        viewBox="0 0 24 80"
        preserveAspectRatio="none"
        className={cn("h-10 w-6", className)}
      >
        <line
          x1="12"
          y1="0"
          x2="12"
          y2="80"
          stroke="oklch(0.7 0.04 320 / 0.25)"
          strokeWidth="1.5"
          strokeDasharray="2 4"
        />
        <circle r="2.5" fill="oklch(0.64 0.23 295)">
          <animate
            attributeName="cy"
            from="0"
            to="80"
            dur="2.4s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="opacity"
            values="0;1;1;0"
            dur="2.4s"
            repeatCount="indefinite"
          />
        </circle>
      </svg>
    );
  }

  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 120 24"
      preserveAspectRatio="none"
      className={cn("h-6 w-full", className)}
    >
      <line
        x1="0"
        y1="12"
        x2="120"
        y2="12"
        stroke="oklch(0.7 0.04 320 / 0.25)"
        strokeWidth="1.5"
        strokeDasharray="2 4"
      />
      <circle r="2.5" fill="oklch(0.64 0.23 295)">
        <animate
          attributeName="cx"
          from="0"
          to="120"
          dur="2.4s"
          repeatCount="indefinite"
        />
        <animate
          attributeName="opacity"
          values="0;1;1;0"
          dur="2.4s"
          repeatCount="indefinite"
        />
      </circle>
    </svg>
  );
}
