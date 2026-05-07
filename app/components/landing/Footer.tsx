"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

const footerLinks = {
  Product: [
    { label: "Features", href: "#features" },
    { label: "Communities", href: "/discover" },
    { label: "Leaderboard", href: "/leaderboard" },
  ],
  Explore: [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Create an account", href: "/signup" },
    { label: "Log in", href: "/login" },
  ],
  Principles: [
    { label: "Thoughtful conversation", href: "#" },
    { label: "Safe participation", href: "#" },
    { label: "Steady improvement", href: "#" },
  ],
};

export default function Footer() {
  return (
    <footer
      style={{
        padding: "24px 0 40px",
      }}
    >
      <div className="section-shell">
        <div
          className="card"
          style={{
            padding: 28,
            borderRadius: 34,
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "minmax(0, 1.1fr) repeat(3, minmax(0, 1fr))",
              gap: 28,
            }}
          >
            <div>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 12,
                  marginBottom: 18,
                  fontFamily: "var(--font-display)",
                  fontSize: 22,
                  fontWeight: 700,
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
              <p
                style={{
                  maxWidth: 360,
                  color: "var(--text-secondary)",
                  fontSize: 15,
                  lineHeight: 1.8,
                }}
              >
                Built for communities that want more than posts and reactions.
                OpenGrow gives people a reason to show up, speak up, and grow.
              </p>
            </div>

            {Object.entries(footerLinks).map(([title, links]) => (
              <div key={title}>
                <p className="stat-label" style={{ marginBottom: 16 }}>
                  {title}
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {links.map((link) => (
                    <Link
                      key={link.label}
                      href={link.href}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 8,
                        color: "var(--text-secondary)",
                        fontSize: 14,
                        fontWeight: 600,
                      }}
                    >
                      {link.label}
                      <ArrowUpRight size={14} />
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div
            style={{
              marginTop: 28,
              paddingTop: 20,
              borderTop: "1px solid var(--border-primary)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 12,
              flexWrap: "wrap",
              color: "var(--text-muted)",
              fontSize: 13,
            }}
          >
            <span>Copyright {new Date().getFullYear()} OpenGrow</span>
            <span>Designed for live learning, not passive browsing.</span>
          </div>
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 900px) {
          footer .card > div:first-child {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </footer>
  );
}
