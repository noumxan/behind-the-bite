"use client";

import { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Button } from "@/components/ui/Button";
import { useAppState } from "@/components/providers/AppState";
import {
  browserFunnel,
  metricDefinitions,
  sampleFunnel,
  toSteps,
  type FunnelSource,
} from "@/lib/analytics/funnel";
import { downloadCsv, toCsv } from "@/lib/csv";
import { SAMPLE_COHORT } from "@/lib/content/seed";
import { useAdminFilter } from "./AdminFilters";

export function AdminOverview() {
  const { activity } = useAppState();
  const { range } = useAdminFilter();
  const [source, setSource] = useState<FunnelSource>("sample");

  const filteredEvents = useMemo(() => {
    const days = range === "7" ? 7 : range === "30" ? 30 : null;
    if (!days) return activity.events;
    const from = Date.now() - days * 86400000;
    return activity.events.filter((event) => new Date(event.at).getTime() >= from);
  }, [activity.events, range]);

  const counts = source === "sample" ? sampleFunnel() : browserFunnel(filteredEvents);
  const steps = toSteps(counts);
  const defs = metricDefinitions();
  const chartData = steps.map((step) => ({ name: step.label, count: step.count }));

  return (
    <div>
      <h1 className="font-display text-3xl text-aubergine">Outreach overview</h1>
      <p className="mt-2 max-w-prose text-sm text-ink-soft">
        This is an outreach and content dashboard, not a factory operations system. Sample cohort
        and this browser’s activity are never mixed.
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          className={`rounded-full px-4 py-2 text-sm ${source === "sample" ? "bg-yellow" : "bg-paper border border-line"}`}
          onClick={() => setSource("sample")}
        >
          Sample cohort (synthetic)
        </button>
        <button
          type="button"
          className={`rounded-full px-4 py-2 text-sm ${source === "browser" ? "bg-yellow" : "bg-paper border border-line"}`}
          onClick={() => setSource("browser")}
        >
          This browser’s demo activity
        </button>
      </div>
      {source === "sample" && (
        <p className="mt-3 text-xs">
          Date filters do not rewrite the fixed synthetic totals; they only apply to the browser
          activity view.
        </p>
      )}

      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {defs.map((def) => (
          <article key={def.id} className="rounded-2xl border border-line bg-paper p-4">
            <p className="text-xs text-cocoa">{def.label}</p>
            <p className="mono mt-1 text-2xl">
              {counts[def.id as keyof typeof counts]}
            </p>
            <p className="mt-2 text-xs text-ink-soft">{def.definition}</p>
            <p className="text-xs text-ink-soft">{def.denominator}</p>
            <p className="mt-1 text-[10px] uppercase tracking-wide">
              {source === "sample" ? "Synthetic" : "Session source"}
            </p>
          </article>
        ))}
      </div>

      <h2 className="mt-10 text-xl">Funnel</h2>
      <div className="mt-4 h-64 rounded-2xl border border-line bg-paper p-3">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <XAxis dataKey="name" tick={{ fontSize: 11 }} />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#3b1238" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <table className="mt-4 w-full text-sm">
        <caption className="sr-only">Funnel table</caption>
        <thead>
          <tr className="text-left border-b border-line">
            <th className="py-2">Step</th>
            <th>Count</th>
            <th>Conversion from previous</th>
            <th>Drop-off</th>
          </tr>
        </thead>
        <tbody>
          {steps.map((step) => (
            <tr key={step.id} className="border-b border-line">
              <td className="py-2">{step.label}</td>
              <td>{step.count}</td>
              <td>
                {step.conversionFromPrevious === null
                  ? "—"
                  : `${Math.round(step.conversionFromPrevious * 100)}%`}
              </td>
              <td>{step.dropOff ?? "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <Button
        className="mt-6"
        onClick={() => {
          const csv = toCsv(
            steps.map((step) => ({
              view: source,
              step: step.label,
              count: step.count,
              conversion: step.conversionFromPrevious ?? "",
              dropOff: step.dropOff ?? "",
            })),
          );
          downloadCsv(`behind-the-bite-funnel-${source}.csv`, csv);
        }}
      >
        Export displayed aggregate CSV
      </Button>
      {source === "sample" && (
        <p className="mt-2 text-xs text-ink-soft">
          Sample size {SAMPLE_COHORT.visitors} synthetic visits. Export excludes personal data.
        </p>
      )}
    </div>
  );
}
