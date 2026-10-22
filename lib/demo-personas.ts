import type { ActivityState, RouteAnswers } from "./content/types";
import { defaultPlan } from "./activity";
import { recommend } from "./recommendations";

export function jordanAnswers(): RouteAnswers {
  return {
    interests: ["fixing"],
    experience: "starting-out",
    learningRoute: "earn-while-learn",
    location: "Midlands",
    travel: "local",
    support: ["first-step", "someone-to-ask", "travel"],
    updatedAt: new Date().toISOString(),
  };
}

export function graduateAnswers(): RouteAnswers {
  return {
    interests: ["coding", "sustainability"],
    experience: "graduate",
    learningRoute: "short-courses",
    location: "North West",
    travel: "regional",
    support: ["qualifications", "work-environment"],
    updatedAt: new Date().toISOString(),
  };
}

export function personaActivity(
  answers: RouteAnswers,
  extraEvents: ActivityState["events"] = [],
): ActivityState {
  const recs = recommend(answers);
  return {
    events: extraEvents,
    routeDraft: { ...answers, step: 6 },
    routeResult: answers,
    plan: {
      ...defaultPlan,
      roles: recs.slice(0, 1).map((item) => item.career),
      updatedAt: new Date().toISOString(),
    },
    reducedMotion: null,
  };
}
