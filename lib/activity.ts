import { STORAGE_KEYS, getAdapter } from "./storage/adapter";
import type { ActivityState, AnalyticsEvent, RouteAnswers, SavedPlan } from "./content/types";

export const defaultPlan: SavedPlan = {
  roles: [],
  resources: [],
  actions: {
    tryMission: false,
    exploreRole: false,
    compareRoute: false,
    prepareQuestions: false,
    visitResource: false,
  },
  supporterNote: "",
  updatedAt: "",
};

export const defaultActivity: ActivityState = {
  events: [],
  routeDraft: { step: 0, interests: [], support: [] },
  plan: defaultPlan,
  reducedMotion: null,
};

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

export function loadActivity(): ActivityState {
  const stored = getAdapter().get<ActivityState>(STORAGE_KEYS.activity);
  if (!stored) return clone(defaultActivity);
  return {
    events: Array.isArray(stored.events) ? stored.events : [],
    routeDraft: stored.routeDraft ?? { step: 0 },
    routeResult: stored.routeResult,
    plan: stored.plan ?? clone(defaultPlan),
    reducedMotion: stored.reducedMotion ?? null,
  };
}

export function saveActivity(state: ActivityState) {
  getAdapter().set(STORAGE_KEYS.activity, state);
}

export function trackEvent(
  name: AnalyticsEvent["name"],
  payload?: AnalyticsEvent["payload"],
) {
  const state = loadActivity();
  const uniqueKey = payload && typeof payload.uniqueKey === "string" ? String(payload.uniqueKey) : undefined;
  if (uniqueKey && state.events.some((item) => item.uniqueKey === uniqueKey)) {
    return state.events.find((item) => item.uniqueKey === uniqueKey)!;
  }
  const event: AnalyticsEvent = {
    id: `${name}-${Date.now()}-${state.events.length}`,
    name,
    at: new Date().toISOString(),
    payload,
    uniqueKey,
  };
  state.events = [...state.events, event].slice(-400);
  saveActivity(state);
  return event;
}

export function clearActivity() {
  saveActivity(clone(defaultActivity));
}

export function saveRouteResult(answers: RouteAnswers) {
  const state = loadActivity();
  state.routeResult = answers;
  state.routeDraft = { ...answers, step: 6 };
  saveActivity(state);
}

export function savePlan(plan: SavedPlan) {
  const state = loadActivity();
  state.plan = { ...plan, updatedAt: new Date().toISOString() };
  saveActivity(state);
}
