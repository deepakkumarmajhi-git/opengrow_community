"use client";

import { useActionState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sparkles, UserPlus, Info, AlertCircle } from "lucide-react";
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
            className="animate-slide-down"
            style={{
              padding: "14px 16px",
              borderRadius: "var(--radius-md)",
              background: state.message.toLowerCase().includes("exists") || state.errors 
                ? "rgba(212, 76, 71, 0.1)" 
                : "rgba(46, 160, 67, 0.1)",
              border: `1px solid ${state.message.toLowerCase().includes("exists") || state.errors 
                ? "rgba(212, 76, 71, 0.2)" 
                : "rgba(46, 160, 67, 0.2)"}`,
              color: state.message.toLowerCase().includes("exists") || state.errors 
                ? "var(--danger)" 
                : "var(--success)",
              fontSize: 14,
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginBottom: 10,
            }}
          >
            <AlertCircle size={18} />
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
          />
          {state?.errors?.name && (
            <p style={{ marginTop: 8, color: "var(--danger)", fontSize: 12, fontWeight: 600, display: "flex", alignItems: "center", gap: 6 }}>
              <AlertCircle size={12} />
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
          />
          {state?.errors?.email && (
            <p style={{ marginTop: 8, color: "var(--danger)", fontSize: 12, fontWeight: 600, display: "flex", alignItems: "center", gap: 6 }}>
              <AlertCircle size={12} />
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
          />
          <div
            style={{
              marginTop: 10,
              display: "flex",
              flexDirection: "column",
              gap: 8,
            }}
          >
            <p
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                color: "var(--text-muted)",
                fontSize: 12,
              }}
            >
              <Info size={12} />
              Password must be at least 8 characters with a letter and a number.
            </p>
            {state?.errors?.password && (
              <div
                style={{
                  color: "var(--danger)",
                  fontSize: 12,
                  fontWeight: 600,
                  display: "flex",
                  flexDirection: "column",
                  gap: 4,
                }}
              >
                {state.errors.password.map((error: string) => (
                  <p key={error} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <AlertCircle size={12} />
                    {error}
                  </p>
                ))}
              </div>
            )}
          </div>
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

        <button
          type="submit"
          disabled={pending}
          className="btn btn-primary"
          style={{ marginTop: 6, gap: 12 }}
        >
          {pending ? (
            <>
              <div className="spinner" />
              Creating your space...
            </>
          ) : (
            <>
              Create account
              <UserPlus size={16} />
            </>
          )}
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
