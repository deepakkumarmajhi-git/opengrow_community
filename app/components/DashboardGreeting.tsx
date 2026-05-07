"use client";

import { useEffect, useState } from "react";

export default function DashboardGreeting({ name }: { name: string }) {
  const [dateStr, setDateStr] = useState("");
  const [greeting, setGreeting] = useState("");

  useEffect(() => {
    const now = new Date();

    // Format: Wednesday, May 6
    const options: Intl.DateTimeFormatOptions = { weekday: 'long', month: 'long', day: 'numeric' };
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDateStr(now.toLocaleDateString('en-US', options));

    // Determine greeting
    const hour = now.getHours();
    if (hour < 12) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setGreeting("Good morning");
    } else if (hour < 18) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setGreeting("Good afternoon");
    } else {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setGreeting("Good evening");
    }
  }, []);

  // Fallback for SSR to prevent hydration mismatch
  if (!dateStr) {
    return (
      <div style={{ marginBottom: 32, minHeight: 68 }}>
        <p style={{ fontSize: 15, color: "var(--text-muted)", marginBottom: 4, opacity: 0 }}>
          Loading...
        </p>
        <h1 style={{ fontSize: 28, fontWeight: 700, opacity: 0 }}>
          Welcome back, {name}
        </h1>
      </div>
    );
  }

  return (
    <div style={{ marginBottom: 32 }}>
      <p style={{ fontSize: 15, color: "var(--text-muted)", marginBottom: 4, fontWeight: 500 }}>
        {dateStr}
      </p>
      <h1 style={{ fontSize: 28, fontWeight: 700 }}>
        {greeting}, {name}
      </h1>
    </div>
  );
}
