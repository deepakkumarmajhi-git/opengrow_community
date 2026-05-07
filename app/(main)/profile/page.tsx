"use client";

import { useState, useEffect, useRef } from "react";
import { 
  User, 
  Mail, 
  Shield, 
  Star, 
  Save, 
  Loader2, 
  Camera, 
  Calendar, 
  LogOut, 
  ChevronRight, 
  Award,
  Zap,
  Settings,
  Moon,
  Sun,
  Layout
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

export default function ProfilePage() {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [avatar, setAvatar] = useState("");
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Fetch profile data
    fetch("/api/user/profile")
      .then((res) => res.json())
      .then((data) => {
        setUser(data.user);
        setName(data.user?.name || "");
        setBio(data.user?.bio || "");
        setAvatar(data.user?.avatar || "");
      })
      .catch(console.error)
      .finally(() => setLoading(false));

    // Detect theme
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
    if (savedTheme) {
      setTheme(savedTheme);
    } else {
      const isDark = document.documentElement.getAttribute("data-theme") !== "light";
      setTheme(isDark ? "dark" : "light");
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    if (newTheme === "light") {
      document.documentElement.setAttribute("data-theme", "light");
    } else {
      document.documentElement.removeAttribute("data-theme");
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, bio, avatar }),
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
      }
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert("Image must be smaller than 2MB");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatar(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  if (loading) {
    return (
      <div
        style={{ 
          height: "100vh", 
          display: "flex", 
          alignItems: "center", 
          justifyContent: "center",
          background: "var(--bg-primary)"
        }}
      >
        <Loader2 size={32} className="animate-spin" style={{ color: "var(--accent)" }} />
      </div>
    );
  }

  if (!user) return null;

  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)" }}>
      {/* Hero Header */}
      <div className="hero-gradient" style={{ paddingTop: 80, paddingBottom: 60, position: "relative" }}>
        <div className="page-container" style={{ paddingTop: 0, paddingBottom: 0, display: "flex", alignItems: "center", gap: 40, flexWrap: "wrap" }}>
          
          {/* Avatar Area */}
          <div style={{ position: "relative" }}>
            <div
              style={{
                width: 140,
                height: 140,
                borderRadius: 40,
                background: "var(--bg-card)",
                padding: 4,
                boxShadow: "var(--shadow-lg)",
                border: "1px solid var(--border-secondary)"
              }}
            >
              <div
                onClick={() => fileInputRef.current?.click()}
                style={{
                  width: "100%",
                  height: "100%",
                  borderRadius: 36,
                  background: avatar ? `url(${avatar}) center/cover` : "var(--accent-muted)",
                  color: "var(--accent)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 800,
                  fontSize: 48,
                  cursor: "pointer",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                {!avatar && initials}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: "rgba(0,0,0,0.6)",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    opacity: 0,
                    transition: "opacity 0.2s",
                  }}
                  className="avatar-overlay"
                  onMouseEnter={(e) => {
                    const overlay = e.currentTarget as HTMLElement;
                    overlay.style.opacity = "1";
                  }}
                  onMouseLeave={(e) => {
                    const overlay = e.currentTarget as HTMLElement;
                    overlay.style.opacity = "0";
                  }}
                >
                  <Camera size={24} color="#fff" />
                </div>
              </div>
            </div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageUpload}
              accept="image/*"
              style={{ display: "none" }}
            />
          </div>

          <div style={{ flex: 1, minWidth: 300 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
              <span className="badge-outline" style={{ background: "rgba(255,255,255,0.05)" }}>
                {user.role}
              </span>
              <span style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)", display: "flex", alignItems: "center", gap: 6 }}>
                <Calendar size={14} />
                Joined {new Date(user.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
              </span>
            </div>
            <h1 style={{ fontSize: "clamp(32px, 5vw, 48px)", fontWeight: 800, marginBottom: 8, letterSpacing: "-0.04em" }}>
              {user.name}
            </h1>
            <p style={{ fontSize: 18, color: "var(--text-secondary)", maxWidth: 600, lineHeight: 1.6 }}>
              {user.bio || "No bio added yet. Tell the community about yourself."}
            </p>
          </div>
        </div>
      </div>

      <div className="page-container" style={{ paddingTop: 60, paddingBottom: 100 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 350px", gap: 60, alignItems: "start" }}>
          
          {/* Main Content - Settings */}
          <div>
            <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 32, display: "flex", alignItems: "center", gap: 10 }}>
              <Settings size={22} />
              Account Settings
            </h2>

            <div className="glass-panel" style={{ padding: 40, display: "flex", flexDirection: "column", gap: 32 }}>
              
              {/* Theme Toggle */}
              <div>
                <label className="label-minimal">Interface Aesthetics</label>
                <div style={{ display: "flex", gap: 12, marginTop: 12 }}>
                  <button 
                    onClick={() => theme === "light" && toggleTheme()}
                    style={{ 
                      flex: 1, 
                      padding: "16px", 
                      borderRadius: 12, 
                      background: theme === "dark" ? "var(--bg-tertiary)" : "transparent",
                      border: theme === "dark" ? "1px solid var(--border-secondary)" : "1px solid var(--border-primary)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 10,
                      cursor: "pointer",
                      transition: "all 0.2s"
                    }}
                  >
                    <Moon size={18} color={theme === "dark" ? "var(--text-primary)" : "var(--text-muted)"} />
                    <span style={{ fontSize: 14, fontWeight: 600, color: theme === "dark" ? "var(--text-primary)" : "var(--text-muted)" }}>Dark Gray</span>
                  </button>
                  <button 
                    onClick={() => theme === "dark" && toggleTheme()}
                    style={{ 
                      flex: 1, 
                      padding: "16px", 
                      borderRadius: 12, 
                      background: theme === "light" ? "var(--bg-tertiary)" : "transparent",
                      border: theme === "light" ? "1px solid var(--border-secondary)" : "1px solid var(--border-primary)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 10,
                      cursor: "pointer",
                      transition: "all 0.2s"
                    }}
                  >
                    <Sun size={18} color={theme === "light" ? "var(--text-primary)" : "var(--text-muted)"} />
                    <span style={{ fontSize: 14, fontWeight: 600, color: theme === "light" ? "var(--text-primary)" : "var(--text-muted)" }}>Light Mode</span>
                  </button>
                </div>
              </div>

              <div style={{ height: 1, background: "var(--border-primary)" }} />

              <div>
                <label className="label-minimal">Full Identity Name</label>
                <input
                  className="input-minimal"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="How should the community address you?"
                  style={{ fontSize: 18, padding: "12px 0" }}
                />
              </div>

              <div>
                <label className="label-minimal">Biography & Experience</label>
                <textarea
                  className="input-minimal"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={4}
                  placeholder="Share your journey..."
                  style={{ resize: "none", fontSize: 15, lineHeight: 1.6 }}
                  maxLength={300}
                />
                <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 8 }}>
                  <span style={{ fontSize: 11, fontWeight: 600, color: bio.length > 280 ? "var(--danger)" : "var(--text-muted)" }}>
                    {bio.length}/300
                  </span>
                </div>
              </div>

              <div style={{ paddingTop: 20 }}>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="btn btn-primary"
                  style={{ height: 52, padding: "0 40px", fontSize: 15, fontWeight: 600 }}
                >
                  {saving ? "Synchronizing..." : "Update Profile"}
                  {!saving && <Save size={18} />}
                </button>
              </div>
            </div>

            {/* Danger Zone */}
            <div style={{ marginTop: 60 }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: "var(--danger)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 20 }}>
                Session Security
              </h3>
              <div 
                className="glass-panel" 
                style={{ 
                  padding: 24, 
                  borderColor: "rgba(239, 68, 68, 0.2)", 
                  display: "flex", 
                  alignItems: "center", 
                  justifyContent: "space-between" 
                }}
              >
                <div>
                  <h4 style={{ fontSize: 16, fontWeight: 600, color: "var(--text-primary)", marginBottom: 4 }}>End Session</h4>
                  <p style={{ fontSize: 13, color: "var(--text-muted)" }}>Sign out of your account on this device.</p>
                </div>
                <form action={logout}>
                  <button
                    type="submit"
                    className="btn btn-secondary"
                    style={{ 
                      borderColor: "rgba(239, 68, 68, 0.3)", 
                      color: "#ff4d4d", 
                      padding: "10px 24px",
                      fontWeight: 600
                    }}
                  >
                    <LogOut size={18} />
                    Sign Out
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* Sidebar - Performance Stats */}
          <aside>
            <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 32, display: "flex", alignItems: "center", gap: 10 }}>
              <Award size={22} />
              Performance
            </h2>

            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div className="glass-panel" style={{ padding: 24 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 12, background: "rgba(245, 158, 11, 0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Star size={20} color="#f59e0b" />
                  </div>
                  <div>
                    <p style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase" }}>Contribution Points</p>
                    <p style={{ fontSize: 24, fontWeight: 800 }}>{user.points.toLocaleString()}</p>
                  </div>
                </div>
                <div style={{ height: 6, background: "var(--bg-tertiary)", borderRadius: 3, overflow: "hidden" }}>
                  <div style={{ width: "65%", height: "100%", background: "#f59e0b", borderRadius: 3 }} />
                </div>
                <p style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 12, fontWeight: 500 }}>
                  Top 12% of contributors this month
                </p>
              </div>

              <div className="glass-panel" style={{ padding: 24 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 12, background: "rgba(239, 68, 68, 0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Zap size={20} color="#ef4444" />
                  </div>
                  <div>
                    <p style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase" }}>Active Streak</p>
                    <p style={{ fontSize: 24, fontWeight: 800 }}>{user.streak} <span style={{ fontSize: 14, color: "var(--text-muted)", fontWeight: 500 }}>Days</span></p>
                  </div>
                </div>
              </div>

              <div className="glass-panel" style={{ padding: 24 }}>
                <p style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", marginBottom: 16 }}>Community Engagement</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span style={{ fontSize: 14, color: "var(--text-secondary)" }}>Joined Spaces</span>
                    <span style={{ fontSize: 14, fontWeight: 700 }}>{user.joinedCommunities?.length || 0}</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span style={{ fontSize: 14, color: "var(--text-secondary)" }}>Managed Communities</span>
                    <span style={{ fontSize: 14, fontWeight: 700 }}>{user.createdCommunity ? 1 : 0}</span>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
