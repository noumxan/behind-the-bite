"use client";

import { Button } from "@/components/ui/Button";
import { useAppState } from "@/components/providers/AppState";
import { DISCLAIMER } from "@/lib/content/seed";

export default function AdminSettingsPage() {
  const { activity, setActivity, resetDemo, clearLocalActivity, restoreContent, reducedMotion } =
    useAppState();

  return (
    <div className="max-w-2xl">
      <h1 className="font-display text-3xl text-aubergine">Settings</h1>
      <label className="mt-6 flex items-center justify-between rounded-2xl bg-paper px-4 py-3">
        Prefer reduced motion in this browser
        <input
          type="checkbox"
          className="h-5 w-5"
          checked={Boolean(activity.reducedMotion)}
          onChange={(event) => setActivity({ ...activity, reducedMotion: event.target.checked })}
        />
      </label>
      <p className="mt-2 text-sm text-ink-soft">
        System setting is currently {reducedMotion ? "reduce" : "full motion"} unless overridden.
      </p>
      <h2 className="mt-8 text-xl">Demo data</h2>
      <p className="mt-2 text-sm">
        Content edits, routes and analytics events are stored in localStorage on this device. They
        are not shared across browsers or teammates. Clearing activity does not log anyone out of a
        real account — there isn’t one.
      </p>
      <div className="mt-4 flex flex-wrap gap-3">
        <Button onClick={clearLocalActivity}>Clear local activity</Button>
        <Button variant="ghost" onClick={restoreContent}>
          Restore seeded content
        </Button>
        <Button variant="ghost" onClick={resetDemo}>
          Reset demo
        </Button>
      </div>
      <h2 className="mt-8 text-xl">Content disclaimer</h2>
      <p className="mt-2 text-sm">{DISCLAIMER}</p>
    </div>
  );
}
