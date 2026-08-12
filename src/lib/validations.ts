import { z } from "zod";

export const playerLevelValues = [
  "YOUTH",
  "MIDDLE_SCHOOL",
  "HIGH_SCHOOL",
  "CLUB",
  "COLLEGE",
  "POST_COLLEGE",
] as const;

export const serviceTypeValues = ["NEW_HEAD", "RESTRING_ONLY"] as const;

export const submissionSchema = z.object({
  athleteName: z.string().trim().min(2, "Enter the athlete's full name"),
  email: z.string().trim().email("Enter a valid email"),
  phone: z.string().trim().optional().or(z.literal("")),
  serviceType: z.enum(serviceTypeValues).default("NEW_HEAD"),
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
    .url("Paste a valid link to your film (Hudl, YouTube, Instagram, Drive, etc.)")
    .optional()
    .or(z.literal("")),
  budgetCents: z
    .string()
    .trim()
    .optional()
    .or(z.literal(""))
    .transform((v) => (v ? Math.round(Number(v) * 100) : undefined)),
  additionalNotes: z.string().trim().optional().or(z.literal("")),
  shippingAddressLine1: z.string().trim().min(1, "Enter your street address"),
  shippingAddressLine2: z.string().trim().optional().or(z.literal("")),
  shippingCity: z.string().trim().min(1, "Enter your city"),
  shippingState: z.string().trim().min(1, "Enter your state"),
  shippingPostalCode: z.string().trim().min(1, "Enter your ZIP code"),
  shippingCountry: z.string().trim().min(1, "Enter your country"),
}).refine(
  (data) => data.serviceType !== "RESTRING_ONLY" || !!data.currentStick?.trim(),
  { message: "Describe the head you're sending in", path: ["currentStick"] }
);

export type SubmissionInput = z.infer<typeof submissionSchema>;

export const headOptionSchema = z.object({
  name: z.string().trim().min(2, "Enter a head name"),
  notes: z.string().trim().optional().or(z.literal("")),
  purchaseLink: z.string().trim().url("Enter a valid link").optional().or(z.literal("")),
  recommended: z.boolean().optional().default(false),
});

export const recommendationSchema = z.object({
  headOptions: z.array(headOptionSchema).max(5, "Up to 5 head options"),
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
  headOptionId: z.string().min(1).optional().or(z.literal("")),
  stringOptionIds: z.array(z.string()).optional().default([]),
  rush: z.boolean().optional().default(false),
});

export const testimonialSchema = z.object({
  athleteName: z.string().trim().min(2, "Enter the athlete's name"),
  resultOrTeam: z.string().trim().optional().or(z.literal("")),
  quote: z.string().trim().min(10, "Enter the testimonial"),
});

export type TestimonialInput = z.infer<typeof testimonialSchema>;

export const teamInquirySchema = z.object({
  contactName: z.string().trim().min(2, "Enter your name"),
  teamOrOrg: z.string().trim().min(2, "Enter your team or organization"),
  email: z.string().trim().email("Enter a valid email"),
  phone: z.string().trim().optional().or(z.literal("")),
  message: z.string().trim().min(10, "Tell us a bit about what you need"),
});

export type TeamInquiryInput = z.infer<typeof teamInquirySchema>;
