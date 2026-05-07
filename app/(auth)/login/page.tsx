"use client";

import { useActionState } from "react";
import Link from "next/link";
import { ArrowLeft, LogIn, Sparkles } from "lucide-react";
import { login } from "@/app/actions/auth";

export default function LoginPage() {
  const [state, action, pending] = useActionState(login, undefined);

  return (
    <div className="card auth-card animate-fade-in">
      <Link
        href="/"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          marginBottom: 26,
          color: "var(--text-secondary)",
          fontSize: 13,
          fontWeight: 700,
        }}
      >
        <ArrowLeft size={14} />
        Back to home
      </Link>

      <div style={{ marginBottom: 28 }}>
        <span className="eyebrow" style={{ marginBottom: 14 }}>
          Returning member
        </span>
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontSize: 40,
            lineHeight: 0.98,
            letterSpacing: "-0.05em",
            marginBottom: 10,
          }}
        >
          Welcome back.
        </h1>
        <p
          style={{
            color: "var(--text-secondary)",
            fontSize: 15,
            lineHeight: 1.75,
          }}
        >
          Step back into your communities and pick up where your last
          conversation left off.
        </p>
      </div>

      <form action={action} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
        {state?.message && (
          <div
            style={{
              padding: "14px 16px",
              borderRadius: "var(--radius-md)",
              background: "rgba(255, 133, 116, 0.1)",
              border: "1px solid rgba(255, 133, 116, 0.2)",
              color: "var(--danger)",
              fontSize: 14,
              fontWeight: 600,
            }}
          >
            {state.message}
          </div>
        )}

        <div>
          <label htmlFor="email" className="label">
            Email Address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="you@example.com"
            className="input"
            required
            autoComplete="email"
          />
          {state?.errors?.email && (
            <p style={{ marginTop: 8, color: "var(--danger)", fontSize: 12 }}>
              {state.errors.email[0]}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="password" className="label">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            placeholder="Enter your password"
            className="input"
            required
            autoComplete="current-password"
          />
          {state?.errors?.password && (
            <p style={{ marginTop: 8, color: "var(--danger)", fontSize: 12 }}>
              {state.errors.password[0]}
            </p>
          )}
        </div>

        <button type="submit" disabled={pending} className="btn btn-primary" style={{ marginTop: 6 }}>
          {pending ? "Signing you in..." : "Continue to dashboard"}
          {!pending && <LogIn size={16} />}
        </button>
      </form>

      <div
        style={{
          marginTop: 22,
          paddingTop: 18,
          borderTop: "1px solid var(--border-primary)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
          flexWrap: "wrap",
        }}
      >
        <p style={{ color: "var(--text-muted)", fontSize: 13 }}>
          New to OpenGrow?
        </p>
        <Link href="/signup" style={{ display: "inline-flex", alignItems: "center", gap: 6, fontWeight: 700 }}>
          Create an account
          <Sparkles size={14} />
        </Link>
      </div>
    </div>
  );
}
