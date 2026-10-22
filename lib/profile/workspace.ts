import { defaultActivity, defaultPlan } from "../activity";
import type {
  ActivityState,
  AnalyticsEvent,
  InterestId,
  WorkspaceId,
} from "../content/types";
import { STORAGE_KEYS, getAdapter } from "../storage/adapter";
import type { SupportPreferenceId } from "./catalog";

export type SavedQuestion = {
  id: string;
  text: string;
  relatedHref?: string;
  relatedTitle?: string;
  savedAt: string;
};

export type VisitorProfile = {
  displayName: string;
  interests: InterestId[];
  supportPreferences: SupportPreferenceId[];
  largerText: boolean;
  roomySpacing: boolean;
  reducedMotion: boolean | null;
  onboardingComplete: boolean;
  onboardingStep: number;
  savedQuestions: SavedQuestion[];
};

export type WorkspaceState = ActivityState & {
  profile: VisitorProfile;
};

export const defaultProfile: VisitorProfile = {
  displayName: "Explorer",
  interests: [],
  supportPreferences: [],
  largerText: false,
  roomySpacing: false,
  reducedMotion: null,
  onboardingComplete: false,
  onboardingStep: 0,
  savedQuestions: [],
};

export function defaultWorkspace(): WorkspaceState {
  return {
    ...JSON.parse(JSON.stringify(defaultActivity)) as ActivityState,
    profile: { ...defaultProfile, savedQuestions: [] },
  };
}

export type SessionState = { activeWorkspace: WorkspaceId };

export function loadSession(): SessionState {
  return getAdapter().get<SessionState>(STORAGE_KEYS.session) ?? { activeWorkspace: "visitor" };
}

export function saveSession(session: SessionState) {
  getAdapter().set(STORAGE_KEYS.session, session);
}

export function loadWorkspace(id: WorkspaceId): WorkspaceState {
  const stored = getAdapter().get<WorkspaceState>(STORAGE_KEYS.workspace(id));
  const base = defaultWorkspace();
  if (!stored) {
    const legacy = id === "visitor" ? getAdapter().get<ActivityState>(STORAGE_KEYS.activity) : null;
    if (legacy) {
      return {
        ...base,
        ...legacy,
        events: legacy.events ?? [],
        plan: legacy.plan ?? defaultPlan,
        profile: base.profile,
      };
    }
    return base;
  }
  return {
    ...base,
    ...stored,
    events: Array.isArray(stored.events) ? stored.events : [],
    profile: { ...base.profile, ...stored.profile, interests: stored.profile?.interests ?? [] },
  };
}

export function saveWorkspace(id: WorkspaceId, state: WorkspaceState) {
  getAdapter().set(STORAGE_KEYS.workspace(id), state);
}

export function recordEvent(
  state: WorkspaceState,
  event: Omit<AnalyticsEvent, "id" | "at"> & { at?: string; id?: string },
): WorkspaceState {
  if (event.uniqueKey && state.events.some((item) => item.uniqueKey === event.uniqueKey)) {
    return state;
  }
  const nextEvent: AnalyticsEvent = {
    id: event.id ?? `${event.name}-${Date.now()}-${state.events.length}`,
    name: event.name,
    at: event.at ?? new Date().toISOString(),
    payload: event.payload,
    uniqueKey: event.uniqueKey,
  };
  return { ...state, events: [...state.events, nextEvent].slice(-400) };
}

export function toggleInterest(state: WorkspaceState, interest: InterestId, on: boolean) {
  const has = state.profile.interests.includes(interest);
  if (on && has) return state;
  if (!on && !has) return state;
  const interests = on
    ? [...state.profile.interests, interest]
    : state.profile.interests.filter((item) => item !== interest);
  const withProfile = { ...state, profile: { ...state.profile, interests } };
  return recordEvent(withProfile, {
    name: on ? "interest_save" : "interest_remove",
    uniqueKey: `${on ? "save" : "remove"}-${interest}-${Date.now()}`,
    payload: { interest },
  });
}

export function resetWorkspace(id: WorkspaceId) {
  const next = defaultWorkspace();
  saveWorkspace(id, next);
  return next;
}
