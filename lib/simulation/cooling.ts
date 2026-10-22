export type CoolingSettings = {
  durationSeconds: number;
  lineSpeed: number;
};

export type CoolingOutcome = {
  consistency: number;
  energy: number;
  throughput: number;
  notes: string[];
};

/** Simplified educational model — not operating guidance. */
export function evaluateCooling(settings: CoolingSettings): CoolingOutcome {
  const { durationSeconds, lineSpeed } = settings;
  const coolNeed = 18;
  const undercool = Math.max(0, coolNeed - durationSeconds);
  const overcool = Math.max(0, durationSeconds - (coolNeed + 8));
  const speedStress = Math.max(0, lineSpeed - 60) / 40;
  const consistency = clamp(0.92 - undercool * 0.045 - speedStress * 0.18 - overcool * 0.01, 0.35, 0.98);
  const energy = clamp(0.25 + durationSeconds * 0.018 + Math.max(0, 70 - lineSpeed) * 0.004, 0.3, 1);
  const throughput = clamp(lineSpeed / 100, 0.2, 1);
  const notes: string[] = [];
  if (undercool > 2) {
    notes.push("Shorter cooling can leave the centre softer, so packs may scuff or stick.");
  }
  if (overcool > 4) {
    notes.push("Extra cooling uses more energy without much extra consistency in this model.");
  }
  if (speedStress > 0.4) {
    notes.push("A faster belt gives less time at each temperature — consistency usually suffers first.");
  }
  if (notes.length === 0) {
    notes.push("This setting keeps a workable balance between set, energy and flow in the model.");
  }
  return { consistency, energy, throughput, notes };
}

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}
