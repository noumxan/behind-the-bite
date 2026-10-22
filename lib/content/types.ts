export type ProductId = "chocolate-bar" | "biscuit" | "wrapped-snack" | "sandwich-biscuit";
export type StationId = "mixing" | "thermal" | "automation" | "quality" | "packaging";
export type LayerId =
  | "mixing-forming"
  | "baking-cooling"
  | "filling-cream"
  | "automation-inspection"
  | "wrapping-packing";
export type InterestId =
  | "coding"
  | "fixing"
  | "sustainability"
  | "design"
  | "sensors-signals"
  | "fixing-equipment"
  | "design-improvement"
  | "food-process";
export type WorkspaceId = "visitor" | "jordan" | "graduate";
export type CareerSlug =
  | "automation-controls"
  | "mechanical-maintenance"
  | "process"
  | "packaging"
  | "software-data"
  | "electrical";
export type MissionSlug = "packaging-detective" | "cooling-challenge" | "waste-smart-design";
export type PublishStatus = "draft" | "published" | "archived";
export type AudienceTag = "starting-out" | "college" | "student" | "graduate" | "unsure";

export type Station = {
  id: StationId;
  title: string;
  whatHappens: string;
  engineerLooksAt: string;
  tools: string[];
  relatedCareer: CareerSlug;
  relatedMission: MissionSlug;
  whyItMatters: string;
  technicalNote: string;
  interests: InterestId[];
};

export type Product = {
  id: ProductId;
  name: string;
  tagline: string;
  description: string;
  flavour: string;
  stations: Station[];
  featured: boolean;
};

export type CareerProfile = {
  id: CareerSlug;
  title: string;
  purpose: string;
  dailyTasks: string[];
  tools: string[];
  environment: string[];
  relatedMissions: MissionSlug[];
  entryRoutes: string[];
  questionsToAsk: string[];
  nextSteps: string[];
  illustrativePersona?: {
    name: string;
    summary: string;
  };
  status: PublishStatus;
  lastReviewed: string;
  sourceUrl?: string;
};

export type MissionProfile = {
  id: MissionSlug;
  title: string;
  duration: string;
  whatYouWillTry: string;
  relatedRoles: CareerSlug[];
  href: string;
  polished: boolean;
  status: PublishStatus;
  lastReviewed: string;
};

export type ResourceItem = {
  id: string;
  title: string;
  audience: AudienceTag[];
  route: string;
  url: string;
  status: PublishStatus;
  lastReviewed: string;
  exampleLabel: boolean;
  notes?: string;
};

export type OpportunityItem = {
  id: string;
  title: string;
  organisation: string;
  summary: string;
  url: string;
  relatedCareers: CareerSlug[];
  status: PublishStatus;
  lastReviewed: string;
  exampleLabel: true;
};

export type HomepageContent = {
  heroEyebrow: string;
  heroTitle: string;
  heroSupport: string;
  featuredProduct: ProductId;
  featuredMission: MissionSlug;
  disclaimer: string;
};

export type SupportResource = {
  id: string;
  title: string;
  body: string;
  url: string;
  status: PublishStatus;
  lastReviewed: string;
  sourceLabel: string;
  exampleLabel: boolean;
};

export type CmsState = {
  careers: CareerProfile[];
  missions: MissionProfile[];
  resources: ResourceItem[];
  opportunities: OpportunityItem[];
  homepage: HomepageContent;
  products: Product[];
  supportResources: SupportResource[];
};

export type RouteAnswers = {
  interests: InterestId[];
  experience: "starting-out" | "college" | "student" | "graduate" | "unsure";
  learningRoute: "earn-while-learn" | "full-time-study" | "short-courses" | "unsure";
  location?: string;
  travel: "local" | "regional" | "flexible" | "unsure";
  support: Array<
    "travel" | "qualifications" | "work-environment" | "first-step" | "someone-to-ask" | "unsure"
  >;
  updatedAt: string;
};

export type SavedPlan = {
  roles: CareerSlug[];
  resources: string[];
  actions: Record<string, boolean>;
  supporterNote: string;
  updatedAt: string;
};

export type AnalyticsEvent = {
  id: string;
  name:
    | "visit"
    | "explore_start"
    | "station_open"
    | "mission_start"
    | "mission_complete"
    | "mission_retry"
    | "hint_used"
    | "walkthrough_used"
    | "route_start"
    | "route_complete"
    | "resource_click"
    | "plan_save"
    | "role_save"
    | "choice"
    | "layer_open"
    | "interest_save"
    | "interest_remove"
    | "question_save"
    | "message_sent"
    | "admin_replied";
  at: string;
  uniqueKey?: string;
  payload?: Record<string, string | number | boolean>;
};

export type ActivityState = {
  events: AnalyticsEvent[];
  routeDraft: Partial<RouteAnswers> & { step?: number };
  routeResult?: RouteAnswers;
  plan: SavedPlan;
  reducedMotion: boolean | null;
};

export type AppSettings = {
  disclaimerAccepted: boolean;
};
