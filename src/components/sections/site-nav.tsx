"use client";

import * as React from "react";
import { Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/brand";
import { buttonVariants } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const NAV_LINKS = [
  { label: "Problem", href: "#problem" },
  { label: "Product", href: "#product" },
  { label: "Risk Framework", href: "#framework" },
  { label: "Use Cases", href: "#use-cases" },
  { label: "Architecture", href: "#architecture" },
  { label: "Mission", href: "#mission" },
];

export function SiteNav() {
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-3 sm:pt-4">
      <nav
        aria-label="Primary"
        className={cn(
          "flex w-full max-w-6xl items-center justify-between gap-4 rounded-2xl px-4 py-2.5 transition-all duration-300 sm:px-5",
          scrolled
            ? "glass-panel shadow-[0_18px_50px_-30px_oklch(0.12_0.014_305/0.9)]"
            : "border border-transparent"
        )}
      >
        <a
          href="#top"
          className="rounded-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
          aria-label="Aegis home"
        >
          <Logo />
        </a>

        <ul className="hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <a
            href="#access"
            className={cn(
              buttonVariants({ variant: "default", size: "lg" }),
              "hidden sm:inline-flex"
            )}
          >
            Request Access
          </a>

          <Sheet>
            <SheetTrigger
              render={
                <button
                  type="button"
                  aria-label="Open menu"
                  className={cn(
                    buttonVariants({ variant: "outline", size: "icon" }),
                    "lg:hidden"
                  )}
                />
              }
            >
              <Menu className="size-4" />
            </SheetTrigger>
            <SheetContent side="right" className="border-border bg-popover">
              <SheetHeader>
                <SheetTitle>
                  <Logo />
                </SheetTitle>
                <SheetDescription>
                  Misogyny risk intelligence for high-stakes systems.
                </SheetDescription>
              </SheetHeader>
              <div className="flex flex-col gap-1 px-4">
                {NAV_LINKS.map((link) => (
                  <SheetClose
                    key={link.href}
                    render={
                      <a
                        href={link.href}
                        className="rounded-lg px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                      />
                    }
                  >
                    {link.label}
                  </SheetClose>
                ))}
                <SheetClose
                  render={
                    <a
                      href="#access"
                      className={cn(
                        buttonVariants({ variant: "default", size: "lg" }),
                        "mt-3 w-full"
                      )}
                    />
                  }
                >
                  Request Access
                </SheetClose>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
}
