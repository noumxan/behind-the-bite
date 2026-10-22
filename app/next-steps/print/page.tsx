"use client";

import { Button } from "@/components/ui/Button";
import { useAppState } from "@/components/providers/AppState";
import { recommend, supporterSummary } from "@/lib/recommendations";

export default function PrintPlanPage() {
  const { cms, activity } = useAppState();
  const answers = activity.routeResult;
  const recs = answers ? recommend(answers) : [];
  const note =
    activity.plan.supporterNote ||
    (answers
      ? supporterSummary({
          careers: recs.map((rec) => ({
            title: cms.careers.find((c) => c.id === rec.career)?.title ?? rec.career,
            why: rec.why,
          })),
          answers,
        })
      : "No route generated yet.");

  return (
    <div className="print-plan mx-auto max-w-3xl px-4 py-10">
      <div className="no-print mb-6 flex gap-3">
        <Button onClick={() => window.print()}>Print</Button>
        <Button href="/next-steps" variant="ghost">
          Back
        </Button>
      </div>
      <p className="mono text-xs uppercase">Behind the Bite · discussion note</p>
      <h1 className="mt-2 text-4xl">Next-step plan</h1>
      <p className="mt-2 text-sm">Not an application. Demo data from this browser only.</p>
      <h2 className="mt-8 text-xl">Actions</h2>
      <ul className="mt-2">
        {Object.entries(activity.plan.actions).map(([key, done]) => (
          <li key={key}>
            {done ? "☑" : "☐"} {key}
          </li>
        ))}
      </ul>
      <h2 className="mt-8 text-xl">Roles</h2>
      <ul>
        {activity.plan.roles.map((id) => (
          <li key={id}>{cms.careers.find((c) => c.id === id)?.title}</li>
        ))}
      </ul>
      <h2 className="mt-8 text-xl">Note for someone supporting me</h2>
      <pre className="mt-3 whitespace-pre-wrap font-body text-base">{note}</pre>
    </div>
  );
}
