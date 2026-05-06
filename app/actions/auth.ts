"use server";

import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import connectDB from "@/lib/mongodb";
import User from "@/lib/models/User";
import { createSession, deleteSession } from "@/lib/session";
import {
  SignupFormSchema,
  LoginFormSchema,
  type FormState,
} from "@/lib/definitions";

export async function signup(
  state: FormState,
  formData: FormData
): Promise<FormState> {
  // 1. Validate
  const validated = SignupFormSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    role: formData.get("role"),
  });

  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors };
  }

  const { name, email, password, role } = validated.data;

  // 2. Connect & check existing
  await connectDB();
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return { message: "An account with this email already exists." };
  }

  // 3. Create user
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    role,
  });

  // 4. Create session & redirect
  await createSession(user._id.toString());
  redirect("/dashboard");
}

export async function login(
  state: FormState,
  formData: FormData
): Promise<FormState> {
  // 1. Validate
  const validated = LoginFormSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors };
  }

  const { email, password } = validated.data;

  // 2. Find user
  await connectDB();
  const user = await User.findOne({ email });
  if (!user) {
    return { message: "Invalid email or password." };
  }

  // 3. Verify password
  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) {
    return { message: "Invalid email or password." };
  }

  // 4. Create session & redirect
  await createSession(user._id.toString());
  redirect("/dashboard");
}

export async function logout() {
  await deleteSession();
  redirect("/login");
}
