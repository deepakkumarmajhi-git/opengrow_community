import { z } from "zod";

// ─── Form Schemas ────────────────────────────────────────────

export const SignupFormSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Name must be at least 2 characters" })
    .max(50)
    .trim(),
  email: z.string().email({ message: "Please enter a valid email" }).trim(),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" })
    .regex(/[a-zA-Z]/, { message: "Must contain at least one letter" })
    .regex(/[0-9]/, { message: "Must contain at least one number" })
    .trim(),
  role: z.enum(["student", "developer", "professional", "teacher"]),
});

export const LoginFormSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email" }).trim(),
  password: z.string().min(1, { message: "Password is required" }).trim(),
});

export const CommunityFormSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Name must be at least 3 characters" })
    .max(60)
    .trim(),
  description: z
    .string()
    .min(10, { message: "Description must be at least 10 characters" })
    .max(500)
    .trim(),
  category: z.enum(["communication", "personality", "technical", "general"]),
  tags: z.string().optional(),
});

export const MeetingFormSchema = z.object({
  communityId: z.string().min(1),
  title: z.string().min(3).max(100).trim(),
  topic: z.string().max(500).trim().optional(),
  scheduledAt: z.string().min(1),
  durationMinutes: z.number().int().min(15).max(180).default(30),
  template: z
    .enum([
      "custom",
      "mock-interview",
      "debate",
      "group-discussion",
      "english-speaking",
      "product-pitch",
      "leadership-circle",
    ])
    .default("custom"),
  timezone: z.string().min(1).max(80).default("UTC"),
  recurrence: z.enum(["none", "daily", "weekly", "monthly"]).default("none"),
  recurrenceCount: z.number().int().min(1).max(12).default(1),
  reminderMinutes: z.array(z.number().int().min(0).max(10080)).default([60, 10]),
  availabilityOptions: z.array(z.string().min(1)).max(5).default([]),
});

export const CommunityWorkspaceSchema = z.object({
  pinnedNotes: z
    .array(
      z.object({
        title: z.string().min(1).max(80).trim(),
        body: z.string().max(800).trim().default(""),
      })
    )
    .max(5)
    .default([]),
  resources: z
    .array(
      z.object({
        title: z.string().min(1).max(80).trim(),
        url: z.string().url().max(300),
        description: z.string().max(180).trim().default(""),
      })
    )
    .max(8)
    .default([]),
  announcements: z
    .array(
      z.object({
        body: z.string().min(1).max(300).trim(),
      })
    )
    .max(5)
    .default([]),
  weeklyGoals: z
    .array(
      z.object({
        text: z.string().min(1).max(140).trim(),
        done: z.boolean().default(false),
      })
    )
    .max(6)
    .default([]),
});

// ─── Types ───────────────────────────────────────────────────

export type FormState = {
  errors?: Record<string, string[]>;
  message?: string;
} | undefined;

export type SessionPayload = {
  userId: string;
  expiresAt: Date;
};
