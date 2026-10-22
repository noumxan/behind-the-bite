"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { useAppState } from "@/components/providers/AppState";
import { PRACTICAL_QUESTIONS } from "@/lib/profile/catalog";
import type { PageContext } from "@/lib/inbox/types";

export function QuestionBank({ context }: { context?: PageContext }) {
  const { workspace, setWorkspace, openComposer, announce } = useAppState();
  const [open, setOpen] = useState(false);
  return (
    <section className="mt-8 rounded-3xl border border-line bg-paper p-5">
      <h2 className="text-2xl text-aubergine">Questions you can take with you</h2>
      <p className="mt-2 text-sm text-ink-soft">
        You can explore your options without sharing personal health information. These prompts do
        not decide whether a role is right for you.
      </p>
      <Button className="mt-4" variant="ghost" onClick={() => setOpen((value) => !value)}>
        {open ? "Hide questions" : "Read the question list"}
      </Button>
      {open && (
        <ul className="mt-4 grid gap-3">
          {PRACTICAL_QUESTIONS.map((text) => (
            <li key={text} className="rounded-2xl bg-cream px-4 py-3">
              <p>{text}</p>
              <div className="mt-2 flex flex-wrap gap-2">
                <Button
                  variant="ghost"
                  className="min-h-10 px-3 text-xs"
                  onClick={() => {
                    const question = {
                      id: `q-${Date.now()}`,
                      text,
                      relatedHref: context?.href,
                      relatedTitle: context?.title,
                      savedAt: new Date().toISOString(),
                    };
                    setWorkspace({
                      ...workspace,
                      profile: {
                        ...workspace.profile,
                        savedQuestions: [...workspace.profile.savedQuestions, question],
                      },
                    });
                    announce("Question saved privately on My Bite.");
                  }}
                >
                  Save privately
                </Button>
                <Button
                  variant="ghost"
                  className="min-h-10 px-3 text-xs"
                  onClick={() => openComposer(context, text)}
                >
                  Add to a message
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
