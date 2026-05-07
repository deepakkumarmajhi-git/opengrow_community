"use client";

import { useActionState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sparkles, UserPlus } from "lucide-react";
import { signup } from "@/app/actions/auth";

const roles = [
  { value: "student", label: "Student" },
  { value: "developer", label: "Developer" },
  { value: "professional", label: "Professional" },
  { value: "teacher", label: "Teacher" },
];

export default function SignupPage() {
  const [state, action, pending] = useActionState(signup, undefined);

  return (
    <div className="card auth-card animate-fade-in">
      <div style={{ marginBottom: 28 }}>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 12,
            marginBottom: 18,
            fontFamily: "var(--font-display)",
            fontWeight: 700,
            fontSize: 22,
            letterSpacing: "-0.04em",
          }}
        >
          <span
            style={{
              width: 42,
              height: 42,
              borderRadius: 8,
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
              background: "var(--bg-tertiary)",
              border: "1px solid var(--border-secondary)",
            }}
          >
            <Image
              src="/logo.png"
              alt="OpenGrow logo"
              width={42}
              height={42}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </span>
          OpenGrow
        </div>

        <span className="eyebrow" style={{ marginBottom: 14 }}>
          New account
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
          Build your practice space.
        </h1>
        <p style={{ color: "var(--text-secondary)", fontSize: 15, lineHeight: 1.75 }}>
          Create your profile, choose how you participate, and start showing up
          to conversations that matter.
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
          <label htmlFor="name" className="label">
            Full Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            placeholder="How should the community know you?"
            className="input"
            required
          />
          {state?.errors?.name && (
            <p style={{ marginTop: 8, color: "var(--danger)", fontSize: 12 }}>
              {state.errors.name[0]}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="email" className="label">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="you@example.com"
            className="input"
            required
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
            placeholder="At least 8 characters"
            className="input"
            required
          />
          {state?.errors?.password && (
            <div style={{ marginTop: 8, color: "var(--danger)", fontSize: 12 }}>
              {state.errors.password.map((error: string) => (
                <p key={error}>{error}</p>
              ))}
            </div>
          )}
        </div>

        <div>
          <label htmlFor="role" className="label">
            I mostly show up as
          </label>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
              gap: 10,
            }}
          >
            {roles.map((role) => (
              <label
                key={role.value}
                className="card"
                style={{
                  padding: 14,
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  cursor: "pointer",
                }}
              >
                <input
                  type="radio"
                  name="role"
                  value={role.value}
                  defaultChecked={role.value === "student"}
                  style={{ accentColor: "var(--accent)" }}
                />
                <span style={{ fontSize: 14, fontWeight: 600 }}>{role.label}</span>
              </label>
            ))}
          </div>
          {state?.errors?.role && (
            <p style={{ marginTop: 8, color: "var(--danger)", fontSize: 12 }}>
              {state.errors.role[0]}
            </p>
          )}
        </div>

        <button type="submit" disabled={pending} className="btn btn-primary" style={{ marginTop: 6 }}>
          {pending ? "Creating your space..." : "Create account"}
          {!pending && <UserPlus size={16} />}
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
          Already have an account?
        </p>
        <Link href="/login" style={{ display: "inline-flex", alignItems: "center", gap: 6, fontWeight: 700 }}>
          Log in
          <ArrowRight size={14} />
        </Link>
      </div>

      <div
        style={{
          marginTop: 18,
          color: "var(--text-muted)",
          fontSize: 12,
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        <Sparkles size={14} />
        You can refine your profile and theme once you are inside.
      </div>
    </div>
  );
}
