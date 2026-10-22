import type {
  CareerProfile,
  CmsState,
  HomepageContent,
  MissionProfile,
  OpportunityItem,
  Product,
  ResourceItem,
  Station,
} from "./types";

export const DISCLAIMER =
  "Independent hackathon prototype inspired by a food manufacturing outreach brief. Not affiliated with, endorsed by, or connected to Mondelēz International or any employer systems.";

export const DEMO_BANNER = "Demo workspace — changes are saved in this browser.";

const stations: Record<string, Station> = {
  mixing: {
    id: "mixing" as const,
    title: "Mixing",
    whatHappens:
      "Ingredients are weighed and combined so each batch starts with a consistent recipe.",
    engineerLooksAt:
      "Whether mixers keep a steady texture, and what happens if a weighing unit drifts.",
    tools: ["Recipe controls", "Weighing systems", "Batch records"],
    relatedCareer: "process" as const,
    relatedMission: "cooling-challenge" as const,
    whyItMatters:
      "A small change at the start of the line can affect every bar, biscuit or pouch that follows.",
    technicalNote:
      "Process engineers often look at mass balance, residence time and how recipe changes affect viscosity.",
    interests: ["fixing", "sustainability"],
  },
  thermal: {
    id: "thermal" as const,
    title: "Heating and cooling",
    whatHappens:
      "The product is warmed or cooled so it sets with the right snap, crumb or filling.",
    engineerLooksAt:
      "How long the product spends in a cooler, and whether speed is fighting consistency.",
    tools: ["Temperature sensors", "Cooling tunnels", "Energy meters"],
    relatedCareer: "process" as const,
    relatedMission: "cooling-challenge" as const,
    whyItMatters:
      "Temperature control protects texture and can reduce wasted energy from over-cooling.",
    technicalNote:
      "Heat transfer, line speed and cooling duration sit in tension; faster is not always better.",
    interests: ["sustainability", "coding"],
  },
  automation: {
    id: "automation" as const,
    title: "Equipment and automation",
    whatHappens:
      "Motors, sensors and control software keep the line moving without constant hand-steering.",
    engineerLooksAt:
      "Alarms, timing, and whether a machine is stopping for a real problem or a noisy signal.",
    tools: ["PLCs", "HMI screens", "Motor drives"],
    relatedCareer: "automation-controls" as const,
    relatedMission: "packaging-detective" as const,
    whyItMatters:
      "Reliable automation keeps people safer and products more consistent.",
    technicalNote:
      "Controls engineers tune loops, interlocks and fault logic so equipment fails in a predictable way.",
    interests: ["coding", "fixing"],
  },
  quality: {
    id: "quality" as const,
    title: "Quality inspection",
    whatHappens:
      "Cameras and sensors check weight, seal, shape or foreign objects before packing.",
    engineerLooksAt:
      "False alarms versus missed defects — both are costly in different ways.",
    tools: ["Vision systems", "Checkweighers", "Sample plans"],
    relatedCareer: "electrical" as const,
    relatedMission: "packaging-detective" as const,
    whyItMatters:
      "Inspection protects people eating the product and reduces unnecessary waste.",
    technicalNote:
      "Thresholds, lighting and sampling strategy decide how a sensor ‘sees’ the line.",
    interests: ["coding", "design"],
  },
  packaging: {
    id: "packaging" as const,
    title: "Packaging",
    whatHappens:
      "Wrappers, cartons or pouches protect the product for the journey from factory to snack.",
    engineerLooksAt:
      "Seals, material use, and how a pack change might affect speed or recyclability.",
    tools: ["Flow wrappers", "Pack specifications", "Material trials"],
    relatedCareer: "packaging" as const,
    relatedMission: "waste-smart-design" as const,
    whyItMatters:
      "Packaging has to protect food, run on real machines, and use materials thoughtfully.",
    technicalNote:
      "Packaging engineers balance barrier properties, machineability and end-of-life options.",
    interests: ["design", "sustainability"],
  },
};

