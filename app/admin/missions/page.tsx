"use client";

import { SAMPLE_COHORT } from "@/lib/content/seed";
import { downloadCsv, toCsv } from "@/lib/csv";
import { Button } from "@/components/ui/Button";

export default function AdminMissionsPage() {
  return (
    <div>
      <h1 className="font-display text-3xl text-aubergine">Mission insights</h1>
      <p className="mt-2 max-w-prose text-sm">
        Aggregate sample data only. We do not infer intelligence, employability or protected
        characteristics, and we do not rank people for recruitment.
      </p>
      <table className="mt-6 w-full text-sm">
        <thead>
          <tr className="text-left border-b border-line">
            <th className="py-2">Mission</th>
            <th>Starts</th>
            <th>Completions</th>
            <th>Retries</th>
            <th>Hints</th>
            <th>Stopped after observe</th>
            <th>Common choice</th>
            <th>Understanding before → after</th>
          </tr>
        </thead>
        <tbody>
          {SAMPLE_COHORT.missionInsights.map((row) => (
            <tr key={row.id} className="border-b border-line">
              <td className="py-2">{row.id}</td>
              <td>{row.starts}</td>
              <td>{row.completions}</td>
              <td>{row.retries}</td>
              <td>{row.hints}</td>
              <td>{row.stopAfterObserve}</td>
              <td>{row.commonChoice}</td>
              <td>
                {row.understandingBefore} → {row.understandingAfter} (self-reported, optional)
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Button
        className="mt-6"
        onClick={() =>
          downloadCsv(
            "behind-the-bite-missions.csv",
            toCsv(
              SAMPLE_COHORT.missionInsights.map((row) => ({
                mission: row.id,
                starts: row.starts,
                completions: row.completions,
                retries: row.retries,
                hints: row.hints,
                stopAfterObserve: row.stopAfterObserve,
                commonChoice: row.commonChoice,
              })),
            ),
          )
        }
      >
        Export sample mission CSV
      </Button>
    </div>
  );
}
