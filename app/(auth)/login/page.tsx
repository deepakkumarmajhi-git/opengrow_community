"use client";

import { useActionState } from "react";
import { login } from "@/app/actions/auth";
import Link from "next/link";
import { LogIn, ArrowLeft } from "lucide-react";

export default function LoginPage() {
  const [state, action, pending] = useActionState(login, undefined);

  return (
    <div className="animate-fade-in">
      <Link
        href="/"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          fontSize: 13,
          color: "var(--text-muted)",
          marginBottom: 32,
          transition: "color 0.2s",
        }}
        className="hover-white"
      >
        <ArrowLeft size={14} />
        Back to Home
      </Link>

      <div style={{ marginBottom: 40 }}>
        <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 12, letterSpacing: "-0.04em" }}>
          Welcome back
        </h1>
        <p style={{ fontSize: 16, color: "var(--text-secondary)", lineHeight: 1.6 }}>
          Log in to your OpenGrow account to join your communities and sessions.
        </p>
      </div>

      <form
        action={action}
        className="glass-panel"
        style={{
          padding: 40,
          display: "flex",
          flexDirection: "column",
          gap: 24,
        }}
      >
        {state?.message && (
          <div
            style={{
              padding: "12px 16px",
              background: "rgba(239, 68, 68, 0.05)",
              border: "1px solid rgba(239, 68, 68, 0.15)",
              borderRadius: "var(--radius-md)",
              color: "var(--danger)",
              fontSize: 14,
              fontWeight: 500
            }}
          >
            {state.message}
          </div>
        )}

        <div>
          <label htmlFor="email" className="label-minimal">Email Address</label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="you@example.com"
            className="input-minimal"
            required
            autoComplete="email"
          />
          {state?.errors?.email && (
            <p style={{ fontSize: 12, color: "var(--danger)", marginTop: 6, fontWeight: 500 }}>
              {state.errors.email[0]}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="password" className="label-minimal">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            placeholder="••••••••"
            className="input-minimal"
            required
            autoComplete="current-password"
          />
          {state?.errors?.password && (
            <p style={{ fontSize: 12, color: "var(--danger)", marginTop: 6, fontWeight: 500 }}>
              {state.errors.password[0]}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={pending}
          className="btn btn-primary"
          style={{ width: "100%", height: 52, marginTop: 8, fontSize: 15, fontWeight: 700 }}
        >
          {pending ? "Synchronizing..." : "Continue"}
          {!pending && <LogIn size={18} />}
        </button>
      </form>

      <p
        style={{
          textAlign: "center",
          marginTop: 32,
          fontSize: 14,
          color: "var(--text-muted)",
        }}
      >
        New to OpenGrow?{" "}
        <Link
          href="/signup"
          style={{ color: "var(--text-primary)", fontWeight: 600, textDecoration: "underline" }}
        >
          Create an account
        </Link>
      </p>
    </div>
  );
}
