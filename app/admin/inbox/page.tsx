"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useAppState } from "@/components/providers/AppState";
import { MESSAGE_CATEGORIES, MESSAGE_LANGUAGES } from "@/lib/profile/catalog";

export default function AdminInboxPage() {
  const { inbox } = useAppState();
  const [status, setStatus] = useState("all");
  const [category, setCategory] = useState("all");
  const [language, setLanguage] = useState("all");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<string | null>(inbox.conversations[0]?.id ?? null);

  const list = useMemo(() => {
    return inbox.conversations
      .filter((item) => (status === "all" ? true : item.status === status))
      .filter((item) => (category === "all" ? true : item.category === category))
      .filter((item) => (language === "all" ? true : item.preferredLanguage === language))
      .filter((item) => `${item.subject} ${item.reference}`.toLowerCase().includes(query.toLowerCase()))
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  }, [inbox.conversations, status, category, language, query]);

  return (
    <div>
      <h1 className="font-display text-3xl text-aubergine">Inbox</h1>
      <p className="mt-2 text-sm">
        Simulated outreach inbox in this browser. Not delivered to Mondelēz. Internal notes never
        appear on the visitor thread.
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        <select className="min-h-11 rounded-xl border px-2" value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="all">All statuses</option>
          <option value="new">New</option>
          <option value="open">Open</option>
          <option value="resolved">Resolved</option>
        </select>
        <select className="min-h-11 rounded-xl border px-2" value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="all">All categories</option>
          {MESSAGE_CATEGORIES.map((item) => (
            <option key={item.id} value={item.id}>
              {item.label}
            </option>
          ))}
        </select>
        <select className="min-h-11 rounded-xl border px-2" value={language} onChange={(e) => setLanguage(e.target.value)}>
          <option value="all">All languages</option>
          {MESSAGE_LANGUAGES.map((item) => (
            <option key={item.id} value={item.id}>
              {item.native}
            </option>
          ))}
        </select>
        <input
          className="min-h-11 rounded-xl border px-3"
          placeholder="Search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
      <div className="mt-6 grid gap-4 lg:grid-cols-[20rem_1fr]">
        <ul className="grid gap-2">
          {list.map((item) => (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => setSelected(item.id)}
                className={`w-full rounded-2xl border px-3 py-3 text-left ${
                  selected === item.id ? "border-aubergine bg-yellow/40" : "border-line bg-paper"
                }`}
              >
                <p className="font-semibold">{item.subject}</p>
                <p className="mono text-xs">
                  {item.reference} · {item.status}
                  {item.sampleTranslation ? " · Sample" : ""}
                </p>
              </button>
            </li>
          ))}
        </ul>
        <div className="rounded-2xl border border-line bg-paper p-4 lg:hidden">
          {selected ? (
            <Link href={`/admin/inbox/${selected}`} className="underline">
              Open conversation
            </Link>
          ) : (
            <p>Select a conversation.</p>
          )}
        </div>
        <div className="hidden rounded-2xl border border-line bg-paper p-4 lg:block">
          {selected ? (
            <p>
              Desktop preview — open the full thread:{" "}
              <Link className="underline" href={`/admin/inbox/${selected}`}>
                {list.find((item) => item.id === selected)?.reference}
              </Link>
            </p>
          ) : (
            <p>Select a conversation to read it.</p>
          )}
        </div>
      </div>
    </div>
  );
}
