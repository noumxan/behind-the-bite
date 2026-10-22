import { describe, expect, it } from "vitest";
import {
  DEFAULT_PACKAGING,
  lessonFromComparison,
  runPackagingBatch,
} from "../lib/simulation/packaging";

describe("packaging simulation", () => {
  it("is deterministic for the same settings", () => {
    const a = runPackagingBatch(DEFAULT_PACKAGING);
    const b = runPackagingBatch(DEFAULT_PACKAGING);
    expect(a.packages).toEqual(b.packages);
    expect(a.metrics).toEqual(b.metrics);
  });

  it("counts metrics from true state rather than decoration", () => {
    const { packages, metrics } = runPackagingBatch(DEFAULT_PACKAGING);
    const unnecessary = packages.filter((p) => !p.trueDefect && p.rejected).length;
    const missed = packages.filter((p) => p.trueDefect && !p.rejected).length;
    expect(metrics.unnecessaryRejects).toBe(unnecessary);
    expect(metrics.missedDefects).toBe(missed);
    expect(
      metrics.correctlyAccepted +
        metrics.correctlyRejected +
        metrics.unnecessaryRejects +
        metrics.missedDefects,
    ).toBe(packages.length);
  });

  it("does not treat higher throughput with more missed defects as a simple win", () => {
    const tight = runPackagingBatch({ ...DEFAULT_PACKAGING, threshold: 0.4, conveyorSpeed: 40 });
    const fast = runPackagingBatch({ ...DEFAULT_PACKAGING, threshold: 0.85, conveyorSpeed: 95 });
    const notes = lessonFromComparison(tight.metrics, fast.metrics);
    expect(notes.join(" ")).toMatch(/quality|defects|rejected|similar/i);
  });
});
