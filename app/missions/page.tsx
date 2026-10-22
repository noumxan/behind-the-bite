"use client";

import { Button } from "@/components/ui/Button";
import { useAppState } from "@/components/providers/AppState";
import { publishedOnly } from "@/lib/content/repository";

export default function MissionsPage() {
  const { cms, openComposer } = useAppState();
  const missions = publishedOnly(cms.missions).filter((item) => item.polished);
  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <h1 className="text-4xl text-aubergine sm:text-5xl">Try a shift</h1>
      <p className="mt-4 max-w-prose rounded-2xl bg-mint-soft px-4 py-3 text-sm">
        These are simplified learning activities, not recruitment assessments.
      </p>
      <div className="mt-8 grid gap-5">
        {missions.map((mission) => (
          <article key={mission.id} className="rounded-[1.6rem] border border-line bg-paper p-6">
            <p className="mono text-xs uppercase text-cocoa">{mission.duration}</p>
            <h2 className="mt-2 text-3xl">{mission.title}</h2>
            <p className="mt-3 max-w-prose text-ink-soft">{mission.whatYouWillTry}</p>
            <p className="mt-3 text-sm">
              Related roles:{" "}
              {mission.relatedRoles
                .map((id) => cms.careers.find((c) => c.id === id)?.title)
                .filter(Boolean)
                .join(" · ")}
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Button href={mission.href}>Start</Button>
              <Button
                variant="ghost"
                onClick={() =>
                  openComposer({
                    title: mission.title,
                    href: mission.href,
                    pageLabel: "Mission",
                  })
                }
              >
                Ask the team
              </Button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
