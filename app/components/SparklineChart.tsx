"use client";

interface SparklineChartProps {
  scores: number[];
  width?: number;
  height?: number;
  color?: string;
}

export default function SparklineChart({
  scores,
  width = 260,
  height = 72,
  color = "var(--accent)",
}: SparklineChartProps) {
  if (scores.length < 2) {
    return (
      <p style={{ color: "var(--text-muted)", fontSize: 13 }}>
        Attend at least 2 rooms to see your trend.
      </p>
    );
  }

  const padX = 8;
  const padY = 8;
  const w = width - padX * 2;
  const h = height - padY * 2;

  const min = Math.min(...scores);
  const max = Math.max(...scores);
  const range = max - min || 1;

  const points = scores.map((score, i) => {
    const x = padX + (i / (scores.length - 1)) * w;
    const y = padY + h - ((score - min) / range) * h;
    return `${x},${y}`;
  });

  const lastScore = scores[scores.length - 1];
  const firstScore = scores[0];
  const delta = lastScore - firstScore;
  const deltaColor = delta >= 0 ? "var(--success)" : "var(--danger)";
  const deltaLabel = delta >= 0 ? `+${delta.toFixed(0)}` : `${delta.toFixed(0)}`;

  // Build fill path (area under the line)
  const lastPoint = points[points.length - 1].split(",");
  const firstPoint = points[0].split(",");
  const areaPath = [
    `M ${firstPoint[0]},${height - padY}`,
    `L ${points.join(" L ")}`,
    `L ${lastPoint[0]},${height - padY}`,
    "Z",
  ].join(" ");

  return (
    <div>
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          justifyContent: "space-between",
          marginBottom: 10,
        }}
      >
        <p style={{ color: "var(--text-muted)", fontSize: 12 }}>
          Overall Score — last {scores.length} sessions
        </p>
        <span style={{ fontSize: 12, fontWeight: 700, color: deltaColor }}>
          {deltaLabel} pts
        </span>
      </div>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        width="100%"
        style={{ overflow: "visible" }}
        aria-hidden="true"
      >
        {/* Gradient fill */}
        <defs>
          <linearGradient id="spark-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.25" />
            <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={areaPath} fill="url(#spark-grad)" />

        {/* Line */}
        <polyline
          points={points.join(" ")}
          fill="none"
          stroke={color}
          strokeWidth={2}
          strokeLinejoin="round"
          strokeLinecap="round"
        />

        {/* Data points */}
        {points.map((pt, i) => {
          const [x, y] = pt.split(",").map(Number);
          const isLast = i === points.length - 1;
          return (
            <circle
              key={i}
              cx={x}
              cy={y}
              r={isLast ? 4 : 2.5}
              fill={isLast ? color : "var(--bg-card)"}
              stroke={color}
              strokeWidth={1.5}
            />
          );
        })}
      </svg>

      {/* Score labels */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: 6,
          color: "var(--text-muted)",
          fontSize: 11,
        }}
      >
        <span>{firstScore}</span>
        <span style={{ color, fontWeight: 700 }}>{lastScore} now</span>
      </div>
    </div>
  );
}
