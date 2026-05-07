"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Loader2,
  Plus,
  Search,
  Users,
  X,
} from "lucide-react";
import UpgradeProModal from "@/app/components/UpgradeProModal";

interface CommunityData {
  _id: string;
  name: string;
  description: string;
  category: string;
  members: string[];
  maxMembers: number;
  tags: string[];
  creator: { _id: string; name: string };
}

const categories = ["All", "Communication", "Personality", "Technical", "General"];

export default function DiscoverPage() {
  const [communities, setCommunities] = useState<CommunityData[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [showCreate, setShowCreate] = useState(false);
  const [creating, setCreating] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState("");
  const [showUpgrade, setShowUpgrade] = useState(false);

  const fetchCommunities = useCallback(async () => {
    try {
      const response = await fetch("/api/communities");
      const data = await response.json();
      setCommunities(data.communities || []);
      if (data.currentUserId) setCurrentUserId(data.currentUserId);
    } catch (error) {
      console.error("Failed to fetch communities:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const loadCommunities = async () => {
      await fetchCommunities();
    };

    void loadCommunities();
  }, [fetchCommunities]);

  const handleJoin = async (communityId: string) => {
    setActionLoading(communityId);
    try {
      const res = await fetch(`/api/communities/${communityId}/join`, { method: "POST" });
      if (res.status === 403) {
        setShowUpgrade(true);
        return;
      }
      fetchCommunities();
    } finally {
      setActionLoading(null);
    }
  };

  const handleLeave = async (communityId: string) => {
    setActionLoading(communityId);
    try {
      await fetch(`/api/communities/${communityId}/leave`, { method: "POST" });
      fetchCommunities();
    } finally {
      setActionLoading(null);
    }
  };

  const handleCreate = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setCreating(true);

    const form = new FormData(event.currentTarget);

    try {
      const response = await fetch("/api/communities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.get("name"),
          description: form.get("description"),
          category: form.get("category"),
          tags: form.get("tags") || "",
        }),
      });

      if (response.ok) {
        setShowCreate(false);
        fetchCommunities();
      }
    } finally {
      setCreating(false);
    }
  };

  const filtered = communities.filter((community) => {
    const matchesSearch =
      community.name.toLowerCase().includes(search.toLowerCase()) ||
      community.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      activeCategory === "All" || community.category === activeCategory.toLowerCase();

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="page-container">
      <header style={{ marginBottom: 48 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 24, flexWrap: "wrap" }}>
          <div>
            <h1
              style={{
                fontSize: 32,
                fontWeight: 600,
                letterSpacing: "-0.03em",
                marginBottom: 8,
              }}
            >
              Discover Communities
            </h1>
            <p style={{ color: "var(--text-secondary)", fontSize: 14 }}>
              Find spaces where members are already practicing together.
            </p>
          </div>
          <button type="button" onClick={() => setShowCreate(true)} className="btn btn-primary">
            <Plus size={16} />
            Create space
          </button>
        </div>
      </header>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 20,
          marginBottom: 32,
          flexWrap: "wrap",
        }}
      >
        <div style={{ display: "flex", gap: 4, background: "var(--bg-tertiary)", padding: 4, borderRadius: 10 }}>
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setActiveCategory(category)}
              style={{
                padding: "6px 12px",
                borderRadius: 8,
                fontSize: 13,
                fontWeight: 500,
                color: activeCategory === category ? "var(--text-primary)" : "var(--text-muted)",
                background: activeCategory === category ? "var(--bg-primary)" : "transparent",
                border: "none",
                cursor: "pointer",
                transition: "all 0.2s"
              }}
            >
              {category}
            </button>
          ))}
        </div>

        <div style={{ position: "relative", width: "min(300px, 100%)" }}>
          <Search
            size={14}
            style={{
              position: "absolute",
              top: "50%",
              left: 12,
              transform: "translateY(-50%)",
              color: "var(--text-muted)",
            }}
          />
          <input
            type="text"
            placeholder="Search spaces..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            style={{
              width: "100%",
              height: 36,
              padding: "0 12px 0 36px",
              background: "var(--bg-secondary)",
              border: "1px solid var(--border-primary)",
              borderRadius: 8,
              fontSize: 13,
              color: "var(--text-primary)"
            }}
          />
        </div>
      </div>

      {loading ? (
        <div style={{ padding: 100, textAlign: "center" }}>
          <Loader2 size={24} className="animate-spin" style={{ margin: "0 auto", color: "var(--text-muted)" }} />
        </div>
      ) : filtered.length === 0 ? (
        <div className="card" style={{ padding: 80, textAlign: "center", background: "var(--bg-secondary)" }}>
          <p style={{ color: "var(--text-muted)", fontSize: 14 }}>No spaces found matching your search.</p>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
            gap: 20,
          }}
        >
          {filtered.map((community) => {
            const isMember = community.members.includes(currentUserId);
            const isCreator = community.creator?._id === currentUserId;

            return (
              <div
                key={community._id}
                className="card"
                style={{
                  padding: 24,
                  display: "flex",
                  flexDirection: "column",
                  gap: 20,
                  transition: "border-color 0.2s"
                }}
              >
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginBottom: 16,
                    }}
                  >
                    <span
                      style={{
                        fontSize: 10,
                        fontWeight: 700,
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                        color: "var(--text-muted)",
                        background: "var(--bg-tertiary)",
                        padding: "2px 8px",
                        borderRadius: 4
                      }}
                    >
                      {community.category}
                    </span>
                    <span style={{ color: "var(--text-muted)", fontSize: 11, fontWeight: 500 }}>
                      {community.members.length} / {community.maxMembers} members
                    </span>
                  </div>

                  <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>{community.name}</h3>
                  <p
                    style={{
                      color: "var(--text-secondary)",
                      fontSize: 13,
                      lineHeight: 1.5,
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden"
                    }}
                  >
                    {community.description}
                  </p>
                </div>

                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, paddingTop: 16, borderTop: "1px solid var(--border-primary)" }}>
                  <Link
                    href={`/community/${community._id}`}
                    style={{ fontSize: 13, fontWeight: 500, color: "var(--text-primary)", display: "flex", alignItems: "center", gap: 4 }}
                  >
                    Details
                    <ArrowRight size={14} />
                  </Link>

                  <div style={{ display: "flex", gap: 8 }}>
                    {isCreator ? (
                      <span style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)", padding: "4px 8px" }}>Host</span>
                    ) : isMember ? (
                      <button
                        type="button"
                        onClick={() => handleLeave(community._id)}
                        disabled={actionLoading === community._id}
                        className="btn btn-ghost btn-sm"
                        style={{ height: 28 }}
                      >
                        {actionLoading === community._id ? "..." : "Joined"}
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleJoin(community._id)}
                        disabled={actionLoading === community._id}
                        className="btn btn-primary btn-sm"
                        style={{ height: 28 }}
                      >
                        {actionLoading === community._id ? "..." : "Join"}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showCreate && (
        <div
          onClick={() => setShowCreate(false)}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 24,
            background: "rgba(0, 0, 0, 0.4)",
            backdropFilter: "blur(8px)",
          }}
        >
          <div
            className="card"
            style={{ width: "min(480px, 100%)", padding: 32, boxShadow: "var(--shadow-lg)" }}
            onClick={(event) => event.stopPropagation()}
          >
            <div style={{ marginBottom: 24 }}>
              <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 4 }}>Create a space</h2>
              <p style={{ color: "var(--text-secondary)", fontSize: 13 }}>Launch a new community for growth.</p>
            </div>

            <form onSubmit={handleCreate} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)" }}>Name</label>
                <input name="name" placeholder="E.g. Product Designers" required className="input" />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)" }}>Description</label>
                <textarea
                  name="description"
                  placeholder="What is this space for?"
                  rows={3}
                  required
                  className="input"
                />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)" }}>Category</label>
                <select name="category" className="input">
                  <option value="communication">Communication</option>
                  <option value="personality">Personality</option>
                  <option value="technical">Technical</option>
                  <option value="general">General</option>
                </select>
              </div>

              <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
                <button type="submit" disabled={creating} className="btn btn-primary" style={{ flex: 1 }}>
                  {creating ? "Creating..." : "Create space"}
                </button>
                <button type="button" onClick={() => setShowCreate(false)} className="btn btn-secondary" style={{ flex: 1 }}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      <UpgradeProModal isOpen={showUpgrade} onClose={() => setShowUpgrade(false)} />
    </div>
  );
}
