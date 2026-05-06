"use client";

import { useActionState } from "react";
import { login } from "@/app/actions/auth";
import Link from "next/link";
import { Sprout, LogIn } from "lucide-react";

export default function LoginPage() {
  const [state, action, pending] = useActionState(login, undefined);

  return (
    <div className="animate-fade-in">
      {/* Logo */}
      <div style={{ textAlign: "center", marginBottom: 32 }}>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 10,
            marginBottom: 24,
          }}
        >
          <Sprout size={28} color="var(--accent)" />
          <span style={{ fontSize: 22, fontWeight: 700 }}>OpenGrow</span>
        </div>
        <h1 style={{ fontSize: 24, fontWeight: 600, marginBottom: 8 }}>
          Welcome back
        </h1>
        <p style={{ fontSize: 14, color: "var(--text-muted)" }}>
          Log in to continue growing with your community
        </p>
      </div>

      {/* Form */}
      <form
        action={action}
        style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border-primary)",
          borderRadius: "var(--radius-xl)",
          padding: 28,
          display: "flex",
          flexDirection: "column",
          gap: 18,
        }}
      >
        {state?.message && (
          <div
            style={{
              padding: "10px 14px",
              background: "rgba(239, 68, 68, 0.1)",
              border: "1px solid rgba(239, 68, 68, 0.2)",
              borderRadius: "var(--radius-md)",
              color: "var(--danger)",
              fontSize: 13,
            }}
          >
            {state.message}
          </div>
        )}

        <div>
          <label htmlFor="email" className="label">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="you@example.com"
            className="input"
            required
          />
          {state?.errors?.email && (
            <p style={{ fontSize: 12, color: "var(--danger)", marginTop: 4 }}>
              {state.errors.email[0]}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="password" className="label">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            placeholder="••••••••"
            className="input"
            required
          />
          {state?.errors?.password && (
            <p style={{ fontSize: 12, color: "var(--danger)", marginTop: 4 }}>
              {state.errors.password[0]}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={pending}
          className="btn btn-primary"
          style={{ width: "100%", marginTop: 4 }}
        >
          {pending ? "Logging in..." : "Log In"}
          {!pending && <LogIn size={16} />}
        </button>
      </form>

      <p
        style={{
          textAlign: "center",
          marginTop: 20,
          fontSize: 14,
          color: "var(--text-muted)",
        }}
      >
        Don&apos;t have an account?{" "}
        <Link
          href="/signup"
          style={{ color: "var(--accent)", fontWeight: 500 }}
        >
          Sign up
        </Link>
      </p>
    </div>
  );
}
