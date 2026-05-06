"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Play } from "lucide-react";

const roles = ["Students", "Developers", "Professionals", "Teachers"];

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
        timeout = setTimeout(() => setIsDeleting(true), 2000);
      }
    } else {
      if (displayText.length > 0) {
        timeout = setTimeout(() => {
          setDisplayText(displayText.slice(0, -1));
        }, 40);
      } else {
        setIsDeleting(false);
        setRoleIndex((prev) => (prev + 1) % roles.length);
      }
    }
    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, roleIndex]);

  return (
    <section
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "120px 24px 80px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background grid */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "radial-gradient(circle at 1px 1px, var(--border-primary) 1px, transparent 0)",
          backgroundSize: "40px 40px",
          opacity: 0.4,
        }}
      />

      {/* Gradient orb */}
      <div
        style={{
          position: "absolute",
          top: "20%",
          left: "50%",
          transform: "translateX(-50%)",
          width: 600,
          height: 600,
          background:
            "radial-gradient(circle, var(--accent-glow) 0%, transparent 70%)",
          opacity: 0.3,
          borderRadius: "50%",
          filter: "blur(80px)",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          position: "relative",
          textAlign: "center",
          maxWidth: 720,
          zIndex: 1,
        }}
        className="animate-fade-in"
      >
        {/* Badge */}
        <div
          className="badge"
          style={{ marginBottom: 24, display: "inline-flex" }}
        >
          <Play size={12} fill="currentColor" />
          Live community discussions
        </div>

        {/* Headline */}
        <h1 style={{ fontSize: "clamp(36px, 5vw, 56px)", marginBottom: 8 }}>
          Where{" "}
          <span className="text-gradient" style={{ display: "inline-block", minWidth: "3ch" }}>
            {displayText}
            <span
              style={{
                display: "inline-block",
                width: 2,
                height: "0.9em",
                background: "var(--accent)",
                marginLeft: 2,
                animation: "pulse-glow 1s infinite",
                verticalAlign: "text-bottom",
              }}
            />
          </span>
        </h1>
        <h1 style={{ fontSize: "clamp(36px, 5vw, 56px)", marginBottom: 24 }}>
          Grow Together
        </h1>

        {/* Subheading */}
        <p
          style={{
            fontSize: 17,
            color: "var(--text-secondary)",
            maxWidth: 560,
            margin: "0 auto 40px",
            lineHeight: 1.7,
          }}
        >
          Join communities, participate in scheduled video meetings, and improve
          your communication skills through real conversations with real people.
        </p>

        {/* CTAs */}
        <div
          style={{
            display: "flex",
            gap: 12,
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <Link href="/signup" className="btn btn-primary btn-lg">
            Start Growing
            <ArrowRight size={16} />
          </Link>
          <a href="#features" className="btn btn-secondary btn-lg">
            Learn More
          </a>
        </div>

        {/* Trust line */}
        <p
          style={{
            marginTop: 32,
            fontSize: 13,
            color: "var(--text-muted)",
          }}
        >
          Free to join · No credit card required · 100% anonymous discussions
        </p>
      </div>
    </section>
  );
}
