"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ChocolateBar } from "@/components/illustrations/ChocolateBar";
import { BiscuitMark, SnackMark } from "@/components/illustrations/ProductMarks";
import { Button } from "@/components/ui/Button";
import { useAppState } from "@/components/providers/AppState";
import { publishedOnly } from "@/lib/content/repository";
import { cn } from "@/lib/cn";

export default function HomePage() {
  const { cms, reducedMotion, mounted } = useAppState();
  const [exploded, setExploded] = useState(false);
  const home = cms.homepage;
  const products = cms.products;
  const motionOn = mounted && !reducedMotion;

  useEffect(() => {
    if (!mounted) return;
    if (reducedMotion) {
      setExploded(true);
      return;
    }
    const t = window.setTimeout(() => setExploded(true), 600);
    return () => window.clearTimeout(t);
  }, [mounted, reducedMotion]);

  const enter = (delayMs: number) => ({
    className: motionOn ? "hero-enter" : undefined,
    style: motionOn ? { animationDelay: `${delayMs}ms` } : undefined,
  });

  return (
    <div>
      <section className="mx-auto grid max-w-6xl gap-10 px-4 py-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:py-20">
        <div>
          <p className={cn("mono text-xs uppercase text-cocoa", enter(0).className)} style={enter(0).style}>
            {home.heroEyebrow}
          </p>
          <h1
            className={cn(
              "mt-4 max-w-xl whitespace-pre-line text-4xl text-aubergine sm:text-6xl",
              enter(80).className,
            )}
            style={enter(80).style}
          >
            {home.heroTitle}
          </h1>
          <p className={cn("mt-6 max-w-prose text-lg text-ink-soft", enter(160).className)} style={enter(160).style}>
            {home.heroSupport}
          </p>
          <div className={cn("mt-8 flex flex-wrap gap-3", enter(240).className)} style={enter(240).style}>
            <Button href="/explore/chocolate-bar">Explore a chocolate bar</Button>
            <Button href="/explore/sandwich-biscuit" variant="ghost">
              Peel a sandwich biscuit
            </Button>
            <Button href="/missions/packaging-detective" variant="secondary">
              Try a 3-minute engineering mission
            </Button>
          </div>
        </div>
        <div className={cn("rounded-[2rem] border border-line bg-paper p-6", enter(120).className)} style={enter(120).style}>
          <ChocolateBar reduced={reducedMotion} exploded={exploded} />
          <p className="mt-4 max-w-sm text-sm text-ink-soft">
            The bar opens into the hidden work: automation, mechanical systems, process engineering,
            packaging and software.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-8">
        <h2 className="text-3xl text-aubergine">Choose a familiar product</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {products.map((product) => (
            <Link
              key={product.id}
              href={`/explore/${product.id}`}
              className="group rounded-[1.5rem] border border-line bg-paper p-5 transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                {product.id === "biscuit" || product.id === "sandwich-biscuit" ? (
                  <BiscuitMark className="h-14 w-14" />
                ) : product.id === "wrapped-snack" ? (
                  <SnackMark className="h-14 w-14" />
                ) : (
                  <div className="h-10 w-24 rounded-md bg-cocoa" />
                )}
                {product.featured ? (
                  <span className="mono text-[10px] uppercase text-mint">Full journey</span>
                ) : (
                  <span className="mono text-[10px] uppercase text-cocoa-soft">Shorter look</span>
                )}
              </div>
              <h3 className="mt-4 text-2xl">{product.name}</h3>
              <p className="mt-2 text-sm text-ink-soft">{product.tagline}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-8 px-4 py-12 lg:grid-cols-3">
        {[
          {
            n: "01",
            t: "See the engineering",
            d: "Walk a factory map for a snack you already know.",
          },
          {
            n: "02",
            t: "Try a short shift",
            d: "Investigate a simplified line problem. These are learning activities, not assessments.",
          },
          {
            n: "03",
            t: "Find a possible route",
            d: "Get explained suggestions and a next step you can actually take.",
          },
        ].map((step) => (
          <article key={step.n} className="border-t border-line pt-4">
            <p className="mono text-xs text-cocoa">{step.n}</p>
            <h3 className="mt-2 text-2xl">{step.t}</h3>
            <p className="mt-2 text-ink-soft">{step.d}</p>
          </article>
        ))}
      </section>

      <section className="mx-auto grid max-w-6xl gap-4 px-4 pb-16 md:grid-cols-2">
        <Link href="/find-your-route?start=jordan" className="rounded-[1.75rem] bg-aubergine p-8 text-cream">
          <p className="mono text-xs uppercase text-yellow">No experience? Start here.</p>
          <h2 className="mt-3 text-3xl">You do not need a degree story to look around.</h2>
          <p className="mt-3 max-w-prose text-cream/80">
            If you have GCSEs, left a course, or have never had a paid job, we will keep the next
            step small and practical.
          </p>
        </Link>
        <Link href="/find-your-route?start=graduate" className="rounded-[1.75rem] bg-paper p-8 border border-line">
          <p className="mono text-xs uppercase text-mint">Students and graduates</p>
          <h2 className="mt-3 text-3xl text-aubergine">Bring your course. Meet the factory.</h2>
          <p className="mt-3 max-w-prose text-ink-soft">
            Connect computing, mechanical, electrical or process study to roles that keep snacks
            consistent, safe and less wasteful.
          </p>
        </Link>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-20">
        <h2 className="max-w-2xl text-3xl text-aubergine">
          Engineering here is about quality, reliability, resource use and keeping a line running.
        </h2>
        <p className="mt-4 max-w-prose text-ink-soft">
          This prototype does not claim to cut factory waste or hire anyone. It is a way to
          understand the work, then take an informed next step.
        </p>
        <div className="mt-6">
          <Button href="/careers" variant="ghost">
            Browse {publishedOnly(cms.careers).length} career profiles
          </Button>
        </div>
      </section>
    </div>
  );
}
