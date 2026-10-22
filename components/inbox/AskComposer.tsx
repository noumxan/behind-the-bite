"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { useAppState } from "@/components/providers/AppState";
import {
  MESSAGE_CATEGORIES,
  MESSAGE_LANGUAGES,
  SUPPORT_PREFERENCE_OPTIONS,
  type MessageCategory,
  type MessageLanguage,
  type SupportPreferenceId,
} from "@/lib/profile/catalog";
import { createConversation, saveDraft } from "@/lib/inbox/store";
import { validateMessage } from "@/lib/translation/service";

export function AskComposer() {
  const { composer, closeComposer, workspaceId, profile, refreshInbox, announce } = useAppState();
  const router = useRouter();
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [language, setLanguage] = useState<MessageLanguage>("en");
  const [category, setCategory] = useState<MessageCategory>("getting-started");
  const [includeContext, setIncludeContext] = useState(true);
  const [sharePrefs, setSharePrefs] = useState<SupportPreferenceId[]>([]);
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (!composer.open) return;
    setSubject(composer.context ? `Question about: ${composer.context.title}` : "");
    setBody(composer.presetQuestion ?? "");
    setIncludeContext(Boolean(composer.context));
    setError("");
  }, [composer]);

  function persistDraft() {
    saveDraft(`composer-${workspaceId}`, body);
  }

  return (
    <Dialog.Root open={composer.open} onOpenChange={(open) => !open && closeComposer()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-aubergine-deep/50" />
        <Dialog.Content className="composer-dock fixed inset-x-0 bottom-0 max-h-[92vh] overflow-y-auto rounded-t-3xl bg-paper p-5 shadow-2xl md:inset-auto md:left-1/2 md:top-1/2 md:w-[min(36rem,calc(100%-2rem))] md:-translate-x-1/2 md:-translate-y-1/2 md:rounded-3xl">
          <Dialog.Title className="font-display text-3xl text-aubergine">Ask the team</Dialog.Title>
          <p className="mt-2 text-sm text-ink-soft">
            Saved to the demo inbox in this browser. No email is sent. You can explore without
            sharing personal health information.
          </p>
          <form
            className="mt-4 grid gap-3"
            onSubmit={(event) => {
              event.preventDefault();
              const invalid = validateMessage(body);
              if (invalid) {
                setError(invalid);
                return;
              }
              setSending(true);
              const token = `${Date.now()}`;
              const result = createConversation({
                workspaceId,
                subject,
                body,
                category,
                preferredLanguage: language,
                contextAttachment: includeContext ? composer.context : null,
                sharedSupportPreferences: sharePrefs,
                sendToken: token,
              });
              refreshInbox();
              announce(`Message saved as ${result.conversation.reference}`);
              closeComposer();
              setSending(false);
              router.push(`/profile/messages/${result.conversation.id}?sent=1`);
            }}
          >
            {error ? (
              <p className="rounded-xl bg-yellow/40 px-3 py-2 text-sm" role="alert">
                {error}
              </p>
            ) : null}
            <label className="grid gap-1 text-sm">
              Subject
              <input
                className="min-h-11 rounded-xl border border-line px-3"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />
            </label>
            <label className="grid gap-1 text-sm">
              Message
              <textarea
                className="min-h-32 rounded-xl border border-line p-3"
                value={body}
                onChange={(e) => {
                  setBody(e.target.value);
                  persistDraft();
                }}
                required
              />
            </label>
            <label className="grid gap-1 text-sm">
              Preferred language for replies
              <select
                className="min-h-11 rounded-xl border px-3"
                value={language}
                onChange={(e) => setLanguage(e.target.value as MessageLanguage)}
              >
                {MESSAGE_LANGUAGES.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.native}
                  </option>
                ))}
              </select>
            </label>
            <label className="grid gap-1 text-sm">
              Category
              <select
                className="min-h-11 rounded-xl border px-3"
                value={category}
                onChange={(e) => setCategory(e.target.value as MessageCategory)}
              >
                {MESSAGE_CATEGORIES.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.label}
                  </option>
                ))}
              </select>
            </label>
            {composer.context && (
              <label className="flex items-start gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={includeContext}
                  onChange={(e) => setIncludeContext(e.target.checked)}
                />
                <span>
                  Attach this page: {composer.context.title} ({composer.context.pageLabel}). Your
                  full profile and exploration history are not attached.
                </span>
              </label>
            )}
            <fieldset className="rounded-2xl border border-line p-3">
              <legend className="text-sm font-semibold">Share support preferences? Optional.</legend>
              <p className="text-xs text-ink-soft">Nothing is shared unless you tick a box.</p>
              {profile.supportPreferences.map((id) => {
                const label = SUPPORT_PREFERENCE_OPTIONS.find((item) => item.id === id)?.label ?? id;
                return (
                  <label key={id} className="mt-2 flex gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={sharePrefs.includes(id)}
                      onChange={() =>
                        setSharePrefs((current) =>
                          current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
                        )
                      }
                    />
                    {label}
                  </label>
                );
              })}
              {profile.supportPreferences.length === 0 ? (
                <p className="mt-2 text-xs">You have not saved support preferences on My Bite.</p>
              ) : null}
            </fieldset>
            <p className="text-xs text-ink-soft">
              Live translation is not configured. Your original message is available.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button type="submit" disabled={sending}>
                Send to demo inbox
              </Button>
              <Button variant="ghost" onClick={closeComposer}>
                Cancel
              </Button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
