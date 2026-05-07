"use client";

import { useEffect, useState } from "react";
import { Crown, Medal, Trophy } from "lucide-react";

interface LeaderboardUser {
  _id: string;
  name: string;
  role: string;
  points: number;
}

export default function LeaderboardPage() {
  const [users, setUsers] = useState<LeaderboardUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/leaderboard")
      .then((response) => response.json())
      .then((data) => setUsers(data.users || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown size={18} color="var(--accent-warm)" />;
    if (rank === 2) return <Medal size={18} color="var(--text-secondary)" />;
    if (rank === 3) return <Medal size={18} color="var(--danger)" />;

    return (
      <span
        style={{
          width: 18,
          textAlign: "center",
          color: "var(--text-muted)",
          fontSize: 13,
          fontWeight: 700,
        }}
      >
        {rank}
      </span>
    );
  };

  return (
    <div className="page-container">
      <div
        className="card"
        style={{
          marginBottom: 24,
          padding: "28px clamp(22px, 4vw, 34px)",
          background:
            "linear-gradient(135deg, rgba(245, 184, 109, 0.14), rgba(132, 240, 184, 0.08)), var(--bg-card)",
        }}
      >
        <span className="eyebrow" style={{ marginBottom: 14 }}>
          Leaderboard
        </span>
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(34px, 5vw, 56px)",
            lineHeight: 0.95,
            letterSpacing: "-0.05em",
            marginBottom: 12,
          }}
        >
          The people carrying conversations forward.
        </h1>
        <p style={{ color: "var(--text-secondary)", fontSize: 16, lineHeight: 1.75, maxWidth: 720 }}>
          A cleaner ranking experience makes contribution feel meaningful instead
          of noisy. Celebrate consistency, not just volume.
        </p>
      </div>

      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "72px minmax(0, 1.3fr) 160px 120px",
            gap: 12,
            padding: "18px 22px",
            borderBottom: "1px solid var(--border-primary)",
            color: "var(--text-muted)",
            fontSize: 11,
            fontWeight: 800,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
          }}
        >
          <span>Rank</span>
          <span>Member</span>
          <span>Role</span>
          <span style={{ textAlign: "right" }}>Points</span>
        </div>

        {loading ? (
          <div style={{ padding: 34, textAlign: "center", color: "var(--text-secondary)" }}>
            Loading leaderboard...
          </div>
        ) : users.length === 0 ? (
          <div style={{ padding: 48, textAlign: "center", color: "var(--text-secondary)" }}>
            <Trophy size={34} style={{ margin: "0 auto 12px" }} />
            <p>No users yet. Be the first to build momentum.</p>
          </div>
        ) : (
          users.map((user, index) => (
            <div
              key={user._id}
              style={{
                display: "grid",
                gridTemplateColumns: "72px minmax(0, 1.3fr) 160px 120px",
                gap: 12,
                alignItems: "center",
                padding: "18px 22px",
                borderTop: "1px solid var(--border-primary)",
                background:
                  index === 0
                    ? "linear-gradient(135deg, rgba(245, 184, 109, 0.12), rgba(132, 240, 184, 0.06))"
                    : "transparent",
              }}
            >
              <div style={{ display: "flex", alignItems: "center" }}>{getRankIcon(index + 1)}</div>

              <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 0 }}>
                <div
                  style={{
                    width: 42,
                    height: 42,
                    borderRadius: 16,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background:
                      index < 3
                        ? "linear-gradient(135deg, rgba(132, 240, 184, 0.18), rgba(245, 184, 109, 0.16))"
                        : "rgba(255, 255, 255, 0.04)",
                    border: "1px solid var(--border-primary)",
                    fontWeight: 800,
                    fontSize: 13,
                    flexShrink: 0,
                  }}
                >
                  {user.name
                    .split(" ")
                    .map((part) => part[0])
                    .join("")
                    .toUpperCase()
                    .slice(0, 2)}
                </div>
                <div style={{ minWidth: 0 }}>
                  <p
                    style={{
                      fontSize: 15,
                      fontWeight: 700,
                      color: "var(--text-primary)",
                      marginBottom: 4,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {user.name}
                  </p>
                  <p style={{ color: "var(--text-secondary)", fontSize: 12 }}>
                    Active contributor
                  </p>
                </div>
              </div>

              <span style={{ color: "var(--text-secondary)", fontSize: 13, textTransform: "capitalize" }}>
                {user.role}
              </span>

              <span
                style={{
                  textAlign: "right",
                  fontFamily: "var(--font-display)",
                  fontSize: 26,
                  fontWeight: 700,
                  letterSpacing: "-0.04em",
                }}
              >
                {user.points.toLocaleString()}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
