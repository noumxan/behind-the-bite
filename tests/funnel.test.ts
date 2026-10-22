import { describe, expect, it } from "vitest";
import { browserFunnel, rate, toSteps } from "../lib/analytics/funnel";
import type { AnalyticsEvent } from "../lib/content/types";

describe("funnel", () => {
  it("calculates conversion and drop-off from counts", () => {
    const steps = toSteps({
      visitors: 100,
      explorerStarts: 50,
      missionStarts: 40,
      missionCompletions: 20,
      routeCompletions: 10,
      resourceClicks: 5,
      savedPlans: 4,
    });
    expect(steps[0].conversionFromPrevious).toBeNull();
    expect(steps[1].conversionFromPrevious).toBe(0.5);
    expect(steps[1].dropOff).toBe(50);
    expect(rate(1, 0)).toBe(0);
  });

  it("uses browser events without mixing sample totals", () => {
    const events: AnalyticsEvent[] = [
      { id: "1", name: "visit", at: "2026-01-01" },
      { id: "2", name: "explore_start", at: "2026-01-01" },
      { id: "3", name: "mission_complete", at: "2026-01-01" },
    ];
    const counts = browserFunnel(events);
    expect(counts.visitors).toBe(1);
    expect(counts.explorerStarts).toBe(1);
    expect(counts.missionCompletions).toBe(1);
    expect(counts.routeCompletions).toBe(0);
  });
});
