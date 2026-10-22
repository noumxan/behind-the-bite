import type { CareerSlug, InterestId, LayerId, MissionSlug } from "./types";

export type BiscuitLayer = {
  id: LayerId;
  title: string;
  shortLabel: string;
  whatHappens: string;
  engineerLooksAt: string;
  tools: string[];
  relatedCareer: CareerSlug;
  relatedMission: MissionSlug;
  whyItMatters: string;
  technicalNote: string;
  interests: InterestId[];
};

export const BISCUIT_LAYERS: BiscuitLayer[] = [
  {
    id: "mixing-forming",
    title: "Mixing and forming",
    shortLabel: "Dough",
    whatHappens: "Flour, fat and sugar become a dough that is rolled and cut into biscuit shapes.",
    engineerLooksAt: "Whether the dough thickness stays even, and what happens if a roller drifts.",
    tools: ["Forming rolls", "Recipe controls", "Thickness gauges"],
    relatedCareer: "process",
    relatedMission: "cooling-challenge",
    whyItMatters: "An uneven start makes every later layer harder to keep consistent.",
    technicalNote: "Process engineers watch moisture, temperature and line speed together.",
    interests: ["food-process", "fixing-equipment"],
  },
  {
    id: "baking-cooling",
    title: "Baking and cooling",
    shortLabel: "Bake",
    whatHappens: "The biscuit bakes, then cools so it can be handled and filled without crumbling.",
    engineerLooksAt: "Oven zones, cooling time, and whether a faster belt fights the bake.",
    tools: ["Oven profiles", "Temperature sensors", "Cooling conveyors"],
    relatedCareer: "process",
    relatedMission: "cooling-challenge",
    whyItMatters: "Texture and energy use are decided here as much as flavour is.",
    technicalNote: "Heat transfer and residence time sit in tension with throughput.",
    interests: ["food-process", "sustainability"],
  },
  {
    id: "filling-cream",
    title: "Filling",
    shortLabel: "Cream",
    whatHappens: "A measured cream or filling is deposited between biscuit halves.",
    engineerLooksAt: "Deposit weight, smear, and whether a nozzle is starting to block.",
    tools: ["Depositors", "Checkweighers", "Hygienic design notes"],
    relatedCareer: "mechanical-maintenance",
    relatedMission: "packaging-detective",
    whyItMatters: "Too little filling disappoints; too much creates waste and sticky machines.",
    technicalNote: "Mechanical and process colleagues often share this station.",
    interests: ["fixing-equipment", "design-improvement"],
  },
  {
    id: "automation-inspection",
    title: "Automation and inspection",
    shortLabel: "Sensors",
    whatHappens:
      "Cameras and sensors check shape, fill and wrap readiness. Control software decides what continues down the line.",
    engineerLooksAt:
      "Whether a reject is a real problem or a noisy signal, and how thresholds are set.",
    tools: ["Vision systems", "PLCs", "Trend charts"],
    relatedCareer: "automation-controls",
    relatedMission: "packaging-detective",
    whyItMatters: "Good inspection protects people eating the biscuit and reduces unnecessary waste.",
    technicalNote: "Controls and electrical engineers tune lighting, thresholds and fault logic.",
    interests: ["sensors-signals", "coding"],
  },
  {
    id: "wrapping-packing",
    title: "Wrapping and packing",
    shortLabel: "Wrap",
    whatHappens: "Each sandwich is wrapped, coded and packed so it survives the journey to a shop.",
    engineerLooksAt: "Seal quality, film use, and how a pack change might affect speed.",
    tools: ["Flow wrappers", "Date coders", "Pack specifications"],
    relatedCareer: "packaging",
    relatedMission: "waste-smart-design",
    whyItMatters: "The wrap has to protect food, run on real machines, and use materials thoughtfully.",
    technicalNote: "Packaging engineers balance barrier, machineability and end-of-life options.",
    interests: ["design-improvement", "design", "sustainability"],
  },
];