export const seedProducts: Product[] = [
  {
    id: "chocolate-bar",
    name: "Chocolate bar",
    tagline: "A familiar snack with a full factory story.",
    description:
      "Follow a chocolate bar from mixing to wrap. This is the complete demonstration journey.",
    flavour: "Cocoa, snap, foil wrap",
    featured: true,
    stations: [
      stations.mixing,
      stations.thermal,
      stations.automation,
      stations.quality,
      stations.packaging,
    ],
  },
  {
    id: "biscuit",
    name: "Biscuit",
    tagline: "A shorter look at dough, bake and pack.",
    description:
      "A compact journey through forming, baking and wrapping a biscuit.",
    flavour: "Crisp crumb, oven heat",
    featured: false,
    stations: [
      { ...stations.mixing, whatHappens: "Flour, fat and sugar are mixed into a dough with a target texture." },
      {
        ...stations.thermal,
        title: "Baking and cooling",
        whatHappens: "The biscuit bakes, then cools so it can be handled without breaking.",
      },
      stations.quality,
      stations.packaging,
    ],
  },
  {
    id: "wrapped-snack",
    name: "Wrapped snack",
    tagline: "A pouch line focused on seals and speed.",
    description:
      "A shorter journey about filling, sealing and checking a wrapped snack.",
    flavour: "Crunch, film, date code",
    featured: false,
    stations: [
      stations.automation,
      stations.quality,
      stations.packaging,
      {
        ...stations.mixing,
        title: "Filling",
        whatHappens: "A measured portion is dropped or deposited into the pack.",
        relatedCareer: "mechanical-maintenance",
      },
    ],
  },
  {
    id: "sandwich-biscuit",
    name: "Sandwich biscuit",
    tagline: "Peel back the layers of a familiar favourite.",
    description:
      "A layered look at mixing, baking, filling, inspection and wrapping — the same content in a picture or a list.",
    flavour: "Crisp biscuit, cream filling, printed wrap",
    featured: true,
    stations: [
      stations.mixing,
      stations.thermal,
      stations.quality,
      stations.automation,
      stations.packaging,
    ],
  },
];

