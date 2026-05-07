import Link from "next/link";
import { ArrowRight, Search, UserPlus, Video } from "lucide-react";
import Navbar from "@/app/components/landing/Navbar";
import Hero from "@/app/components/landing/Hero";
import Features from "@/app/components/landing/Features";
import Stats from "@/app/components/landing/Stats";
import Footer from "@/app/components/landing/Footer";

const steps = [
  {
    step: "01",
    icon: UserPlus,
    title: "Join with intent",
    description:
      "Create an account, choose your role, and step into a space that matches how you want to grow.",
  },
  {
    step: "02",
    icon: Search,
    title: "Find your room",
    description:
      "Browse communities by topic and energy, then join the ones where real participation is already happening.",
  },
  {
    step: "03",
    icon: Video,
    title: "Practice live",
    description:
      "Show up to scheduled discussions, speak with other members, and review the insights after each session.",
  },
];

export default function LandingPage() {
  return (
    <div style={{ minHeight: "100vh" }}>
      <Navbar />
      <Hero />
      <Features />
      <Stats />

      <section id="how-it-works" style={{ padding: "0 0 96px" }}>
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
            <span className="eyebrow">Flow</span>
            <h2 style={{ fontSize: "clamp(34px, 5vw, 58px)" }}>
              A clean path from curiosity to confident participation.
            </h2>
            <p>
              The product now guides people through a more intentional journey:
              discover, commit, and show up prepared.
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 280px), 1fr))",
              gap: 18,
            }}
          >
            {steps.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.step}
                  className="card"
                  style={{
                    minHeight: 250,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    gap: 16,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: 12,
                    }}
                  >
                    <span
                      className="badge-outline"
                      style={{
                        background: "rgba(255, 255, 255, 0.03)",
                        color: "var(--text-primary)",
                      }}
                    >
                      Step {item.step}
                    </span>
                    <div
                      style={{
                        width: 50,
                        height: 50,
                        borderRadius: 18,
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background:
                          "linear-gradient(135deg, rgba(132, 240, 184, 0.18), rgba(245, 184, 109, 0.15))",
                        border: "1px solid var(--border-secondary)",
                      }}
                    >
                      <Icon size={22} />
                    </div>
                  </div>

                  <div>
                    <h3
                      style={{
                        fontFamily: "var(--font-display)",
                        fontSize: 26,
                        fontWeight: 700,
                        letterSpacing: "-0.04em",
                        marginBottom: 10,
                      }}
                    >
                      {item.title}
                    </h3>
                    <p
                      style={{
                        color: "var(--text-secondary)",
                        fontSize: 15,
                        lineHeight: 1.75,
                      }}
                    >
                      {item.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section style={{ padding: "0 0 26px" }}>
        <div className="section-shell">
          <div
            className="card"
            style={{
              padding: "34px clamp(24px, 4vw, 44px)",
              borderRadius: 36,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 18,
              flexWrap: "wrap",
              background:
                "linear-gradient(135deg, rgba(132, 240, 184, 0.16), rgba(245, 184, 109, 0.14)), var(--bg-card)",
            }}
          >
            <div style={{ maxWidth: 680 }}>
              <span className="eyebrow" style={{ marginBottom: 14 }}>
                Ready to begin
              </span>
              <h2
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(32px, 5vw, 54px)",
                  lineHeight: 0.95,
                  letterSpacing: "-0.05em",
                }}
              >
                Build a community people actually return to.
              </h2>
              <p
                style={{
                  marginTop: 16,
                  color: "var(--text-secondary)",
                  fontSize: 16,
                  lineHeight: 1.75,
                }}
              >
                Join OpenGrow and create a stronger rhythm around speaking,
                listening, and learning together.
              </p>
            </div>

            <Link href="/signup" className="btn btn-primary btn-lg">
              Join OpenGrow
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
