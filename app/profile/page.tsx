"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { useAppState } from "@/components/providers/AppState";
import { INTEREST_OPTIONS, SUPPORT_PREFERENCE_OPTIONS } from "@/lib/profile/catalog";
import { recommendFromInterests } from "@/lib/recommendations";
import type { InterestId } from "@/lib/content/types";
import type { SupportPreferenceId } from "@/lib/profile/catalog";

export default function ProfilePage() {
  const { workspace, setWorkspace, saveInterest, unreadUser, cms, openComposer } = useAppState();
  const profile = workspace.profile;
  const recs = recommendFromInterests(profile.interests, workspace.routeResult);
  const continueHref = workspace.events.some((item) => item.name === "layer_open")
    ? "/explore/sandwich-biscuit"
    : "/explore/chocolate-bar";
  const feed = [...workspace.events].reverse().slice(0, 8);

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <div className="overflow-hidden rounded-[2rem] bg-aubergine text-cream">
        <svg viewBox="0 0 640 160" className="w-full" aria-hidden>
          <rect width="640" height="160" fill="#3b1238" />
          <ellipse cx="520" cy="90" rx="90" ry="50" fill="#5b3426" />
          <ellipse cx="520" cy="90" rx="60" ry="28" fill="#f2c014" />
          <rect x="80" y="70" width="220" height="36" rx="12" fill="#2f8f82" />
        </svg>
        <div className="px-6 pb-6">
          <div className="-mt-8 flex items-end gap-4">
            <div
              className="flex h-16 w-16 items-center justify-center rounded-full bg-yellow font-display text-2xl text-aubergine"
              aria-hidden
            >
              {profile.displayName.slice(0, 1).toUpperCase()}
            </div>
            <div>
              <p className="mono text-xs uppercase text-yellow">My Bite · private in this browser</p>
              <h1 className="text-4xl">{profile.displayName}</h1>
            </div>
          </div>
          <p className="mt-4 max-w-prose text-cream/80">
            A personal discovery space, not a social profile. Interests you save here can shape
            route ideas. Exploring a page does not add an interest by itself.
          </p>
        </div>
      </div>

      <section className="mt-8 rounded-[1.6rem] border border-line bg-paper p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-2xl">Continue</h2>
          {unreadUser > 0 ? (
            <Link href="/profile/messages" className="text-sm text-mint">
              {unreadUser} unread {unreadUser === 1 ? "reply" : "replies"}
            </Link>
          ) : null}
        </div>
        <Button className="mt-4" href={continueHref}>
          Return to exploring
        </Button>
        <Button className="mt-3" variant="ghost" href="/profile/messages">
          Messages
        </Button>
      </section>

      <section className="mt-8">
        <h2 className="text-2xl text-aubergine">Interests you chose</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {INTEREST_OPTIONS.map((item) => {
            const on = profile.interests.includes(item.id);
            return (
              <button
                key={item.id}
                type="button"
                className={`min-h-11 rounded-full border px-4 text-sm ${on ? "border-aubergine bg-yellow" : "border-line bg-paper"}`}
                onClick={() => saveInterest(item.id as InterestId, !on)}
              >
                {item.short}
              </button>
            );
          })}
        </div>
        {recs[0] && (
          <p className="mt-4 text-sm text-ink-soft">
            Because of what you saved, a useful area to look at is{" "}
            {cms.careers.find((item) => item.id === recs[0].career)?.title}. This is not a match
            score.
          </p>
        )}
      </section>

      <section className="mt-8">
        <h2 className="text-2xl text-aubergine">Private activity</h2>
        {feed.length === 0 ? (
          <p className="mt-2 text-ink-soft">Nothing saved yet. Explore a snack to begin.</p>
        ) : (
          <ol className="mt-3 grid gap-2">
            {feed.map((item) => (
              <li key={item.id} className="rounded-2xl border border-line bg-paper px-4 py-3 text-sm">
                {labelEvent(item.name)} · {item.at.slice(0, 10)}
              </li>
            ))}
          </ol>
        )}
      </section>

      <section className="mt-8">
        <h2 className="text-2xl text-aubergine">Saved questions</h2>
        {profile.savedQuestions.length === 0 ? (
          <p className="mt-2 text-sm text-ink-soft">Save a prompt from a career or layer page.</p>
        ) : (
          <ul className="mt-3 grid gap-2">
            {profile.savedQuestions.map((item) => (
              <li key={item.id} className="rounded-2xl bg-cream-dark px-4 py-3 text-sm">
                {item.text}
                <Button className="mt-2" variant="ghost" onClick={() => openComposer(undefined, item.text)}>
                  Add to a message
                </Button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="mt-8 rounded-3xl border border-line p-5">
        <h2 className="text-2xl">How this site behaves</h2>
        <label className="mt-3 flex gap-2">
          <input
            type="checkbox"
            checked={Boolean(profile.reducedMotion)}
            onChange={(e) =>
              setWorkspace({ ...workspace, profile: { ...profile, reducedMotion: e.target.checked } })
            }
          />
          Reduce motion
        </label>
        <label className="mt-2 flex gap-2">
          <input
            type="checkbox"
            checked={profile.largerText}
            onChange={(e) =>
              setWorkspace({ ...workspace, profile: { ...profile, largerText: e.target.checked } })
            }
          />
          Larger text
        </label>
        <label className="mt-2 flex gap-2">
          <input
            type="checkbox"
            checked={profile.roomySpacing}
            onChange={(e) =>
              setWorkspace({ ...workspace, profile: { ...profile, roomySpacing: e.target.checked } })
            }
          />
          More space between controls
        </label>
        <h3 className="mt-6 text-lg">Private support notes</h3>
        <p className="text-sm text-ink-soft">
          You can explore your options without sharing personal health information. These notes
          never hide a career, and they are not sent unless you tick them on a message.
        </p>
        {SUPPORT_PREFERENCE_OPTIONS.map((item) => {
          const on = profile.supportPreferences.includes(item.id);
          return (
            <label key={item.id} className="mt-2 flex gap-2 text-sm">
              <input
                type="checkbox"
                checked={on}
                onChange={() =>
                  setWorkspace({
                    ...workspace,
                    profile: {
                      ...profile,
                      supportPreferences: on
                        ? profile.supportPreferences.filter((id) => id !== item.id)
                        : [...profile.supportPreferences, item.id as SupportPreferenceId],
                    },
                  })
                }
              />
              {item.label}
            </label>
          );
        })}
        <Button
          className="mt-4"
          variant="ghost"
          onClick={() =>
            setWorkspace({
              ...workspace,
              profile: { ...profile, onboardingComplete: false, onboardingStep: 0 },
            })
          }
        >
          Resume optional setup
        </Button>
      </section>
    </div>
  );
}

function labelEvent(name: string) {
  const map: Record<string, string> = {
    visit: "Opened the site",
    explore_start: "Explored a product",
    layer_open: "Opened a biscuit layer",
    interest_save: "Saved an interest",
    interest_remove: "Removed an interest",
    mission_complete: "Finished a mission",
    message_sent: "Asked the team a question",
    admin_replied: "The outreach team replied to your question.",
    route_complete: "Created a route",
    role_save: "Saved a role",
  };
  return map[name] ?? name;
}
