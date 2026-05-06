"use client";

import { useState, useEffect } from "react";
import { Trophy, Medal, Crown } from "lucide-react";

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
      .then((res) => res.json())
      .then((data) => setUsers(data.users || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown size={18} color="#f59e0b" />;
    if (rank === 2) return <Medal size={18} color="#94a3b8" />;
    if (rank === 3) return <Medal size={18} color="#d97706" />;
    return (
      <span style={{ fontSize: 14, color: "var(--text-muted)", fontWeight: 500, width: 18, textAlign: "center", display: "inline-block" }}>
        {rank}
      </span>
    );
  };

  return (
    <div className="page-container">
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 4 }}>
          Leaderboard
        </h1>
        <p style={{ fontSize: 15, color: "var(--text-muted)" }}>
          Top contributors in the OpenGrow community
        </p>
      </div>

      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        {/* Header */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "60px 1fr 120px 100px",
            padding: "12px 20px",
            background: "var(--bg-tertiary)",
            fontSize: 12,
            fontWeight: 600,
            color: "var(--text-muted)",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
          }}
        >
          <span>Rank</span>
          <span>Member</span>
          <span>Role</span>
          <span style={{ textAlign: "right" }}>Points</span>
        </div>

        {loading ? (
          <div style={{ padding: 40, textAlign: "center", color: "var(--text-muted)" }}>
            Loading...
          </div>
        ) : users.length === 0 ? (
          <div style={{ padding: 40, textAlign: "center", color: "var(--text-muted)" }}>
            <Trophy size={32} style={{ margin: "0 auto 8px", opacity: 0.5 }} />
            <p>No users yet. Be the first!</p>
          </div>
        ) : (
          users.map((user, idx) => (
            <div
              key={user._id}
              style={{
                display: "grid",
                gridTemplateColumns: "60px 1fr 120px 100px",
                padding: "14px 20px",
                alignItems: "center",
                borderTop: "1px solid var(--border-primary)",
                background: idx < 3 ? "rgba(34, 197, 94, 0.02)" : "transparent",
              }}
            >
              <div style={{ display: "flex", alignItems: "center" }}>
                {getRankIcon(idx + 1)}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: "var(--radius-md)",
                    background: idx < 3 ? "var(--accent-muted)" : "var(--bg-tertiary)",
                    color: idx < 3 ? "var(--accent)" : "var(--text-muted)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 600,
                    fontSize: 12,
                  }}
                >
                  {user.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()
                    .slice(0, 2)}
                </div>
                <span style={{ fontSize: 14, fontWeight: 500 }}>
                  {user.name}
                </span>
              </div>
              <span
                style={{
                  fontSize: 12,
                  color: "var(--text-muted)",
                  textTransform: "capitalize",
                }}
              >
                {user.role}
              </span>
              <span
                style={{
                  textAlign: "right",
                  fontSize: 14,
                  fontWeight: 600,
                  color: idx < 3 ? "var(--accent)" : "var(--text-primary)",
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
