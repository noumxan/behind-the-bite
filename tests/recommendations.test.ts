import { describe, expect, it } from "vitest";
import { recommend, supporterSummary } from "../lib/recommendations";
import { jordanAnswers, graduateAnswers } from "../lib/demo-personas";

describe("route recommendations", () => {
  it("explains starting-out suggestions without fake percentages", () => {
    const recs = recommend(jordanAnswers());
    expect(recs.length).toBeGreaterThan(0);
    expect(recs[0].why.join(" ")).toMatch(/apprenticeship|hands-on|earning|practical/i);
    expect(recs[0].check.some((item) => item.includes("official"))).toBe(true);
    expect(JSON.stringify(recs)).not.toMatch(/%/);
  });

  it("shifts toward process and software for graduates who like coding", () => {
    const recs = recommend(graduateAnswers());
    const ids = recs.map((item) => item.career);
    expect(ids.some((id) => id === "software-data" || id === "process" || id === "automation-controls")).toBe(
      true,
    );
  });

  it("builds a deterministic supporter note", () => {
    const answers = jordanAnswers();
    const recs = recommend(answers);
    const note = supporterSummary({
      careers: recs.map((item) => ({ title: item.career, why: item.why })),
      answers,
    });
    expect(note).toContain("not an application");
    expect(note).toContain("starting out");
  });
});
