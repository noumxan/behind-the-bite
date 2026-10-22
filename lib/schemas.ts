import { z } from "zod";

export const careerFormSchema = z.object({
  id: z.string().min(2),
  title: z.string().min(3, "Add a title"),
  purpose: z.string().min(12, "Explain the role in plain language"),
  status: z.enum(["draft", "published", "archived"]),
  lastReviewed: z.string().min(8),
  sourceUrl: z.string().url().optional().or(z.literal("")),
});

export const resourceFormSchema = z.object({
  id: z.string().min(2),
  title: z.string().min(3),
  url: z.string().url("Add a real URL or leave blank").optional().or(z.literal("")),
  route: z.string().min(2),
  status: z.enum(["draft", "published", "archived"]),
  lastReviewed: z.string().min(8),
  exampleLabel: z.boolean(),
});

export const homepageSchema = z.object({
  heroEyebrow: z.string().min(2),
  heroTitle: z.string().min(8),
  heroSupport: z.string().min(12),
});
