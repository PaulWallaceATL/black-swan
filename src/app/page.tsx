import { SiteNav } from "@/components/sections/site-nav";
import { Hero } from "@/components/sections/hero";
import { Problem } from "@/components/sections/problem";
import { Product } from "@/components/sections/product";
import { RiskFramework } from "@/components/sections/risk-framework";
import { UseCases } from "@/components/sections/use-cases";
import { Architecture } from "@/components/sections/architecture";
import { Differentiation } from "@/components/sections/differentiation";
import { Mission } from "@/components/sections/mission";
import { CtaSection } from "@/components/sections/cta";
import { SiteFooter } from "@/components/sections/site-footer";
import { Noise } from "@/components/react-bits/noise";

export default function Home() {
  return (
    <>
      <Noise />
      <SiteNav />
      <main className="relative flex-1">
        <Hero />
        <Problem />
        <Product />
        <RiskFramework />
        <UseCases />
        <Architecture />
        <Differentiation />
        <Mission />
        <CtaSection />
      </main>
      <SiteFooter />
    </>
  );
}
