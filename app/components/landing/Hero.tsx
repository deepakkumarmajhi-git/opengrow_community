"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Play, Sparkles } from "lucide-react";

const roles = ["you", "people", "Students", "Developers", "Professionals", "Teachers"];

export default function Hero() {
  const [roleIndex, setRoleIndex] = useState(0);
  const [displayText, setDisplayText] = useState("you");
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
        padding: "160px 24px 100px",
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <div 
        className="animate-fade-in"
        style={{
          maxWidth: 900,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div 
          className="badge" 
          style={{ 
            marginBottom: 24,
            padding: "6px 12px",
            border: "1px solid var(--border-primary)",
            background: "var(--bg-tertiary)",
            color: "var(--text-secondary)",
            fontSize: 12,
            fontWeight: 500,
            borderRadius: 100,
            display: "flex",
            alignItems: "center",
            gap: 8
          }}
        >
          <Sparkles size={12} />
          The future of community-driven practice
        </div>

        <h1
          style={{
            fontSize: "clamp(48px, 8vw, 84px)",
            fontWeight: 600,
            lineHeight: 1.05,
            letterSpacing: "-0.04em",
            marginBottom: 24,
            color: "var(--text-primary)",
          }}
        >
          Where{" "}
          <span style={{ color: "var(--text-muted)", position: "relative" }}>
            {displayText}
            <span
              style={{
                display: "inline-block",
                width: 2,
                height: "0.85em",
                marginLeft: 4,
                background: "var(--text-primary)",
                verticalAlign: "middle",
                animation: "pulse 1s infinite",
              }}
            />
          </span>
          <br />
          learn to speak with presence.
        </h1>

        <p
          style={{
            maxWidth: 640,
            color: "var(--text-secondary)",
            fontSize: 18,
            lineHeight: 1.6,
            marginBottom: 40,
          }}
        >
          Transform passive communities into active speaking practice spaces. 
          Meet real people, speak in structured rooms, and grow together.
        </p>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: 16,
            marginBottom: 64,
          }}
        >
          <Link href="/signup" className="btn btn-primary btn-lg" style={{ borderRadius: 100 }}>
            Start Growing
            <ArrowRight size={18} />
          </Link>
          <a href="#experience" className="btn btn-secondary btn-lg" style={{ borderRadius: 100 }}>
            <Play size={16} fill="currentColor" />
            Watch the experience
          </a>
        </div>

        <div
          style={{
            width: "100%",
            maxWidth: 1000,
            borderRadius: 16,
            border: "1px solid var(--border-primary)",
            background: "var(--bg-secondary)",
            overflow: "hidden",
            boxShadow: "var(--shadow-lg)",
            position: "relative",
          }}
        >
          <div
            style={{
              padding: "12px 20px",
              borderBottom: "1px solid var(--border-primary)",
              background: "var(--bg-tertiary)",
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <div style={{ display: "flex", gap: 6 }}>
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#ef4444" }} />
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#f59e0b" }} />
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#10b981" }} />
            </div>
            <div 
              style={{ 
                flex: 1, 
                textAlign: "center", 
                fontSize: 12, 
                color: "var(--text-muted)",
                fontFamily: "var(--font-mono)"
              }}
            >
              opengrow.space/dashboard
            </div>
          </div>
          <div style={{ padding: "1px", background: "var(--border-primary)" }}>
            <div style={{ background: "var(--bg-primary)", height: 500, position: "relative" }}>
              {/* Simplified Dashboard Mockup */}
              <div style={{ display: "flex", height: "100%" }}>
                <div style={{ width: 200, borderRight: "1px solid var(--border-primary)", padding: 20, textAlign: "left" }}>
                  <div style={{ height: 12, width: "80%", background: "var(--border-primary)", borderRadius: 4, marginBottom: 20 }} />
                  <div style={{ height: 12, width: "60%", background: "var(--border-primary)", borderRadius: 4, marginBottom: 12 }} />
                  <div style={{ height: 12, width: "70%", background: "var(--border-primary)", borderRadius: 4, marginBottom: 12 }} />
                  <div style={{ height: 12, width: "50%", background: "var(--border-primary)", borderRadius: 4, marginBottom: 12 }} />
                </div>
                <div style={{ flex: 1, padding: 32, textAlign: "left" }}>
                  <div style={{ height: 24, width: "40%", background: "var(--border-primary)", borderRadius: 4, marginBottom: 32 }} />
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 40 }}>
                    <div style={{ height: 100, border: "1px solid var(--border-primary)", borderRadius: 12 }} />
                    <div style={{ height: 100, border: "1px solid var(--border-primary)", borderRadius: 12 }} />
                    <div style={{ height: 100, border: "1px solid var(--border-primary)", borderRadius: 12 }} />
                  </div>
                  <div style={{ height: 200, border: "1px solid var(--border-primary)", borderRadius: 12 }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
    </section>
  );
}
