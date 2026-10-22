export type PackOption = {
  id: string;
  name: string;
  materialGrams: number;
  protection: number;
  recyclability: string;
  illustrativeCost: number;
  notes: string;
};

export const PACK_OPTIONS: PackOption[] = [
  {
    id: "light-film",
    name: "Light film",
    materialGrams: 2.1,
    protection: 0.62,
    recyclability: "Mono-material film in some collections — check local rules.",
    illustrativeCost: 0.041,
    notes: "Uses less material, but scuffs more easily in this fictional dataset.",
  },
  {
    id: "balanced",
    name: "Balanced wrap",
    materialGrams: 2.8,
    protection: 0.84,
    recyclability: "Widely collected carton sleeve; inner film still needs checking.",
    illustrativeCost: 0.055,
    notes: "A middle path: better protection than the light film, more material than the lightest option.",
  },
  {
    id: "heavy-barrier",
    name: "Heavy barrier",
    materialGrams: 4.4,
    protection: 0.96,
    recyclability: "Mixed layers are harder to recycle in many UK collections.",
    illustrativeCost: 0.072,
    notes: "Highest protection in the set, with more material and a harder end-of-life story.",
  },
];

export function comparePacks(selectedId: string) {
  const selected = PACK_OPTIONS.find((item) => item.id === selectedId) ?? PACK_OPTIONS[1];
  const lightest = [...PACK_OPTIONS].sort((a, b) => a.materialGrams - b.materialGrams)[0];
  const toughest = [...PACK_OPTIONS].sort((a, b) => b.protection - a.protection)[0];
  return {
    selected,
    tradeoff:
      selected.id === lightest.id
        ? "You favoured less material. Check whether protection still holds in a real trial."
        : selected.id === toughest.id
          ? "You favoured protection. A real team would still ask if the extra layers are required."
          : "You chose a compromise. Real decisions need validated materials and product data.",
  };
}
