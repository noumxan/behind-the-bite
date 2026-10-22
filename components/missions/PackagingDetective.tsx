"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import { useAppState } from "@/components/providers/AppState";
import {
  DEFAULT_PACKAGING,
  lessonFromComparison,
  runPackagingBatch,
  type PackagingMetrics,
  type PackagingSettings,
} from "@/lib/simulation/packaging";

const hypotheses = [
  {
    id: "threshold-tight",
    label: "The reject threshold is too tight, so good packs look ‘wrong’.",
    hint: "A lower number on this sensor means more packs are rejected.",
  },
  {
    id: "speed-noise",
    label: "The conveyor is fast, so the sensor reading is noisier.",
    hint: "Higher speed in this model increases measurement scatter.",
  },
  {
    id: "more-defects",
    label: "There are simply more defective packs than usual.",
    hint: "The true defect rate is fixed in this demo. You cannot change how many are actually defective.",
  },
];

type Phase = "observe" | "inspect" | "hypothesize" | "adjust" | "compare" | "complete";

export function PackagingDetective() {
  const { track, reducedMotion } = useAppState();
  const [phase, setPhase] = useState<Phase>("observe");
  const [settings, setSettings] = useState<PackagingSettings>(DEFAULT_PACKAGING);
  const [baseline] = useState(() => runPackagingBatch(DEFAULT_PACKAGING));
  const [second, setSecond] = useState<ReturnType<typeof runPackagingBatch> | null>(null);
  const [hypothesis, setHypothesis] = useState<string | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [walkthrough, setWalkthrough] = useState(false);

  const after = second?.metrics;
  const lessons = after ? lessonFromComparison(baseline.metrics, after) : [];

  function start() {
    track("mission_start", { mission: "packaging-detective" });
    setPhase("inspect");
  }

  function runSecond() {
    const result = runPackagingBatch(settings);
    setSecond(result);
    setPhase("compare");
    track("choice", {
      mission: "packaging-detective",
      threshold: settings.threshold,
      speed: settings.conveyorSpeed,
    });
  }

  function complete() {
    track("mission_complete", { mission: "packaging-detective" });
    setPhase("complete");
  }

  function retry() {
    track("mission_retry", { mission: "packaging-detective" });
    setSecond(null);
    setPhase("observe");
    setHypothesis(null);
    setSettings(DEFAULT_PACKAGING);
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <p className="mono text-xs uppercase text-cocoa">Flagship mission</p>
      <h1 className="mt-2 text-4xl text-aubergine sm:text-5xl">Packaging Detective</h1>
      <p className="mt-4 max-w-prose">
        A packaging line is rejecting too many correctly packed products. Investigate the signals
        and test an adjustment.
      </p>
      <p className="mt-3 text-sm text-ink-soft">
        Simplified learning activity, not a recruitment assessment. The numbers come from a seeded
        model, not a real factory.
      </p>

      <div className="mt-6 flex flex-wrap gap-3">
        <Button
          variant="ghost"
          onClick={() => {
            setWalkthrough((v) => !v);
            track("walkthrough_used", { mission: "packaging-detective" });
          }}
        >
          {walkthrough ? "Hide walkthrough" : "Show me how"}
        </Button>
        <Button
          variant="ghost"
          onClick={() => {
            setShowHint(true);
            track("hint_used", { mission: "packaging-detective" });
          }}
        >
          Hint
        </Button>
      </div>
      {walkthrough && (
        <ol className="mt-4 max-w-prose list-decimal pl-5 text-sm text-ink-soft">
          <li>Watch the baseline batch and read unnecessary rejects versus missed defects.</li>
          <li>Open a few sensor readings. Good packs should usually sit below the threshold.</li>
          <li>Choose the tight-threshold hypothesis, then raise the threshold slightly.</li>
          <li>Run a second batch and compare. Quality matters more than raw speed here.</li>
        </ol>
      )}
      {showHint && (
        <p className="mt-3 rounded-xl bg-mint-soft px-4 py-3 text-sm">
          If good packs are being rejected, the gate may be too eager. Try a slightly higher
          threshold, and avoid chasing throughput if missed defects rise.
        </p>
      )}

      <ConveyorPreview reduced={reducedMotion} packages={second?.packages ?? baseline.packages} />

      {phase === "observe" && (
        <section className="mt-8">
          <h2 className="text-2xl">1. Observe a baseline run</h2>
          <MetricsTable metrics={baseline.metrics} />
          <Button className="mt-4" onClick={start}>
            Inspect measurements
          </Button>
        </section>
      )}

      {phase !== "observe" && (
        <section className="mt-8">
          <h2 className="text-2xl">2. Inspect measurements</h2>
          <p className="mt-2 text-sm text-ink-soft">
            Each pack has a true state (acceptable or defective) and a noisy sensor reading. If the
            reading is at or above the threshold, the pack is rejected.
          </p>
          <ResultsTable
            rows={(second?.packages ?? baseline.packages).slice(0, 12)}
            threshold={phase === "compare" || phase === "complete" ? settings.threshold : DEFAULT_PACKAGING.threshold}
          />
        </section>
      )}

      {["hypothesize", "adjust", "compare", "complete", "inspect"].includes(phase) && phase !== "observe" && (
        <section className="mt-8">
          <h2 className="text-2xl">3. Choose a hypothesis</h2>
          <div className="mt-3 grid gap-2">
            {hypotheses.map((item) => (
              <label key={item.id} className="flex gap-3 rounded-2xl border border-line bg-paper p-4">
                <input
                  type="radio"
                  name="hypothesis"
                  checked={hypothesis === item.id}
                  onChange={() => {
                    setHypothesis(item.id);
                    setPhase("adjust");
                  }}
                />
                <span>
                  {item.label}
                  {showHint ? <span className="block text-sm text-ink-soft">{item.hint}</span> : null}
                </span>
              </label>
            ))}
          </div>
        </section>
      )}

      {(phase === "adjust" || phase === "compare" || phase === "complete") && (
        <section className="mt-8">
          <h2 className="text-2xl">4. Adjust and run another batch</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <label className="block">
              Reject threshold ({settings.threshold.toFixed(2)})
              <input
                type="range"
                min={0.35}
                max={0.9}
                step={0.01}
                value={settings.threshold}
                onChange={(e) =>
                  setSettings((s) => ({ ...s, threshold: Number(e.target.value) }))
                }
                className="mt-2 w-full"
              />
            </label>
            <label className="block">
              Conveyor speed ({settings.conveyorSpeed})
              <input
                type="range"
                min={40}
                max={95}
                step={1}
                value={settings.conveyorSpeed}
                onChange={(e) =>
                  setSettings((s) => ({ ...s, conveyorSpeed: Number(e.target.value) }))
                }
                className="mt-2 w-full"
              />
            </label>
          </div>
          <Button className="mt-4" onClick={runSecond}>
            Run second batch
          </Button>
        </section>
      )}

      {(phase === "compare" || phase === "complete") && after && (
        <section className="mt-8">
          <h2 className="text-2xl">5. Compare outcomes</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div>
              <h3 className="font-semibold">Baseline</h3>
              <MetricsTable metrics={baseline.metrics} />
            </div>
            <div>
              <h3 className="font-semibold">After your change</h3>
              <MetricsTable metrics={after} />
            </div>
          </div>
          <ul className="mt-4 list-disc pl-5">
            {lessons.map((note) => (
              <li key={note}>{note}</li>
            ))}
          </ul>
          <p className="mt-3 text-sm">
            False rejects are good packs pushed aside. Missed defects are problem packs that slipped
            through. This activity does not reward speed if quality gets worse.
          </p>
          {phase === "compare" && (
            <Button className="mt-4" onClick={complete}>
              Finish
            </Button>
          )}
        </section>
      )}

      {phase === "complete" && (
        <section className="mt-10 rounded-[1.8rem] bg-aubergine p-8 text-cream">
          <h2 className="text-3xl">You’ve explored a task connected to automation and controls engineering.</h2>
          <p className="mt-4">
            You investigated why a sensor-and-threshold combination might reject good packs, then
            compared a second seeded batch.
          </p>
          <p className="mt-3 text-cream/80">
            Similar reasoning shows up when engineers tune vision systems, checkweighers and PLC
            logic: gather evidence, change one thing, compare, and watch quality as well as flow.
          </p>
          <p className="mt-3 text-sm text-yellow">
            This is not a certificate, skill score or proof you can do the job.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button href="/careers/automation-controls">View related career</Button>
            <Button href="/find-your-route" variant="ghost" className="border-cream text-cream">
              Find a route
            </Button>
            <Button variant="ghost" className="border-cream text-cream" onClick={retry}>
              Retry without penalty
            </Button>
          </div>
        </section>
      )}
    </div>
  );
}

