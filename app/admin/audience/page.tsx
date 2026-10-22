"use client";

import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { SAMPLE_COHORT } from "@/lib/content/seed";

export default function AdminAudiencePage() {
  return (
    <div>
      <h1 className="font-display text-3xl text-aubergine">Audience and support</h1>
      <p className="mt-2 max-w-prose text-sm">
        Voluntarily selected, synthetic categories. Language stays respectful. We do not label
        people by employment status.
      </p>
      <h2 className="mt-8 text-xl">Who visitors said they were</h2>
      <div className="mt-4 h-56 rounded-2xl bg-paper p-3">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={SAMPLE_COHORT.byAudience}>
            <XAxis dataKey="label" tick={{ fontSize: 11 }} />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#2f8f82" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <h2 className="mt-8 text-xl">Support themes people asked about</h2>
      <ul className="mt-3 grid gap-2">
        {SAMPLE_COHORT.supportThemes.map((theme) => (
          <li key={theme.id} className="rounded-xl bg-paper px-4 py-3">
            {theme.label}: {theme.count}
          </li>
        ))}
      </ul>
    </div>
  );
}
