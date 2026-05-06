"use client";

import { useState, useEffect, useRef } from "react";
import { User, Mail, Shield, Star, Save, Loader2, Camera, Calendar } from "lucide-react";

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
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
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
  }, []);

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
        className="page-container"
        style={{ textAlign: "center", paddingTop: 100, color: "var(--text-muted)" }}
      >
        <Loader2 size={24} className="animate-spin" style={{ margin: "0 auto" }} />
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
    <div className="page-container" style={{ maxWidth: 800, paddingBottom: 64 }}>
      {/* Banner */}
      <div
        style={{
          height: 200,
          borderRadius: "var(--radius-lg) var(--radius-lg) 0 0",
          background: "linear-gradient(135deg, var(--bg-tertiary) 0%, rgba(34, 197, 94, 0.1) 100%)",
          position: "relative",
          marginBottom: 64,
        }}
      >
        {/* Avatar Container */}
        <div
          style={{
            position: "absolute",
            bottom: -50,
            left: 40,
            width: 120,
            height: 120,
            borderRadius: "50%",
            background: "var(--bg-card)",
            padding: 4,
          }}
        >
          <div
            onClick={() => fileInputRef.current?.click()}
            style={{
              width: "100%",
              height: "100%",
              borderRadius: "50%",
              background: avatar ? `url(${avatar}) center/cover` : "var(--accent-muted)",
              color: "var(--accent)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 700,
              fontSize: 36,
              cursor: "pointer",
              position: "relative",
              overflow: "hidden",
              border: "1px solid var(--border-secondary)",
            }}
            className="group"
          >
            {!avatar && initials}

            {/* Hover Overlay */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: "rgba(0,0,0,0.5)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                opacity: 0,
                transition: "opacity 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "0")}
            >
              <Camera size={24} color="#fff" style={{ marginBottom: 4 }} />
              <span style={{ fontSize: 11, color: "#fff", fontWeight: 500 }}>Update</span>
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

        {/* Member Since Badge */}
        <div style={{ position: "absolute", bottom: -40, right: 24 }}>
          <div className="badge" style={{ background: "var(--bg-tertiary)", color: "var(--text-secondary)", border: "1px solid var(--border-primary)" }}>
            <Calendar size={12} />
            Member since {new Date(user.createdAt || Date.now()).getFullYear()}
          </div>
        </div>
      </div>

      {/* Main Info */}
      <div style={{ padding: "0 16px", marginBottom: 32 }}>
        <h1 style={{ fontSize: 32, fontWeight: 700, marginBottom: 4 }}>
          {user.name}
        </h1>
        <p style={{ fontSize: 15, color: "var(--text-muted)", display: "flex", alignItems: "center", gap: 6 }}>
          <Mail size={14} />
          {user.email}
        </p>
      </div>

      {/* Stats Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
          gap: 16,
          marginBottom: 40,
        }}
      >
        {[
          { icon: Shield, label: "Platform Role", value: user.role, color: "#3b82f6" },
          { icon: Star, label: "Total Points", value: user.points, color: "#f59e0b" },
          { icon: User, label: "Active Streak", value: `${user.streak} days`, color: "#ef4444" },
          { icon: Mail, label: "Communities", value: (user.joinedCommunities?.length || 0) + (user.createdCommunity ? 1 : 0), color: "var(--accent)" },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="card"
              style={{ padding: 20, display: "flex", alignItems: "center", gap: 16 }}
            >
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: "var(--radius-md)",
                  background: `${stat.color}15`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Icon size={20} color={stat.color} />
              </div>
              <div>
                <p style={{ fontSize: 20, fontWeight: 700 }}>
                  {typeof stat.value === "string"
                    ? stat.value.charAt(0).toUpperCase() + stat.value.slice(1)
                    : stat.value}
                </p>
                <p style={{ fontSize: 12, color: "var(--text-muted)" }}>
                  {stat.label}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Profile Settings */}
      <div className="card" style={{ padding: 32 }}>
        <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 24, paddingBottom: 16, borderBottom: "1px solid var(--border-primary)" }}>
          Profile Settings
        </h3>
        <div style={{ display: "grid", gap: 24 }}>
          <div>
            <label className="label">Display Name</label>
            <input
              className="input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your full name"
            />
          </div>
          <div>
            <label className="label">Bio</label>
            <textarea
              className="input"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={4}
              placeholder="Tell the community about yourself, your skills, and what you're learning..."
              style={{ resize: "vertical" }}
              maxLength={300}
            />
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 6 }}>
              <span style={{ fontSize: 12, color: "var(--text-muted)" }}>
                Visible to community members
              </span>
              <span style={{ fontSize: 12, color: "var(--text-muted)" }}>
                {bio.length}/300
              </span>
            </div>
          </div>
          <div style={{ marginTop: 8 }}>
            <button
              onClick={handleSave}
              disabled={saving}
              className="btn btn-primary"
            >
              {saving ? "Saving Changes..." : "Save Profile"}
              {!saving && <Save size={16} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
