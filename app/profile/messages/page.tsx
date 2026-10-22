"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import { useAppState } from "@/components/providers/AppState";
import { MESSAGE_CATEGORIES } from "@/lib/profile/catalog";

export default function MessagesPage() {
  const { inbox, workspaceId, openComposer } = useAppState();
  const [query, setQuery] = useState("");
  const list = useMemo(() => {
    return inbox.conversations
      .filter((item) => item.workspaceId === workspaceId)
      .filter((item) => {
        const blob = `${item.subject} ${item.reference} ${item.category}`.toLowerCase();
        return blob.includes(query.toLowerCase());
      })
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  }, [inbox.conversations, query, workspaceId]);

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-4xl text-aubergine">Messages</h1>
      <p className="mt-3 text-sm text-ink-soft">
        Demo inbox in this browser. Replies appear here. Nothing is emailed.
      </p>
      <input
        className="mt-4 min-h-11 w-full rounded-xl border px-3"
        placeholder="Search subject or reference"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      {list.length === 0 ? (
        <div className="mt-8 rounded-3xl border border-line p-6">
          <p>No conversations yet.</p>
          <Button className="mt-4" onClick={() => openComposer(null)}>
            Ask the team
          </Button>
        </div>
      ) : (
        <ul className="mt-6 grid gap-3">
          {list.map((item) => {
            const last = inbox.messages.filter((m) => m.conversationId === item.id).at(-1);
            const unread = inbox.messages.some(
              (m) => m.conversationId === item.id && m.senderRole === "admin" && !m.readAt,
            );
            return (
              <li key={item.id}>
                <Link href={`/profile/messages/${item.id}`} className="block rounded-2xl border border-line bg-paper p-4">
                  <div className="flex justify-between gap-3">
                    <p className="font-semibold">{item.subject}</p>
                    {unread ? <span className="text-xs text-mint">Unread</span> : null}
                  </div>
                  <p className="mono mt-1 text-xs">
                    {item.reference} · {MESSAGE_CATEGORIES.find((c) => c.id === item.category)?.label} · {item.status}
                    {item.sampleTranslation ? " · Sample translation" : ""}
                  </p>
                  <p className="mt-2 line-clamp-2 text-sm text-ink-soft">{last?.originalText}</p>
                  <p className="mt-1 text-xs">{item.updatedAt.slice(0, 16).replace("T", " ")}</p>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
