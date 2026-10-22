"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { useAppState } from "@/components/providers/AppState";
import { resourceFormSchema } from "@/lib/schemas";
import { needsReview, upsertById } from "@/lib/content/repository";
import type { ResourceItem } from "@/lib/content/types";

export default function AdminResourcesPage() {
  const { cms, setCms } = useAppState();
  const [editing, setEditing] = useState<ResourceItem | null>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const [ok, setOk] = useState("");

  return (
    <div>
      <h1 className="font-display text-3xl text-aubergine">Resources</h1>
      <p className="mt-2 text-sm">
        Review status is editorial, not a live link check. Missing URLs are called out instead of
        inventing addresses.
      </p>
      {ok && <p className="mt-3 rounded-xl bg-mint-soft px-3 py-2 text-sm">{ok}</p>}
      <table className="mt-6 w-full text-sm">
        <thead>
          <tr className="text-left border-b border-line">
            <th className="py-2">Title</th>
            <th>Audience</th>
            <th>Route</th>
            <th>URL</th>
            <th>Status</th>
            <th>Last reviewed</th>
            <th>Review status</th>
          </tr>
        </thead>
        <tbody>
          {cms.resources.map((item) => (
            <tr key={item.id} className="border-b border-line">
              <td className="py-2">
                {item.title}
                {item.exampleLabel ? " (illustrative)" : ""}
              </td>
              <td>{item.audience.join(", ")}</td>
              <td>{item.route}</td>
              <td>{item.url || "Missing URL"}</td>
              <td>{item.status}</td>
              <td>{item.lastReviewed}</td>
              <td>{needsReview(item.lastReviewed) || !item.url ? "Needs review" : "In date"}</td>
              <td>
                <button type="button" className="underline" onClick={() => setEditing(item)}>
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Button
        className="mt-4"
        variant="ghost"
        onClick={() =>
          setEditing({
            id: `res-${Date.now()}`,
            title: "",
            audience: ["unsure"],
            route: "General",
            url: "",
            status: "draft",
            lastReviewed: new Date().toISOString().slice(0, 10),
            exampleLabel: true,
          })
        }
      >
        New resource
      </Button>
      <h2 className="mt-10 text-xl">Support resources</h2>
      <p className="text-sm">General information, separate from any employer-specific promise.</p>
      <ul className="mt-3 grid gap-2">
        {(cms.supportResources ?? []).map((item) => (
          <li key={item.id} className="rounded-2xl bg-paper p-3 text-sm">
            <p className="font-semibold">{item.title}</p>
            <p>{item.body}</p>
            <p className="text-xs">
              Source: {item.sourceLabel} · Last reviewed {item.lastReviewed} · {item.url || "Missing URL"}
            </p>
            <input
              className="mt-2 min-h-11 w-full rounded-xl border px-3"
              defaultValue={item.lastReviewed}
              onBlur={(e) =>
                setCms({
                  ...cms,
                  supportResources: (cms.supportResources ?? []).map((row) =>
                    row.id === item.id ? { ...row, lastReviewed: e.target.value } : row,
                  ),
                })
              }
            />
          </li>
        ))}
      </ul>
      {editing && (
        <form
          className="mt-6 grid gap-3 rounded-2xl bg-paper p-4"
          onSubmit={(event) => {
            event.preventDefault();
            const data = new FormData(event.currentTarget);
            const parsed = resourceFormSchema.safeParse({
              id: editing.id,
              title: data.get("title"),
              url: data.get("url") || "",
              route: data.get("route"),
              status: data.get("status"),
              lastReviewed: data.get("lastReviewed"),
              exampleLabel: data.get("exampleLabel") === "on",
            });
            if (!parsed.success) {
              setErrors(parsed.error.issues.map((issue) => issue.message));
              return;
            }
            setCms({
              ...cms,
              resources: upsertById(cms.resources, { ...editing, ...parsed.data }),
            });
            setEditing(null);
            setErrors([]);
            setOk("Resource saved in this browser.");
          }}
        >
          {errors.map((err) => (
            <p key={err} className="text-sm text-cocoa">
              {err}
            </p>
          ))}
          <input name="title" defaultValue={editing.title} placeholder="Title" className="min-h-11 rounded-xl border px-3" />
          <input name="url" defaultValue={editing.url} placeholder="URL" className="min-h-11 rounded-xl border px-3" />
          <input name="route" defaultValue={editing.route} className="min-h-11 rounded-xl border px-3" />
          <select name="status" defaultValue={editing.status} className="min-h-11 rounded-xl border px-3">
            <option value="draft">draft</option>
            <option value="published">published</option>
            <option value="archived">archived</option>
          </select>
          <input name="lastReviewed" type="date" defaultValue={editing.lastReviewed} className="min-h-11 rounded-xl border px-3" />
          <label className="flex items-center gap-2">
            <input name="exampleLabel" type="checkbox" defaultChecked={editing.exampleLabel} />
            Illustrative example
          </label>
          <div className="flex gap-2">
            <Button type="submit">Save</Button>
            <Button variant="ghost" onClick={() => setEditing(null)}>
              Cancel
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
