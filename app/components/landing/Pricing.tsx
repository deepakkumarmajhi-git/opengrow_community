"use client";

import { Check, ArrowRight, Zap } from "lucide-react";
import Link from "next/link";

const plans = [
  {
    name: "Growth",
    price: "0",
    description: "For individuals starting their speaking journey.",
    features: [
      "Join unlimited communities",
      "Attend 2 live sessions / month",
      "Basic AI meeting reports",
      "Public leaderboard entry",
    ],
    buttonText: "Start for free",
    href: "/signup",
    featured: false,
  },
  {
    name: "Pro",
    price: "19",
    description: "For professionals building a serious presence.",
    features: [
      "Everything in Growth",
      "Unlimited live sessions",
      "Advanced AI speaking analytics",
      "Priority room access",
      "Create 1 community",
    ],
    buttonText: "Go Pro",
    href: "/signup",
    featured: true,
  },
  {
    name: "Mentor",
    price: "49",
    description: "For leaders and coaches building a brand.",
    features: [
      "Everything in Pro",
      "Unlimited communities",
      "Custom room templates",
      "Member engagement dashboard",
      "Early access to new features",
    ],
    buttonText: "Join as Mentor",
    href: "/signup",
    featured: false,
  },
];

export default function Pricing() {
  return (
    <section id="pricing" style={{ padding: "120px 24px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div
          style={{
            textAlign: "center",
            margin: "0 auto 80px",
            maxWidth: 600,
          }}
        >
          <div 
            style={{ 
              display: "inline-flex", 
              padding: "4px 12px", 
              borderRadius: 100, 
              background: "var(--bg-tertiary)", 
              border: "1px solid var(--border-primary)",
              fontSize: 12,
              fontWeight: 600,
              color: "var(--text-muted)",
              marginBottom: 20
            }}
          >
            Pricing
          </div>
          <h2
            style={{
              fontSize: "clamp(36px, 5vw, 56px)",
              fontWeight: 600,
              letterSpacing: "-0.04em",
              lineHeight: 1.1,
              marginBottom: 24,
              color: "var(--text-primary)",
            }}
          >
            Invest in your voice.
          </h2>
          <p style={{ color: "var(--text-secondary)", fontSize: 18, lineHeight: 1.6 }}>
            Choose a plan that matches your rhythm. Scale as your presence grows.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: 32,
            alignItems: "stretch",
          }}
        >
          {plans.map((plan) => (
            <div
              key={plan.name}
              className="card"
              style={{
                display: "flex",
                flexDirection: "column",
                padding: 40,
                borderRadius: 24,
                background: "var(--bg-secondary)",
                border: "1px solid var(--border-primary)",
                position: "relative",
              }}
            >
              {plan.featured && (
                <div
                  style={{
                    position: "absolute",
                    top: -12,
                    left: 40,
                    background: "var(--text-primary)",
                    color: "var(--bg-primary)",
                    padding: "4px 12px",
                    borderRadius: 100,
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: "0.05em",
                    textTransform: "uppercase"
                  }}
                >
                  Most Popular
                </div>
              )}
              
              <div style={{ marginBottom: 40 }}>
                <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 12 }}>{plan.name}</h3>
                <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 16 }}>
                  <span style={{ fontSize: 40, fontWeight: 700, letterSpacing: "-0.04em" }}>
                    ${plan.price}
                  </span>
                  <span style={{ color: "var(--text-muted)", fontSize: 14 }}>/mo</span>
                </div>
                <p style={{ color: "var(--text-secondary)", fontSize: 14, lineHeight: 1.5 }}>
                  {plan.description}
                </p>
              </div>

              <div style={{ flex: 1, marginBottom: 40 }}>
                <ul style={{ display: "grid", gap: 16, listStyle: "none" }}>
                  {plan.features.map((feature) => (
                    <li
                      key={feature}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        fontSize: 14,
                        color: "var(--text-secondary)",
                      }}
                    >
                      <Check size={14} color="var(--text-primary)" style={{ flexShrink: 0 }} />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              <Link
                href={plan.href}
                className={`btn ${plan.featured ? "btn-primary" : "btn-secondary"} btn-lg`}
                style={{ width: "100%", borderRadius: 100 }}
              >
                {plan.buttonText}
              </Link>
            </div>
          ))}
        </div>

        <div style={{ textAlign: "center", marginTop: 48 }}>
          <p style={{ color: "var(--text-muted)", fontSize: 14 }}>
            Looking for a custom plan?{" "}
            <Link href="mailto:sales@opengrow.space" style={{ color: "var(--text-primary)", fontWeight: 600 }}>
              Talk to Sales
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
