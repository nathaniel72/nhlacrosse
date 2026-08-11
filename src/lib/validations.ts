import { z } from "zod";

export const playerLevelValues = [
  "YOUTH",
  "MIDDLE_SCHOOL",
  "HIGH_SCHOOL",
  "CLUB",
  "COLLEGE",
  "POST_COLLEGE",
] as const;

export const submissionSchema = z.object({
  athleteName: z.string().trim().min(2, "Enter the athlete's full name"),
  email: z.string().trim().email("Enter a valid email"),
  phone: z.string().trim().optional().or(z.literal("")),
  position: z.string().trim().min(1, "Select a position"),
  gradYear: z
    .string()
    .trim()
    .optional()
    .or(z.literal(""))
    .transform((v) => (v ? Number(v) : undefined)),
  level: z.enum(playerLevelValues, {
    message: "Select a playing level",
  }),
  team: z.string().trim().optional().or(z.literal("")),
  currentStick: z.string().trim().optional().or(z.literal("")),
  playingStyle: z
    .string()
    .trim()
    .min(20, "Tell us a bit more about your playing style (20+ characters)"),
  filmUrl: z
    .string()
    .trim()
    .url("Paste a valid link to your film (Hudl, YouTube, Instagram, Drive, etc.)"),
  budgetCents: z
    .string()
    .trim()
    .optional()
    .or(z.literal(""))
    .transform((v) => (v ? Math.round(Number(v) * 100) : undefined)),
  additionalNotes: z.string().trim().optional().or(z.literal("")),
});

export type SubmissionInput = z.infer<typeof submissionSchema>;

export const headOptionSchema = z.object({
  name: z.string().trim().min(2, "Enter a head name"),
  notes: z.string().trim().optional().or(z.literal("")),
  purchaseLink: z.string().trim().url("Enter a valid link").optional().or(z.literal("")),
  recommended: z.boolean().optional().default(false),
});

export const recommendationSchema = z.object({
  headOptions: z
    .array(headOptionSchema)
    .min(1, "Add at least one head option")
    .max(5, "Up to 5 head options"),
  pocketNotes: z.string().trim().min(10, "Describe the pocket recommendation"),
  stringNotes: z.string().trim().optional().or(z.literal("")),
  suggestedStringOptionIds: z.array(z.string()).optional().default([]),
  priceCents: z
    .string()
    .trim()
    .min(1, "Enter a stringing fee")
    .transform((v) => Math.round(Number(v) * 100)),
});

export type RecommendationInput = z.infer<typeof recommendationSchema>;

export const stringOptionSchema = z.object({
  name: z.string().trim().min(2, "Enter a string name"),
  color: z.string().trim().optional().or(z.literal("")),
  description: z.string().trim().optional().or(z.literal("")),
  priceCents: z
    .string()
    .trim()
    .min(1, "Enter a price")
    .transform((v) => Math.round(Number(v) * 100)),
});

export type StringOptionInput = z.infer<typeof stringOptionSchema>;

export const checkoutSelectionSchema = z.object({
  token: z.string().min(1),
  headOptionId: z.string().min(1, "Select a head"),
  stringOptionIds: z.array(z.string()).optional().default([]),
});
