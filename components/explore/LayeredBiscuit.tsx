"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { Button } from "@/components/ui/Button";
import { useAppState } from "@/components/providers/AppState";
import { BISCUIT_LAYERS, type BiscuitLayer } from "@/lib/content/layers";
import { INTEREST_OPTIONS } from "@/lib/profile/catalog";
import type { InterestId } from "@/lib/content/types";

export function LayeredBiscuitExplorer() {
  const { cms, track, saveInterest, profile, reducedMotion, openComposer } = useAppState();
  const [separated, setSeparated] = useState(false);
  const [listView, setListView] = useState(false);
  const [selectedId, setSelectedId] = useState<(typeof BISCUIT_LAYERS)[number]["id"]>(
    "automation-inspection",
  );
  const [savedFlash, setSavedFlash] = useState(false);
  const layer = BISCUIT_LAYERS.find((item) => item.id === selectedId) ?? BISCUIT_LAYERS[3];

  useEffect(() => {
    track("explore_start", { product: "sandwich-biscuit" }, "explore-sandwich-biscuit");
  }, [track]);
  const career = cms.careers.find((item) => item.id === layer.relatedCareer);
  const mission = cms.missions.find((item) => item.id === layer.relatedMission);

  function selectLayer(next: BiscuitLayer) {
    setSelectedId(next.id);
    track("layer_open", { layer: next.id, product: "sandwich-biscuit" }, `layer-${next.id}`);
  }

  function onKey(event: React.KeyboardEvent) {
    const index = BISCUIT_LAYERS.findIndex((item) => item.id === selectedId);
    if (event.key === "ArrowDown" || event.key === "ArrowRight") {
      event.preventDefault();
      selectLayer(BISCUIT_LAYERS[Math.min(index + 1, BISCUIT_LAYERS.length - 1)]);
    }
    if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
      event.preventDefault();
      selectLayer(BISCUIT_LAYERS[Math.max(index - 1, 0)]);
    }
    if (event.key === "Home") {
      event.preventDefault();
      selectLayer(BISCUIT_LAYERS[0]);
    }
    if (event.key === "End") {
      event.preventDefault();
      selectLayer(BISCUIT_LAYERS[BISCUIT_LAYERS.length - 1]);
    }
  }

  const interestLabels = useMemo(
    () => INTEREST_OPTIONS.filter((item) => layer.interests.includes(item.id)),
    [layer],
  );

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <p className="mono text-xs uppercase text-cocoa">Layered explorer</p>
      <h1 className="mt-2 text-4xl text-aubergine sm:text-5xl">Sandwich biscuit</h1>
      <p className="mt-4 max-w-prose text-ink-soft">
        Peel the snack apart to see the engineering inside. The picture and the list show the same
        five stages.
      </p>
      <div className="mt-6 flex flex-wrap gap-3">
        <Button onClick={() => setSeparated((value) => !value)}>
          {separated ? "Restack layers" : "Separate the layers"}
        </Button>
        <Button variant="ghost" onClick={() => setListView((value) => !value)}>
          {listView ? "Show layered picture" : "Show list view"}
        </Button>
      </div>

      {!listView && (
        <div
          className="mt-8 rounded-[2rem] border border-line bg-paper p-4 sm:p-8"
          onKeyDown={onKey}
          role="listbox"
          aria-label="Biscuit layers"
          tabIndex={0}
        >
          <svg viewBox="0 0 360 220" className="mx-auto w-full max-w-lg" aria-hidden>
            {BISCUIT_LAYERS.map((item, index) => {
              const gap = separated ? index * 22 : index * 8;
              const selected = item.id === selectedId;
              return (
                <motion.g
                  key={item.id}
                  initial={false}
                  animate={{ y: reducedMotion ? (separated ? index * 18 : index * 6) : gap }}
                  transition={{ duration: reducedMotion ? 0 : 0.45 }}
                >
                  <rect
                    x="48"
                    y={28 + index * 2}
                    width="264"
                    height="36"
                    rx="16"
                    fill={selected ? "#f2c014" : ["#c99708", "#e8c15a", "#fffbf4", "#2f8f82", "#5b3426"][index]}
                    stroke="#3b1238"
                    strokeWidth={selected ? 3 : 1}
                  />
                </motion.g>
              );
            })}
          </svg>
          <div className="mt-4 grid gap-2">
            {BISCUIT_LAYERS.map((item) => (
              <button
                key={item.id}
                type="button"
                role="option"
                aria-selected={item.id === selectedId}
                className={`min-h-12 rounded-2xl border px-4 text-left ${
                  item.id === selectedId ? "border-aubergine bg-yellow/50" : "border-line"
                }`}
                onClick={() => selectLayer(item)}
              >
                {item.title}
              </button>
            ))}
          </div>
        </div>
      )}

      {listView && (
        <ol className="mt-8 grid gap-2">
          {BISCUIT_LAYERS.map((item) => (
            <li key={item.id}>
              <button
                type="button"
                className={`w-full min-h-14 rounded-2xl border px-4 py-3 text-left ${
                  item.id === selectedId ? "border-aubergine bg-yellow/50" : "border-line bg-paper"
                }`}
                onClick={() => selectLayer(item)}
              >
                <span className="font-semibold">{item.title}</span>
                <span className="mt-1 block text-sm text-ink-soft">{item.whatHappens}</span>
              </button>
            </li>
          ))}
        </ol>
      )}

      <LayerPanel
        layer={layer}
        careerTitle={career?.title}
        careerHref={career ? `/careers/${career.id}` : undefined}
        missionTitle={mission?.title}
        missionHref={mission?.href}
        interestLabels={interestLabels}
        saved={layer.interests.some((id) => profile.interests.includes(id))}
        savedFlash={savedFlash}
        onSave={() => {
          const primary = layer.interests[0];
          saveInterest(primary, true);
          setSavedFlash(true);
          window.setTimeout(() => setSavedFlash(false), 1600);
        }}
        onAsk={() =>
          openComposer(
            {
              title: layer.title,
              href: "/explore/sandwich-biscuit",
              pageLabel: "Sandwich biscuit explorer",
            },
            "Can you explain the entry requirements in simpler language?",
          )
        }
      />
    </div>
  );
}

