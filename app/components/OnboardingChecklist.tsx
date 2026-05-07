"use client";
import React from "react";

import { CheckCircle2, Circle, ArrowRight, Users, Compass, Video, BarChart3 } from "lucide-react";
import Link from "next/link";

const STEP_ICONS: Record<string, React.ElementType> = {
  role: Users,
  community: Compass,
  meeting: Video,
  report: BarChart3,
};

interface OnboardingChecklistProps {
  steps: {
    id: string;
    label: string;
    completed: boolean;
    href: string;
  }[];
}

export default function OnboardingChecklist({ steps }: OnboardingChecklistProps) {
  const completedCount = steps.filter((s) => s.completed).length;
  const progress = (completedCount / steps.length) * 100;

  if (completedCount === steps.length) return null;

  return (
    <div
      className="card"
      style={{
        marginBottom: 32,
        padding: "24px 32px",
        background: "var(--bg-secondary)",
        border: "1px solid var(--border-primary)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 24,
          flexWrap: "wrap",
        }}
      >
        <div style={{ flex: 1, minWidth: 300 }}>
          <h3
            style={{
              fontSize: 18,
              fontWeight: 600,
              letterSpacing: "-0.02em",
              marginBottom: 4,
            }}
          >
            Mission Progress
          </h3>
          <p style={{ color: "var(--text-secondary)", fontSize: 13, marginBottom: 16 }}>
            Complete your onboarding to unlock full potential.
          </p>

          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            {steps.map((step) => {
              const Icon = STEP_ICONS[step.id] ?? Circle;
              return (
                <Link
                  key={step.id}
                  href={step.href}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "6px 12px",
                    borderRadius: 100,
                    background: step.completed ? "transparent" : "var(--bg-tertiary)",
                    border: "1px solid",
                    borderColor: step.completed ? "var(--success)" : "var(--border-primary)",
                    opacity: step.completed ? 0.6 : 1,
                    pointerEvents: step.completed ? "none" : "auto",
                    transition: "all 0.2s"
                  }}
                  className={step.completed ? "" : "hover-zinc"}
                >
                  <Icon size={12} color={step.completed ? "var(--success)" : "var(--text-muted)"} />
                  <span style={{ fontSize: 12, fontWeight: 500, color: step.completed ? "var(--success)" : "var(--text-secondary)" }}>
                    {step.label}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>

        <div style={{ width: 140, textAlign: "right" }}>
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "flex-end", gap: 4, marginBottom: 8 }}>
            <span style={{ fontSize: 24, fontWeight: 600, color: "var(--text-primary)" }}>{Math.round(progress)}%</span>
            <span style={{ fontSize: 12, color: "var(--text-muted)" }}>complete</span>
          </div>
          <div
            style={{
              width: "100%",
              height: 4,
              background: "var(--bg-tertiary)",
              borderRadius: 100,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: `${progress}%`,
                height: "100%",
                background: "var(--text-primary)",
                transition: "width 0.6s cubic-bezier(0.65, 0, 0.35, 1)",
              }}
            />
          </div>
        </div>
      </div>

      <style jsx>{`
        .hover-zinc:hover {
          background: var(--border-primary) !important;
          border-color: var(--border-secondary) !important;
        }
      `}</style>
    </div>
  );
}
