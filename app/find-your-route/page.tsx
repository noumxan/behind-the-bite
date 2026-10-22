"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import { useAppState } from "@/components/providers/AppState";
import { graduateAnswers, jordanAnswers } from "@/lib/demo-personas";
import type { InterestId, RouteAnswers } from "@/lib/content/types";

const steps = [
  "Interests",
  "Experience",
  "Learning route",
  "Location",
  "Travel",
  "Support",
] as const;

function RouteFinderInner() {
  const { activity, setActivity, track } = useAppState();
  const router = useRouter();
  const params = useSearchParams();
  const start = params.get("start");
  const draft = activity.routeDraft;
  const [step, setStep] = useState(draft.step ?? 0);
  const [form, setForm] = useState<Partial<RouteAnswers>>({
    interests: draft.interests ?? [],
    experience: draft.experience,
    learningRoute: draft.learningRoute,
    location: draft.location ?? "",
    travel: draft.travel,
    support: draft.support ?? [],
  });

  useEffect(() => {
    track("route_start");
  }, [track]);

  useEffect(() => {
    if (start === "jordan") setForm(jordanAnswers());
    if (start === "graduate") setForm(graduateAnswers());
  }, [start]);

  const persist = (nextStep: number, nextForm = form) => {
    const routeDraft = { ...nextForm, step: nextStep };
    setActivity({ ...activity, routeDraft });
    setStep(nextStep);
  };

  const canNext = useMemo(() => {
    if (step === 1) return Boolean(form.experience);
    if (step === 2) return Boolean(form.learningRoute);
    if (step === 4) return Boolean(form.travel);
    return true;
  }, [form, step]);

  function finish() {
    const answers: RouteAnswers = {
      interests: form.interests ?? [],
      experience: form.experience ?? "unsure",
      learningRoute: form.learningRoute ?? "unsure",
      location: form.location,
      travel: form.travel ?? "unsure",
      support: form.support ?? ["unsure"],
      updatedAt: new Date().toISOString(),
    };
    setActivity({
      ...activity,
      routeDraft: { ...answers, step: 6 },
      routeResult: answers,
    });
    track("route_complete", { experience: answers.experience });
    router.push("/my-route");
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <p className="mono text-xs uppercase text-cocoa">
        Step {step + 1} of {steps.length}
      </p>
      <div className="mt-2 h-2 rounded-full bg-cream-dark" aria-hidden>
        <div
          className="h-2 rounded-full bg-mint"
          style={{ width: `${((step + 1) / steps.length) * 100}%` }}
        />
      </div>
      <h1 className="mt-6 text-4xl text-aubergine">Find your route</h1>
      <p className="mt-3 text-ink-soft">
        Not sure is a valid answer. Nothing here is sent to an employer. Progress saves in this
        browser.
      </p>

      {step === 0 && (
        <fieldset className="mt-8">
          <legend className="text-xl font-semibold">What are you drawn to?</legend>
          {(
            [
              ["coding", "I like coding"],
              ["fixing", "I like fixing things"],
              ["sustainability", "I care about sustainability"],
              ["design", "I enjoy design"],
            ] as const
          ).map(([id, label]) => (
            <label key={id} className="mt-3 flex min-h-11 items-center gap-3">
              <input
                type="checkbox"
                checked={(form.interests ?? []).includes(id)}
                onChange={() => {
                  const current = new Set(form.interests ?? []);
                  if (current.has(id)) current.delete(id);
                  else current.add(id as InterestId);
                  setForm({ ...form, interests: [...current] as InterestId[] });
                }}
              />
              {label}
            </label>
          ))}
        </fieldset>
      )}

      {step === 1 && (
        <fieldset className="mt-8 grid gap-3">
          <legend className="text-xl font-semibold">Where are you starting from?</legend>
          {(
            [
              ["starting-out", "Starting out / little or no paid work"],
              ["college", "College or apprenticeship exploration"],
              ["student", "University student"],
              ["graduate", "Graduate"],
              ["unsure", "Not sure yet"],
            ] as const
          ).map(([id, label]) => (
            <label key={id} className="flex min-h-11 items-center gap-3 rounded-2xl border border-line bg-paper px-4">
              <input
                type="radio"
                name="experience"
                checked={form.experience === id}
                onChange={() => setForm({ ...form, experience: id })}
              />
              {label}
            </label>
          ))}
        </fieldset>
      )}

      {step === 2 && (
        <fieldset className="mt-8 grid gap-3">
          <legend className="text-xl font-semibold">How would you prefer to learn?</legend>
          {(
            [
              ["earn-while-learn", "Earn while I learn"],
              ["full-time-study", "Full-time study"],
              ["short-courses", "Short courses alongside other work"],
              ["unsure", "Not sure yet"],
            ] as const
          ).map(([id, label]) => (
            <label key={id} className="flex min-h-11 items-center gap-3 rounded-2xl border border-line bg-paper px-4">
              <input
                type="radio"
                name="learn"
                checked={form.learningRoute === id}
                onChange={() => setForm({ ...form, learningRoute: id })}
              />
              {label}
            </label>
          ))}
        </fieldset>
      )}

      {step === 3 && (
        <label className="mt-8 block">
          Approximate location (optional)
          <input
            className="mt-2 w-full min-h-11 rounded-2xl border border-line bg-paper px-3"
            value={form.location ?? ""}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
            placeholder="e.g. Midlands"
          />
          <span className="mt-2 block text-sm text-ink-soft">Skip if you would rather not say.</span>
        </label>
      )}

      {step === 4 && (
        <fieldset className="mt-8 grid gap-3">
          <legend className="text-xl font-semibold">Travel preference</legend>
          {(
            [
              ["local", "Keep it local if possible"],
              ["regional", "I can travel in the region"],
              ["flexible", "I can be flexible"],
              ["unsure", "Not sure yet"],
            ] as const
          ).map(([id, label]) => (
            <label key={id} className="flex min-h-11 items-center gap-3 rounded-2xl border border-line bg-paper px-4">
              <input
                type="radio"
                name="travel"
                checked={form.travel === id}
                onChange={() => setForm({ ...form, travel: id })}
              />
              {label}
            </label>
          ))}
        </fieldset>
      )}

      {step === 5 && (
        <fieldset className="mt-8 grid gap-3">
          <legend className="text-xl font-semibold">What would help?</legend>
          {(
            [
              ["travel", "Travel and getting there"],
              ["qualifications", "Understanding qualifications"],
              ["work-environment", "Work environment and shifts"],
              ["first-step", "Confidence taking the first step"],
              ["someone-to-ask", "Finding someone to ask"],
              ["unsure", "Not sure yet"],
            ] as const
          ).map(([id, label]) => (
            <label key={id} className="flex min-h-11 items-center gap-3">
              <input
                type="checkbox"
                checked={(form.support ?? []).includes(id)}
                onChange={() => {
                  const current = new Set(form.support ?? []);
                  if (current.has(id)) current.delete(id);
                  else current.add(id);
                  setForm({ ...form, support: [...current] as RouteAnswers["support"] });
                }}
              />
              {label}
            </label>
          ))}
        </fieldset>
      )}

      <div className="mt-10 flex flex-wrap gap-3">
        {step > 0 && (
          <Button variant="ghost" onClick={() => persist(step - 1)}>
            Back
          </Button>
        )}
        {step < steps.length - 1 ? (
          <Button disabled={!canNext} onClick={() => persist(step + 1)}>
            Continue
          </Button>
        ) : (
          <Button onClick={finish}>See my route</Button>
        )}
        <Button variant="ghost" onClick={() => persist(step)}>
          Save and resume later
        </Button>
      </div>
    </div>
  );
}

export default function FindYourRoutePage() {
  return (
    <Suspense fallback={<p className="px-4 py-10">Loading route finder…</p>}>
      <RouteFinderInner />
    </Suspense>
  );
}
