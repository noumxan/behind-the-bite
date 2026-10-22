import { describe, expect, it } from "vitest";
import { escapeCsvCell, toCsv } from "../lib/csv";

describe("csv export", () => {
  it("guards spreadsheet formula prefixes", () => {
    expect(escapeCsvCell("=SUM(A1)")).toBe("'=SUM(A1)");
    expect(escapeCsvCell("+cmd")).toBe("'+cmd");
    expect(escapeCsvCell("-1+1")).toBe("'-1+1");
    expect(escapeCsvCell("@foo")).toBe("'@foo");
  });

  it("quotes commas and combined headers", () => {
    const csv = toCsv([
      { label: "Visit, start", count: 3 },
      { label: 'Say "hello"', count: 1 },
    ]);
    expect(csv.split("\n")[0]).toBe("label,count");
    expect(csv).toContain('"Visit, start"');
    expect(csv).toContain('"Say ""hello"""');
  });
});
