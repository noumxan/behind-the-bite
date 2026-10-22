"use client";

import { useParams } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { useAppState } from "@/components/providers/AppState";
import { savePlan } from "@/lib/activity";
import { QuestionBank } from "@/components/support/QuestionBank";
import type { CareerSlug } from "@/lib/content/types";

export default function CareerDetailPage() {
  const params = useParams<{ slug: string }>();
  const { cms, activity, setActivity, track, openComposer } = useAppState();
  const career = cms.careers.find((item) => item.id === params.slug && item.status === "published");

  if (!career) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16">
        <h1 className="text-3xl">Profile not available</h1>
        <Button href="/careers" className="mt-6">
          All roles
        </Button>
      </div>
    );
  }

  const saved = activity.plan.roles.includes(career.id);

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <p className="mono text-xs uppercase text-cocoa">Illustrative profile</p>
      <h1 className="mt-2 text-4xl text-aubergine">{career.title}</h1>
      <p className="mt-4 text-lg">{career.purpose}</p>
      <h2 className="mt-8 text-2xl">Example daily tasks</h2>
      <ul className="mt-3 list-disc pl-5">
        {career.dailyTasks.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      <h2 className="mt-8 text-2xl">Tools and skills</h2>
      <p className="mt-2">{career.tools.join(" · ")}</p>
      <h2 className="mt-8 text-2xl">Work environment to ask about</h2>
      <ul className="mt-3 list-disc pl-5">
        {career.environment.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      <h2 className="mt-8 text-2xl">Possible entry routes</h2>
      <ul className="mt-3 list-disc pl-5">
        {career.entryRoutes.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      <p className="mt-3 text-sm text-ink-soft">
        Requirements change. Always verify with an official listing or adviser.
      </p>
      <h2 className="mt-8 text-2xl">Questions to ask an employer</h2>
      <ul className="mt-3 list-disc pl-5">
        {career.questionsToAsk.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      <h2 className="mt-8 text-2xl">Connected missions</h2>
      <div className="mt-3 flex flex-wrap gap-3">
        {career.relatedMissions.map((id) => {
          const mission = cms.missions.find((item) => item.id === id);
          return mission ? (
            <Button key={id} href={mission.href} variant="ghost">
              {mission.title}
            </Button>
          ) : null;
        })}
      </div>
      {career.illustrativePersona && (
        <aside className="mt-8 rounded-2xl bg-cream-dark p-4 text-sm">
          <p className="font-semibold">Illustrative persona</p>
          <p className="mt-1">
            {career.illustrativePersona.name}: {career.illustrativePersona.summary}
          </p>
        </aside>
      )}
      <div className="mt-8 flex flex-wrap gap-3">
        <Button
          onClick={() => {
            const roles = saved
              ? activity.plan.roles.filter((id) => id !== career.id)
              : [...activity.plan.roles, career.id as CareerSlug];
            const plan = { ...activity.plan, roles, updatedAt: new Date().toISOString() };
            savePlan(plan);
            setActivity({ ...activity, plan });
            track("role_save", { career: career.id });
          }}
        >
          {saved ? "Saved to next steps" : "Save to my next steps"}
        </Button>
        <Button href="/find-your-route" variant="ghost">
          Find a route
        </Button>
        <Button
          variant="ghost"
          onClick={() =>
            openComposer({
              title: career.title,
              href: `/careers/${career.id}`,
              pageLabel: "Career profile",
            })
          }
        >
          Ask the team
        </Button>
      </div>
      <QuestionBank
        context={{
          title: career.title,
          href: `/careers/${career.id}`,
          pageLabel: "Career profile",
        }}
      />
    </div>
  );
}
