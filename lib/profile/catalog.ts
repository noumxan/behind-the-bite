import type { InterestId } from "../content/types";

export const INTEREST_OPTIONS: { id: InterestId; label: string; short: string }[] = [
  { id: "sensors-signals", label: "I like sensors and signals", short: "Sensors and signals" },
  { id: "fixing-equipment", label: "I like fixing equipment", short: "Fixing equipment" },
  { id: "design-improvement", label: "I like designing improvements", short: "Designing improvements" },
  { id: "food-process", label: "I like understanding how food is made", short: "How food is made" },
  { id: "coding", label: "I like coding", short: "Coding" },
  { id: "fixing", label: "I like fixing things", short: "Fixing things" },
  { id: "sustainability", label: "I care about sustainability", short: "Sustainability" },
  { id: "design", label: "I enjoy design", short: "Design" },
];

export const SUPPORT_PREFERENCE_OPTIONS = [
  { id: "quieter-spaces", label: "I may need quieter spaces" },
  { id: "reduced-motion", label: "Prefer reduced motion on this site" },
  { id: "larger-text", label: "Prefer larger text on this site" },
  { id: "roomy-spacing", label: "Prefer more space between controls" },
  { id: "interview-access", label: "I want information about interview accessibility" },
  { id: "workplace-adjustments", label: "I want to know who to ask about workplace adjustments" },
  { id: "alt-assessment", label: "I want to know if assessments can be done another way" },
  { id: "none", label: "None of these right now" },
  { id: "prefer-not", label: "Prefer not to say" },
] as const;

export type SupportPreferenceId = (typeof SUPPORT_PREFERENCE_OPTIONS)[number]["id"];

export const PRACTICAL_QUESTIONS = [
  "What does a typical working environment look like?",
  "Does this role involve shifts or travel?",
  "Are there quieter spaces available?",
  "Can you explain the physical tasks involved?",
  "What accessibility arrangements are available for interviews?",
  "Who can I speak to about workplace adjustments?",
  "Are there alternative ways to complete an assessment?",
  "Can you explain the entry requirements in simpler language?",
];

export const MESSAGE_CATEGORIES = [
  { id: "getting-started", label: "Getting started" },
  { id: "entry-requirements", label: "Entry requirements" },
  { id: "understanding-role", label: "Understanding a role" },
  { id: "apprenticeships", label: "Apprenticeships and study routes" },
  { id: "workplace-support", label: "Workplace support" },
  { id: "travel-hours", label: "Travel and working hours" },
  { id: "website-access", label: "Website accessibility" },
  { id: "other", label: "Other" },
] as const;

export type MessageCategory = (typeof MESSAGE_CATEGORIES)[number]["id"];

export const MESSAGE_LANGUAGES = [
  { id: "en", native: "English" },
  { id: "cy", native: "Cymraeg" },
  { id: "pl", native: "Polski" },
] as const;

export type MessageLanguage = (typeof MESSAGE_LANGUAGES)[number]["id"];
