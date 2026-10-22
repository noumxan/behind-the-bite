import type { AnalyticsEvent } from "../content/types";
import { SAMPLE_COHORT } from "../content/seed";

export type FunnelSource = "sample" | "browser";

export type FunnelStep = {
  id: string;
  label: string;
  count: number;
  conversionFromPrevious: number | null;
  dropOff: number | null;
};

export function rate(part: number, whole: number) {
  if (whole <= 0) return 0;
  return part / whole;
}

export function browserFunnel(events: AnalyticsEvent[]) {
  const visitors = events.filter((e) => e.name === "visit").length || (events.length ? 1 : 0);
  const explorerStarts = events.filter((e) => e.name === "explore_start").length;
  const missionCompletions = events.filter((e) => e.name === "mission_complete").length;
  const routeCompletions = events.filter((e) => e.name === "route_complete").length;
  const resourceClicks = events.filter((e) => e.name === "resource_click").length;
  const missionStarts = events.filter((e) => e.name === "mission_start").length;
  const savedPlans = events.filter((e) => e.name === "plan_save").length;
  return {
    visitors,
    explorerStarts,
    missionStarts,
    missionCompletions,
    routeCompletions,
    resourceClicks,
    savedPlans,
  };
}

export function sampleFunnel() {
  return {
    visitors: SAMPLE_COHORT.visitors,
    explorerStarts: SAMPLE_COHORT.explorerStarts,
    missionStarts: SAMPLE_COHORT.missionStarts,
    missionCompletions: SAMPLE_COHORT.missionCompletions,
    routeCompletions: SAMPLE_COHORT.routeCompletions,
    resourceClicks: SAMPLE_COHORT.resourceClicks,
    savedPlans: SAMPLE_COHORT.savedPlans,
  };
}

export function toSteps(counts: ReturnType<typeof sampleFunnel>): FunnelStep[] {
  const sequence: Array<[keyof typeof counts, string]> = [
    ["visitors", "Visit"],
    ["explorerStarts", "Product explored"],
    ["missionCompletions", "Mission completed"],
    ["routeCompletions", "Route created"],
    ["resourceClicks", "Resource clicked"],
  ];
  return sequence.map(([key, label], index) => {
    const count = counts[key];
    const previous = index === 0 ? null : counts[sequence[index - 1][0]];
    return {
      id: key,
      label,
      count,
      conversionFromPrevious: previous === null ? null : rate(count, previous),
      dropOff: previous === null ? null : Math.max(previous - count, 0),
    };
  });
}

export function metricDefinitions() {
  return [
    {
      id: "visitors",
      label: "Visitors",
      definition: "Session starts recorded for this view.",
      denominator: "Not a unique-person count in demo mode.",
    },
    {
      id: "explorerStarts",
      label: "Explorer starts",
      definition: "Opened a product factory map.",
      denominator: "Of visitors.",
    },
    {
      id: "missionStarts",
      label: "Mission starts",
      definition: "Pressed start on a playable mission.",
      denominator: "Of visitors.",
    },
    {
      id: "missionCompletions",
      label: "Mission completions",
      definition: "Finished a mission comparison or design choice.",
      denominator: "Of mission starts.",
    },
    {
      id: "routeCompletions",
      label: "Route finder completions",
      definition: "Reached a saved recommendation set.",
      denominator: "Of visitors.",
    },
    {
      id: "resourceClicks",
      label: "Resource clicks",
      definition: "Opened a next-step resource from the product.",
      denominator: "Of route completions where relevant.",
    },
    {
      id: "savedPlans",
      label: "Saved action plans",
      definition: "Saved or updated a next-step plan.",
      denominator: "Of visitors.",
    },
  ];
}
