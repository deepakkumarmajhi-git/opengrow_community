"use client";

import { useEffect, useState } from "react";

export default function DashboardGreeting({ name }: { name: string }) {
  const [copy, setCopy] = useState<{ dateStr: string; greeting: string } | null>(null);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        weekday: "long",
        month: "long",
        day: "numeric",
      };

      const hour = now.getHours();
      const greeting =
        hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

      setCopy({
        dateStr: now.toLocaleDateString("en-US", options),
        greeting,
      });
    });

    return () => window.cancelAnimationFrame(frame);
  }, []);

  if (!copy) {
    return <div style={{ minHeight: 124, marginBottom: 30 }} />;
  }

  return (
    <div
      className="card"
      style={{
        marginBottom: 30,
        padding: "26px clamp(20px, 4vw, 32px)",
        borderRadius: 30,
        background:
          "linear-gradient(135deg, rgba(132, 240, 184, 0.14), rgba(245, 184, 109, 0.1)), var(--bg-card)",
      }}
    >
      <p className="stat-label" style={{ marginBottom: 12 }}>
        {copy.dateStr}
      </p>
      <h1
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(30px, 4vw, 46px)",
          lineHeight: 0.95,
          letterSpacing: "-0.05em",
          marginBottom: 8,
        }}
      >
        {copy.greeting}, {name}.
      </h1>
      <p style={{ color: "var(--text-secondary)", fontSize: 15, lineHeight: 1.7 }}>
        Your communities, sessions, and progress are all in one calmer workspace now.
      </p>
    </div>
  );
}
