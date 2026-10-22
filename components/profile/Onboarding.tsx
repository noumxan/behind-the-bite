"use client";

import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { useAppState } from "@/components/providers/AppState";
import { INTEREST_OPTIONS, SUPPORT_PREFERENCE_OPTIONS } from "@/lib/profile/catalog";
import type { InterestId } from "@/lib/content/types";
import type { SupportPreferenceId } from "@/lib/profile/catalog";

export function Onboarding() {
  const { mounted, workspace, setWorkspace, workspaceId } = useAppState();
  const pathname = usePathname();
  if (!mounted || workspace.profile.onboardingComplete || pathname.startsWith("/admin")) return null;
  const step = workspace.profile.onboardingStep;
  const profile = workspace.profile;

  function patch(partial: Partial<typeof profile>, nextStep?: number) {
    setWorkspace({
      ...workspace,
      profile: {
        ...profile,
        ...partial,
        onboardingStep: nextStep ?? profile.onboardingStep,
      },
    });
  }

  return (
    <div className="border-b border-line bg-mint-soft px-4 py-4">
      <div className="mx-auto max-w-3xl">
        <p className="mono text-xs uppercase">Optional setup · step {step + 1} of 3</p>
        {step === 0 && (
          <>
            <h2 className="mt-2 text-2xl text-aubergine">Make this visit a little more yours</h2>
            <p className="mt-2 text-sm">
              You can skip this. Nothing here is a public profile, and you can explore without
              sharing personal health information.
            </p>
            <label className="mt-4 block text-sm">
              What should we call you here?
              <input
                className="mt-1 min-h-11 w-full rounded-xl border px-3"
                value={profile.displayName}
                onChange={(e) => patch({ displayName: e.target.value })}
              />
            </label>
          </>
        )}
        {step === 1 && (
          <>
            <h2 className="mt-2 text-2xl text-aubergine">Any interests to pin?</h2>
            <p className="mt-2 text-sm">Exploring a page does not save an interest until you choose to.</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {INTEREST_OPTIONS.slice(0, 4).map((item) => {
                const on = profile.interests.includes(item.id);
                return (
                  <button
                    key={item.id}
                    type="button"
                    className={`min-h-11 rounded-full border px-4 text-sm ${on ? "bg-yellow" : "bg-paper"}`}
                    onClick={() =>
                      patch({
                        interests: on
                          ? profile.interests.filter((id) => id !== item.id)
                          : [...profile.interests, item.id as InterestId],
                      })
                    }
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>
          </>
        )}
        {step === 2 && (
          <>
            <h2 className="mt-2 text-2xl text-aubergine">How should this site behave?</h2>
            <label className="mt-3 flex gap-2 text-sm">
              <input
                type="checkbox"
                checked={Boolean(profile.reducedMotion)}
                onChange={(e) => patch({ reducedMotion: e.target.checked })}
              />
              Reduce motion
            </label>
            <label className="mt-2 flex gap-2 text-sm">
              <input
                type="checkbox"
                checked={profile.largerText}
                onChange={(e) => patch({ largerText: e.target.checked })}
              />
              Larger text
            </label>
            <label className="mt-2 flex gap-2 text-sm">
              <input
                type="checkbox"
                checked={profile.roomySpacing}
                onChange={(e) => patch({ roomySpacing: e.target.checked })}
              />
              More space between controls
            </label>
            <p className="mt-3 text-xs">
              Optional support notes stay private unless you later choose to share one with a
              question. They do not hide careers.
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {SUPPORT_PREFERENCE_OPTIONS.slice(0, 3).map((item) => {
                const on = profile.supportPreferences.includes(item.id);
                return (
                  <button
                    key={item.id}
                    type="button"
                    className={`rounded-full border px-3 py-2 text-xs ${on ? "bg-paper" : ""}`}
                    onClick={() =>
                      patch({
                        supportPreferences: on
                          ? profile.supportPreferences.filter((id) => id !== item.id)
                          : [...profile.supportPreferences, item.id as SupportPreferenceId],
                      })
                    }
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>
          </>
        )}
        <div className="mt-4 flex flex-wrap gap-3">
          {step > 0 && (
            <Button variant="ghost" onClick={() => patch({}, step - 1)}>
              Back
            </Button>
          )}
          {step < 2 ? (
            <Button onClick={() => patch({}, step + 1)}>Continue</Button>
          ) : (
            <Button onClick={() => patch({ onboardingComplete: true }, 2)}>Save preferences</Button>
          )}
          <Button
            variant="ghost"
            onClick={() =>
              setWorkspace({
                ...workspace,
                profile: { ...profile, onboardingComplete: true },
              })
            }
          >
            Skip for now
          </Button>
        </div>
        <p className="mt-2 text-xs text-ink-soft">Workspace: {workspaceId} in this browser only.</p>
      </div>
    </div>
  );
}