function MetricsTable({ metrics }: { metrics: PackagingMetrics }) {
  const rows = [
    ["Correctly accepted", metrics.correctlyAccepted, "Good packs that stayed on the line."],
    ["Correctly rejected", metrics.correctlyRejected, "Defective packs caught by the gate."],
    ["Unnecessary rejects", metrics.unnecessaryRejects, "Good packs thrown aside — waste."],
    ["Missed defects", metrics.missedDefects, "Problem packs that got through."],
    ["Illustrative throughput", metrics.throughput, "Relative flow in this model, not a plant KPI."],
  ] as const;
  return (
    <table className="mt-3 w-full text-sm">
      <thead>
        <tr className="text-left border-b border-line">
          <th className="py-2">Metric</th>
          <th>Value</th>
          <th>Meaning</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={row[0]} className="border-b border-line">
            <td className="py-2">{row[0]}</td>
            <td className="mono">{row[1]}</td>
            <td className="text-ink-soft">{row[2]}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function ResultsTable({
  rows,
  threshold,
}: {
  rows: ReturnType<typeof runPackagingBatch>["packages"];
  threshold: number;
}) {
  return (
    <div className="mt-3 overflow-x-auto">
      <table className="w-full min-w-[32rem] text-sm">
        <caption className="sr-only">Package measurements</caption>
        <thead>
          <tr className="text-left border-b border-line">
            <th className="py-2">Pack</th>
            <th>True state</th>
            <th>Sensor</th>
            <th>Threshold</th>
            <th>Decision</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.index} className="border-b border-line">
              <td className="py-2 mono">{row.index}</td>
              <td>{row.trueDefect ? "Defective" : "Acceptable"}</td>
              <td className="mono">{row.sensor.toFixed(2)}</td>
              <td className="mono">{threshold.toFixed(2)}</td>
              <td>{row.rejected ? "Rejected" : "Accepted"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ConveyorPreview({
  reduced,
  packages,
}: {
  reduced: boolean;
  packages: ReturnType<typeof runPackagingBatch>["packages"];
}) {
  const shown = useMemo(() => packages.slice(0, 8), [packages]);
  return (
    <div className="mt-8 overflow-hidden rounded-3xl border border-line bg-paper p-4" aria-hidden={reduced}>
      <p className="mono text-xs uppercase text-cocoa">Line view</p>
      <div className="relative mt-4 h-24 overflow-hidden rounded-2xl bg-aubergine-deep">
        <div className={`absolute inset-x-0 top-10 h-6 bg-cocoa ${reduced ? "" : "animate-conveyor"}`} />
        <div className="relative flex h-full items-center gap-3 px-4">
          {shown.map((item) => (
            <span
              key={item.index}
              className={`inline-flex h-10 w-14 items-center justify-center rounded-md text-[10px] ${
                item.rejected ? "bg-yellow text-aubergine" : "bg-cream"
              }`}
            >
              {item.rejected ? "RJ" : "OK"}
            </span>
          ))}
          <span className={`ml-auto h-8 w-8 rounded-full bg-mint ${reduced ? "" : "animate-sensor"}`} />
        </div>
      </div>
    </div>
  );
}
