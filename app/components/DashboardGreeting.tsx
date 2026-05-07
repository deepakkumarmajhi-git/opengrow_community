"use client";

import { useEffect, useState } from "react";

export default function DashboardGreeting({ 
  name, 
  role 
}: { 
  name: string; 
  role?: string;
}) {
  const [copy, setCopy] = useState<{ dateStr: string; greeting: string } | null>(null);

  const roleMessages: Record<string, string> = {
    student: "Ready to learn? Here are rooms for academic discussion and speaking practice.",
    developer: "Keep building. Here are rooms for technical communication and dev collaboration.",
    professional: "Lead with presence. Here are rooms for leadership and professional growth.",
    teacher: "Share your wisdom. Here are rooms for mentoring and pedagogical practice.",
    default: "Your communities, sessions, and progress are all in one calmer workspace now.",
  };

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
    <div style={{ marginBottom: 30 }}>
      <p className="stat-label" style={{ marginBottom: 8 }}>
        {copy.dateStr}
      </p>
      <h1
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(24px, 3vw, 32px)",
          lineHeight: 1.1,
          letterSpacing: "-0.02em",
          marginBottom: 8,
          fontWeight: 600
        }}
      >
        {copy.greeting}, {name}.
      </h1>
      <p style={{ color: "var(--text-secondary)", fontSize: 15 }}>
        {roleMessages[role || "default"] || roleMessages.default}
      </p>
    </div>
  );
}