function LayerPanel({
  layer,
  careerTitle,
  careerHref,
  missionTitle,
  missionHref,
  interestLabels,
  saved,
  savedFlash,
  onSave,
  onAsk,
}: {
  layer: BiscuitLayer;
  careerTitle?: string;
  careerHref?: string;
  missionTitle?: string;
  missionHref?: string;
  interestLabels: { id: InterestId; label: string }[];
  saved: boolean;
  savedFlash: boolean;
  onSave: () => void;
  onAsk: () => void;
}) {
  return (
    <article className="mt-8 rounded-[1.8rem] bg-aubergine p-6 text-cream sm:p-8">
      <p className="mono text-xs uppercase text-yellow">{layer.shortLabel}</p>
      <h2 className="mt-2 text-3xl">{layer.title}</h2>
      <p className="mt-3">{layer.whatHappens}</p>
      <h3 className="mt-6 text-xl">What an engineer might investigate</h3>
      <p className="mt-2 text-cream/90">{layer.engineerLooksAt}</p>
      <p className="mt-3 text-sm text-cream/70">Tools: {layer.tools.join(" · ")}</p>
      <details className="mt-4 text-sm">
        <summary>Optional technical detail</summary>
        <p className="mt-2">{layer.technicalNote}</p>
      </details>
      <p className="mt-4">{layer.whyItMatters}</p>
      {careerHref && (
        <p className="mt-4">
          Related career:{" "}
          <Link href={careerHref} className="text-yellow underline">
            {careerTitle}
          </Link>
        </p>
      )}
      {missionHref && (
        <div className="mt-4">
          <Button href={missionHref}>Try {missionTitle}</Button>
        </div>
      )}
      <p className="mt-6 text-sm">Connected interests: {interestLabels.map((item) => item.label).join(" · ")}</p>
      <div className="mt-4 flex flex-wrap gap-3">
        <Button onClick={onSave}>{saved ? "Saved to My Bite" : "Save this interest"}</Button>
        <Button variant="ghost" className="border-cream text-cream" onClick={onAsk}>
          Ask the team
        </Button>
      </div>
      {savedFlash ? <p className="mt-3 text-yellow">Saved. It now appears on My Bite.</p> : null}
    </article>
  );
}
