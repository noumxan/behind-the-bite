"use client";

import { useState } from "react";
import * as Tabs from "@radix-ui/react-tabs";
import { Button } from "@/components/ui/Button";
import { useAppState } from "@/components/providers/AppState";
import { needsReview, upsertById } from "@/lib/content/repository";
import { careerFormSchema, homepageSchema } from "@/lib/schemas";
import type { CareerProfile, CmsState } from "@/lib/content/types";

export default function AdminContentPage() {
  const { cms, setCms, restoreContent } = useAppState();
  const [message, setMessage] = useState("");
  const [editing, setEditing] = useState<CareerProfile | null>(null);
  const [errors, setErrors] = useState<string[]>([]);

  function saveCareer(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!editing) return;
    const data = new FormData(event.currentTarget);
    const parsed = careerFormSchema.safeParse({
      id: editing.id,
      title: data.get("title"),
      purpose: data.get("purpose"),
      status: data.get("status"),
      lastReviewed: data.get("lastReviewed"),
      sourceUrl: data.get("sourceUrl") || "",
    });
    if (!parsed.success) {
      setErrors(parsed.error.issues.map((issue) => issue.message));
      return;
    }
    const next: CareerProfile = {
      ...editing,
      title: parsed.data.title,
      purpose: parsed.data.purpose,
      status: parsed.data.status,
      lastReviewed: parsed.data.lastReviewed,
      sourceUrl: parsed.data.sourceUrl || undefined,
    };
    const state: CmsState = { ...cms, careers: upsertById(cms.careers, next) };
    setCms(state);
    setEditing(null);
    setErrors([]);
    setMessage("Career profile saved in this browser. Published entries update the public site here.");
  }

  function saveHome(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const parsed = homepageSchema.safeParse({
      heroEyebrow: data.get("heroEyebrow"),
      heroTitle: data.get("heroTitle"),
      heroSupport: data.get("heroSupport"),
    });
    if (!parsed.success) {
      setErrors(parsed.error.issues.map((issue) => issue.message));
      return;
    }
    setCms({ ...cms, homepage: { ...cms.homepage, ...parsed.data } });
    setMessage("Homepage copy saved for this browser.");
  }

  return (
    <div>
      <h1 className="font-display text-3xl text-aubergine">Content</h1>
      <p className="mt-2 text-sm">Create, edit and archive demonstration content. Restore seed any time.</p>
      {message && <p className="mt-3 rounded-xl bg-mint-soft px-3 py-2 text-sm">{message}</p>}
      <Tabs.Root defaultValue="careers" className="mt-6">
        <Tabs.List className="flex flex-wrap gap-2">
          {["careers", "missions", "opportunities", "homepage"].map((tab) => (
            <Tabs.Trigger
              key={tab}
              value={tab}
              className="rounded-full border border-line bg-paper px-4 py-2 text-sm data-[state=active]:bg-yellow"
            >
              {tab}
            </Tabs.Trigger>
          ))}
        </Tabs.List>
        <Tabs.Content value="careers" className="mt-6">
          <ul className="grid gap-2">
            {cms.careers.map((career) => (
              <li key={career.id} className="flex flex-wrap items-center justify-between gap-2 rounded-2xl bg-paper p-3">
                <div>
                  <p className="font-semibold">{career.title}</p>
                  <p className="text-xs">
                    {career.status}
                    {needsReview(career.lastReviewed) ? " · Review needed" : ""}
                    {career.status !== "published" ? " · hidden on public site" : ""}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" onClick={() => setEditing(career)}>
                    Edit
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() =>
                      setCms({
                        ...cms,
                        careers: cms.careers.map((item) =>
                          item.id === career.id ? { ...item, status: "archived" } : item,
                        ),
                      })
                    }
                  >
                    Archive
                  </Button>
                </div>
              </li>
            ))}
          </ul>
          {editing && (
            <form onSubmit={saveCareer} className="mt-6 grid gap-3 rounded-2xl border border-line bg-paper p-4">
              <h2 className="text-xl">Edit {editing.title}</h2>
              {errors.map((err) => (
                <p key={err} className="text-sm text-cocoa">
                  {err}
                </p>
              ))}
              <label>
                Title
                <input name="title" defaultValue={editing.title} className="mt-1 w-full min-h-11 rounded-xl border border-line px-3" />
              </label>
              <label>
                Purpose
                <textarea name="purpose" defaultValue={editing.purpose} className="mt-1 min-h-24 w-full rounded-xl border border-line p-3" />
              </label>
              <label>
                Status
                <select name="status" defaultValue={editing.status} className="mt-1 min-h-11 w-full rounded-xl border px-3">
                  <option value="draft">draft</option>
                  <option value="published">published</option>
                  <option value="archived">archived</option>
                </select>
              </label>
              <label>
                Last reviewed
                <input name="lastReviewed" type="date" defaultValue={editing.lastReviewed} className="mt-1 min-h-11 w-full rounded-xl border px-3" />
              </label>
              <label>
                Source URL
                <input name="sourceUrl" defaultValue={editing.sourceUrl ?? ""} className="mt-1 min-h-11 w-full rounded-xl border px-3" />
              </label>
              <div className="flex gap-2">
                <Button type="submit">Save</Button>
                <Button variant="ghost" onClick={() => setEditing(null)}>
                  Cancel
                </Button>
                <Button href={`/careers/${editing.id}`} variant="ghost">
                  Preview
                </Button>
              </div>
            </form>
          )}
        </Tabs.Content>
        <Tabs.Content value="missions" className="mt-6">
          <ul className="grid gap-2">
            {cms.missions.map((mission) => (
              <li key={mission.id} className="rounded-2xl bg-paper p-3">
                <p className="font-semibold">{mission.title}</p>
                <label className="mt-2 block text-sm">
                  Description
                  <textarea
                    className="mt-1 w-full rounded-xl border p-2"
                    defaultValue={mission.whatYouWillTry}
                    onBlur={(e) =>
                      setCms({
                        ...cms,
                        missions: cms.missions.map((item) =>
                          item.id === mission.id ? { ...item, whatYouWillTry: e.target.value } : item,
                        ),
                      })
                    }
                  />
                </label>
              </li>
            ))}
          </ul>
        </Tabs.Content>
        <Tabs.Content value="opportunities" className="mt-6">
          {cms.opportunities.map((item) => (
            <article key={item.id} className="mb-3 rounded-2xl bg-paper p-3">
              <p className="mono text-[10px] uppercase">Illustrative opportunity — verify availability and requirements.</p>
              <input
                className="mt-2 w-full min-h-11 rounded-xl border px-3"
                defaultValue={item.title}
                onBlur={(e) =>
                  setCms({
                    ...cms,
                    opportunities: cms.opportunities.map((row) =>
                      row.id === item.id ? { ...row, title: e.target.value } : row,
                    ),
                  })
                }
              />
            </article>
          ))}
        </Tabs.Content>
        <Tabs.Content value="homepage" className="mt-6">
          <form onSubmit={saveHome} className="grid gap-3 rounded-2xl bg-paper p-4">
            <label>
              Eyebrow
              <input name="heroEyebrow" defaultValue={cms.homepage.heroEyebrow} className="mt-1 w-full min-h-11 rounded-xl border px-3" />
            </label>
            <label>
              Title
              <textarea name="heroTitle" defaultValue={cms.homepage.heroTitle} className="mt-1 min-h-24 w-full rounded-xl border p-3" />
            </label>
            <label>
              Supporting copy
              <textarea name="heroSupport" defaultValue={cms.homepage.heroSupport} className="mt-1 min-h-24 w-full rounded-xl border p-3" />
            </label>
            <Button type="submit">Save homepage</Button>
          </form>
        </Tabs.Content>
      </Tabs.Root>
      <Button className="mt-8" variant="ghost" onClick={() => { restoreContent(); setMessage("Seeded content restored."); }}>
        Restore seeded content
      </Button>
    </div>
  );
}
