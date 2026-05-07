"use client";

import { useEffect, useState } from "react";
import {
  TrendingUp,
  Users,
  Award,
  Loader2,
  Target,
  Zap,
} from "lucide-react";

interface AnalyticsData {
  totalMeetings: number;
  completedMeetings: number;
  upcomingMeetings: number;
  totalMembers: number;
  totalReports: number;
  avgAttendance: number;
  avgScore: number;
  avgClarity: number;
  topMembers: Array<{
    _id: string;
    name: string;
    role: string;
    points: number;
    streak: number;
  }>;
  weeklyActivity: Array<{
    label: string;
    count: number;
  }>;
}

export default function CommunityAnalytics({ communityId }: { communityId: string }) {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await fetch(`/api/communities/${communityId}/analytics`);
        if (res.ok) {
          const json = await res.json();
          setData(json);
        }
      } catch (err) {
        console.error("Failed to fetch analytics:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [communityId]);

  if (loading) {
    return (
      <div className="card" style={{ padding: 40, textAlign: "center" }}>
        <Loader2 size={24} className="animate-spin" style={{ margin: "0 auto 12px" }} />
        <p style={{ color: "var(--text-secondary)", fontSize: 14 }}>Calculating community insights...</p>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24, marginBottom: 32 }}>
      {/* Stats Overview */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: 16,
        }}
      >
        <div className="card" style={{ padding: 20 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
            <span className="stat-label">Avg. Attendance</span>
            <Users size={16} color="var(--accent)" />
          </div>
          <p style={{ fontFamily: "var(--font-display)", fontSize: 32, fontWeight: 700 }}>
            {data.avgAttendance}
            <span style={{ fontSize: 14, color: "var(--text-muted)", fontWeight: 400, marginLeft: 4 }}>per session</span>
          </p>
        </div>

        <div className="card" style={{ padding: 20 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
            <span className="stat-label">Avg. AI Score</span>
            <Target size={16} color="var(--success)" />
          </div>
          <p style={{ fontFamily: "var(--font-display)", fontSize: 32, fontWeight: 700 }}>
            {data.avgScore}
            <span style={{ fontSize: 14, color: "var(--text-muted)", fontWeight: 400, marginLeft: 4 }}>/100</span>
          </p>
        </div>

        <div className="card" style={{ padding: 20 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
            <span className="stat-label">Clarity Level</span>
            <Zap size={16} color="var(--accent-warm)" />
          </div>
          <p style={{ fontFamily: "var(--font-display)", fontSize: 32, fontWeight: 700 }}>
            {data.avgClarity}%
          </p>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.5fr 1fr",
          gap: 24,
          alignItems: "start",
        }}
      >
        {/* Weekly Activity Sparkline-ish */}
        <div className="card" style={{ padding: 24 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, display: "flex", alignItems: "center", gap: 8 }}>
              <TrendingUp size={18} color="var(--accent)" />
              Weekly Rhythm
            </h3>
            <span style={{ fontSize: 12, color: "var(--text-muted)" }}>Last 8 weeks</span>
          </div>
          
          <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 120, paddingTop: 10 }}>
            {data.weeklyActivity.map((week, i) => {
              const max = Math.max(...data.weeklyActivity.map(w => w.count), 1);
              const height = (week.count / max) * 100;
              return (
                <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                  <div 
                    style={{ 
                      width: "100%", 
                      height: `${height}%`, 
                      minHeight: week.count > 0 ? 4 : 0,
                      background: i === data.weeklyActivity.length - 1 ? "var(--accent)" : "rgba(132, 240, 184, 0.15)",
                      borderRadius: "4px 4px 0 0",
                      transition: "height 0.6s ease"
                    }} 
                    title={`${week.count} sessions`}
                  />
                  <span style={{ fontSize: 9, color: "var(--text-muted)", whiteSpace: "nowrap" }}>{week.label}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top Contributors */}
        <div className="card" style={{ padding: 24 }}>
          <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
            <Award size={18} color="var(--accent-warm)" />
            Engaged Members
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {data.topMembers.map((member) => (
              <div key={member._id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ 
                    width: 32, 
                    height: 32, 
                    borderRadius: 10, 
                    background: "var(--bg-tertiary)", 
                    display: "flex", 
                    alignItems: "center", 
                    justifyContent: "center",
                    fontSize: 11,
                    fontWeight: 700
                  }}>
                    {member.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                  </div>
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 700 }}>{member.name}</p>
                    <p style={{ fontSize: 11, color: "var(--text-muted)" }}>{member.points.toLocaleString()} pts</p>
                  </div>
                </div>
                {member.streak > 0 && (
                  <span style={{ fontSize: 11, fontWeight: 700, color: "var(--accent-warm)", display: "flex", alignItems: "center", gap: 2 }}>
                    <Zap size={10} fill="currentColor" />
                    {member.streak}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
