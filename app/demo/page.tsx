"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { useAppState } from "@/components/providers/AppState";
import { graduateAnswers, jordanAnswers, personaActivity } from "@/lib/demo-personas";
import { restoreSeededCms } from "@/lib/content/repository";
import { defaultWorkspace, saveWorkspace } from "@/lib/profile/workspace";

export default function DemoPage() {
  const { setCms, resetDemo, resetJordanOnly, switchWorkspace } = useAppState();
  const [open, setOpen] = useState(true);
  const [jordanOpen, setJordanOpen] = useState(true);

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-4xl text-aubergine">Presenter launcher</h1>
      <p className="mt-4 text-ink-soft">
        Seeds this browser only. Visitor progress and the Jordan demo live in separate workspaces so
        they do not overwrite each other.
      </p>
      <div className="mt-8 grid gap-3">
        <Button
          href="/explore/sandwich-biscuit"
          onClick={() => {
            setCms(restoreSeededCms());
            const seeded = {
              ...personaActivity(jordanAnswers(), [{ id: "d1", name: "visit" as const, at: new Date().toISOString() }]),
              profile: {
                ...defaultWorkspace().profile,
                displayName: "Jordan",
                onboardingComplete: true,
                interests: [],
              },
            };
            saveWorkspace("jordan", seeded);
            switchWorkspace("jordan");
          }}
        >
          Jordan: from curiosity to a conversation
        </Button>
        <Button
          variant="secondary"
          href="/explore/chocolate-bar"
          onClick={() => {
            setCms(restoreSeededCms());
            const seeded = {
              ...personaActivity(jordanAnswers()),
              profile: { ...defaultWorkspace().profile, displayName: "Jordan", onboardingComplete: true },
            };
            saveWorkspace("jordan", seeded);
            switchWorkspace("jordan");
          }}
        >
          Start as Jordan (chocolate path)
        </Button>
        <Button
          variant="secondary"
          href="/explore/chocolate-bar"
          onClick={() => {
            const seeded = {
              ...personaActivity(graduateAnswers()),
              profile: { ...defaultWorkspace().profile, displayName: "Graduate explorer", onboardingComplete: true },
            };
            saveWorkspace("graduate", seeded);
            switchWorkspace("graduate");
          }}
        >
          Start as an engineering graduate
        </Button>
        <Button href="/admin" variant="ghost">
          Open employer dashboard
        </Button>
        <Button href="/profile/messages/convo-sample-cy" variant="ghost">
          Open sample translation thread
        </Button>
        <Button variant="ghost" onClick={resetJordanOnly}>
          Reset Jordan scenario only
        </Button>
        <Button variant="ghost" onClick={resetDemo}>
          Reset all demo workspaces
        </Button>
      </div>
      <button type="button" className="mt-10 text-sm underline" onClick={() => setJordanOpen((v) => !v)}>
        {jordanOpen ? "Hide" : "Show"} Jordan conversation walkthrough
      </button>
      {jordanOpen && (
        <ol className="mt-4 list-decimal pl-5 text-ink-soft">
          <li>Start Jordan’s fictional demo profile.</li>
          <li>Open the sandwich biscuit.</li>
          <li>Separate the layers.</li>
          <li>Select automation and inspection.</li>
          <li>Save the interest.</li>
          <li>Open My Bite and show the new interest and activity.</li>
          <li>Enable reduced motion and larger text.</li>
          <li>Return to the explorer and show equivalent usability.</li>
          <li>Ask a question about entry requirements.</li>
          <li>Choose any context to include, then send.</li>
          <li>Open admin and view the new message notification.</li>
          <li>Reply from the same conversation.</li>
          <li>Return to Jordan’s profile and read the reply.</li>
          <li>Save a practical next step.</li>
        </ol>
      )}
      <button type="button" className="mt-8 text-sm underline" onClick={() => setOpen((v) => !v)}>
        {open ? "Hide" : "Show"} chocolate walkthrough
      </button>
      {open && (
        <ol className="mt-4 list-decimal pl-5 text-ink-soft">
          <li>Choose chocolate.</li>
          <li>Open the automation station.</li>
          <li>Play a short packaging investigation.</li>
          <li>View the career connection.</li>
          <li>Generate a route.</li>
          <li>Save one next step.</li>
          <li>Open admin and switch to this browser’s funnel.</li>
        </ol>
      )}
    </div>
  );
}
