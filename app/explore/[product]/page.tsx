"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { FactoryScene } from "@/components/illustrations/FactoryScene";
import { LayeredBiscuitExplorer } from "@/components/explore/LayeredBiscuit";
import { Button } from "@/components/ui/Button";
import { QuestionBank } from "@/components/support/QuestionBank";
import { useAppState } from "@/components/providers/AppState";
import type { InterestId, ProductId, Station } from "@/lib/content/types";

const chips: { id: InterestId; label: string }[] = [
  { id: "coding", label: "I like coding" },
  { id: "fixing", label: "I like fixing things" },
  { id: "sustainability", label: "I care about sustainability" },
  { id: "design", label: "I enjoy design" },
];

export default function ProductExplorePage() {
  const params = useParams<{ product: string }>();
  const { cms, track, reducedMotion, openComposer } = useAppState();
  const product = cms.products.find((item) => item.id === params.product);
  const [selected, setSelected] = useState<Station["id"] | "">("");
  const [interest, setInterest] = useState<InterestId | null>(null);

  useEffect(() => {
    if (!product) return;
    track("explore_start", { product: product.id }, `explore-${product.id}`);
    setSelected(product.stations[0]?.id ?? "");
  }, [product, track]);

  const station = product?.stations.find((item) => item.id === selected) ?? product?.stations[0];
  const career = cms.careers.find((item) => item.id === station?.relatedCareer);
  const mission = cms.missions.find((item) => item.id === station?.relatedMission);

  const highlighted = useMemo(() => {
    if (!product || !interest) return [];
    return product.stations.filter((item) => item.interests.includes(interest));
  }, [interest, product]);

  if (params.product === "sandwich-biscuit") {
    return <LayeredBiscuitExplorer />;
  }

  if (!product) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16">
        <h1 className="text-3xl">Product not found</h1>
        <Button href="/explore" className="mt-6">
          Back to products
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <p className="mono text-xs uppercase text-cocoa">Product explorer</p>
      <h1 className="mt-2 text-4xl text-aubergine sm:text-5xl">{product.name}</h1>
      <p className="mt-4 max-w-prose text-ink-soft">{product.description}</p>

      <fieldset className="mt-8">
        <legend className="text-sm font-semibold">What are you curious about?</legend>
        <div className="mt-3 flex flex-wrap gap-2">
          {chips.map((chip) => (
            <button
              key={chip.id}
              type="button"
              onClick={() => setInterest(interest === chip.id ? null : chip.id)}
              className={`min-h-11 rounded-full border px-4 text-sm ${
                interest === chip.id ? "border-aubergine bg-yellow" : "border-line bg-paper"
              }`}
              aria-pressed={interest === chip.id}
            >
              {chip.label}
            </button>
          ))}
        </div>
        {interest && (
          <p className="mt-3 max-w-prose text-sm text-ink-soft">
            Highlighted stations connect to that interest. This is not a prediction of the job you
            should do.
          </p>
        )}
      </fieldset>

      <div className="mt-8 hidden lg:block rounded-[2rem] border border-line bg-paper p-4">
        <FactoryScene
          stations={product.stations}
          selected={station?.id ?? ""}
          reduced={reducedMotion}
          onSelect={(id) => {
            setSelected(id);
            track("station_open", { station: id, product: product.id });
          }}
        />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <ol className="grid gap-3">
          {product.stations.map((item) => {
            const on = item.id === station?.id;
            const glow = highlighted.some((h) => h.id === item.id);
            return (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => {
                    setSelected(item.id);
                    track("station_open", { station: item.id, product: product.id });
                  }}
                  className={`w-full rounded-2xl border px-4 py-4 text-left min-h-14 ${
                    on ? "border-aubergine bg-yellow/40" : "border-line bg-paper"
                  } ${glow ? "ring-2 ring-mint" : ""}`}
                >
                  <span className="font-semibold">{item.title}</span>
                  {glow ? (
                    <span className="ml-2 text-xs text-mint">Related to your interest chip</span>
                  ) : null}
                </button>
              </li>
            );
          })}
        </ol>

        {station && (
          <article className="rounded-[1.8rem] bg-aubergine p-6 text-cream sm:p-8">
            <p className="mono text-xs uppercase text-yellow">{station.title}</p>
            <h2 className="mt-2 text-3xl">What happens here</h2>
            <p className="mt-3 text-cream/90">{station.whatHappens}</p>
            <h3 className="mt-6 text-xl">What an engineer might investigate</h3>
            <p className="mt-2 text-cream/90">{station.engineerLooksAt}</p>
            <p className="mt-4 text-sm text-cream/70">
              Tools: {station.tools.join(" · ")}
            </p>
            <details className="mt-4 text-sm">
              <summary className="cursor-pointer">Optional technical detail</summary>
              <p className="mt-2 text-cream/80">{station.technicalNote}</p>
            </details>
            <p className="mt-4">{station.whyItMatters}</p>
            {career && (
              <p className="mt-6">
                Related career:{" "}
                <Link className="underline text-yellow" href={`/careers/${career.id}`}>
                  {career.title}
                </Link>
              </p>
            )}
            {mission && (
              <div className="mt-6">
                <Button href={mission.href}>Try {mission.title}</Button>
              </div>
            )}
          </article>
        )}
      </div>
      <div className="mt-8">
        <Button
          variant="ghost"
          onClick={() =>
            openComposer({
              title: station?.title ?? product.name,
              href: `/explore/${product.id}`,
              pageLabel: `${product.name} explorer`,
            })
          }
        >
          Ask the team
        </Button>
      </div>
      <QuestionBank
        context={{
          title: station?.title ?? product.name,
          href: `/explore/${product.id}`,
          pageLabel: `${product.name} explorer`,
        }}
      />
      <OtherProducts current={product.id} />
    </div>
  );
}

function OtherProducts({ current }: { current: ProductId }) {
  const { cms } = useAppState();
  return (
    <p className="mt-10 text-sm">
      Also explore{" "}
      {cms.products
        .filter((item) => item.id !== current)
        .map((item) => (
          <Link key={item.id} href={`/explore/${item.id}`} className="mr-3 underline">
            {item.name}
          </Link>
        ))}
    </p>
  );
}
