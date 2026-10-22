import { beforeEach, describe, expect, it } from "vitest";
import { memoryAdapter, memoryStore, setAdapter, STORAGE_KEYS } from "../lib/storage/adapter";
import { loadCms, restoreSeededCms, saveCms } from "../lib/content/repository";
import { seedCms } from "../lib/content/seed";

describe("content persistence", () => {
  beforeEach(() => {
    memoryStore.clear();
    setAdapter(memoryAdapter);
  });

  it("returns seed data when storage is empty", () => {
    expect(loadCms().careers.map((c) => c.id)).toEqual(seedCms.careers.map((c) => c.id));
  });

  it("persists an edited career title", () => {
    const cms = loadCms();
    cms.careers[0] = { ...cms.careers[0], title: "Controls engineer (edited)" };
    saveCms(cms);
    expect(loadCms().careers[0].title).toBe("Controls engineer (edited)");
  });

  it("recovers from corrupted JSON", () => {
    memoryStore.set(STORAGE_KEYS.cms, "{not-json");
    expect(loadCms().homepage.heroEyebrow).toBe(seedCms.homepage.heroEyebrow);
  });

  it("restores seeded content", () => {
    const cms = loadCms();
    cms.homepage.heroTitle = "Changed";
    saveCms(cms);
    expect(restoreSeededCms().homepage.heroTitle).toBe(seedCms.homepage.heroTitle);
  });
});
