"use client";

import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { useAppState } from "@/components/providers/AppState";
import { addReply, deleteConversation, markConversationRead, setStatus } from "@/lib/inbox/store";
import { translationLabel } from "@/lib/translation/service";
import { MESSAGE_LANGUAGES } from "@/lib/profile/catalog";

function ThreadInner() {
  const params = useParams<{ id: string }>();
  const search = useSearchParams();
  const { inbox, workspaceId, refreshInbox, announce } = useAppState();
  const conversation = inbox.conversations.find(
    (item) => item.id === params.id && item.workspaceId === workspaceId,
  );
  const messages = inbox.messages.filter((item) => item.conversationId === params.id);
  const [reply, setReply] = useState("");
  const [view, setView] = useState<"original" | "translation">("original");
  const [confirmDelete, setConfirmDelete] = useState(false);

  const sent = search.get("sent") === "1";

  const sample = conversation?.sampleTranslation;

  useEffect(() => {
    if (!conversation) return;
    markConversationRead(conversation.id, "visitor");
    refreshInbox();
  }, [conversation, refreshInbox]);

  if (!conversation) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16">
        <h1 className="text-3xl">Conversation not found</h1>
        <Button href="/profile/messages" className="mt-6">
          Inbox
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      {sent && (
        <p className="rounded-2xl bg-mint-soft px-4 py-3 text-sm" role="status">
          Saved to the demo inbox in this browser. Open the employer demo to try replying. Reference{" "}
          {conversation.reference}. Status: {conversation.status}. Replies appear here.
        </p>
      )}
      <p className="mono text-xs">{conversation.reference}</p>
      <h1 className="mt-2 text-3xl text-aubergine">{conversation.subject}</h1>
      <p className="text-sm">Status: {conversation.status}</p>
      {conversation.contextAttachment && (
        <p className="mt-2 text-sm">
          Related page:{" "}
          <Link className="underline" href={conversation.contextAttachment.href}>
            {conversation.contextAttachment.pageLabel}
          </Link>
        </p>
      )}
      {conversation.sharedSupportPreferences.length > 0 && (
        <p className="mt-2 text-xs">Explicitly shared notes: {conversation.sharedSupportPreferences.join(", ")}</p>
      )}
      {sample && (
        <p className="mt-3 rounded-xl bg-cream-dark px-3 py-2 text-xs">
          Sample translation pair. This is not live translation of new text.
        </p>
      )}
      <div className="mt-4 flex gap-2">
        <Button variant={view === "original" ? "primary" : "ghost"} onClick={() => setView("original")}>
          View original
        </Button>
        <Button variant={view === "translation" ? "primary" : "ghost"} onClick={() => setView("translation")}>
          View translation
        </Button>
      </div>
      <ol className="mt-6 grid gap-3">
        {messages.map((message) => {
          const lang = MESSAGE_LANGUAGES.find((item) => item.id === message.originalLanguage)?.native;
          const record = message.translations[0];
          const shown =
            view === "translation"
              ? translationLabel(record, message.originalText)
              : { text: message.originalText, caption: `Original · ${lang}` };
          return (
            <li key={message.id} className="rounded-2xl border border-line bg-paper p-4">
              <p className="text-xs font-semibold">
                {message.senderRole === "admin" ? "Outreach team" : "You"}
              </p>
              <p className="mt-2 whitespace-pre-wrap">{shown.text}</p>
              <p className="mt-2 text-xs text-ink-soft">{shown.caption}</p>
              <p className="text-xs">{message.createdAt.slice(0, 16).replace("T", " ")}</p>
            </li>
          );
        })}
      </ol>
      <form
        className="mt-8 grid gap-3"
        onSubmit={(event) => {
          event.preventDefault();
          if (reply.trim().length < 4) return;
          addReply({
            conversationId: conversation.id,
            senderRole: "visitor",
            text: reply,
            language: conversation.preferredLanguage,
            sendToken: `${Date.now()}`,
          });
          setReply("");
          refreshInbox();
          announce("Follow-up saved in this browser.");
        }}
      >
        <label className="grid gap-1 text-sm">
          Follow-up
          <textarea
            className="min-h-24 rounded-xl border p-3"
            value={reply}
            onChange={(e) => setReply(e.target.value)}
          />
        </label>
        <Button type="submit">Send follow-up</Button>
      </form>
      <div className="mt-6 flex flex-wrap gap-3">
        {conversation.status === "resolved" ? (
          <Button variant="ghost" onClick={() => { setStatus(conversation.id, "open"); refreshInbox(); }}>
            Reopen
          </Button>
        ) : null}
        {!sample && (
          confirmDelete ? (
            <Button
              variant="secondary"
              onClick={() => {
                deleteConversation(conversation.id, workspaceId);
                refreshInbox();
              }}
              href="/profile/messages"
            >
              Confirm delete
            </Button>
          ) : (
            <Button variant="ghost" onClick={() => setConfirmDelete(true)}>
              Delete local conversation
            </Button>
          )
        )}
        <Button href="/profile" variant="ghost">
          Back to My Bite
        </Button>
      </div>
    </div>
  );
}

export default function ThreadPage() {
  return (
    <Suspense fallback={<p className="px-4 py-10">Loading conversation…</p>}>
      <ThreadInner />
    </Suspense>
  );
}