export const seedCareers: CareerProfile[] = [
  {
    id: "automation-controls",
    title: "Automation and controls engineer",
    purpose:
      "Help factory equipment listen, decide and move — so a line runs safely and consistently.",
    dailyTasks: [
      "Investigate why a sensor is rejecting good product.",
      "Adjust control logic after talking with operators.",
      "Test a change on a quiet shift, then watch the next batch.",
    ],
    tools: ["PLC software", "Sensor diagnostics", "Line trend charts"],
    environment: [
      "Time split between a control room, the factory floor and a laptop.",
      "Hearing protection and high-visibility clothing on the line.",
      "Shift cover can be part of some roles — always ask.",
    ],
    relatedMissions: ["packaging-detective"],
    entryRoutes: [
      "Apprenticeship in electrical or control systems.",
      "HNC/HND or degree in electrical, mechatronics or related subjects.",
      "Technician roles that grow into engineering with support.",
    ],
    questionsToAsk: [
      "How much time is spent on the factory floor versus at a desk?",
      "What training is offered in the first six months?",
      "How are night or weekend cover handled?",
    ],
    nextSteps: [
      "Try the Packaging Detective mission.",
      "Write down two questions for a careers adviser.",
      "Look up an apprenticeship listing on an official careers site.",
    ],
    illustrativePersona: {
      name: "Sam (illustrative persona)",
      summary:
        "Started as a maintenance technician, then learned PLC basics on the job with a mentor.",
    },
    status: "published",
    lastReviewed: "2026-10-01",
    sourceUrl: "https://www.tomorrowsengineers.org.uk/",
  },
  {
    id: "mechanical-maintenance",
    title: "Mechanical maintenance engineer",
    purpose:
      "Keep mixers, conveyors and wrappers running, and find the cause when they do not.",
    dailyTasks: [
      "Diagnose a noisy gearbox before it fails.",
      "Plan a planned stop so parts are ready.",
      "Work with operators who noticed a change first.",
    ],
    tools: ["Hand tools", "Vibration clues", "Work orders"],
    environment: [
      "Hands-on, often on the factory floor.",
      "Physical work with safe lifting and lock-off procedures.",
      "Team-based, with radio or tablet job lists.",
    ],
    relatedMissions: ["packaging-detective", "cooling-challenge"],
    entryRoutes: [
      "Engineering maintenance apprenticeship.",
      "College engineering course plus site experience.",
      "Entry technician programmes — verify current requirements.",
    ],
    questionsToAsk: [
      "Is there a buddy system for new starters?",
      "What personal protective equipment is provided?",
      "How are training days scheduled around shifts?",
    ],
    nextSteps: [
      "Explore the biscuit factory map.",
      "Ask an adviser about local apprenticeships.",
      "List tools you already enjoy using.",
    ],
    status: "published",
    lastReviewed: "2026-10-01",
  },
  {
    id: "process",
    title: "Process engineer",
    purpose:
      "Improve how a recipe becomes a consistent product — temperature, time, flow and yield.",
    dailyTasks: [
      "Compare two cooling settings with quality results.",
      "Reduce waste from a step that over-trims or over-cools.",
      "Explain a trial in plain language to the team.",
    ],
    tools: ["Trend data", "Trial plans", "Mass and energy sketches"],
    environment: [
      "Office plus plant time.",
      "Collaboration with quality, operations and engineering.",
    ],
    relatedMissions: ["cooling-challenge"],
    entryRoutes: [
      "Chemical, food or manufacturing engineering study.",
      "Laboratory or quality technician pathways.",
      "Graduate programmes — check official employer pages.",
    ],
    questionsToAsk: [
      "How are trials approved before they run?",
      "Who owns quality decisions on the line?",
      "Is there support for professional registration later?",
    ],
    nextSteps: [
      "Play the Cooling Challenge.",
      "Read a process engineer profile with someone who supports you.",
    ],
    status: "published",
    lastReviewed: "2026-10-01",
  },
  {
    id: "packaging",
    title: "Packaging engineer",
    purpose:
      "Design packs that protect food, run on machines, and use materials with care.",
    dailyTasks: [
      "Compare two film options for seal strength and material use.",
      "Watch a wrapper when a new pack size is trialled.",
      "Work with sustainability and quality colleagues.",
    ],
    tools: ["Pack specifications", "Material data sheets", "Line trials"],
    environment: [
      "Lab, desk and factory trials.",
      "Detail-focused work with lots of collaboration.",
    ],
    relatedMissions: ["waste-smart-design"],
    entryRoutes: [
      "Packaging technology, materials or mechanical study.",
      "Quality or design technician routes.",
    ],
    questionsToAsk: [
      "How do you test a pack change before a full launch?",
      "Who decides trade-offs between protection and material use?",
    ],
    nextSteps: [
      "Try Waste-Smart Design.",
      "Visit a verified careers page about packaging technology.",
    ],
    status: "published",
    lastReviewed: "2026-10-01",
  },
  {
    id: "software-data",
    title: "Manufacturing software and data engineer",
    purpose:
      "Help factories see what the line is doing, using software, data and clear dashboards.",
    dailyTasks: [
      "Trace why a timestamp does not match a reject event.",
      "Build a view that operators actually use.",
      "Keep plant systems talking to each other safely.",
    ],
    tools: ["SQL or similar queries", "Line event logs", "Version control"],
    environment: [
      "Mostly desk-based with plant visits.",
      "Close work with controls, quality and IT security rules.",
    ],
    relatedMissions: ["packaging-detective"],
    entryRoutes: [
      "Computing, data or software study.",
      "Internal graduate or placement programmes — verify listings.",
      "Analyst roles that grow toward manufacturing systems.",
    ],
    questionsToAsk: [
      "How much time is spent with operators versus in code?",
      "What does a typical first project look like?",
    ],
    nextSteps: [
      "Complete Packaging Detective and notice the metrics.",
      "Save a question about data on the factory floor.",
    ],
    status: "published",
    lastReviewed: "2026-10-01",
    sourceUrl: "https://www.prospects.ac.uk/",
  },
  {
    id: "electrical",
    title: "Electrical engineer",
    purpose:
      "Keep power, sensors and safety circuits healthy so machines can be trusted.",
    dailyTasks: [
      "Investigate a sensor that flickers at a certain speed.",
      "Support a shutdown with electrical isolation.",
      "Specify a replacement part that still meets safety rules.",
    ],
    tools: ["Multimeters", "Electrical drawings", "Safety procedures"],
    environment: [
      "Factory floor with strict isolation rules.",
      "Documentation is part of the job, not an extra.",
    ],
    relatedMissions: ["packaging-detective"],
    entryRoutes: [
      "Electrical apprenticeship.",
      "HNC/HND or degree in electrical engineering.",
    ],
    questionsToAsk: [
      "What qualifications are required on this site?",
      "How is competence signed off before unsupervised work?",
    ],
    nextSteps: [
      "Open the quality station on the chocolate map.",
      "Talk with an adviser about electrical apprenticeships.",
    ],
    status: "published",
    lastReviewed: "2026-10-01",
  },
];

