"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { useAppState } from "@/components/providers/AppState";
import { addNote, addReply, markConversationRead, notesFor, setStatus } from "@/lib/inbox/store";
import { translationLabel } from "@/lib/translation/service";
import { MESSAGE_LANGUAGES } from "@/lib/profile/catalog";

const TEMPLATES = [
  {
    id: "entry",
    label: "Clarifying entry requirements",
    text: "Requirements change by year and employer. Please check an official listing rather than this demo. If it helps, we can walk through what a typical apprenticeship advert includes.",
  },
  {
    id: "role",
    label: "Explaining a role",
    text: "This kind of work is about keeping a line consistent and safe. A first week often mixes plant time, a mentor, and learning the local safety rules. Always verify the actual role on an official page.",
  },
  {
    id: "info",
    label: "Asking what information would help",
    text: "Thanks for writing. What would be most useful next: a simpler explanation of entry routes, a related mission, or a verified careers page?",
  },
  {
    id: "resource",
    label: "Directing to a verified resource",
    text: "A useful official starting point is the National Careers Service or Find an apprenticeship on GOV.UK. This demo does not submit applications.",
  },
  {
    id: "access",
    label: "Acknowledging an accessibility question",
    text: "Thank you for asking. We cannot promise a specific workplace adjustment from this demo. Useful questions include interview access, quieter spaces, and who to speak to about adjustments. You do not have to share personal health information to explore.",
  },
];

export default function AdminThreadPage() {
  const params = useParams<{ id: string }>();
  const { inbox, refreshInbox } = useAppState();
  const conversation = inbox.conversations.find((item) => item.id === params.id);
  const messages = inbox.messages.filter((item) => item.conversationId === params.id);
  const notes = notesFor(inbox, params.id);
  const [reply, setReply] = useState("");
  const [note, setNote] = useState("");
  const [view, setView] = useState<"original" | "translation">("original");
  const target = conversation?.preferredLanguage ?? "en";

  useEffect(() => {
    if (!conversation) return;
    markConversationRead(conversation.id, "admin");
    refreshInbox();
  }, [conversation, refreshInbox]);

  if (!conversation) {
    return (
      <div>
        <h1 className="text-2xl">Not found</h1>
        <Button href="/admin/inbox">Inbox</Button>
      </div>
    );
  }

  const lastUser = [...messages].reverse().find((item) => item.senderRole === "visitor");
  const preview =
    conversation.sampleTranslation && lastUser?.translations[0]
      ? lastUser.translations[0].text
      : null;

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_18rem]">
      <div>
        <p className="mono text-xs">{conversation.reference}</p>
        <h1 className="mt-2 font-display text-3xl text-aubergine">{conversation.subject}</h1>
        {conversation.contextAttachment && (
          <p className="mt-2 text-sm">
            Context:{" "}
            <Link className="underline" href={conversation.contextAttachment.href}>
              {conversation.contextAttachment.pageLabel} — {conversation.contextAttachment.title}
            </Link>
          </p>
        )}
        <div className="mt-4 flex gap-2">
          <Button variant={view === "original" ? "primary" : "ghost"} onClick={() => setView("original")}>
            Original
          </Button>
          <Button variant={view === "translation" ? "primary" : "ghost"} onClick={() => setView("translation")}>
            Translation
          </Button>
        </div>
        <ol className="mt-4 grid gap-3">
          {messages.map((message) => {
            const record = message.translations.find((item) => item.language === (view === "translation" ? "en" : target)) ?? message.translations[0];
            const shown =
              view === "translation"
                ? translationLabel(record, message.originalText)
                : {
                    text: message.originalText,
                    caption: `Original · ${MESSAGE_LANGUAGES.find((l) => l.id === message.originalLanguage)?.native}`,
                  };
            return (
              <li key={message.id} className="rounded-2xl border border-line bg-paper p-4">
                <p className="text-xs font-semibold">{message.senderRole === "admin" ? "You (outreach)" : "Visitor"}</p>
                <p className="mt-2 whitespace-pre-wrap">{shown.text}</p>
                <p className="mt-2 text-xs text-ink-soft">{shown.caption}</p>
              </li>
            );
          })}
        </ol>
        <form
          className="mt-6 grid gap-3"
          onSubmit={(event) => {
            event.preventDefault();
            if (reply.trim().length < 4) return;
            addReply({
              conversationId: conversation.id,
              senderRole: "admin",
              text: reply,
              language: "en",
              sendToken: `${Date.now()}`,
            });
            setReply("");
            refreshInbox();
          }}
        >
          <p className="text-sm">Target language: {MESSAGE_LANGUAGES.find((item) => item.id === target)?.native}</p>
          {preview && view === "translation" ? (
            <p className="rounded-xl bg-cream-dark p-3 text-sm">Visitor sample translation: {preview}</p>
          ) : null}
          <p className="text-xs">
            Automatic translations may miss meaning. You can ask the team to clarify. Do not present
            a typed reply as a verified translation of arbitrary text.
          </p>
          <label className="grid gap-1 text-sm">
            Your original reply
            <textarea className="min-h-28 rounded-xl border p-3" value={reply} onChange={(e) => setReply(e.target.value)} />
          </label>
          <p className="text-sm text-ink-soft">
            {conversation.sampleTranslation
              ? "Sample thread: authored pairs only. Live translation is not configured."
              : "Live translation is not configured. Your original message is available."}
          </p>
          <div className="flex flex-wrap gap-2">
            {TEMPLATES.map((item) => (
              <button
                key={item.id}
                type="button"
                className="rounded-full border px-3 py-2 text-xs"
                onClick={() => setReply(item.text)}
              >
                {item.label}
              </button>
            ))}
          </div>
          <Button type="submit">Send reply</Button>
        </form>
        <div className="mt-4 flex gap-3">
          <Button variant="ghost" onClick={() => { setStatus(conversation.id, "resolved"); refreshInbox(); }}>
            Mark resolved
          </Button>
          <Button variant="ghost" onClick={() => { setStatus(conversation.id, "open"); refreshInbox(); }}>
            Reopen
          </Button>
        </div>
      </div>
      <aside className="rounded-2xl bg-cream-dark p-4">
        <h2 className="font-semibold">Internal notes</h2>
        <p className="text-xs">Never shown to the visitor or included in their thread.</p>
        <ul className="mt-3 grid gap-2 text-sm">
          {notes.map((item) => (
            <li key={item.id} className="rounded-xl bg-paper p-2">
              {item.text}
            </li>
          ))}
        </ul>
        <form
          className="mt-3 grid gap-2"
          onSubmit={(event) => {
            event.preventDefault();
            if (!note.trim()) return;
            addNote(conversation.id, note);
            setNote("");
            refreshInbox();
          }}
        >
          <textarea className="min-h-20 rounded-xl border p-2 text-sm" value={note} onChange={(e) => setNote(e.target.value)} />
          <Button type="submit" variant="ghost">
            Add note
          </Button>
        </form>
      </aside>
    </div>
  );
}
