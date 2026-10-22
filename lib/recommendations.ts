import type { CareerSlug, InterestId, RouteAnswers } from "./content/types";

export type Recommendation = {
  career: CareerSlug;
  why: string[];
  check: string[];
  nextStep: string;
};

const INTEREST_TO_CAREER: Record<InterestId, CareerSlug[]> = {
  coding: ["automation-controls", "software-data"],
  fixing: ["mechanical-maintenance", "electrical"],
  sustainability: ["process", "packaging"],
  design: ["packaging", "process"],
  "sensors-signals": ["automation-controls", "electrical", "software-data"],
  "fixing-equipment": ["mechanical-maintenance", "electrical"],
  "design-improvement": ["packaging", "process"],
  "food-process": ["process", "packaging"],
};

export function recommendFromInterests(
  interests: InterestId[],
  answers?: Partial<import("./content/types").RouteAnswers>,
) {
  return recommend({
    interests,
    experience: answers?.experience ?? "unsure",
    learningRoute: answers?.learningRoute ?? "unsure",
    location: answers?.location,
    travel: answers?.travel ?? "unsure",
    support: answers?.support ?? ["unsure"],
    updatedAt: answers?.updatedAt ?? "",
  });
}

export function recommend(answers: RouteAnswers): Recommendation[] {
  const scores = new Map<CareerSlug, { score: number; why: string[] }>();
  const bump = (career: CareerSlug, amount: number, reason: string) => {
    const current = scores.get(career) ?? { score: 0, why: [] };
    current.score += amount;
    if (!current.why.includes(reason)) current.why.push(reason);
    scores.set(career, current);
  };

  for (const interest of answers.interests) {
    for (const career of INTEREST_TO_CAREER[interest]) {
      bump(career, 2, `You marked an interest that often shows up in this kind of work.`);
    }
  }

  if (answers.experience === "starting-out" || answers.experience === "college") {
    bump("mechanical-maintenance", 2, "Hands-on technician and apprenticeship routes can start without a degree.");
    bump("electrical", 1, "Electrical maintenance apprenticeships are a common earn-while-you-learn path.");
    bump("automation-controls", 1, "Some people grow into controls after time on the tools.");
  }
  if (answers.experience === "student" || answers.experience === "graduate") {
    bump("process", 2, "Degree and placement routes often map onto process improvement work.");
    bump("software-data", 2, "Computing study can connect to manufacturing systems and data.");
    bump("automation-controls", 1, "Mechatronics and electrical study often leads here.");
  }
  if (answers.experience === "unsure") {
    bump("mechanical-maintenance", 1, "A practical first look can help you decide without committing to a degree story.");
    bump("packaging", 1, "Packaging sits between making, design and materials — useful if you are still exploring.");
  }
  if (answers.learningRoute === "earn-while-learn") {
    bump("mechanical-maintenance", 2, "You preferred earning while learning.");
    bump("electrical", 1, "Apprenticeships are a frequent electrical entry route.");
  }
  if (answers.learningRoute === "full-time-study") {
    bump("process", 1, "You preferred a study-led route.");
    bump("software-data", 1, "University routes are common for software and data roles.");
  }
  if (answers.travel === "local") {
    bump("mechanical-maintenance", 1, "Site-based maintenance roles are often advertised locally — still verify travel.");
  }

  const ranked = [...scores.entries()]
    .sort((a, b) => b[1].score - a[1].score)
    .slice(0, 3)
    .map(([career, value]) => ({
      career,
      why: value.why.slice(0, 3),
      check: checksFor(career, answers),
      nextStep: nextStepFor(career, answers),
    }));

  if (ranked.length === 0) {
    return [
      {
        career: "mechanical-maintenance",
        why: ["A practical starting point when preferences are still open."],
        check: checksFor("mechanical-maintenance", answers),
        nextStep: nextStepFor("mechanical-maintenance", answers),
      },
      {
        career: "process",
        why: ["Useful if you like seeing how small changes affect a whole recipe."],
        check: checksFor("process", answers),
        nextStep: nextStepFor("process", answers),
      },
    ];
  }
  return ranked;
}

function checksFor(career: CareerSlug, answers: RouteAnswers) {
  const items = [
    "Confirm current entry requirements with an official listing — they vary by employer and year.",
    answers.travel === "local"
      ? "Check travel time, shift pattern and whether transport support exists."
      : "Ask how often the role needs site presence versus remote or office days.",
  ];
  if (answers.experience === "starting-out") {
    items.push("Ask whether paid experience is required, or whether training is provided.");
  }
  if (career === "electrical") {
    items.push("Electrical competence is signed off carefully — ask how training is structured.");
  }
  return items;
}

function nextStepFor(career: CareerSlug, answers: RouteAnswers) {
  if (answers.experience === "starting-out") {
    return "Talk with National Careers Service or a local adviser, then try one related mission.";
  }
  if (career === "packaging") return "Complete Waste-Smart Design and save the packaging engineer profile.";
  if (career === "process") return "Run the Cooling Challenge and note one question about trials.";
  return "Play Packaging Detective, then save this role to your next-steps plan.";
}

export function supporterSummary(args: {
  careers: Array<{ title: string; why: string[] }>;
  answers: RouteAnswers;
}) {
  const interestText =
    args.answers.interests.length > 0
      ? `Interests selected: ${args.answers.interests.join(", ")}.`
      : "Interests were left open.";
  const careerText = args.careers
    .map((item) => `${item.title} — ${item.why[0] ?? "Shown as a possible area to investigate."}`)
    .join(" ");
  const route =
    args.answers.learningRoute === "earn-while-learn"
      ? "They would like to earn while learning if a route exists."
      : args.answers.learningRoute === "full-time-study"
        ? "They are considering a study-led route."
        : "They are still choosing how they want to learn.";
  return [
    "This is a discussion note from the Behind the Bite demo, not an application or assessment.",
    `Experience described: ${args.answers.experience.replace("-", " ")}. ${interestText}`,
    careerText,
    route,
    "Useful questions: What does a first week look like? Is travel support available? What must be verified before applying?",
  ].join("\n\n");
}