export const seedMissions: MissionProfile[] = [
  {
    id: "packaging-detective",
    title: "Packaging Detective",
    duration: "About 3 minutes",
    whatYouWillTry:
      "Watch a wrapping line, inspect sensor readings, test a threshold and compare results.",
    relatedRoles: ["automation-controls", "electrical", "software-data"],
    href: "/missions/packaging-detective",
    polished: true,
    status: "published",
    lastReviewed: "2026-10-08",
  },
  {
    id: "cooling-challenge",
    title: "Cooling Challenge",
    duration: "About 2 minutes",
    whatYouWillTry:
      "Adjust cooling time and line speed, then see illustrative effects on consistency, energy and throughput.",
    relatedRoles: ["process"],
    href: "/missions/cooling-challenge",
    polished: true,
    status: "published",
    lastReviewed: "2026-10-08",
  },
  {
    id: "waste-smart-design",
    title: "Waste-Smart Design",
    duration: "About 2 minutes",
    whatYouWillTry:
      "Compare three fictional pack options across material, protection, recyclability notes and illustrative cost.",
    relatedRoles: ["packaging"],
    href: "/missions/waste-smart-design",
    polished: true,
    status: "published",
    lastReviewed: "2026-10-08",
  },
];

export const seedResources: ResourceItem[] = [
  {
    id: "ucas",
    title: "UCAS — explore courses and apprenticeships",
    audience: ["student", "college", "graduate"],
    route: "Study and apprenticeships",
    url: "https://www.ucas.com/",
    status: "published",
    lastReviewed: "2026-09-15",
    exampleLabel: false,
  },
  {
    id: "find-apprenticeship",
    title: "Find an apprenticeship (GOV.UK)",
    audience: ["starting-out", "college"],
    route: "Earn while you learn",
    url: "https://www.gov.uk/apply-apprenticeship",
    status: "published",
    lastReviewed: "2026-09-15",
    exampleLabel: false,
  },
  {
    id: "national-careers",
    title: "National Careers Service",
    audience: ["starting-out", "unsure", "college"],
    route: "Talk to someone",
    url: "https://nationalcareers.service.gov.uk/",
    status: "published",
    lastReviewed: "2026-09-15",
    exampleLabel: false,
  },
  {
    id: "tomorrows-engineers",
    title: "EngineeringUK / Tomorrow’s Engineers",
    audience: ["student", "college", "starting-out"],
    route: "Understand engineering careers",
    url: "https://www.engineeringuk.com/",
    status: "published",
    lastReviewed: "2026-09-20",
    exampleLabel: false,
  },
  {
    id: "demo-open-day",
    title: "Site open-day briefing (demonstration resource)",
    audience: ["starting-out", "unsure"],
    route: "Visit and ask",
    url: "",
    status: "published",
    lastReviewed: "2026-05-01",
    exampleLabel: true,
    notes: "No live URL — labelled demonstration content only.",
  },
];

