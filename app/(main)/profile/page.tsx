"use client";

import { useEffect, useRef, useState } from "react";
import {
  Award,
  Camera,
  Calendar,
  Loader2,
  LogOut,
  Moon,
  Save,
  Star,
  Sun,
  Zap,
} from "lucide-react";
import { logout } from "@/app/actions/auth";

interface UserData {
  _id: string;
  name: string;
  email: string;
  bio: string;
  avatar: string;
  role: string;
  points: number;
  streak: number;
  joinedCommunities: string[];
  createdCommunity: string | null;
  createdAt: string;
}

interface GrowthTimelineItem {
  _id: string;
  overallScore: number;
  summary?: string;
  badgesEarned?: string[];
  createdAt: string;
  meetingId?: {
    _id: string;
    title: string;
    topic?: string;
    scheduledAt: string;
    template?: string;
    community?: { name: string };
  };
}

export default function ProfilePage() {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [avatar, setAvatar] = useState("");
  const [timeline, setTimeline] = useState<GrowthTimelineItem[]>([]);
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    if (typeof window === "undefined") return "light";

    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "light" || savedTheme === "dark") {
      return savedTheme;
    }

    return document.documentElement.getAttribute("data-theme") === "dark"
      ? "dark"
      : "light";
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    Promise.all([
      fetch("/api/user/profile").then((response) => response.json()),
      fetch("/api/user/growth").then((response) => response.json()),
    ])
      .then(([profileData, growthData]) => {
        setUser(profileData.user);
        setName(profileData.user?.name || "");
        setBio(profileData.user?.bio || "");
        setAvatar(profileData.user?.avatar || "");
        setTimeline(growthData.timeline || []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    localStorage.setItem("theme", nextTheme);

    document.documentElement.setAttribute("data-theme", nextTheme);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, bio, avatar }),
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      }
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert("Image must be smaller than 2MB");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => setAvatar(reader.result as string);
    reader.readAsDataURL(file);
  };

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Loader2 size={30} className="animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  const initials = user.name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="page-container">
      <div
        className="card profile-hero-row"
        style={{
          marginBottom: 28,
          padding: "28px clamp(22px, 4vw, 34px)",
          display: "flex",
          alignItems: "center",
          gap: 24,
          flexWrap: "wrap",
          background:
            "linear-gradient(135deg, rgba(132, 240, 184, 0.14), rgba(245, 184, 109, 0.1)), var(--bg-card)",
        }}
      >
        <div style={{ position: "relative" }}>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            style={{
              width: 132,
              height: 132,
              borderRadius: 36,
              border: "1px solid var(--border-secondary)",
              background: avatar ? `url(${avatar}) center/cover` : "rgba(255, 255, 255, 0.05)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: "var(--font-display)",
              fontSize: 40,
              fontWeight: 700,
              cursor: "pointer",
              overflow: "hidden",
              position: "relative",
            }}
          >
            {!avatar && initials}
            <span
              style={{
                position: "absolute",
                inset: "auto 10px 10px auto",
                width: 36,
                height: 36,
                borderRadius: 14,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "rgba(4, 11, 9, 0.7)",
                border: "1px solid var(--border-primary)",
              }}
            >
              <Camera size={16} />
            </span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleImageUpload}
            accept="image/*"
            style={{ display: "none" }}
          />
        </div>

        <div style={{ flex: 1, minWidth: 280 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", marginBottom: 12 }}>
            <span className="badge-outline">{user.role}</span>
            <span
              style={{
                color: "var(--text-secondary)",
                fontSize: 13,
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              <Calendar size={14} />
              Joined{" "}
              {new Date(user.createdAt).toLocaleDateString("en-US", {
                month: "long",
                year: "numeric",
              })}
            </span>
          </div>

          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(34px, 5vw, 52px)",
              lineHeight: 0.95,
              letterSpacing: "-0.05em",
              marginBottom: 12,
            }}
          >
            {user.name}
          </h1>
          <p style={{ color: "var(--text-secondary)", lineHeight: 1.8, fontSize: 16 }}>
            {user.bio || "No bio yet. Add a short description so communities know what you bring to the room."}
          </p>
        </div>
      </div>

      <div
        className="profile-content-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 1.4fr) minmax(300px, 0.85fr)",
          gap: 24,
          alignItems: "start",
        }}
      >
        <section>
          <div className="card" style={{ padding: "26px clamp(20px, 4vw, 30px)" }}>
            <div style={{ marginBottom: 24 }}>
              <p className="stat-label" style={{ marginBottom: 10 }}>
                Account Settings
              </p>
              <h2
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 32,
                  letterSpacing: "-0.05em",
                  marginBottom: 10,
                }}
              >
                Keep your profile current.
              </h2>
              <p style={{ color: "var(--text-secondary)", lineHeight: 1.75 }}>
                A more polished profile gives your communities context before you even speak.
              </p>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              <div>
                <label className="label">Interface Theme</label>
                <div className="profile-theme-grid" style={{ display: "flex", gap: 10 }}>
                  <button
                    type="button"
                    onClick={() => theme === "light" && toggleTheme()}
                    className="btn btn-secondary"
                    style={{
                      flex: 1,
                      background: theme === "dark" ? "rgba(255, 255, 255, 0.08)" : undefined,
                    }}
                  >
                    <Moon size={16} />
                    Dark
                  </button>
                  <button
                    type="button"
                    onClick={() => theme === "dark" && toggleTheme()}
                    className="btn btn-secondary"
                    style={{
                      flex: 1,
                      background: theme === "light" ? "rgba(255, 255, 255, 0.08)" : undefined,
                    }}
                  >
                    <Sun size={16} />
                    Light
                  </button>
                </div>
              </div>

              <div>
                <label className="label">Full Name</label>
                <input
                  className="input"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="How should people know you?"
                />
              </div>

              <div>
                <label className="label">Bio</label>
                <textarea
                  className="input"
                  value={bio}
                  onChange={(event) => setBio(event.target.value)}
                  rows={5}
                  placeholder="Tell the community what you care about and what kind of conversations you enjoy."
                  maxLength={300}
                />
                <div style={{ marginTop: 8, textAlign: "right", color: "var(--text-muted)", fontSize: 12 }}>
                  {bio.length}/300
                </div>
              </div>

              <button type="button" onClick={handleSave} disabled={saving} className="btn btn-primary">
                {saving ? "Saving..." : "Save profile"}
                {!saving && <Save size={16} />}
              </button>
            </div>
          </div>

          <div className="card profile-security-panel" style={{ marginTop: 20, padding: 24, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 18 }}>
            <div>
              <p className="stat-label" style={{ marginBottom: 8, color: "var(--danger)" }}>
                Session Control
              </p>
              <h3 style={{ fontSize: 22, fontWeight: 700, letterSpacing: "-0.03em", marginBottom: 6 }}>
                Sign out on this device
              </h3>
              <p style={{ color: "var(--text-secondary)", lineHeight: 1.7 }}>
                End your current session safely when you are done.
              </p>
            </div>
            <form action={logout}>
              <button type="submit" className="btn btn-secondary">
                <LogOut size={16} />
                Sign out
              </button>
            </form>
          </div>
        </section>

        <aside style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div className="card">
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 18 }}>
              <div
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: 16,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "rgba(245, 184, 109, 0.16)",
                }}
              >
                <Star size={18} color="var(--accent-warm)" />
              </div>
              <div>
                <p className="stat-label" style={{ marginBottom: 6 }}>
                  Contribution
                </p>
                <h3 style={{ fontSize: 28, fontWeight: 700, letterSpacing: "-0.04em" }}>
                  {user.points.toLocaleString()}
                </h3>
              </div>
            </div>
            <p style={{ color: "var(--text-secondary)", fontSize: 14, lineHeight: 1.7 }}>
              Your points reflect how consistently you participate in community discussions.
            </p>
          </div>

          <div className="card">
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 18 }}>
              <div
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: 16,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "rgba(255, 133, 116, 0.16)",
                }}
              >
                <Zap size={18} color="var(--danger)" />
              </div>
              <div>
                <p className="stat-label" style={{ marginBottom: 6 }}>
                  Streak
                </p>
                <h3 style={{ fontSize: 28, fontWeight: 700, letterSpacing: "-0.04em" }}>
                  {user.streak} days
                </h3>
              </div>
            </div>
            <p style={{ color: "var(--text-secondary)", fontSize: 14, lineHeight: 1.7 }}>
              Momentum matters. Keep showing up to retain your streak.
            </p>
          </div>

          <div className="card">
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 18 }}>
              <div
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: 16,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "rgba(132, 240, 184, 0.16)",
                }}
              >
                <Award size={18} color="var(--accent)" />
              </div>
              <div>
                <p className="stat-label" style={{ marginBottom: 6 }}>
                  Community Reach
                </p>
                <h3 style={{ fontSize: 28, fontWeight: 700, letterSpacing: "-0.04em" }}>
                  {(user.joinedCommunities?.length || 0) + (user.createdCommunity ? 1 : 0)}
                </h3>
              </div>
            </div>
            <div style={{ display: "grid", gap: 10, color: "var(--text-secondary)", fontSize: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                <span>Joined communities</span>
                <strong>{user.joinedCommunities?.length || 0}</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                <span>Hosted communities</span>
                <strong>{user.createdCommunity ? 1 : 0}</strong>
              </div>
            </div>
          </div>

          <div className="card">
            <p className="stat-label" style={{ marginBottom: 12 }}>
              Growth Timeline
            </p>
            <div style={{ display: "grid", gap: 12 }}>
              {timeline.length === 0 ? (
                <p style={{ color: "var(--text-secondary)", lineHeight: 1.7 }}>
                  Your coach journal will appear here after you open meeting reports.
                </p>
              ) : (
                timeline.slice(0, 5).map((item) => (
                  <div key={item._id} className="card" style={{ padding: 14 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", gap: 10, marginBottom: 8 }}>
                      <strong style={{ fontSize: 14 }}>
                        {item.meetingId?.title || "Meeting report"}
                      </strong>
                      <span style={{ color: "var(--text-muted)", fontSize: 12 }}>
                        {item.overallScore}
                      </span>
                    </div>
                    <p style={{ color: "var(--text-secondary)", fontSize: 13, lineHeight: 1.6, marginBottom: 10 }}>
                      {item.summary || "Coach summary saved for this session."}
                    </p>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                      {(item.badgesEarned || []).slice(0, 2).map((badge) => (
                        <span key={badge} className="badge-outline">
                          {badge}
                        </span>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
