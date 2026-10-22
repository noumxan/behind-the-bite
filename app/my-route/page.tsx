"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { useAppState } from "@/components/providers/AppState";
import { recommendFromInterests } from "@/lib/recommendations";
import { publishedOnly } from "@/lib/content/repository";

export default function MyRoutePage() {
  const { cms, activity, track, profile, openComposer } = useAppState();
  const answers = activity.routeResult;
  if (!answers) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16">
        <h1 className="text-4xl text-aubergine">No route saved yet</h1>
        <p className="mt-4">Answer a few questions and we will explain a starting set of ideas.</p>
        <Button href="/find-your-route" className="mt-6">
          Find your route
        </Button>
      </div>
    );
  }
  const recs = recommendFromInterests(
    [...new Set([...(answers.interests ?? []), ...profile.interests])],
    answers,
  );
  const resources = publishedOnly(cms.resources).filter((item) =>
    item.audience.includes(answers.experience === "college" ? "college" : answers.experience),
  );
  const opportunities = publishedOnly(cms.opportunities);

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="text-4xl text-aubergine">Your route ideas</h1>
      <p className="mt-3 max-w-prose text-ink-soft">
        These are rule-based suggestions from what you selected, not a score and not an offer.
      </p>
      <div className="mt-8 grid gap-5">
        {recs.map((rec) => {
          const career = cms.careers.find((item) => item.id === rec.career);
          if (!career) return null;
          return (
            <article key={rec.career} className="rounded-[1.6rem] border border-line bg-paper p-6">
              <h2 className="text-2xl">{career.title}</h2>
              <h3 className="mt-4 text-sm font-semibold uppercase tracking-wide text-cocoa">
                Why this appeared
              </h3>
              <ul className="mt-2 list-disc pl-5">
                {rec.why.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <h3 className="mt-4 text-sm font-semibold uppercase tracking-wide text-cocoa">
                What to check
              </h3>
              <ul className="mt-2 list-disc pl-5">
                {rec.check.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <p className="mt-4">
                <strong>A useful next step:</strong> {rec.nextStep}
              </p>
              <Link href={`/careers/${career.id}`} className="mt-3 inline-block underline">
                Open profile
              </Link>
            </article>
          );
        })}
      </div>

      <h2 className="mt-10 text-2xl">Missions to try</h2>
      <div className="mt-3 flex flex-wrap gap-3">
        {cms.missions
          .filter((m) => recs.some((r) => m.relatedRoles.includes(r.career)))
          .map((m) => (
            <Button key={m.id} href={m.href} variant="ghost">
              {m.title}
            </Button>
          ))}
      </div>

      <h2 className="mt-10 text-2xl">Illustrative opportunities</h2>
      <p className="text-sm text-ink-soft">Every example must be verified. None of these are live applications.</p>
      <ul className="mt-4 grid gap-3">
        {opportunities.map((item) => (
          <li key={item.id} className="rounded-2xl border border-line p-4">
            <p className="mono text-[10px] uppercase text-yellow-deep">
              Illustrative opportunity — verify availability and requirements.
            </p>
            <h3 className="mt-1 text-lg">{item.title}</h3>
            <p className="text-sm text-ink-soft">{item.summary}</p>
            {item.url ? (
              <a
                href={item.url}
                className="mt-2 inline-block underline"
                onClick={() => track("resource_click", { id: item.id })}
              >
                Official-style resource to check
              </a>
            ) : (
              <p className="mt-2 text-sm">Demonstration resource — no URL provided.</p>
            )}
          </li>
        ))}
      </ul>

      <h2 className="mt-10 text-2xl">Saved resources</h2>
      <ul className="mt-3 grid gap-2">
        {resources.map((item) => (
          <li key={item.id}>
            {item.url ? (
              <a
                href={item.url}
                className="underline"
                onClick={() => track("resource_click", { id: item.id })}
              >
                {item.title}
              </a>
            ) : (
              <span>
                {item.title} — demonstration resource with no fabricated URL.
              </span>
            )}
            {item.exampleLabel ? (
              <span className="ml-2 text-xs text-cocoa">Illustrative</span>
            ) : null}
          </li>
        ))}
      </ul>

      <div className="mt-10 flex flex-wrap gap-3">
        <Button href="/next-steps">Build my next-step plan</Button>
        <Button
          variant="ghost"
          onClick={() =>
            openComposer({
              title: "Your route ideas",
              href: "/my-route",
              pageLabel: "Pathway results",
            })
          }
        >
          Ask the team
        </Button>
      </div>
    </div>
  );
}
