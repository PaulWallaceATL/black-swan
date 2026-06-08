import * as React from "react";
import { cn } from "@/lib/utils";

type GradientTextProps = React.ComponentProps<"span">;

/** Animated gradient fill for emphasis words in headlines. */
export function GradientText({ className, children, ...props }: GradientTextProps) {
  return (
    <span className={cn("text-aurora", className)} {...props}>
      {children}
    </span>
  );
}
