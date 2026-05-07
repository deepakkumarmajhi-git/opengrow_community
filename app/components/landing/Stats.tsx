"use client";

import { useEffect, useRef, useState } from "react";

const defaultStats = [
  { id: "members", value: 1200, label: "Members speaking every month", suffix: "+" },
  { id: "communities", value: 48, label: "Focused communities", suffix: "+" },
  { id: "moments", value: 9400, label: "Discussion moments captured", suffix: "+" },
  { id: "confidence", value: 87, label: "Members reporting confidence gains", suffix: "%" },
];

function AnimatedCounter({
  target,
  suffix,
  id,
}: {
  target: number;
  suffix: string;
  id: string;
}) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || hasAnimated.current) return;

        hasAnimated.current = true;
        const duration = 1800;
        const steps = 60;
        const increment = target / steps;
        let current = 0;

        const interval = setInterval(() => {
          current += increment;
          if (current >= target) {
            setCount(target);
            clearInterval(interval);
          } else {
            setCount(Math.floor(current));
          }
        }, duration / steps);
      },
      { threshold: 0.35 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  return (
    <div
      ref={ref}
      className="card"
      style={{
        padding: 24,
        borderRadius: 26,
        minHeight: 190,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <div className="stat-label">Community Pulse</div>
      <div>
        <div
          className="text-gradient"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(34px, 5vw, 54px)",
            fontWeight: 700,
            letterSpacing: "-0.06em",
            lineHeight: 0.92,
          }}
        >
          {count.toLocaleString()}
          {suffix}
        </div>
        <p
          style={{
            marginTop: 12,
            color: "var(--text-secondary)",
            fontSize: 14,
            lineHeight: 1.65,
          }}
        >
          {defaultStats.find((stat) => stat.id === id)?.label}
        </p>
      </div>
    </div>
  );
}

export default function Stats({
  liveData,
}: {
  liveData?: {
    members?: number;
    communities?: number;
    moments?: number;
    confidence?: number;
  };
}) {
  const stats = defaultStats.map((stat) => ({
    ...stat,
    value: liveData?.[stat.id as keyof typeof liveData] || stat.value,
  }));

  return (
    <section id="stats" style={{ padding: "0 0 96px" }}>
      <div className="section-shell">
        <div
          className="metric-strip"
          style={{
            gap: 16,
          }}
        >
          {stats.map((stat) => (
            <AnimatedCounter
              key={stat.id}
              id={stat.id}
              target={stat.value}
              suffix={stat.suffix}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
