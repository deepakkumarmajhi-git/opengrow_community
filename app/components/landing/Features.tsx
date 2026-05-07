"use client";

import {
  BookOpen,
  MessageCircle,
  Target,
  Users,
  Video,
  Zap,
} from "lucide-react";

const features = [
  {
    icon: MessageCircle,
    title: "Purposeful discussion rooms",
    description:
      "Every meeting starts with a clear topic, so members arrive ready to speak instead of drifting through random chat.",
  },
  {
    icon: Video,
    title: "Built-in live sessions",
    description:
      "Practice happens in the product with video, audio, device checks, and host-friendly controls already connected.",
  },
  {
    icon: Users,
    title: "Communities that feel active",
    description:
      "Discover rooms by interest, join focused groups, and create rhythms that keep people coming back.",
  },
  {
    icon: BookOpen,
    title: "AI-supported preparation",
    description:
      "Suggested topics and meeting summaries help hosts lead better conversations and help members reflect faster.",
  },
  {
    icon: Target,
    title: "Visible growth loops",
    description:
      "Points, streaks, and reports make progress tangible without turning the experience into empty gamification.",
  },
  {
    icon: Zap,
    title: "Low-friction coordination",
    description:
      "Scheduling, attendance, and follow-ups happen in the same flow, which keeps communities moving with less admin overhead.",
  },
];

export default function Features() {
  return (
    <section id="features" style={{ padding: "42px 0 96px" }}>
      <div className="section-shell">
        <div
          className="section-heading"
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 10,
            marginBottom: 30,
          }}
        >
          <span className="eyebrow">Experience Design</span>
          <h2 style={{ fontSize: "clamp(34px, 5vw, 58px)" }}>
            Everything needed to turn a community into a practice ritual.
          </h2>
          <p>
            The product now leans into warmth, momentum, and clarity so the
            experience feels like a live studio for growth rather than a generic
            dashboard.
          </p>
        </div>

        <div className="marketing-grid">
          {features.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <div
                key={feature.title}
                className="card"
                style={{
                  gridColumn: index === 0 || index === 3 ? "span 6" : undefined,
                  minHeight: index === 0 || index === 3 ? 250 : 220,
                  display: "flex",
                  flexDirection: "column",
                  gap: 22,
                  justifyContent: "space-between",
                }}
              >
                <div
                  style={{
                    width: 54,
                    height: 54,
                    borderRadius: 20,
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background:
                      "linear-gradient(135deg, rgba(132, 240, 184, 0.18), rgba(245, 184, 109, 0.15))",
                    border: "1px solid var(--border-secondary)",
                  }}
                >
                  <Icon size={22} color="var(--text-primary)" />
                </div>

                <div>
                  <h3
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: 24,
                      fontWeight: 700,
                      letterSpacing: "-0.04em",
                      marginBottom: 10,
                    }}
                  >
                    {feature.title}
                  </h3>
                  <p
                    style={{
                      fontSize: 15,
                      color: "var(--text-secondary)",
                      lineHeight: 1.75,
                    }}
                  >
                    {feature.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
