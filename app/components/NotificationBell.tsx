"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Bell, CheckCheck, Video, Users, Award, Megaphone, Info } from "lucide-react";

interface AppNotification {
  _id: string;
  type: "meeting_reminder" | "new_member" | "badge_earned" | "community_update" | "system";
  title: string;
  body: string;
  href?: string;
  read: boolean;
  createdAt: string;
}

const TYPE_ICON: Record<AppNotification["type"], React.ElementType> = {
  meeting_reminder: Video,
  new_member: Users,
  badge_earned: Award,
  community_update: Megaphone,
  system: Info,
};

const TYPE_COLOR: Record<AppNotification["type"], string> = {
  meeting_reminder: "var(--accent)",
  new_member: "var(--success)",
  badge_earned: "var(--accent-warm)",
  community_update: "var(--info)",
  system: "var(--text-muted)",
};

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const panelRef = useRef<HTMLDivElement>(null);

  const fetchNotifications = async () => {
    try {
      const res = await fetch("/api/notifications");
      if (!res.ok) return;
      const data = await res.json();
      setNotifications(data.notifications ?? []);
      setUnreadCount(data.unreadCount ?? 0);
    } catch {
      // silently ignore
    }
  };

  useEffect(() => {
    void (async () => {
      await fetchNotifications();
    })();
    // Poll every 60 seconds for new notifications
    const interval = setInterval(() => { void fetchNotifications(); }, 60_000);
    return () => clearInterval(interval);
  }, []);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const handleOpen = async () => {
    setOpen((prev) => !prev);
    if (!open && unreadCount > 0) {
      // Optimistically clear badge
      setUnreadCount(0);
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      await fetch("/api/notifications", { method: "PATCH" });
    }
  };

  return (
    <div ref={panelRef} style={{ position: "relative" }}>
      <button
        type="button"
        onClick={handleOpen}
        aria-label={`Notifications${unreadCount > 0 ? `, ${unreadCount} unread` : ""}`}
        style={{
          position: "relative",
          width: 40,
          height: 40,
          borderRadius: 14,
          border: "1px solid var(--border-primary)",
          background: open ? "var(--bg-tertiary)" : "transparent",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          transition: "background 0.15s ease",
          color: "var(--text-secondary)",
        }}
      >
        <Bell size={18} />
        {unreadCount > 0 && (
          <span
            style={{
              position: "absolute",
              top: 7,
              right: 7,
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: "var(--danger)",
              border: "1.5px solid var(--bg-primary)",
            }}
          />
        )}
      </button>

      {open && (
        <div
          style={{
            position: "absolute",
            bottom: "calc(100% + 8px)",
            left: "50%",
            transform: "translateX(-50%)",
            width: 340,
            maxHeight: 440,
            borderRadius: 20,
            background: "var(--bg-elevated)",
            border: "1px solid var(--border-strong)",
            boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            zIndex: 200,
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: "16px 20px",
              borderBottom: "1px solid var(--border-primary)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <p style={{ fontWeight: 700, fontSize: 15 }}>Notifications</p>
            {notifications.some((n) => n.read) && (
              <div style={{ display: "flex", alignItems: "center", gap: 4, color: "var(--text-muted)", fontSize: 12 }}>
                <CheckCheck size={14} />
                All caught up
              </div>
            )}
          </div>

          {/* List */}
          <div style={{ overflowY: "auto", flex: 1 }}>
            {notifications.length === 0 ? (
              <div style={{ padding: "32px 20px", textAlign: "center" }}>
                <Bell size={28} color="var(--text-muted)" style={{ margin: "0 auto 12px" }} />
                <p style={{ color: "var(--text-muted)", fontSize: 14, lineHeight: 1.6 }}>
                  No notifications yet. Join rooms and communities to get started.
                </p>
              </div>
            ) : (
              notifications.map((n) => {
                const Icon = TYPE_ICON[n.type];
                const color = TYPE_COLOR[n.type];
                const inner = (
                  <div
                    style={{
                      display: "flex",
                      gap: 12,
                      padding: "14px 20px",
                      borderBottom: "1px solid var(--border-primary)",
                      background: !n.read ? "rgba(132,240,184,0.04)" : "transparent",
                      transition: "background 0.15s ease",
                      cursor: n.href ? "pointer" : "default",
                    }}
                  >
                    <div
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: 12,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background: `${color}18`,
                        flexShrink: 0,
                      }}
                    >
                      <Icon size={16} color={color} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", gap: 6, marginBottom: 3 }}>
                        <p style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary)" }}>
                          {n.title}
                        </p>
                        <span style={{ fontSize: 11, color: "var(--text-muted)", flexShrink: 0 }}>
                          {timeAgo(n.createdAt)}
                        </span>
                      </div>
                      <p style={{ fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.55 }}>
                        {n.body}
                      </p>
                    </div>
                    {!n.read && (
                      <div
                        style={{
                          width: 7,
                          height: 7,
                          borderRadius: "50%",
                          background: "var(--accent)",
                          flexShrink: 0,
                          marginTop: 4,
                        }}
                      />
                    )}
                  </div>
                );

                return n.href ? (
                  <Link key={n._id} href={n.href} onClick={() => setOpen(false)} style={{ display: "block", textDecoration: "none" }}>
                    {inner}
                  </Link>
                ) : (
                  <div key={n._id}>{inner}</div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
