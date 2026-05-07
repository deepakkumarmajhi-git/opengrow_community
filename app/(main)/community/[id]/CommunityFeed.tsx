"use client";

import { useEffect, useState } from "react";
import { 
  MessageSquare, 
  UserPlus, 
  Calendar, 
  CheckCircle2, 
  Megaphone,
  Loader2,
  Clock
} from "lucide-react";

interface FeedItem {
  _id: string;
  userName: string;
  type: "join" | "meeting_scheduled" | "meeting_completed" | "goal_completed" | "announcement";
  content: string;
  createdAt: string;
  metadata?: Record<string, unknown>;
}

const TYPE_ICON = {
  join: UserPlus,
  meeting_scheduled: Calendar,
  meeting_completed: CheckCircle2,
  goal_completed: CheckCircle2,
  announcement: Megaphone,
};

const TYPE_COLOR = {
  join: "var(--success)",
  meeting_scheduled: "var(--accent)",
  meeting_completed: "var(--accent-warm)",
  goal_completed: "var(--success)",
  announcement: "var(--info)",
};

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h`;
  return `${Math.floor(hrs / 24)}d`;
}

export default function CommunityFeed({ communityId }: { communityId: string }) {
  const [feed, setFeed] = useState<FeedItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeed = async () => {
      try {
        const res = await fetch(`/api/communities/${communityId}/feed`);
        if (res.ok) {
          const data = await res.json();
          setFeed(data.feed || []);
        }
      } catch (err) {
        console.error("Failed to fetch feed:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFeed();
  }, [communityId]);

  if (loading) {
    return (
      <div className="card" style={{ padding: 24, textAlign: "center" }}>
        <Loader2 size={20} className="animate-spin" style={{ margin: "0 auto 8px" }} />
        <p style={{ color: "var(--text-secondary)", fontSize: 13 }}>Loading activity...</p>
      </div>
    );
  }

  return (
    <div className="card" style={{ padding: 24 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <h3 style={{ fontSize: 18, fontWeight: 700, display: "flex", alignItems: "center", gap: 8 }}>
          <MessageSquare size={18} color="var(--accent)" />
          Activity Log
        </h3>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        {feed.length === 0 ? (
          <p style={{ color: "var(--text-secondary)", fontSize: 14, textAlign: "center", padding: "10px 0" }}>
            No recent activity. Start the conversation!
          </p>
        ) : (
          feed.map((item) => {
            const Icon = TYPE_ICON[item.type] || MessageSquare;
            const color = TYPE_COLOR[item.type] || "var(--text-muted)";
            
            return (
              <div key={item._id} style={{ display: "flex", gap: 14, position: "relative" }}>
                <div style={{
                  width: 32,
                  height: 32,
                  borderRadius: 10,
                  background: `${color}15`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0
                }}>
                  <Icon size={14} color={color} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 13, lineHeight: 1.5, color: "var(--text-primary)" }}>
                    <strong style={{ color: "var(--text-primary)" }}>{item.userName}</strong>{" "}
                    <span style={{ color: "var(--text-secondary)" }}>{item.content}</span>
                  </p>
                  <p style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 4, display: "flex", alignItems: "center", gap: 4 }}>
                    <Clock size={10} />
                    {timeAgo(item.createdAt)}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
