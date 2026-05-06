"use client";

import { useEffect, useRef, useState } from "react";

const stats = [
  { value: 1200, label: "Active Members", suffix: "+" },
  { value: 85, label: "Communities", suffix: "+" },
  { value: 15000, label: "Discussions", suffix: "+" },
  { value: 96, label: "Satisfaction", suffix: "%" },
];

function AnimatedCounter({
  target,
  suffix,
}: {
  target: number;
  suffix: string;
}) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const duration = 2000;
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
        }
      },
      { threshold: 0.3 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  return (
    <div ref={ref} style={{ textAlign: "center" }}>
      <div
        style={{
          fontSize: "clamp(32px, 4vw, 48px)",
          fontWeight: 700,
          letterSpacing: "-0.03em",
        }}
        className="text-gradient"
      >
        {count.toLocaleString()}
        {suffix}
      </div>
      <div
        style={{
          fontSize: 14,
          color: "var(--text-muted)",
          marginTop: 4,
        }}
      >
        {stats.find((s) => s.value === target)?.label}
      </div>
    </div>
  );
}

export default function Stats() {
  return (
    <section
      id="stats"
      style={{
        padding: "80px 24px",
        background: "var(--bg-secondary)",
        borderTop: "1px solid var(--border-primary)",
        borderBottom: "1px solid var(--border-primary)",
      }}
    >
      <div
        style={{
          maxWidth: 900,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: 32,
        }}
      >
        {stats.map((stat) => (
          <AnimatedCounter
            key={stat.label}
            target={stat.value}
            suffix={stat.suffix}
          />
        ))}
      </div>
    </section>
  );
}
