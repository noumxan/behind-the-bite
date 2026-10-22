"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { useAppState } from "@/components/providers/AppState";
import { evaluateCooling } from "@/lib/simulation/cooling";

export default function CoolingChallengePage() {
  const { track } = useAppState();
  const [duration, setDuration] = useState(20);
  const [speed, setSpeed] = useState(55);
  const [started, setStarted] = useState(false);
  const outcome = evaluateCooling({ durationSeconds: duration, lineSpeed: speed });

  useEffect(() => {
    track("mission_start", { mission: "cooling-challenge" });
  }, [track]);

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <p className="mono text-xs uppercase text-cocoa">Simplified educational model — not operating guidance</p>
      <h1 className="mt-2 text-4xl text-aubergine">Cooling Challenge</h1>
      <p className="mt-4">
        Adjust cooling duration and line speed. Watch illustrative effects on consistency, energy
        and throughput.
      </p>
      <ul className="mt-4 list-disc pl-5 text-sm text-ink-soft">
        <li>The model assumes a chocolate-like centre that needs about 18 seconds of cooling.</li>
        <li>Faster belts reduce time at temperature.</li>
        <li>Longer cooling uses more energy in this sketch.</li>
      </ul>
      <label className="mt-8 block">
        Cooling duration ({duration}s)
        <input
          type="range"
          min={8}
          max={36}
          value={duration}
          onChange={(e) => setDuration(Number(e.target.value))}
          className="mt-2 w-full"
        />
      </label>
      <label className="mt-6 block">
        Line speed ({speed})
        <input
          type="range"
          min={30}
          max={100}
          value={speed}
          onChange={(e) => setSpeed(Number(e.target.value))}
          className="mt-2 w-full"
        />
      </label>
      <dl className="mt-8 grid gap-3">
        <Metric label="Consistency" value={outcome.consistency} />
        <Metric label="Energy use" value={outcome.energy} />
        <Metric label="Throughput" value={outcome.throughput} />
      </dl>
      <ul className="mt-6 list-disc pl-5">
        {outcome.notes.map((note) => (
          <li key={note}>{note}</li>
        ))}
      </ul>
      <p className="mt-6 text-sm">
        Process engineers run real trials with quality, energy and safety data. This sketch only
        shows that the three goals pull against each other.
      </p>
      {!started ? (
        <Button
          className="mt-6"
          onClick={() => {
            setStarted(true);
            track("mission_complete", { mission: "cooling-challenge" });
          }}
        >
          Save this as completed
        </Button>
      ) : (
        <p className="mt-6 text-mint">Recorded in this browser’s demo activity.</p>
      )}
      <div className="mt-6">
        <Button href="/careers/process" variant="ghost">
          Process engineer profile
        </Button>
      </div>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="flex justify-between text-sm">
        <dt>{label}</dt>
        <dd className="mono">{Math.round(value * 100)}%</dd>
      </div>
      <div className="mt-1 h-2 rounded-full bg-cream-dark">
        <div className="h-2 rounded-full bg-mint" style={{ width: `${Math.round(value * 100)}%` }} />
      </div>
    </div>
  );
}
