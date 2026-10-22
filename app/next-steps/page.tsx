"use client";

import { useMemo } from "react";
import { Button } from "@/components/ui/Button";
import { useAppState } from "@/components/providers/AppState";
import { recommend, supporterSummary } from "@/lib/recommendations";
import { savePlan } from "@/lib/activity";

const actions = [
  { id: "tryMission", label: "Try one mission", href: "/missions" },
  { id: "exploreRole", label: "Explore one role", href: "/careers" },
  { id: "compareRoute", label: "Compare an entry route", href: "/find-your-route" },
  { id: "prepareQuestions", label: "Prepare questions", href: "/careers" },
  { id: "visitResource", label: "Visit a verified opportunity or resource page", href: "/my-route" },
];

export default function NextStepsPage() {
  const { cms, activity, setActivity, track, resetDemo, openComposer } = useAppState();
  const answers = activity.routeResult;
  const recs = answers ? recommend(answers) : [];
  const careers = recs
    .map((rec) => ({
      title: cms.careers.find((c) => c.id === rec.career)?.title ?? rec.career,
      why: rec.why,
    }))
    .filter((item) => item.title);

  const note = useMemo(() => {
    if (activity.plan.supporterNote) return activity.plan.supporterNote;
    if (!answers) {
      return "This plan is empty until you try a mission or generate a route. It is a discussion note, not an application.";
    }
    return supporterSummary({ careers, answers });
  }, [activity.plan.supporterNote, answers, careers]);

  function updatePlan(partial: Partial<typeof activity.plan>) {
    const plan = { ...activity.plan, ...partial, updatedAt: new Date().toISOString() };
    savePlan(plan);
    setActivity({ ...activity, plan });
    track("plan_save");
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-4xl text-aubergine">My next steps</h1>
      <p className="mt-3 text-ink-soft">
        A local action plan. Nothing is submitted. You can print it or reset this browser’s demo
        data.
      </p>
      <ul className="mt-8 grid gap-3">
        {actions.map((action) => (
          <li key={action.id} className="flex items-center justify-between gap-3 rounded-2xl border border-line bg-paper px-4 py-3">
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={Boolean(activity.plan.actions[action.id])}
                onChange={() =>
                  updatePlan({
                    actions: {
                      ...activity.plan.actions,
                      [action.id]: !activity.plan.actions[action.id],
                    },
                  })
                }
              />
              {action.label}
            </label>
            <Button href={action.href} variant="ghost" className="min-h-10 px-3 text-xs">
              Open
            </Button>
          </li>
        ))}
      </ul>

      <h2 className="mt-10 text-2xl">Saved roles</h2>
      {activity.plan.roles.length === 0 ? (
        <p className="mt-2 text-ink-soft">No roles saved yet.</p>
      ) : (
        <ul className="mt-2 list-disc pl-5">
          {activity.plan.roles.map((id) => (
            <li key={id}>{cms.careers.find((c) => c.id === id)?.title ?? id}</li>
          ))}
        </ul>
      )}

      <h2 className="mt-10 text-2xl">Explain this to someone supporting me</h2>
      <textarea
        className="mt-3 min-h-48 w-full rounded-2xl border border-line bg-paper p-4"
        value={activity.plan.supporterNote || note}
        onChange={(e) => updatePlan({ supporterNote: e.target.value })}
      />
      <div className="mt-4 flex flex-wrap gap-3">
        <Button href="/next-steps/print">Print plan</Button>
        <Button variant="ghost" onClick={() => openComposer({ title: "My next steps", href: "/next-steps", pageLabel: "Action plan" })}>
          Ask the team
        </Button>
        <Button
          variant="ghost"
          onClick={() => {
            resetDemo();
          }}
        >
          Reset local data
        </Button>
      </div>
    </div>
  );
}