export const seedOpportunities: OpportunityItem[] = [
  {
    id: "opp-apprentice-controls",
    title: "Maintenance and controls apprenticeship (illustrative)",
    organisation: "Example food manufacturer — demonstration only",
    summary:
      "A made-up example of an earn-while-you-learn route supporting mixers, wrappers and sensors.",
    url: "https://www.gov.uk/apply-apprenticeship",
    relatedCareers: ["automation-controls", "mechanical-maintenance", "electrical"],
    status: "published",
    lastReviewed: "2026-09-01",
    exampleLabel: true,
  },
  {
    id: "opp-grad-process",
    title: "Process improvement placement (illustrative)",
    organisation: "Example manufacturing graduate programme — demonstration only",
    summary:
      "A fictional placement focused on cooling, yield and quality trials. Verify any real listing.",
    url: "https://www.prospects.ac.uk/",
    relatedCareers: ["process", "software-data"],
    status: "published",
    lastReviewed: "2026-09-01",
    exampleLabel: true,
  },
];

export const seedHomepage: HomepageContent = {
  heroEyebrow: "Behind the Bite",
  heroTitle: "Your favourite snack.\nYour unexpected future.",
  heroSupport:
    "Discover the people, technology and engineering behind every bite — and find a way in that works for you.",
  featuredProduct: "chocolate-bar",
  featuredMission: "packaging-detective",
  disclaimer: DISCLAIMER,
};

export const seedSupportResources = [
  {
    id: "access-to-work",
    title: "Access to Work (GOV.UK)",
    body: "Official information about workplace support that an individual can explore privately.",
    url: "https://www.gov.uk/access-to-work",
    status: "published" as const,
    lastReviewed: "2026-09-15",
    sourceLabel: "GOV.UK",
    exampleLabel: false,
  },
  {
    id: "equality-advisory",
    title: "Equality Advisory and Support Service",
    body: "Independent information about rights at work. Not an employer adjustment promise.",
    url: "https://www.equalityadvisoryservice.com/",
    status: "published" as const,
    lastReviewed: "2026-09-15",
    sourceLabel: "EASS",
    exampleLabel: false,
  },
];

export const seedCms: CmsState = {
  careers: seedCareers,
  missions: seedMissions,
  resources: seedResources,
  opportunities: seedOpportunities,
  homepage: seedHomepage,
  products: seedProducts,
  supportResources: seedSupportResources,
};

export const SAMPLE_COHORT = {
  label: "Sample cohort",
  source: "synthetic" as const,
  visitors: 420,
  explorerStarts: 286,
  missionStarts: 174,
  missionCompletions: 118,
  routeCompletions: 79,
  resourceClicks: 64,
  savedPlans: 41,
  byAudience: [
    { id: "starting-out", label: "Starting out", count: 132 },
    { id: "student", label: "Student", count: 148 },
    { id: "graduate", label: "Graduate", count: 86 },
    { id: "unsure", label: "Unsure", count: 54 },
  ],
  supportThemes: [
    { id: "travel", label: "Travel and getting there", count: 91 },
    { id: "qualifications", label: "Understanding qualifications", count: 118 },
    { id: "work-environment", label: "Work environment and shifts", count: 77 },
    { id: "first-step", label: "Confidence taking the first step", count: 104 },
    { id: "someone-to-ask", label: "Finding someone to ask", count: 96 },
  ],
  missionInsights: [
    {
      id: "packaging-detective",
      starts: 98,
      completions: 71,
      retries: 44,
      hints: 39,
      stopAfterObserve: 12,
      commonChoice: "Threshold is too tight",
      understandingBefore: 2.4,
      understandingAfter: 3.8,
    },
    {
      id: "cooling-challenge",
      starts: 46,
      completions: 31,
      retries: 18,
      hints: 11,
      stopAfterObserve: 8,
      commonChoice: "Slower line, longer cool",
      understandingBefore: 2.6,
      understandingAfter: 3.5,
    },
    {
      id: "waste-smart-design",
      starts: 30,
      completions: 16,
      retries: 7,
      hints: 9,
      stopAfterObserve: 6,
      commonChoice: "Balanced film",
      understandingBefore: 2.8,
      understandingAfter: 3.6,
    },
  ],
};
