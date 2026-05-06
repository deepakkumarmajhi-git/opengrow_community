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

// ─── Types ───────────────────────────────────────────────────

export type FormState = {
  errors?: Record<string, string[]>;
  message?: string;
} | undefined;

export type SessionPayload = {
  userId: string;
  expiresAt: Date;
};
