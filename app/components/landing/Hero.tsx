"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Play, Sparkles, Users } from "lucide-react";

const roles = ["Students", "Developers", "Professionals", "Teachers"];
const highlights = [
  "Structured live rooms",
  "AI session feedback",
  "Communities with momentum",
];

export default function Hero() {
  const [roleIndex, setRoleIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentRole = roles[roleIndex];
    let timeout: NodeJS.Timeout;

    if (!isDeleting) {
      if (displayText.length < currentRole.length) {
        timeout = setTimeout(() => {
          setDisplayText(currentRole.slice(0, displayText.length + 1));
        }, 80);
      } else {
        timeout = setTimeout(() => setIsDeleting(true), 1800);
      }
    } else if (displayText.length > 0) {
      timeout = setTimeout(() => {
        setDisplayText(displayText.slice(0, -1));
      }, 36);
    } else {
      timeout = setTimeout(() => {
        setIsDeleting(false);
        setRoleIndex((prev) => (prev + 1) % roles.length);
      }, 0);
    }

    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, roleIndex]);

  return (
    <section
      style={{
        position: "relative",
        overflow: "hidden",
        padding: "132px 0 72px",
      }}
    >
      <div className="section-shell">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 1.08fr) minmax(320px, 0.92fr)",
            gap: 34,
            alignItems: "center",
          }}
        >
          <div className="animate-fade-in">
            <div className="badge" style={{ marginBottom: 20 }}>
              <Play size={12} fill="currentColor" />
              Live community practice rooms
            </div>

            <h1
              style={{
                maxWidth: 760,
                fontFamily: "var(--font-sans)",
                fontSize: "clamp(42px, 7vw, 76px)",
                lineHeight: 1,
                letterSpacing: "-0.035em",
                marginBottom: 18,
              }}
            >
              Where{" "}
              <span className="text-gradient" style={{ minWidth: "4.3ch", display: "inline-block" }}>
                {displayText}
                <span
                  style={{
                    display: "inline-block",
                    width: 2,
                    height: "0.9em",
                    marginLeft: 4,
                    background: "var(--text-primary)",
                    verticalAlign: "text-bottom",
                    animation: "pulse-glow 1s infinite",
                  }}
                />
              </span>
              <br />
              learn to speak with presence.
            </h1>

            <p
              style={{
                maxWidth: 620,
                color: "var(--text-secondary)",
                fontSize: 17,
                lineHeight: 1.75,
                marginBottom: 28,
              }}
            >
              OpenGrow turns passive communities into living practice spaces where
              people meet, speak, reflect, and steadily improve together.
            </p>

            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 12,
                marginBottom: 28,
              }}
            >
              <Link href="/signup" className="btn btn-primary btn-lg">
                Start Growing
                <ArrowRight size={16} />
              </Link>
              <a href="#features" className="btn btn-secondary btn-lg">
                Explore the experience
              </a>
            </div>

            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 10,
              }}
            >
              {highlights.map((item) => (
                <span
                  key={item}
                  className="badge-outline"
                  style={{ background: "rgba(255, 255, 255, 0.03)" }}
                >
                  <Sparkles size={12} />
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div className="animate-fade-in">
            <div
              style={{
                border: "1px solid var(--border-primary)",
                borderRadius: 8,
                background: "var(--bg-secondary)",
                overflow: "hidden",
                boxShadow: "var(--shadow-md)",
              }}
            >
              <div
                style={{
                  padding: "14px 16px",
                  borderBottom: "1px solid var(--border-primary)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 12,
                  background: "var(--bg-tertiary)",
                }}
              >
                <div>
                  <p className="stat-label" style={{ marginBottom: 4 }}>
                    OpenGrow workspace
                  </p>
                  <strong style={{ fontSize: 15 }}>Community operations</strong>
                </div>
                <span className="badge">Live</span>
              </div>

              <div style={{ padding: 18 }}>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
                    border: "1px solid var(--border-primary)",
                    borderRadius: 8,
                    overflow: "hidden",
                    marginBottom: 18,
                  }}
                >
                  {[
                    ["Sessions", "14"],
                    ["Members", "186"],
                    ["Reports", "42"],
                  ].map(([label, value]) => (
                    <div
                      key={label}
                      style={{
                        padding: 14,
                        borderRight:
                          label === "Reports" ? "none" : "1px solid var(--border-primary)",
                      }}
                    >
                      <p className="stat-label" style={{ marginBottom: 8 }}>
                        {label}
                      </p>
                      <strong style={{ fontSize: 28, letterSpacing: "-0.02em" }}>
                        {value}
                      </strong>
                    </div>
                  ))}
                </div>

                <div style={{ display: "grid", gap: 10 }}>
                  {[
                    ["Product Communication Circle", "Today, 7:30 PM", "18 / 20"],
                    ["Interview Practice Room", "Tomorrow, 6:00 PM", "12 / 16"],
                    ["Leadership Roundtable", "Fri, 8:00 PM", "9 / 12"],
                  ].map(([title, time, attendance]) => (
                    <div
                      key={title}
                      style={{
                        display: "grid",
                        gridTemplateColumns: "minmax(0, 1fr) 120px 70px",
                        gap: 12,
                        alignItems: "center",
                        padding: "12px 0",
                        borderBottom: "1px solid var(--border-primary)",
                      }}
                    >
                      <div style={{ minWidth: 0 }}>
                        <strong
                          style={{
                            display: "block",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {title}
                        </strong>
                        <span style={{ color: "var(--text-muted)", fontSize: 12 }}>
                          Scheduled room
                        </span>
                      </div>
                      <span style={{ color: "var(--text-secondary)", fontSize: 13 }}>
                        {time}
                      </span>
                      <span style={{ color: "var(--text-secondary)", fontSize: 13 }}>
                        {attendance}
                      </span>
                    </div>
                  ))}
                </div>

                <div
                  style={{
                    marginTop: 18,
                    display: "grid",
                    gap: 10,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      color: "var(--text-secondary)",
                      fontSize: 14,
                    }}
                  >
                    <CheckCircle2 size={16} color="var(--success)" />
                    AI summaries are queued after each completed room.
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      color: "var(--text-secondary)",
                      fontSize: 14,
                    }}
                  >
                    <Users size={16} color="var(--accent)" />
                    Hosts can see attendance and member momentum in one place.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 980px) {
          section > .section-shell > div {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </section>
  );
}
