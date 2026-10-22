import { mulberry32 } from "../prng";

export type PackagingSettings = {
  threshold: number;
  conveyorSpeed: number;
  seed: number;
  batchSize: number;
};

export type PackageRecord = {
  index: number;
  trueDefect: boolean;
  trueScore: number;
  sensor: number;
  rejected: boolean;
};

export type PackagingMetrics = {
  correctlyAccepted: number;
  correctlyRejected: number;
  unnecessaryRejects: number;
  missedDefects: number;
  throughput: number;
  qualityIndex: number;
};

export const DEFAULT_PACKAGING: PackagingSettings = {
  threshold: 0.62,
  conveyorSpeed: 70,
  seed: 42,
  batchSize: 24,
};

export function runPackagingBatch(settings: PackagingSettings): {
  packages: PackageRecord[];
  metrics: PackagingMetrics;
} {
  const rand = mulberry32(settings.seed);
  const noiseScale = 0.05 + (settings.conveyorSpeed / 100) * 0.12;
  const defectRate = 0.18;
  const packages: PackageRecord[] = [];

  for (let i = 0; i < settings.batchSize; i += 1) {
    const trueDefect = rand() < defectRate;
    const trueScore = trueDefect ? 0.72 + rand() * 0.22 : 0.22 + rand() * 0.28;
    const sensor = clamp(trueScore + (rand() - 0.5) * 2 * noiseScale, 0, 1);
    const rejected = sensor >= settings.threshold;
    packages.push({ index: i + 1, trueDefect, trueScore, sensor, rejected });
  }

  return { packages, metrics: summarisePackaging(packages, settings.conveyorSpeed) };
}

export function summarisePackaging(packages: PackageRecord[], conveyorSpeed: number): PackagingMetrics {
  let correctlyAccepted = 0;
  let correctlyRejected = 0;
  let unnecessaryRejects = 0;
  let missedDefects = 0;
  for (const item of packages) {
    if (!item.trueDefect && !item.rejected) correctlyAccepted += 1;
    else if (item.trueDefect && item.rejected) correctlyRejected += 1;
    else if (!item.trueDefect && item.rejected) unnecessaryRejects += 1;
    else missedDefects += 1;
  }
  const qualityIndex =
    packages.length === 0
      ? 0
      : (correctlyAccepted + correctlyRejected) / packages.length - missedDefects * 0.08;
  const throughput = Math.round(40 + conveyorSpeed * 0.9 - unnecessaryRejects * 1.4);
  return {
    correctlyAccepted,
    correctlyRejected,
    unnecessaryRejects,
    missedDefects,
    throughput: Math.max(throughput, 12),
    qualityIndex,
  };
}

export function lessonFromComparison(before: PackagingMetrics, after: PackagingMetrics) {
  const notes: string[] = [];
  if (after.unnecessaryRejects < before.unnecessaryRejects) {
    notes.push("Fewer good packs were thrown aside — the line wasted less wrapping and product.");
  } else if (after.unnecessaryRejects > before.unnecessaryRejects) {
    notes.push("More good packs were rejected. A tighter gate can look ‘safer’ while creating waste.");
  }
  if (after.missedDefects < before.missedDefects) {
    notes.push("Fewer defective packs slipped through.");
  } else if (after.missedDefects > before.missedDefects) {
    notes.push("More defects were missed. Speed or a looser threshold can hide problems.");
  }
  if (after.throughput > before.throughput && after.missedDefects > before.missedDefects) {
    notes.push("Throughput rose, but quality slipped. This prototype does not treat that as a win.");
  }
  if (notes.length === 0) {
    notes.push("The second run looked similar. Small changes can still be worth recording and re-testing.");
  }
  return notes;
}

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}
